import "dotenv/config"; // Load env vars BEFORE other imports
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import resumeAdminRoutes from "./routes/resumeAdminRoutes.js";
import resumeBuildRoutes from "./routes/resumeBuildRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import testimonialsRoutes from "./routes/testimonialsRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import hiringpartnersRoutes from "./routes/hiringpartnersRoutes.js";
import competitionRoutes from "./routes/competitionRoutes.js";
import competitionTestimonialsRoutes from "./routes/competitionTestimonialsRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import competitionWinnerRoutes from "./routes/competitionWinnerRoutes.js";


const app = express();


// connect database
connectDB();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now to prevent frontend blocking
  crossOriginResourcePolicy: false,
}));
app.use(morgan("dev"));

// CORS Configuration (Relaxed for debugging)
app.use(cors({
  origin: true, // Allow all origins dynamically
  credentials: true
}));

// Body Parsers (Must be before sanitizers)
app.use(express.json());
// Serve uploads folder statically
app.use('/uploads', express.static('uploads'));

// Sanitization (Must be after body parser)
// app.use(mongoSanitize());
// app.use(xss());

// Rate Limiting (Relaxed for Dev)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // Increased limit for dev
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeBuildRoutes);
app.use("/api", testimonialsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/resume-candidates", resumeAdminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/education", educationRoutes);
app.use("/api", hiringpartnersRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/competition-testimonials", competitionTestimonialsRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/competition-winners", competitionWinnerRoutes);


app.get("/", (req, res) => {
  res.send("≡ƒÜÇ Backend Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`≡ƒöÑ Server running on port ${PORT}`);
});

// ✅ Global Error Handler (JSON response for all errors)
app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch-all:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});
