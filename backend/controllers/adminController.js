const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const bcrypt = require("bcryptjs");
const PERMISSIONS = require("../config/permissions");

// Create Admin (Super Admin Only)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            permissions: permissions || [], // Array of permission strings
        });

        // Audit Log
        await AuditLog.create({
            action: "CREATE_ADMIN",
            adminId: req.user._id,
            targetId: newAdmin._id,
            details: { name: newAdmin.name, email: newAdmin.email },
            ipAddress: req.ip
        });

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Failed to create admin", error: error.message });
    }
};

// Get All Users (Super Admin & Admin with permission)
exports.getAllUsers = async (req, res) => {
    try {
        // Simple filter example
        const { role } = req.query;
        const query = role ? { role } : {};

        const users = await User.find(query).select("-password -googleId -linkedinId");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users", error: error.message });
    }
};

// Get All Job Seeker Candidates
exports.getAllCandidates = async (req, res) => {
    try {
        // Find all users with role 'jobseeker'
        const candidates = await User.find({ role: "jobseeker" }).select("-password -googleId -linkedinId");

        // Fetch profiles for these candidates
        const candidatesWithProfiles = await Promise.all(candidates.map(async (user) => {
            const profile = await require("../models/Profile").findOne({ user: user._id });
            return {
                ...user.toObject(),
                profile: profile || null
            };
        }));

        res.status(200).json(candidatesWithProfiles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch candidates", error: error.message });
    }
};

// Delete Candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optional: Check if user is actually a jobseeker to prevent accidental admin deletion
        if (user.role !== "jobseeker") {
            // return res.status(403).json({ message: "Can only delete job seekers via this endpoint" });
            // For now, allow deleting any user via this ID if admin has permission, but usually safer to restrict.
        }

        await User.findByIdAndDelete(id);
        await require("../models/Profile").findOneAndDelete({ user: id });

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete candidate", error: error.message });
    }
};

// Update Admin Permissions (Super Admin Only)
exports.updateAdminPermissions = async (req, res) => {
    try {
        const { userId, permissions } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(400).json({ message: "Can only update permissions for admins" });
        }

        user.permissions = permissions;
        await user.save();

        // Audit Log
        await AuditLog.create({
            action: "UPDATE_PERMISSIONS",
            adminId: req.user._id,
            targetId: user._id,
            details: { newPermissions: permissions },
            ipAddress: req.ip
        });

        res.status(200).json({ message: "Permissions updated", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update permissions", error: error.message });
    }
};

// Get System Stats (Example for Dashboard)
exports.getDashboardStats = async (req, res) => {
    try {
        const candidateCount = await User.countDocuments({ role: "jobseeker" });
        const adminCount = await User.countDocuments({ role: "admin" });

        // Add Job model counts here when Job model is integrated
        // const jobCount = await Job.countDocuments({});

        res.status(200).json({
            candidates: candidateCount,
            admins: adminCount,
            // jobs: jobCount
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};
