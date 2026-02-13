import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

// ============================
// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        const googleRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );

        const { email, name, sub } = googleRes.data;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = sub;
            }
            user.lastLogin = new Date();
            await user.save();

            // Check Status - Block if inactive
            if (user.role === 'admin' && user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
            }
        } else {
            user = await User.create({
                name,
                email,
                googleId: sub,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                role: "jobseeker",
                role: "jobseeker",
                permissions: [],
                lastLogin: new Date()
            });
        }

        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
            console.log("Auto-repaired admin permissions");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google authentication failed" });
    }
};

// ============================
// LINKEDIN AUTH
export const linkedinAuth = async (req, res) => {
    try {
        const { code } = req.body;

        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri = "http://localhost:5173/linkedin/callback";

        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenRes.data;

        const userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { email, name, sub } = userRes.data;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.linkedinId) {
                user.linkedinId = sub;
            }
            user.lastLogin = new Date();
            await user.save();
            // Check Status - Block if inactive
            if (user.role === 'admin' && user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
            }
        } else {
            user = await User.create({
                name,
                email,
                linkedinId: sub,
                password: await bcrypt.hash(Math.random().toString(36), 10),
                role: "jobseeker",
                role: "jobseeker",
                permissions: [],
                lastLogin: new Date()
            });
        }

        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
            console.log("Auto-repaired admin permissions");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("LinkedIn Auth Error:", error.response?.data || error.message);
        res.status(500).json({ message: "LinkedIn authentication failed" });
    }
};

// ============================
// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

// ============================
// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Check Status - Block if inactive
        if (user.role === 'admin' && user.status === 'inactive') {
            return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
        }

        // Auto Repair Permissions
        if (user.role === 'admin' && (!user.permissions || user.permissions.length === 0)) {
            user.permissions = DEFAULT_REPAIR_PERMISSIONS;
            await user.save();
            console.log("Auto-repaired admin permissions");
        }

        // Update Last Login
        user.lastLogin = new Date();
        await user.save();

        console.log(`[DEBUG] Login Auth - User: ${user.email}, Role: ${user.role}, Perms: ${user.permissions?.length}`);
        const token = jwt.sign(
            { id: user._id, role: user.role, permissions: user.permissions },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};

// ============================
// OTP SYSTEM (DEV MODE)
// ============================

// { "9999999999": { otp: "1234", expires: 123456789 } }
const otpStore = {};

// SEND OTP
export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        otpStore[phone] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        };

        console.log(`📲 [OTP SENT] Phone: ${phone}, OTP: ${otp}`);

        // TODO: Integrate SMS gateway here

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required"
            });
        }

        const record = otpStore[phone];

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP expired or not found"
            });
        }

        if (Date.now() > record.expires) {
            delete otpStore[phone];
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        if (record.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Success
        delete otpStore[phone];

        res.status(200).json({
            success: true,
            message: "Phone verified successfully"
        });
    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({
            success: false,
            message: "Verification failed"
        });
    }
};
