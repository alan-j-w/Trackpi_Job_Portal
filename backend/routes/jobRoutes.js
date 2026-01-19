import express from "express";
const router = express.Router();

import {
    createJob,
    getAllJobs,
    getJobById
} from "../controllers/jobController.js";

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);

export default router;
