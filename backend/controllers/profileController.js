import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ✅ Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware

        // Check if profile already exists
        let profile = await Profile.findOne({ user: userId });

        if (profile) {
            // Update existing profile
            profile = await Profile.findOneAndUpdate(
                { user: userId },
                { ...req.body },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                profile,
            });
        }

        // Create new profile
        const newProfile = await Profile.create({
            user: userId,
            ...req.body,
        });

        // Mark user profile as completed
        await User.findByIdAndUpdate(userId, { profileCompleted: true });

        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile: newProfile,
        });
    } catch (error) {
        console.error("Profile create/update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create or update profile",
        });
    }
};

// ✅ Get My Profile
export const getMyProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const profile = await Profile.findOne({ user: userId }).populate(
            "user",
            "name email"
        );

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        res.status(200).json({
            success: true,
            profile,
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};

// ✅ Check if my profile exists(optional helper)
export const checkProfileStatus = async (req, res) => {
    try {
        const userId = req.user._id;

        const profile = await Profile.findOne({ user: userId });

        res.status(200).json({
            success: true,
            hasProfile: !!profile,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to check profile status",
        });
    }
};
