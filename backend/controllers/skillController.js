const Skill = require('../models/Skill');

// @desc    Search skills
// @route   GET /api/skills/search
// @access  Public
const searchSkills = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: 'Query parameter is required' });
        }

        // Perform a regex search (case-insensitive)
        // Limit results to 20 for performance
        const skills = await Skill.find({
            name: { $regex: query, $options: 'i' }
        })
            .limit(20)
            .select('name');

        // Return just an array of strings as per frontend expectation
        // or return objects if we want more data later. 
        // Let's return objects to be robust, but frontend might need adaptation.
        // Actually, user wants "just type and enter", simple string array is easier for frontend integration described.
        // But let's stick to standard API response of objects, and map in frontend. 
        // Wait, the plan said "JSON results like ["React", "React Native"]".
        // Let's do that for simplicity.

        const skillNames = skills.map(skill => skill.name);

        res.json(skillNames);
    } catch (error) {
        console.error('Search Skills Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    searchSkills
};
