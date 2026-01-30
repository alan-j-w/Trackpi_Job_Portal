import mongoose from "mongoose";

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

        permanentLocation: {
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

        // ================= STEP 2: PROFESSIONAL INFO =================
        languages: [{
            name: { type: String, required: true },
            proficiency: { type: String, default: "beginner" } // beginner, intermediate, expert
        }],

        preferredLocations: [{ type: String }],

        willRelocate: {
            type: Boolean,
            default: false
        },

        preferredWorkMode: {
            type: String,
            enum: ["onsite", "remote", "hybrid", "field", ""],
            default: ""
        },

        education: [{
            degree: String,
            institution: String,
            year: String,
            description: String
        }],

        // ================= STEP 3: EXPERIENCE & ASSETS =================
        expectedSalary: { type: String, default: "" },

        // Legacy fields kept for safety, but Step 2 uses the above now
        jobTitle: { type: String, default: "" },
        skills: { type: [String], default: [] },

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
            behance: { type: String, default: "" },
            facebook: { type: String, default: "" },
            portfolio: { type: String, default: "" },
            twitter: { type: String, default: "" },
        },

        // Driving License (Multiple selection possible)
        drivingLicenses: [{ type: String }], // "two_wheeler", "four_wheeler"

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("Profile", profileSchema);
