const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    googleAuth,
    linkedinAuth,
    sendOtp,
    verifyOtp
} = require("../controllers/authController");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/linkedin", linkedinAuth);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
