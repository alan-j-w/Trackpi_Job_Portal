import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect, authorize, checkPermission } from "../middleware/authMiddleware.js";
import PERMISSIONS from "../config/permissions.js";

const router = express.Router();

// All admin routes are protected and require admin or superadmin role
router.use(protect);
router.use(authorize("admin", "superadmin"));

// Dashboard Stats
router.get("/dashboard-stats", adminController.getDashboardStats);

// Get All Candidates (Job Seekers)
router.get("/candidates", adminController.getAllCandidates);

// Get All Jobs (Admin View)
router.get("/jobs", adminController.getAdminJobs);

// Delete Candidate
router.delete("/candidates/:id", adminController.deleteCandidate);

// Super Admin Only: Manage Admins
router.post(
    "/create-admin",
    authorize("superadmin"),
    adminController.createAdmin
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

export default router;
