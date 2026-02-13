import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

/* IMAGE STORAGE (Profile + Cover) */
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: (req) => ({
        folder: "trackpi/profile/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        public_id: `${req.user.id}_${Date.now()}`
    }),
});

/* RESUME STORAGE */
const resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: (req) => ({
        folder: "trackpi/profile/resumes",
        resource_type: "raw", // IMPORTANT for PDF/DOC
        public_id: `resume_${req.user.id}_${Date.now()}`
    }),
});

export const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
