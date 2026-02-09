import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import testimonialsRoutes from "./routes/testimonialsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// connect database
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", testimonialsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend Running");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
