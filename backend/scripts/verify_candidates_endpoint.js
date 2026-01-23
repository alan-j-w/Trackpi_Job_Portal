const mongoose = require("mongoose");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// Configuration
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://trackpi_admin:Mg2umyJoAiGNejwH@cluster0.ghpwnt1.mongodb.net/trackpi_jobportal";
const JWT_SECRET = process.env.JWT_SECRET || "trackpi_secret_key";
const API_URL = "http://localhost:8000/api/admin/candidates";

async function verify() {
    try {
        // 1. Connect to MongoDB
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");

        // 2. Find an Admin User
        console.log("Finding an admin user...");
        let admin = await User.findOne({ role: { $in: ["admin", "superadmin"] } });

        if (!admin) {
            console.log("No admin found. Creating a temporary superadmin...");
            admin = await User.create({
                name: "Temp SuperAdmin",
                email: "temp_superadmin@example.com",
                password: "password123", // Not hashed, doesn't matter for token generation
                role: "superadmin"
            });
        }
        console.log(`Using admin: ${admin.email} (${admin._id})`);

        // 3. Generate Token
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, {
            expiresIn: "1d",
        });
        console.log("Generated Admin Token.");

        // 4. Test the Endpoint
        console.log(`Testing endpoint: ${API_URL}`);
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("\n--- API RESPONSE ---");
        console.log(`Status: ${response.status}`);
        console.log(`Candidates Found: ${response.data.length}`);

        if (response.data.length > 0) {
            const firstCandidate = response.data[0];
            console.log("\nFirst Candidate Sample:");
            console.log("- Name:", firstCandidate.name);
            console.log("- Role:", firstCandidate.role);
            console.log("- Profile Found:", !!firstCandidate.profile);
            if (firstCandidate.profile) {
                console.log("  - Job Title:", firstCandidate.profile.jobTitle);
            }
        } else {
            console.log("No candidates found in the database. (Logic still verified if status is 200)");
        }

        console.log("\n✅ VERIFICATION SUCCESSFUL");

    } catch (error) {
        console.error("\n❌ VERIFICATION FAILED");
        if (error.response) {
            console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    } finally {
        await mongoose.connection.close();
    }
}

verify();
