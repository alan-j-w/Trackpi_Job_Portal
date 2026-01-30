import express from "express";
const router = express.Router();

import {
    createOrUpdateProfile,
    getMyProfile,
    checkProfileStatus
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

// All profile routes are protected
router.post("/", protect, createOrUpdateProfile);       // Create or update profile
router.get("/me", protect, getMyProfile);               // Get my profile
router.get("/status", protect, checkProfileStatus);     // Check if profile exists

export default router;
