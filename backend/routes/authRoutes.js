const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    googleAuth,
    linkedinAuth,
} = require("../controllers/authController");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/linkedin", linkedinAuth);

module.exports = router;
