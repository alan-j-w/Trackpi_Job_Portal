const express = require("express");
const router = express.Router();

const {
    createJob,
    getAllJobs,
    getJobById
} = require("../controllers/jobController");

router.post("/", createJob);
router.get("/", getAllJobs);
router.get("/:id", getJobById);

module.exports = router;
