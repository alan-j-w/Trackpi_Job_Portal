import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import connectDB from "./config/db.js";

dotenv.config();

const jobs = [
    {
        title: "UI/UX Designer",
        company: "TrackPi Privet Limited",
        location: "Kochi, Kerala",
        jobType: "Full time",
        workMode: "Work from home",
        salary: "35,000 rs - 40,000 rs",
        experience: "Minimum one year experience in sales",
        education: "Any postgraduation",
        gender: "Female",
        description: "Office ipsum you must be muted. Unpack team productive club productive didn't alpha 4-blocker pulling need. You competitors creep room and that management horse charts baked pulling.",
        status: "urgent",
        benefits: "Work from home",
        vacancies: 5
    },
    {
        title: "UI/UX Designer",
        company: "TrackPi Privet Limited",
        location: "Kochi, Kerala",
        jobType: "Full time",
        workMode: "Work from home",
        salary: "35,000 rs - 40,000 rs",
        experience: "Minimum one year experience in sales",
        education: "Any postgraduation",
        gender: "Female",
        description: "Office ipsum you must be muted. Unpack team productive club productive didn't alpha 4-blocker pulling need. You competitors creep room and that management horse charts baked pulling.",
        status: "urgent",
        benefits: "Work from home",
        vacancies: 3
    },
    {
        title: "UI/UX Designer",
        company: "TrackPi Privet Limited",
        location: "Kochi, Kerala",
        jobType: "Full time",
        workMode: "Work from home",
        salary: "35,000 rs - 40,000 rs",
        experience: "Minimum one year experience in sales",
        education: "Any postgraduation",
        gender: "Female",
        description: "Office ipsum you must be muted. Unpack team productive club productive didn't alpha 4-blocker pulling need. You competitors creep room and that management horse charts baked pulling.",
        status: "new",
        benefits: "Work from home",
        vacancies: 10
    }
];

const seedJobs = async () => {
    try {
        await connectDB();
        await Job.deleteMany(); // Clear existing jobs
        await Job.insertMany(jobs);
        console.log("✅ Jobs Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding jobs:", error);
        process.exit(1);
    }
};

seedJobs();
