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
    params: async (req, file) => {
        const user = req.user;
        let filename = `resume_${user.id}_${Date.now()}`; // Fallback

        if (user && user.name) {
            // Sanitize: Replace spaces with underscores, remove special chars
            const sanitized = user.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
            filename = `${sanitized}_resume`;
        }

        return {
            folder: "trackpi/profile/resumes",
            resource_type: "raw", // IMPORTANT for PDF/DOC
            public_id: filename,
            format: "pdf" // Explicitly ensure PDF extension
        };
    },
});

export const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadResume = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"), false);
        }
    }
});

/* TESTIMONIAL STORAGE (Images + Video) */
const testimonialStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "trackpi/testimonials",
        resource_type: "auto",
    },
});

export const uploadTestimonial = multer({ storage: testimonialStorage });

export const upload = multer({ storage: multer.memoryStorage() });

export default uploadTestimonial;
