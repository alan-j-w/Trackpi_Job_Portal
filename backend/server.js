import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import jobRoutes from "./routes/jobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import testimonialRoutes from "./routes/testimonialsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

/* Database */
connectDB();

/* Middlewares */
app.use(cors());
app.use(express.json());

/* Routes */
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/admin", adminRoutes);

/* Health Check */
app.get("/", (req, res) => {
  res.status(200).send("🚀 TrackPI Backend Running Successfully");
});

/* Server */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🔥 TrackPI server running on port ${PORT}`));
