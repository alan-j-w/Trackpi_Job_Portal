import Course from "../models/Course.js";
import University from "../models/University.js";
import axios from "axios";

export const searchCourses = async (req, res) => {
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

        // Fetch ONLY from real DB
        const courses = await Course.find(filter)
            .limit(20)
            .select("name level");

        // Return empty array if not found (No fake data)
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error searching courses:", error);
        // Resilience: Return empty array on error instead of 500
        res.status(200).json([]);
    }
};

export const searchUniversities = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(200).json([]);
        }

        const searchQuery = query.toLowerCase().trim();

        // Promise.allSettled for Resilience
        const [hipolabsResult, gdResult, localResult] = await Promise.allSettled([
            // 1. Hipolabs API
            axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`, { timeout: 3000 })
                .then(res => res.data.slice(0, 20).map(u => ({ name: u.name }))),

            // 2. Github College List (Cached)
            (async () => {
                if (!global.cachedColleges) {
                    try {
                        const collegeRes = await axios.get("https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/master/colleges.json", { timeout: 3000 });
                        global.cachedColleges = collegeRes.data;
                    } catch (e) {
                        return [];
                    }
                }
                return global.cachedColleges
                    ? global.cachedColleges
                        .filter(c => c.college && c.college.toLowerCase().includes(searchQuery))
                        .slice(0, 20)
                        .map(c => ({
                            name: c.college.replace(/\s*\(Id:.*?\)/i, "").trim()
                        }))
                    : [];
            })(),

            // 3. Local DB
            University.find({ name: { $regex: new RegExp(query, "i") } })
                .limit(10)
                .select("name")
                .then(docs => docs.map(d => ({ name: d.name })))
        ]);

        // Aggregate results
        let allResults = [];
        if (hipolabsResult.status === 'fulfilled') allResults.push(...hipolabsResult.value);
        if (gdResult.status === 'fulfilled') allResults.push(...gdResult.value);
        if (localResult.status === 'fulfilled') allResults.push(...localResult.value);

        // Deduplication (Case-Insensitive)
        const uniqueResults = [];
        const seenNames = new Set();

        for (const item of allResults) {
            // Strict deduplication key
            const normalizedName = item.name.trim().toLowerCase();
            if (!seenNames.has(normalizedName)) {
                seenNames.add(normalizedName);
                uniqueResults.push({ name: item.name }); // Keep original casing
            }
        }

        // Return strictly [{ name: "..." }]
        res.status(200).json(uniqueResults.slice(0, 50));

    } catch (error) {
        console.error("Error searching institutions:", error.message);
        // Resilience: Return empty array on critical failure
        res.status(200).json([]);
    }
};
