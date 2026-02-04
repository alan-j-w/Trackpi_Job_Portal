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

router.get(
    "/users",
    checkPermission(PERMISSIONS.MANAGE_USERS),
    adminController.getAllUsers
);

// Role Management (Super Admin Only)
router.post("/permissions", authorize("superadmin"), adminController.createRole);
router.get("/permissions", authorize("superadmin", "admin"), adminController.getAllRoles);
router.put("/permissions/:id", authorize("superadmin"), adminController.updateRole);
router.put("/permissions/:id", authorize("superadmin"), adminController.updateRole);
router.delete("/permissions/:id", authorize("superadmin"), adminController.deleteRole);

// Manage Admin Status
router.put("/admin-status/:id", authorize("superadmin"), adminController.toggleAdminStatus);

// Update Super User (Admin & Super Admin)
router.put(
    "/superuser/:id",
    authorize("superadmin", "admin"),
    adminController.updateSuperUser
);

// Demote Super User (Admin & Super Admin)
router.put(
    "/remove-superuser/:id",
    authorize("superadmin", "admin"),
    adminController.demoteSuperUser
);

// Update Admin (Super Admin Only)
router.put(
    "/update-admin/:id",
    authorize("superadmin"),
    adminController.updateAdmin
);

// Demote Admin (Super Admin Only)
router.put(
    "/demote-admin/:id",
    authorize("superadmin"),
    adminController.demoteAdmin
);

export default router;
