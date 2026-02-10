import "dotenv/config"; // Load env vars BEFORE other imports
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import languageRoutes from "./routes/languageRoutes.js";
import testimonialsRoutes from "./routes/testimonialsRoutes.js";
import educationRoutes from "./routes/educationRoutes.js";

// dotenv.config(); // Removed - already loaded above

const app = express();

// connect database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/education", educationRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
