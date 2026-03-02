import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect Routes
export const protect = async (req, res, next) => {
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

            if (req.user.status === 'inactive') {
                return res.status(403).json({ message: "Account is inactive. Please contact support." });
            }

            // Update lastActive (Fire and forget, don't await blocking)
            User.findByIdAndUpdate(req.user._id, { lastActive: new Date() }).catch(err => console.error("Error updating lastActive:", err));

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Not authorized, token failed", error: error.message });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Authorize Roles
export const authorize = (...roles) => {
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
// Superadmin always bypasses this check
export const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;

        // 1. Super Admin: Full Access (Bypass everything)
        if (user.role === "superadmin") {
            return next();
        }

        // 2. Admin: Restricted Access
        // Admins generally have full access, BUT we must explicit block them from
        // "Super Admin Only" actions if the route is protected by a permission key
        // that corresponds to those actions.
        if (user.role === "admin") {
            const RESTRICTED_PERMISSIONS = [
                // Admin Management Restrictions
                "admin_management.add_admin",
                "admin_management.edit",
                "admin_management.update_status",
                // Role Management Restrictions - ALLOWED now
                // "user_permission.edit", 
                // "user_permission.delete"
            ];

            if (RESTRICTED_PERMISSIONS.includes(requiredPermission)) {
                return res.status(403).json({
                    message: "Access forbidden: Admins cannot perform this action.",
                });
            }
            return next();
        }

        // 3. Super User (Restricted Admin) permission check
        if (user.role === "superuser") {
            if (user.permissions && user.permissions.includes(requiredPermission)) {
                return next();
            } else {
                return res.status(403).json({
                    message: "Access forbidden: Insufficient permissions.",
                });
            }
        }

        return res.status(403).json({ message: "Access forbidden." });
    };
};
