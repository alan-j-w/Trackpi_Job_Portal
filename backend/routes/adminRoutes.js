import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

// All admin routes are protected and require admin, superadmin, or superuser role
router.use(protect);
router.use(authorize("admin", "superadmin", "superuser"));

// Dashboard Stats
router.get("/dashboard-stats", adminController.getDashboardStats);

// Get All Candidates (Job Seekers)
router.get("/candidates", adminController.getAllCandidates);

// Get All Jobs (Admin View)
router.get("/jobs", adminController.getAdminJobs);

// Delete Candidate
router.delete("/candidates/:id", adminController.deleteCandidate);

// Super Admin Only: Manage Admins (Full Admins)
router.post(
    "/create-admin",
    authorize("superadmin"),
    adminController.createAdmin
);

// Admin & Super Admin: Manage Super Users (Restricted Staff)
router.post(
    "/create-superuser",
    authorize("superadmin", "admin"),
    adminController.createSuperUser
);

router.put(
    "/update-permissions",
    authorize("superadmin"),
    adminController.updateAdminPermissions
);

// Get All Users (Super Admin & Admin with permission)
router.get(
    "/users",
    checkPermission(PERMISSIONS.MANAGE_USERS),
    adminController.getAllUsers
);

// Update Admin (Super Admin Only)
router.put("/users/:id", authorize("superadmin"), adminController.updateAdmin);

// Demote Admin (Super Admin Only)
router.put("/remove-admin/:id", authorize("superadmin"), adminController.demoteAdmin);

// Role Management (Super Admin Only)
router.post("/permissions", authorize("superadmin"), adminController.createRole);
router.get("/permissions", authorize("superadmin", "admin"), adminController.getAllRoles);
router.put("/permissions/:id", authorize("superadmin"), adminController.updateRole);
// router.put("/permissions/:id", authorize("superadmin"), adminController.updateRole); // Remove duplicate
router.delete("/permissions/:id", authorize("superadmin"), adminController.deleteRole);

// Manage Admin Status
router.put("/admin-status/:id", authorize("superadmin"), adminController.toggleAdminStatus);

export default router;
