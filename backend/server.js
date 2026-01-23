const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const skillRoutes = require("./routes/skillRoutes");
const languageRoutes = require("./routes/languageRoutes");

dotenv.config();

const app = express();

/* -------------------- Database -------------------- */
connectDB();

/* -------------------- Middlewares -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- Routes -------------------- */
app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/languages", languageRoutes);
app.use("/api/education", require("./routes/educationRoutes"));

/* -------------------- Health Check -------------------- */
app.get("/", (req, res) => {
  res.status(200).send("🚀 TrackPI Backend Running Successfully");
});

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🔥 TrackPI server running on port ${PORT}`);
});
