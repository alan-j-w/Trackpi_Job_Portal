const Course = require("../models/Course");
const University = require("../models/University");
const axios = require("axios");

exports.searchCourses = async (req, res) => {
    try {
        const { query, level } = req.query;
        let filter = {};

        if (level) {
            filter.level = level;
        }

        if (query) {
            const regex = new RegExp(query, "i"); // case-insensitive fuzzy search
            filter.name = { $regex: regex };
        }

        const courses = await Course.find(filter)
            .limit(20)
            .select("name");

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.searchUniversities = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            // If empty, return some top defaults from our DB or empty
            const universities = await University.find({}).limit(20).select("name");
            return res.status(200).json(universities);
        }

        // Use Hipolabs API for search
        const response = await axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`, { timeout: 5000 });

        // Map to our format
        // Limit to 20 results to keep it fast and list generic
        const universities = response.data
            .slice(0, 50)
            .map(uni => ({ name: uni.name }));

        res.status(200).json(universities);
    } catch (error) {
        console.error("Error searching universities:", error.message);
        // Fallback to local DB if API fails
        try {
            const regex = new RegExp(req.query.query, "i");
            const universities = await University.find({ name: { $regex: regex } })
                .limit(20)
                .select("name");
            res.status(200).json(universities);
        } catch (dbError) {
            res.status(500).json({ message: "Server error", error: dbError.message });
        }
    }
};
