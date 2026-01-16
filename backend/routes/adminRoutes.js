const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, authorize, checkPermission } = require("../middleware/authMiddleware");
const PERMISSIONS = require("../config/permissions");

// All admin routes are protected and require admin or superadmin role
router.use(protect);
router.use(authorize("admin", "superadmin"));

// Dashboard Stats
router.get("/dashboard-stats", adminController.getDashboardStats);

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

module.exports = router;
