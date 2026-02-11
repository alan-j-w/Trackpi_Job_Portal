const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("../models/Course");
const connectDB = require("../config/db");

dotenv.config();

const checkCourses = async () => {
    try {
        await connectDB();
        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses.`);
        if (courses.length > 0) {
            console.log("Sample course:", courses[0]);
        }

        const bachelors = await Course.find({ level: "Bachelor" });
        console.log(`Found ${bachelors.length} Bachelor courses.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkCourses();
