import express from "express";
const router = express.Router();

import {
    createJob,
    getAllJobs,
    getJobById,
    updateJob
} from "../controllers/jobController.js";

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.put("/:id", updateJob);

export default router;
