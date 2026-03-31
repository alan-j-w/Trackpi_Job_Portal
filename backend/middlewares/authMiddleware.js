const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - requires valid JWT
 */
const protect = async (req, res, next) => {
    let token;

    // Check Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (without password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "User not found" });
            }

            next(); // Continue to controller
        } catch (error) {
            console.error("JWT Error:", error.message);
            return res.status(401).json({ message: "Not authorized, token invalid" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

/**
 * Admin Middleware - Allows Admin and SuperAdmin
 */
const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};

/**
 * SuperAdmin Middleware - Allows only SuperAdmin
 */
const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === "superadmin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as a superadmin" });
    }
};

module.exports = { protect, isAdmin, isSuperAdmin };
