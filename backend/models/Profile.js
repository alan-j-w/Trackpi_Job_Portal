const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // ================= BASIC INFO =================
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        alternatePhone: {
            type: String,
            trim: true,
            default: "",
        },

        email: {
            type: String,
            trim: true,
        },

        // Location Details
        location: {
            pincode: { type: String, default: "" },
            country: { type: String, default: "" },
            state: { type: String, default: "" },
            city: { type: String, default: "" },
        },

        dateOfBirth: {
            type: String, // or Date
            default: "",
        },

        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: "",
        },

        maritalStatus: {
            type: String,
            enum: ["married", "single", ""],
            default: "",
        },

        // ================= CAREER INFO =================
        workStatus: {
            type: String,
            enum: ["fresher", "experienced", ""],
            default: "",
        },

        // Only if experienced
        workExperience: [
            {
                jobTitle: String,
                company: String,
                startDate: String,
                endDate: String,
                description: String,
            }
        ],

        // Kept from previous (might be used in Step 2/3)
        jobTitle: { type: String, default: "" },
        education: { type: String, default: "" },
        skills: { type: [String], default: [] },
        expectedSalary: { type: String, default: "" },
        workMode: { type: String, default: "" },

        // ================= ASSETS =================
        resumeUrl: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        // ================= EXTRA =================
        hasDrivingLicense: { type: Boolean, default: false },
        hasTwoWheeler: { type: Boolean, default: false },
        hasLaptop: { type: Boolean, default: false },

        // ================= SOCIAL =================
        socialLinks: {
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            portfolio: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
