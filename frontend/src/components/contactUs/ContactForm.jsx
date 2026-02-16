import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../config";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        location: "Where are you located?",
        hearAboutUs: "How did you hear about us?",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Basic Validation
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/api/contact/submit`, formData);
            toast.success("Message sent successfully! We'll be in touch soon.");
            setFormData({
                name: "",
                email: "",
                phone: "",
                location: "Where are you located?",
                hearAboutUs: "How did you hear about us?",
                message: ""
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            const msg = error.response?.data?.message || "Failed to send message. Please try again.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Send <span className="text-[#FFB300]">Us</span> a Message</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Email address *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Phone number (Optional)</label>
                    <div className="flex gap-2">
                        <span className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">🇮🇳 +91</span>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Mobile number"
                            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Location *</label>
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50 text-gray-500"
                    >
                        <option>Where are you located?</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">About us *</label>
                    <select
                        name="hearAboutUs"
                        value={formData.hearAboutUs}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50 text-gray-500"
                    >
                        <option>How did you hear about us?</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend">Friend</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Search Engine">Search Engine</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Message *</label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Please describe your inquiry in detail..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50"
                        required
                    ></textarea>
                </div>

                <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-[#FFB300] rounded focus:ring-0" required />
                    <p className="text-sm text-gray-500">
                        I agree to the <a href="#" className="text-[#FFB300] underline">privacy policy</a> and consent to data processing.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FFB300] hover:bg-[#ffca2c] text-black font-bold py-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Sending..." : "Send Message"}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
