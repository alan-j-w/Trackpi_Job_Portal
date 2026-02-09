import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import AuditLog from "../models/AuditLog.js";
import Profile from "../models/Profile.js";
import AdminRole from "../models/AdminRole.js";
import bcrypt from "bcryptjs";
import PERMISSIONS from "../config/permissions.js";

// Create Admin (Super Admin Only)
// Create or Promote Admin
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, roleId } = req.body;

        // Check if role exists
        let rolePermissions = [];
        let roleName = "Admin";
        if (roleId) {
            const adminRole = await AdminRole.findById(roleId);
            if (adminRole) {
                rolePermissions = adminRole.permissions;
                roleName = adminRole.name;
            }
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            // PROMOTE EXISTING USER
            userExists.role = "admin";
            // If name is provided, update it, else keep existing
            if (name) userExists.name = name;
            // If password provided, update it (optional, maybe specific flag needed?)
            // For now, let's NOT update password for existing users to prevent account takeover unless explicitly intended.
            // But the form has password. Let's start with just promoting role/permissions.

            userExists.permissions = rolePermissions;
            await userExists.save();

            // Link to Admin Role if provided
            if (roleId) {
                await AdminRole.findByIdAndUpdate(roleId, { $addToSet: { users: userExists._id } });
            }

            // Audit
            await AuditLog.create({
                action: "PROMOTE_ADMIN",
                adminId: req.user._id,
                targetId: userExists._id,
                details: { email: userExists.email, newRole: roleName },
                ipAddress: req.ip
            });

            return res.status(200).json({ message: "User promoted to Admin successfully", admin: userExists });
        }

        // CREATE NEW ADMIN
        // Generate random password if not provided (since admins use social login)
        const finalPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(finalPassword, 10);

        const newAdmin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "admin",
            permissions: rolePermissions,
        });

        // Link to Admin Role if provided
        if (roleId) {
            await AdminRole.findByIdAndUpdate(roleId, { $addToSet: { users: newAdmin._id } });
        }

        // Audit Log
        await AuditLog.create({
            action: "CREATE_ADMIN",
            adminId: req.user._id,
            targetId: newAdmin._id,
            details: { name: newAdmin.name, email: newAdmin.email, role: roleName },
            ipAddress: req.ip
        });

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: "Failed to create/promote admin", error: error.message });
    }
};

// Get All Users (Super Admin & Admin with permission)
export const getAllUsers = async (req, res) => {
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
export const getAllCandidates = async (req, res) => {
    try {
        // Find all users with role 'jobseeker'
        const candidates = await User.find({ role: "jobseeker" }).select("-password -googleId -linkedinId");

        // Fetch profiles for these candidates
        const candidatesWithProfiles = await Promise.all(candidates.map(async (user) => {
            const profile = await Profile.findOne({ user: user._id });
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
export const deleteCandidate = async (req, res) => {
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
        await Profile.findOneAndDelete({ user: id });

        res.status(200).json({ message: "Candidate deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete candidate", error: error.message });
    }
};

// Update Admin Permissions (Super Admin Only)
export const updateAdminPermissions = async (req, res) => {
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
export const getDashboardStats = async (req, res) => {
    try {
        const candidateCount = await User.countDocuments({ role: "jobseeker" });
        const adminCount = await User.countDocuments({ role: "admin" });

        // Active Jobs (status is not closed)
        const activeJobsCount = await Job.countDocuments({ status: { $ne: "closed" } });

        // Hired Candidates (Applications with status 'hired')
        // Check if Application model has 'hired' status. Assuming standard status flows.
        const hiredCount = await Application.countDocuments({ status: "hired" });

        // Resumes/Profiles Built
        const resumesCount = await Profile.countDocuments({});

        res.status(200).json({
            candidates: candidateCount,
            admins: adminCount,
            activeJobs: activeJobsCount,
            hired: hiredCount,
            resumes: resumesCount
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};

// Get All Jobs for Admin (with applicant counts)
export const getAdminJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        const jobsWithStats = await Promise.all(jobs.map(async (job) => {
            const totalApplicants = await Application.countDocuments({ jobId: job._id });
            const pendingApplicants = await Application.countDocuments({ jobId: job._id, status: 'applied' });

            return {
                ...job.toObject(),
                school_id: undefined, // remove if not needed, just cleaning up
                applicantsCount: totalApplicants,
                pendingApplicantsCount: pendingApplicants
            };
        }));

        res.status(200).json(jobsWithStats);
    } catch (error) {
        console.error("Error fetching admin jobs:", error);
        res.status(500).json({ message: "Failed to fetch admin jobs", error: error.message });
    }
};

// ============================================
// ROLE MANAGEMENT (AdminRole Based)
// ============================================

// Create New Role
export const createRole = async (req, res) => {
    try {
        const { name, permissions, users } = req.body;

        const roleExists = await AdminRole.findOne({ name });
        if (roleExists) {
            return res.status(400).json({ message: "Role with this name already exists" });
        }

        const newRole = await AdminRole.create({
            name,
            permissions,
            users,
            createdBy: req.user._id
        });

        // Update assigned users with these permissions
        if (users && users.length > 0) {
            await User.updateMany(
                { _id: { $in: users } },
                { $set: { permissions: permissions } }
            );
        }

        res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
        res.status(500).json({ message: "Failed to create role", error: error.message });
    }
};

// Get All Roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await AdminRole.find()
            .populate("users", "name email")
            .populate("createdBy", "name");
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch roles", error: error.message });
    }
};

// Update Role
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions, users } = req.body;

        const role = await AdminRole.findById(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // 1. Identify users removed from this role
        // The old list of users in this role
        const oldUserIds = role.users.map(u => u.toString());
        // The new list of users
        const newUserIds = users || [];

        // Users to remove are in old but not in new
        const usersToRemove = oldUserIds.filter(uid => !newUserIds.includes(uid));

        // 2. Update the role document
        role.name = name || role.name;
        role.permissions = permissions || role.permissions;
        role.users = users || role.users;
        await role.save();

        // 3. Update Permissions for Users

        // A. For users newly added or kept in this role -> Set to new permissions
        if (newUserIds.length > 0) {
            await User.updateMany(
                { _id: { $in: newUserIds } },
                { $set: { permissions: role.permissions } }
            );
        }

        // B. For users removed from this role -> Clear permissions
        if (usersToRemove.length > 0) {
            await User.updateMany(
                { _id: { $in: usersToRemove } },
                { $set: { permissions: [] } }
            );
        }

        res.status(200).json({ message: "Role updated successfully", role });
    } catch (error) {
        res.status(500).json({ message: "Failed to update role", error: error.message });
    }
};

// Delete Role
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await AdminRole.findById(id);
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }

        // Remove permissions from all users in this role
        if (role.users && role.users.length > 0) {
            await User.updateMany(
                { _id: { $in: role.users } },
                { $set: { permissions: [] } }
            );
        }

        await AdminRole.findByIdAndDelete(id);

        res.status(200).json({ message: "Role deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete role", error: error.message });
    }
};

// Toggle Admin Status (Activate/Deactivate)
export const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'active' or 'inactive'

        if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent deactivating self (optional but good practice)
        if (req.user._id.toString() === id) {
            return res.status(400).json({ message: "Cannot deactivate your own account" });
        }

        // Prevent deactivating superadmin if not superadmin? (Already protected by route auth usually, but extra safety)
        if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Not authorized to change superadmin status" });
        }

        user.status = status;
        await user.save();

        // Audit Log
        await AuditLog.create({
            action: "UPDATE_STATUS",
            adminId: req.user._id,
            targetId: user._id,
            details: { newStatus: status, email: user.email },
            ipAddress: req.ip
        });

        res.status(200).json({ message: `Admin status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};
