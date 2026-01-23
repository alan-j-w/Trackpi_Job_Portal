const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");

router.get("/courses", educationController.searchCourses);
router.get("/universities", educationController.searchUniversities);

module.exports = router;
