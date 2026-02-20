import React, { useState } from "react";
import { applyForJob } from "../../jobService";
import trackpiLogo from "../../assets/badges/trackpi-striped.png";

const ApplyJobForm = ({ jobId, job, onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        experience: "",
        portfolio: "",
    });

    // Load user data on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    name: user.name || "",
                    email: user.email || ""
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        }
    }, []);

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [fileError, setFileError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                setFileError("File size exceeds 2MB limit.");
                setResume(null);
                e.target.value = null; // Reset input
                return;
            }
            const validTypes = ['application/pdf'];
            if (!validTypes.includes(file.type)) {
                setFileError("Invalid format. Please upload PDF only.");
                setResume(null);
                e.target.value = null;
                return;
            }
            setFileError(null);
            setResume(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!resume) {
            setError("Please upload your resume.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("experience", formData.experience);
        data.append("portfolio", formData.portfolio);

        // Append User ID if available
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user._id || user.id) {
                    data.append("userId", user._id || user.id);
                }
            } catch (e) {
                // Ignore if parse fails
            }
        }

        if (resume) {
            data.append("resume", resume);
        }

        try {
            // If the user wants to test UI only, we can mock success if needed
            // const res = await applyForJob(jobId, data);

            // For now proceeding with real call
            const res = await applyForJob(jobId, data);

            if (res.success || res.application) {
                setMessage("Application submitted successfully!");
                setTimeout(() => {
                    onSuccess();
                }, 2000);
            } else {
                setError(res.message || "Failed to submit application.");
            }
        } catch (err) {
            console.error(err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (message) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fadeIn">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <i className="ri-check-line text-4xl text-green-600"></i>
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Success!</h3>
                <p className="text-gray-600 mb-6">Your application for {job?.title} has been sent.</p>
            </div>
        );
    }

    return (

        <div className="h-full flex flex-col animate-slideUp relative">
            {/* Close Button (Top Right) - mimicking the 'white circle' or just a clean close */}
            <div className="absolute -top-2 -right-2 z-20">
                <button
                    onClick={onCancel}
                    className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all backdrop-blur-sm"
                >
                    <i className="ri-close-line text-xl text-gray-500 hover:text-black"></i>
                </button>
            </div>

            {/* Custom Header for Form */}
            <div className="flex items-center justify-center gap-3 mb-5 pt-4">
                <img src={trackpiLogo} alt="Logo" className="w-14 object-contain" />
                <div className="flex flex-col items-start leading-tight">
                    <h2 className="text-sm font-bold text-black">TrackPi Private Limited</h2>
                    <p className="text-gray-500 text-[10px]">{job?.location || "Kochi, Kerala"}</p>
                    <h3 className="text-black font-bold text-[11px]">{job?.title || "UI/UX Designer"}</h3>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto px-6 pb-4 space-y-3 relative z-10 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {error && (
                    <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs border border-red-100 flex items-center gap-2">
                        <i className="ri-error-warning-fill"></i>
                        {error}
                    </div>
                )}


                {/* 1. Personal Information */}
                <div>
                    <h4 className="text-sm font-bold text-black mb-1">Personal Information</h4>

                    <div className="space-y-2">
                        {/* Full Name */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] font-semibold text-gray-800">Full Name<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full text-black font-bold text-xs border-b border-gray-300 focus:border-black outline-none py-0.5 bg-transparent transition-colors placeholder:font-normal"
                                placeholder="Paul Walker"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] font-semibold text-gray-800">Email Address<span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full text-black font-bold text-xs border-b border-gray-300 focus:border-black outline-none py-0.5 bg-transparent transition-colors placeholder:font-normal"
                                placeholder="paulwalker233@gmail.com"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] font-normal text-gray-600">Phone Number (With country code)</label>
                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-1 bg-white">
                                <div className="border-r border-gray-300 pr-2">
                                    <select className="bg-transparent font-bold text-xs text-black outline-none cursor-pointer appearance-none pr-3">
                                        <option>+91</option>
                                        <option>+1</option>
                                        <option>+44</option>
                                    </select>
                                    <i className="ri-arrow-down-s-fill absolute ml-[-12px] mt-[3px] text-[8px] pointer-events-none text-black"></i>
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="flex-grow font-bold text-xs text-black outline-none bg-transparent"
                                    placeholder="867392385578"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Job-Related Details */}
                <div>
                    <h4 className="text-sm font-bold text-black mb-1">Job-Related Details</h4>

                    <div className="space-y-2">
                        {/* Experience */}
                        <div className="space-y-0.5">
                            <label className="text-[10px] font-normal text-gray-600">Experience</label>
                            <input
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="w-full font-bold text-xs text-black border-b border-gray-300 focus:border-black outline-none py-0.5 bg-transparent"
                                placeholder="I am fresher"
                            />
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black">Resume / CV Upload</label>
                            <div className="flex items-center gap-2">
                                <div className="relative px-2 py-1 bg-[#E9E9E9] border border-gray-400 rounded overflow-hidden flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                                    <span className="text-[9px] font-bold text-black">Choose file</span>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <span className="text-[9px] text-gray-500 truncate max-w-[150px]">{resume ? resume.name : ""}</span>
                            </div>
                            <p className="text-[#8A8A8A] text-[9px] mt-0.5 tracking-wide leading-tight">PDF only, 2MB limit</p>
                            {fileError && (
                                <p className="text-red-500 text-[9px] mt-0.5 flex items-center gap-1 animate-pulse">
                                    <i className="ri-error-warning-line"></i> {fileError}
                                </p>
                            )}
                        </div>

                        {/* Portfolio Link */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black">Portfolio / Work samples Link</label>
                            <div className="bg-[#F3F3F3] border border-gray-400 rounded p-1.5">
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none text-black font-semibold text-xs placeholder:text-black"
                                    placeholder="www.behancepaulwalker.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-32 h-8 bg-gradient-to-b from-[#FFD740] to-white hover:from-[#FFE57F] hover:to-gray-50 rounded-lg text-black font-bold text-xs shadow-md transition-all flex items-center justify-center border border-[#FFD740]"
                    >
                        {loading ? <i className="ri-loader-4-line animate-spin"></i> : "Submit"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-32 h-8 bg-white hover:bg-gray-50 rounded-lg text-black font-bold text-xs shadow-md transition-all border border-black"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

};

export default ApplyJobForm;
