import express from "express";
import {
  getAdminTestimonials,
  getAdminTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getPublicTestimonials
} from "../controllers/testimonialsController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/testimonials", getPublicTestimonials);
router.get("/admin/testimonials", getAdminTestimonials);

/* ================= ADD (STATIC – IMPORTANT) ================= */
// prevents "/add" from being treated as ":id"
router.get("/admin/testimonials/add", (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin/testimonials",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  createTestimonial
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/testimonials/:id", getAdminTestimonialById);

router.put(
  "/admin/testimonials/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnailImage", maxCount: 1 },
    { name: "video", maxCount: 1 }
  ]),
  updateTestimonial
);

router.delete("/admin/testimonials/:id", deleteTestimonial);

export default router;
