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
        let filename = `resume_${Date.now()}`;

        if (user && user.name) {
            const sanitized = user.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
            filename = `${sanitized}_resume_${Date.now()}`;
        } else if (req.body.name) {
            // Fallback for guest application
            const sanitized = req.body.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
            filename = `${sanitized}_resume_${Date.now()}`;
        }

        return {
            folder: "trackpi/profile/resumes",
            resource_type: "raw",
            type: "upload",
            public_id: filename
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
