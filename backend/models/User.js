import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileCompleted: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            enum: ["jobseeker", "admin", "superadmin", "user"], // 'user' kept for legacy support until migration
            default: "jobseeker"
        },
        permissions: {
            type: [String],
            default: []
        },
        googleId: {
            type: String
        },
        linkedinId: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);