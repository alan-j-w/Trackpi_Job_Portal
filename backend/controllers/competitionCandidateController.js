import CompetitionCandidate from "../models/CompetitionCandidate.js";

// @desc    Register for a competition
// @route   POST /api/competitions/register
export const registerForCompetition = async (req, res) => {
    try {
        const { name, email, phone, portfolio, role } = req.body;
        
        // Generate enrollment ID: ENDG + random 3 digits + #
        const randomDigits = Math.floor(100 + Math.random() * 900);
        const enrollmentId = `ENDG${randomDigits}#`;

        const candidate = await CompetitionCandidate.create({
            name,
            email,
            phone,
            portfolio,
            department: role,
            enrollmentId,
            status: "Pending",
            isLive: true
        });

        res.status(201).json({ success: true, candidate });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all candidates for admin
// @route   GET /api/competitions/candidates
export const getAdminCandidates = async (req, res) => {
    try {
        const candidates = await CompetitionCandidate.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, candidates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update candidate status (Pass/Fail)
// @route   PUT /api/competitions/candidates/:id/status
export const updateCandidateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const candidate = await CompetitionCandidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
        res.status(200).json({ success: true, candidate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete multiple candidates
// @route   POST /api/competitions/candidates/bulk-delete
export const bulkDeleteCandidates = async (req, res) => {
    try {
        const { ids } = req.body;
        await CompetitionCandidate.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: "Candidates deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Toggle live status
// @route   PUT /api/competitions/candidates/:id/toggle-live
export const toggleLiveStatus = async (req, res) => {
    try {
        const candidate = await CompetitionCandidate.findById(req.params.id);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });
        
        candidate.isLive = !candidate.isLive;
        await candidate.save();
        
        res.status(200).json({ success: true, candidate });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
