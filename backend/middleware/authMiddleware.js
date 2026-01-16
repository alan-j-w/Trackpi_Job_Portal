const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Authorize Roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role '${req.user.role}' is not authorized to access this route.`,
            });
        }
        next();
    };
};

// Check Permissions (Admin Only)
// Superadmin always bypasses this check due to authorize('superadmin', 'admin') logic usually preceding this,
// or we can explicitly handle it here.
exports.checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;

        // Super Admin bypass
        if (user.role === "superadmin") {
            return next();
        }

        // Admin permission check
        if (user.role === "admin") {
            if (user.permissions && user.permissions.includes(requiredPermission)) {
                return next();
            } else {
                return res.status(403).json({
                    message: "Access forbidden: Insufficient permissions.",
                });
            }
        }

        // Jobseekers shouldn't be hitting this middleware if routing is correct, but safe fail:
        return res.status(403).json({ message: "Access forbidden." });
    };
};
