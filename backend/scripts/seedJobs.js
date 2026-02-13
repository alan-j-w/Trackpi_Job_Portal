import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "../models/Job.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedJobs = async () => {
    try {
        await connectDB();

        await Job.deleteMany(); // Clear existing jobs

        const jobs = [
            {
                title: "Sales Executive",
                company: "Phifer Mosquito Recruiters",
                location: "Edappally, Ernakulam",
                jobType: "Full time",
                workMode: "On-site",
                education: "Any Graduate",
                salary: "₹3,00,000 — ₹3,36,000 per annum (Negotiable based on performance)",
                experience: "Minimum 1 year",
                gender: "Male",
                vacancies: 1,
                workingDays: "Monday to Saturday",
                workingHours: "10 am to 6 pm",
                description: "This recruitment is facilitated by Trackpi Private Limited, an authorized hiring partner for Phifer Mosquito Screens. As a Sales Executive, you will be responsible for driving sales by engaging directly with potential customers, providing detailed product information, and ensuring excellent customer service throughout the sales process. This role requires an individual who is proactive, results-driven, and able to manage multiple tasks efficiently.\n\nPhifer is a global leader in high-performance screening and shading solutions. Specializing in products for residential, commercial, and industrial applications, Phifer offers durable and innovative solutions like window and door screens, solar fabrics, and outdoor products. Committed to quality, sustainability, and energy efficiency, Phifer creates custom solutions that enhance comfort and protection.",
                skills: "Relationship building and networking.\nSales and persuasion techniques.\nStrong time management and organizational skills.\nAbility to work independently and achieve targets.",
                eligibility: "Male (Age group: 24-30 years)\nAny Qualification.\nMinimum 1 years of experience in sales.\nFluency in Malayalam and English.\nValid driver’s license and access to a 2-wheeler.\nBasic computer knowledge is mandatory.\nExcellent communication, negotiation, and interpersonal skills.",
                benefits: "Travel allowance\nDaily allowance for field visits\nHealth insurance\nMobile/internet reimbursement\nProfessional training programs",
                incentive: "Performance based incentives",
                responsibilities: "Visit customers based on scheduled appointments.\nDeliver product presentations and explain key features.\nCollect and follow up on daily leads.\nConduct product demonstrations for up to 4 customers per day.\nInput data and update customer feedback in CRM.\nMaintain regular follow-ups with potential customers.\nKeep detailed records of leads assigned and managed.",
                status: "urgent"
            },
            {
                title: "UI/UX Designer",
                company: "Track pi private limited",
                location: "Kakkanad, Ernakulam",
                jobType: "Full time",
                workMode: "Hybrid",
                education: "Any postgraduate",
                salary: "₹ 5,00,000 P.A.",
                experience: "1-3 Years",
                gender: "Any",
                vacancies: 2,
                workingDays: "5 Days",
                workingHours: "9 AM - 6 PM",
                description: "This recruitment is facilitated by Trackpi Private Limited. As a UI/UX Designer, you will be responsible for defining the user experience of our digital products. You will work closely with the development team to ensure that the designs are implemented correctly and meet our high standards of quality.\n\nTrackpi is a technology company dedicated to creating innovative solutions for the recruitment industry. We bridge the gap between talented individuals and top-tier organizations through our cutting-edge platform. Our mission is to streamline the hiring process and empower professionals to find their dream careers.",
                skills: "Figma, Adobe XD, Photoshop, Prototyping",
                eligibility: "Portfolio required\nDesign Degree preferred",
                benefits: "Flexible hours, Remote work options",
                incentive: "Yearly Bonus",
                responsibilities: "Create wireframes, prototypes, and high-fidelity designs.\nCollaborate with product managers and developers.\nConduct user research and usability testing.\nMaintain and evolve the design system.",
                status: "new"
            }
        ];

        await Job.insertMany(jobs);
        console.log("✅ Jobs seeded successfully with elaborated content");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding jobs:", error);
        process.exit(1);
    }
};

seedJobs();
