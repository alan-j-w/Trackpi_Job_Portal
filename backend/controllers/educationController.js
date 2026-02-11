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
        const [clearbitResult, hipolabsResult, gdResult, localResult] = await Promise.allSettled([
            // 0. Clearbit Autocomplete API (Best for logos & global coverage)
            axios.get(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`, { timeout: 3000 })
                .then(res => res.data.map(item => ({
                    name: item.name,
                    domain: item.domain,
                    logo: item.logo
                }))),

            // 1. Hipolabs API
            axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`, { timeout: 3000 })
                .then(res => res.data.slice(0, 20).map(u => ({ name: u.name, domain: u.domains?.[0] || null }))),

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
                            name: c.college.replace(/\s*\(Id:.*?\)/i, "").trim(),
                            domain: null
                        }))
                    : [];
            })(),

            // 3. Local DB
            University.find({ name: { $regex: new RegExp(query, "i") } })
                .limit(10)
                .select("name domain")
                .then(docs => docs.map(d => ({ name: d.name, domain: d.domain || null })))
        ]);

        // Aggregate results
        let allResults = [];
        if (clearbitResult.status === 'fulfilled') allResults.push(...clearbitResult.value);
        if (hipolabsResult.status === 'fulfilled') allResults.push(...hipolabsResult.value);
        if (gdResult.status === 'fulfilled') allResults.push(...gdResult.value);
        if (localResult.status === 'fulfilled') allResults.push(...localResult.value);

        // Deduplication (Case-Insensitive) & Prefer Domain/Logo
        const uniqueResults = new Map();

        for (const item of allResults) {
            const normalizedName = item.name.trim().toLowerCase();

            // Update if:
            // 1. Not exists
            // 2. Current has no domain but new one does
            // 3. Current has domain but new one has explicitly defined logo
            const current = uniqueResults.get(normalizedName);
            if (!current) {
                uniqueResults.set(normalizedName, item);
            } else if (!current.domain && item.domain) {
                uniqueResults.set(normalizedName, item);
            } else if (!current.logo && item.logo) {
                uniqueResults.set(normalizedName, item);
            }
        }

        // Return values
        res.status(200).json(Array.from(uniqueResults.values()).slice(0, 50));
    } catch (error) {
        console.error("Error searching institutions:", error.message);
        // Resilience: Return empty array on critical failure
        res.status(200).json([]);
    }
};
