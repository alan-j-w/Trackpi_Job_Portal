import express from "express";
const router = express.Router();

import {
    registerUser,
    loginUser,
    googleAuth,
    linkedinAuth,
} from "../controllers/authController.js";

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/linkedin", linkedinAuth);

export default router;
