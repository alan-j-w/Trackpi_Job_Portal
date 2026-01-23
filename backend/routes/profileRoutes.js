const express = require("express");
const router = express.Router();

const {
    createOrUpdateProfile,
    getMyProfile,
    checkProfileStatus,
    saveStep1
} = require("../controllers/profileController");

const { protect } = require("../middlewares/authMiddleware");

// All profile routes are protected
router.post("/step1", protect, saveStep1);
router.post("/", protect, createOrUpdateProfile);       // Create or update profile
router.get("/me", protect, getMyProfile);               // Get my profile
router.get("/status", protect, checkProfileStatus);     // Check if profile exists

module.exports = router;
