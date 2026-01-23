import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

// TEMPORARY: Default permissions to sync with Frontend if missing in DB
const DEFAULT_REPAIR_PERMISSIONS = [
    "dashboard.view",
    "jobs.post", "jobs.status", "jobs.view", "jobs.pending", "jobs.all", "jobs.urgent", "jobs.edit",
    "signup.resume", "signup.view", "signup.delete",
    "applicants.resume", "applicants.view", "applicants.delete",
    "resume.download", "resume.delete",
    "partners.add", "partners.view", "partners.edit", "partners.delete",
    "testimonials.add", "testimonials.view", "testimonials.edit", "testimonials.delete",
    "admin.add", "admin.edit", "admin.status",
    "roles.edit", "roles.delete",
    "users.edit", "users.delete",
    "forms.manage",
    "competition.add", "competition.edit", "competition.testimonials", "competition.candidates",
    "video.add", "video.edit", "video.delete",
    "winners.add", "winners.edit", "winners.delete"
];

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    try {
        const { access_token } = req.body;

        const googleRes = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
        );
        const { email, name, sub } = googleRes.data;

        // Check if user exists by email
        let user = await User.findOne({ email });

        if (user) {
            // If user exists but no googleId, link it
            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }

            // Check Status - Block if inactive
            if (user.role === 'admin' && user.status === 'inactive') {
                return res.status(403).json({ message: "Access Denied: Your account has been deactivated by the administrator." });
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId: sub,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
                role: "jobseeker",
                permissions: []
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
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: "Google authentication failed" });
    }
};

// LINKEDIN AUTH
export const linkedinAuth = async (req, res) => {
    try {
        const { code } = req.body;
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri = "http://localhost:5173/linkedin/callback";

        // 1. Exchange code for access token
        const tokenRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenRes.data;

        // 2. Get User Info
        const userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { email, name, sub } = userRes.data;

        let user = await User.findOne({ email });

        if (user) {
            if (!user.linkedinId) {
                user.linkedinId = sub;
                await user.save();
            }
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
                permissions: []
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
                role: user.role,
            },
        });

    } catch (error) {
        console.error("LinkedIn Auth Error:", error.response?.data || error.message);
        res.status(500).json({ message: "LinkedIn authentication failed" });
    }
};

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
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
};

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
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
};
