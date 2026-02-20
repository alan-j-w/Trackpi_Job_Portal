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
// Create Admin (Super Admin Only)
export const createAdmin = async (req, res) => {
    try {
        const { name, email, employeeId, password, role } = req.body;

        // Default to 'admin', strictly allow 'superadmin' only if explicitly requested
        const targetRole = role === 'superadmin' ? 'superadmin' : 'admin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            // Check if attempting to demote/modify another Super Admin?
            // Since this is Super Admin only route, they can do what they want.
            userExists.role = targetRole;
            userExists.permissions = []; // Clear custom permissions as they are now a main Admin type
            await userExists.save();
            return res.status(200).json({ message: `User promoted to ${targetRole === 'superadmin' ? 'Super Admin' : 'Admin'}`, admin: userExists });
        }

        const hashedPassword = await bcrypt.hash(password || "trackpi123", 10);
        const newAdmin = await User.create({
            name,
            email,
            employeeId,
            password: hashedPassword,
            role: targetRole,
            permissions: []
        });

        res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Super User (Restricted Staff)
export const createSuperUser = async (req, res) => {
    try {
        const { name, email, employeeId, roleId } = req.body; // No password usually for staff? Or random.

        // Resolve Permissions from Role
        let permissions = [];
        let roleName = "SuperUser";

        if (roleId) {
            const r = await AdminRole.findById(roleId);
            if (r) {
                permissions = r.permissions;
                roleName = r.name;
            }
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            userExists.role = "superuser";
            userExists.permissions = permissions;
            await userExists.save();
            return res.status(200).json({ message: "Promoted to Super User", user: userExists });
        }

        // New User
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            employeeId,
            password: hashedPassword,
            role: "superuser",
            permissions: permissions
        });

        // Add to Role
        if (roleId) {
            await AdminRole.findByIdAndUpdate(roleId, { $addToSet: { users: newUser._id } });
        }

        res.status(201).json({ message: "Super User created", user: newUser, password: password });
    } catch (error) {
        res.status(500).json({ message: "Failed to create Super User", error: error.message });
    }
};

// Get All Users (Super Admin & Admin with permission)
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};

        if (role) {
            const roles = role.split(',');
            if (roles.length > 1) {
                // If searching for admins, also include those who were admins (demoted)
                if (roles.includes('admin') || roles.includes('superadmin')) {
                    query = {
                        $or: [
                            { role: { $in: roles } },
                            { previousRole: { $in: roles } }
                        ]
                    };
                } else {
                    query = { role: { $in: roles } };
                }
            } else {
                if (role === 'admin' || role === 'superadmin') {
                    query = {
                        $or: [
                            { role: role },
                            { previousRole: role }
                        ]
                    };
                } else {
                    query = { role };
                }
            }
        }

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

// Get Single Candidate Profile
export const getCandidateById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists and is a jobseeker (optional restriction)
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "Candidate not found" });
        }

        const profile = await Profile.findOne({ user: id }).populate("user", "name email");

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch candidate profile" });
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

// Demote Admin to Job Seeker (Super Admin Only)
export const demoteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Cannot demote Super Admin" });
        }

        user.role = "jobseeker";
        user.permissions = []; // Clear admin permissions
        user.employeeId = undefined; // Clear employee ID
        await user.save();

        // Remove from any AdminRole groups
        await AdminRole.updateMany(
            { users: user._id },
            { $pull: { users: user._id } }
        );

        // Audit Log
        await AuditLog.create({
            action: "DEMOTE_ADMIN",
            adminId: req.user._id,
            targetId: user._id,
            details: { email: user.email, newRole: "jobseeker" },
            ipAddress: req.ip
        });

        res.status(200).json({ message: "Admin demoted to Job Seeker successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to demote admin", error: error.message });
    }
};

// Update Admin Details (Super Admin Only)
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, employeeId, roleId, status } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ message: "Not authorized to update Super Admin" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (employeeId) user.employeeId = employeeId;
        if (status) user.status = status; // Handle status update

        // Handle Role Update (Promote/Demote between Admin and Super Admin)
        if (req.body.role) {
            // Only Super Admin can change roles here
            if (req.user.role !== 'superadmin') {
                return res.status(403).json({ message: "Only Super Admins can change user roles" });
            }
            // Validate role
            if (['admin', 'superadmin'].includes(req.body.role)) {
                user.role = req.body.role;
            }
        }

        // If roleId provided, update permissions
        let roleName = "Custom";
        if (roleId) {
            const adminRole = await AdminRole.findById(roleId);
            if (adminRole) {
                user.permissions = adminRole.permissions;
                roleName = adminRole.name;

                // Update AdminRole associations
                // Remove from old roles
                await AdminRole.updateMany(
                    { users: user._id },
                    { $pull: { users: user._id } }
                );
                // Add to new role
                await AdminRole.findByIdAndUpdate(roleId, { $addToSet: { users: user._id } });
            }
        }

        await user.save();

        // Audit Log
        await AuditLog.create({
            action: "UPDATE_ADMIN",
            adminId: req.user._id,
            targetId: user._id,
            details: { name: user.name, email: user.email, role: roleName },
            ipAddress: req.ip
        });

        res.status(200).json({ message: "Admin updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update admin", error: error.message });
    }
};

// Toggle Admin Status / Deactivate to Job Seeker
export const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'active' or 'inactive' from frontend button

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Logic:
        // If status becomes 'inactive' (Deactivate) -> Demote to Job Seeker, Store previous Role
        // If status becomes 'active' (Activate) -> Restore previous Role

        if (status === 'inactive') {
            // Deactivating
            if (user.role === 'admin' || user.role === 'superadmin') {
                user.previousRole = user.role;
                user.role = 'jobseeker';
                // user.status remains 'active' technically to allow them to be a job seeker?
                // OR we set user.status to 'active' always?
                // The frontend sends 'inactive' to signal the INTENT of deactivating ADMIN privileges.
                // So we set role = jobseeker. Status can stay active so they can login.
                user.status = 'active';
            }
        } else if (status === 'active') {
            // Activating
            if (user.role === 'jobseeker' && user.previousRole) {
                user.role = user.previousRole;
                user.previousRole = null;
                user.status = 'active';
            }
        }

        await user.save();
        res.status(200).json({ message: "Admin status updated", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
};

// Update Super User (Restricted Staff) - Admin & Super Admin
// Update Super User (Restricted Staff) - Admin & Super Admin
export const updateSuperUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, employeeId, roleId } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Security Check: Only allow updating 'superuser' role
        if (user.role !== 'superuser') {
            return res.status(403).json({ message: "This endpoint is only for updating Super Users." });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (employeeId) user.employeeId = employeeId;

        if (roleId) {
            const r = await AdminRole.findById(roleId);
            if (r) {
                user.permissions = r.permissions;

                // Sync AdminRole Collections
                // 1. Remove user from ALL other AdminRole documents first
                await AdminRole.updateMany(
                    { users: user._id },
                    { $pull: { users: user._id } }
                );

                // 2. Add user to the NEW AdminRole document
                await AdminRole.findByIdAndUpdate(roleId, {
                    $addToSet: { users: user._id }
                });
            }
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user", error: error.message });
    }
};

// Demote Super User (Restricted Staff) -> Job Seeker
export const demoteSuperUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'superuser') {
            return res.status(403).json({ message: "Target user is not a Super User" });
        }

        user.role = "jobseeker";
        user.permissions = []; // Clear permissions
        user.employeeId = undefined; // Clear employee ID
        await user.save();

        // Remove from any AdminRole groups
        await AdminRole.updateMany(
            { users: user._id },
            { $pull: { users: user._id } }
        );

        // Audit Log
        await AuditLog.create({
            action: "DEMOTE_SUPERUSER",
            adminId: req.user._id,
            targetId: user._id,
            details: { email: user.email, newRole: "jobseeker" },
            ipAddress: req.ip
        });

        res.status(200).json({ message: "Super User demoted to Job Seeker successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to demote super user", error: error.message });
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


