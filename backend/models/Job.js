const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        jobType: {
            type: String, // Full time / Part time
            required: true,
        },
        workMode: {
            type: String, // WFH / Hybrid / Office
            required: true,
        },
        education: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["urgent", "new"],
            default: "new",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
