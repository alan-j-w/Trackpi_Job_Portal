import Application from "../models/Application.js";

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Public
export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { name, email, phone, experience, portfolio, userId } = req.body;

        // Ensure file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const resumePath = req.file.path;

        const application = await Application.create({
            jobId,
            userId: userId || null, // Optional if guest
            name,
            email,
            phone,
            experience,
            resume: resumePath,
            portfolio
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
