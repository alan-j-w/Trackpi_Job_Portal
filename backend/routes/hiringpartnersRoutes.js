import express from "express";
import {
  getAdminHiringPartners,
  getAdminHiringPartnersById,
  createHiringPartners,
  updateHiringPartners,
  deleteHiringPartners,
  getPublicHiringPartners

} from "../controllers/hiringpartnersController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* ================= LIST ================= */
router.get("/hiringpartners", getPublicHiringPartners);

// Admin routes
router.use("/admin", protect, authorize("admin", "superadmin", "superuser"));

router.get("/admin/hiringpartners", getAdminHiringPartners);

/* ================= ADD (STATIC – IMPORTANT) ================= */
// prevents "/add" from being treated as ":id"
router.get("/admin/hiringpartners/add", (req, res) => {
  return res.status(200).json({ success: true });
});

/* ================= CREATE ================= */
router.post(
  "/admin/hiringpartners",
  upload.fields([
    { name: "logo", maxCount: 1 },

  ]),
  createHiringPartners
);

/* ================= DYNAMIC (ALWAYS LAST) ================= */
router.get("/admin/hiringpartners/:id", getAdminHiringPartnersById);

router.put(
  "/admin/hiringpartners/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },

  ]),
  updateHiringPartners
);

router.delete("/admin/hiringpartners/:id", deleteHiringPartners);

export default router;
