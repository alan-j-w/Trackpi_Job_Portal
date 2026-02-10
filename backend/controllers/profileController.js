import Profile from "../models/Profile.js";
import User from "../models/User.js";

// ✅ Create or Update Profile
// ✅ Create or Update Profile
export const createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user._id; // from auth middleware
        const { isFinalSubmission, ...bodyData } = req.body;

        // 1. Safety Whitelist
        const allowedFields = [
            'fullName', 'jobTitle', 'phone', 'altPhone', 'email',
            'country', 'state', 'city', 'pincode', 'location', // Added location object and flattened fields
            'dob', 'gender', 'maritalStatus', 'workStatus',
            'education', 'workExperience', // Arrays
            'skills', 'languages',
            'preferredLocations', 'willRelocate', 'preferredWorkMode', // Step 2 fields
            'expectedSalary', 'drivingLicenses', 'hasTwoWheeler', 'hasLaptop', 'socialLinks',
            'resumeUrl', 'profileImage', 'summary',
            'careerBreak', 'careerBreakDuration' // Added whitelist
        ];

        // Filter bodyData to only allowed fields
        const safeUpdates = {};
        Object.keys(bodyData).forEach(key => {
            if (allowedFields.includes(key)) {
                safeUpdates[key] = bodyData[key];
            }
        });

        // Handle Location Mapping (Flat -> Nested)
        // If flat fields exist, merge them into location object
        if (bodyData.country || bodyData.state || bodyData.city || bodyData.pincode) {
            safeUpdates.location = {
                ...safeUpdates.location, // Preserve specific location updates if any
                country: bodyData.country || safeUpdates.location?.country,
                state: bodyData.state || safeUpdates.location?.state,
                city: bodyData.city || safeUpdates.location?.city,
                pincode: bodyData.pincode || safeUpdates.location?.pincode
            };

            // Remove flat fields from root to avoid schema validation errors if strict is true
            delete safeUpdates.country;
            delete safeUpdates.state;
            delete safeUpdates.city;
            delete safeUpdates.pincode;
        }

        const profileFields = {
            user: userId,
            ...safeUpdates
        };

        // 2. Profile Completion Logic
        // Only set profileCompleted if this is a final submission
        if (isFinalSubmission) {
            profileFields.profileCompleted = true;
        }

        // Use findOneAndUpdate with upsert to handle both create and update
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Also update User model ONLY if final submission
        if (isFinalSubmission) {
            await User.findByIdAndUpdate(userId, { profileCompleted: true });
        }

        return res.status(200).json({
            success: true,
            message: "Profile saved successfully",
            profile,
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

export const uploadCoverImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { coverImage: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Cover upload error:", error);
        res.status(500).json({ success: false, message: "Cover upload failed" });
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { profileImage: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Profile image upload error:", error);
        res.status(500).json({ success: false, message: "Profile image upload failed" });
    }
};

export const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { resume: req.file.path },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (error) {
        console.error("Resume upload error:", error);
        res.status(500).json({ success: false, message: "Resume upload failed" });
    }
};


// ✅ Delete Cover Image
export const deleteCoverImage = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { coverImage: "" },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// ✅ Delete Profile Image
export const deleteProfileImage = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { profileImage: "" },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });
        res.json(profile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// ✅ Delete Resume
export const deleteResume = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $set: { resume: "" } },
            { new: true }
        );

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        res.json(profile);
    } catch (err) {
        console.error("Delete resume fatal error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
};
