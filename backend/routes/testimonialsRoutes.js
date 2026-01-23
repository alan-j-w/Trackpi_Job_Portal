import express from "express";
import {
  createTestimonial,
  getTestimonials,
} from "../controllers/testimonialsController.js";

const router = express.Router();

// Admin
router.post("/", createTestimonial);

// Frontend
router.get("/", getTestimonials);

export default router;
