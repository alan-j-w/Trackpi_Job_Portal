import React from "react";

const ContactForm = () => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">Send <span className="text-[#FFB300]">Us</span> a Message</h3>
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input type="text" placeholder="Enter your full name" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Email address *</label>
                    <input type="email" placeholder="Enter your email address" className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50" />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Phone number (Optional)</label>
                    <div className="flex gap-2">
                        <span className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-500">🇮🇳 +91</span>
                        <input type="tel" placeholder="Mobile number" className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Location *</label>
                    <select className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50 text-gray-500">
                        <option>Where are you located?</option>
                        <option>Kerala</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">About us *</label>
                    <select className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50 text-gray-500">
                        <option>How did you hear about us?</option>
                        <option>Social Media</option>
                        <option>Friend</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2">Message *</label>
                    <textarea rows="4" placeholder="Please describe your inquiry in detail..." className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFB300] bg-gray-50"></textarea>
                </div>

                <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-[#FFB300] rounded focus:ring-0" />
                    <p className="text-sm text-gray-500">
                        I agree to the <a href="#" className="text-[#FFB300] underline">privacy policy</a> and consent to data processing.
                    </p>
                </div>

                <button type="submit" className="w-full bg-[#FFB300] hover:bg-[#ffca2c] text-black font-bold py-4 rounded-xl shadow-md transition-all">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
