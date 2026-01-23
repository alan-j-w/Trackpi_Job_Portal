const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load env variables
dotenv.config();

const migrateUsers = async () => {
    try {
        console.log("🚀 Starting User Migration...");

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // 1. Update users with missing or legacy role 'user' to 'jobseeker'
        // Also ensure permissions array exists and google/linkedin IDs are handled (schema does this on save, but we can be explicit)
        const result = await User.updateMany(
            {
                $or: [
                    { role: { $exists: false } },
                    { role: "user" }
                ]
            },
            {
                $set: { role: "jobseeker", permissions: [] }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} users to 'jobseeker' role.`);

        // 2. Ensure all admins have a permission array (even if empty)
        await User.updateMany(
            { role: "admin", permissions: { $exists: false } },
            { $set: { permissions: [] } }
        );
        console.log("✅ Verified admin permission arrays.");

    } catch (error) {
        console.error("❌ Migration Error:", error.message);
    } finally {
        mongoose.disconnect();
        console.log("👋 Migration complete. Disconnected.");
        process.exit();
    }
};

migrateUsers();
