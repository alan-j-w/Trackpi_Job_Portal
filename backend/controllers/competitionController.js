import Competition from "../models/Competition.js";

// @desc    Create a new competition
// @route   POST /api/competitions
// @access  Private (Admin with COMPETITION_ADD permission)
export const createCompetition = async (req, res) => {
    try {
        const { name, department, startDate, endDate, status } = req.body;
        const questionUrl = req.file ? req.file.path : null;

        const competition = await Competition.create({
            name,
            department,
            startDate,
            endDate,
            questionUrl,
            status: status || "live"
        });

        res.status(201).json({ success: true, competition });
    } catch (error) {
        console.error("Error creating competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Private (Admin with COMPETITION_VIEW permission)
export const getCompetitions = async (req, res) => {
    try {
        const competitions = await Competition.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, competitions });
    } catch (error) {
        console.error("Error fetching competitions:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a competition
// @route   DELETE /api/competitions/:id
// @access  Private (Admin with COMPETITION_EDIT/DELETE permission)
export const deleteCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const competition = await Competition.findByIdAndDelete(id);
        if (!competition) {
            return res.status(404).json({ success: false, message: "Competition not found" });
        }
        res.status(200).json({ success: true, message: "Competition deleted successfully" });
    } catch (error) {
        console.error("Error deleting competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCompetition = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, startDate, endDate, status } = req.body;
        const updateData = { name, department, startDate, endDate, status };
        if (req.file) updateData.questionUrl = req.file.path;

        const competition = await Competition.findByIdAndUpdate(id, updateData, { new: true });
        if (!competition) {
            return res.status(404).json({ success: false, message: "Competition not found" });
        }
        res.status(200).json({ success: true, competition });
    } catch (error) {
        console.error("Error updating competition:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
