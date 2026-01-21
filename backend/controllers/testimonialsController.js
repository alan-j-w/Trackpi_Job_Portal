const Testimonial = require("../models/Testimonial.js");

// Create a new testimonial
const createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all testimonials with pagination
const getTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const testimonials = await Testimonial.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Testimonial.countDocuments();

    res.status(200).json({
      testimonials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTestimonial,
  getTestimonials,
};
