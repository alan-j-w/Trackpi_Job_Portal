import express from "express";
import {
  createTestimonial,
  getTestimonials,
} from "../controllers/testimonialsController.js";

const router = express.Router();

router.post("/", createTestimonial);      // Admin
router.get("/", getTestimonials);          // Frontend

export default router;
