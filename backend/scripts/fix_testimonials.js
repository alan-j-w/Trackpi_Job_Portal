const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Testimonial = require("../models/Testimonial");

dotenv.config();

const fixTestimonials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        const testimonials = await Testimonial.find();
        console.log(`Found ${testimonials.length} testimonials.`);

        let updatedCount = 0;

        for (const t of testimonials) {
            // Check if image is the broken default or missing
            if (!t.image || t.image.includes("cdn.yoursite.com")) {
                // Use a valid placeholder
                t.image = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random&size=256`;
                await t.save();
                updatedCount++;
                console.log(`Updated image for: ${t.name}`);
            }
        }

        console.log(`✅ Fixed ${updatedCount} testimonials.`);
        process.exit();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

fixTestimonials();
