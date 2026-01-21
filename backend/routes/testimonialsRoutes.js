const express = require("express");
const {
  createTestimonial,
  getTestimonials,
} = require("../controllers/testimonialsController.js");

const router = express.Router();

router.post("/", createTestimonial); // Admin
router.get("/", getTestimonials); // Frontend

module.exports = router;
