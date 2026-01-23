import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load env variables
dotenv.config();

const promoteUser = async () => {
    try {
        const email = process.argv[2];

        if (!email) {
            console.error("Please provide an email address.");
            console.log("Usage: node scripts/promoteToSuperAdmin.js <email>");
            process.exit(1);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        // Update Role
        user.role = "superadmin";
        await user.save();

        console.log(`✅ Success! User ${user.name} (${user.email}) is now a Super Admin.`);

    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

promoteUser();
