import React, { useState, useEffect } from "react";
// SVGs used directly in component

const EditProfileModal = ({ isOpen, onClose, profileData, onSave }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        fullName: "",
        jobTitle: "",
        skills: [],
        workStatus: "",
        gender: "",
        phone: "",
        email: "",
        educationDegree: "", // We'll map this to the first ed entry
        locationCity: "",
        locationState: "",
        countryCode: "+91"
    });

    const [skillInput, setSkillInput] = useState("");

    // Initialize form with profile data
    useEffect(() => {
        if (profileData) {
            setFormData({
                fullName: profileData.fullName || "",
                jobTitle: profileData.jobTitle || "",
                skills: profileData.skills || [],
                workStatus: profileData.workStatus || "",
                gender: profileData.gender || "",
                phone: profileData.phone || "", // Assuming phone might include code, we might need to strip it if separate
                email: profileData.email || "",
                // Take first education entry's degree or empty
                educationDegree: profileData.education?.[0]?.degree || "",
                // Parse location string or use fields if available
                locationCity: profileData.location?.city || "",
                locationState: profileData.location?.state || "",
                countryCode: "+91" // Default or parse from phone
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillAdd = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
            }
            setSkillInput("");
        }
    };

    const removeSkill = (skill) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Enter your Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm font-medium text-black placeholder-gray-400"
                            placeholder="Paul walker"
                        />
                    </div>

                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Add your job title</label>
                        <input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm font-medium text-black placeholder-gray-400"
                            placeholder="UI UX Designer"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-3">Skills</label>
                        <div className="flex flex-wrap gap-3 mb-2">
                            {formData.skills.map((skill, idx) => (
                                <span key={idx} className="border border-[#FFB300] px-3 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2">
                                    <span className="text-[#FFB300]">★</span> {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-black hover:text-red-500 font-bold ml-1">×</button>
                                </span>
                            ))}
                        </div>
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillAdd}
                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm placeholder-gray-400"
                            placeholder="Type and press Enter to add skills..."
                        />
                    </div>

                    {/* Work Status */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-4">Work status</label>
                        <div className="flex flex-wrap gap-8">
                            {['Fresher', 'Intern', 'Experienced'].map(status => (
                                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.workStatus.toLowerCase() === status.toLowerCase() ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.workStatus.toLowerCase() === status.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="workStatus"
                                        value={status.toLowerCase()}
                                        checked={formData.workStatus.toLowerCase() === status.toLowerCase()}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium text-gray-800">{status}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-4">Gender</label>
                        <div className="flex gap-12">
                            {['Male', 'Female'].map(g => (
                                <label key={g} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender.toLowerCase() === g.toLowerCase() ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.gender.toLowerCase() === g.toLowerCase() && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g.toLowerCase()}
                                        checked={formData.gender.toLowerCase() === g.toLowerCase()}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm font-medium text-gray-800">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Primary phone number</label>
                        <div className="flex items-center gap-4 mt-2 border-b border-gray-300 pb-2">

                            {/* Static Code Dropdown for UI match */}
                            <div className="bg-white border border-gray-200 rounded px-2 py-1 flex items-center gap-2 shadow-sm cursor-pointer">
                                <span className="text-sm font-bold text-black">+91</span>
                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>

                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-sm font-medium text-gray-600 placeholder-gray-300"
                                placeholder="9785105567"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Email ID</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm font-medium text-black placeholder-gray-400"
                            placeholder="example@gmail.com"
                        />
                    </div>

                    {/* Education */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Education</label>
                        <input
                            name="educationDegree"
                            value={formData.educationDegree}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm font-medium text-black placeholder-gray-400"
                            placeholder="Bsc Computer science"
                        />
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* District/City */}
                        {/* Using simple inputs with dropdown icons to match UI visual, as simplified logic */}
                        <div className="relative">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer">
                                <input
                                    name="locationCity"
                                    value={formData.locationCity}
                                    onChange={handleChange}
                                    placeholder="Palakkad"
                                    className="outline-none text-sm text-gray-600 w-full font-medium"
                                />
                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        {/* State */}
                        <div className="relative">
                            <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer">
                                <input
                                    name="locationState"
                                    value={formData.locationState}
                                    onChange={handleChange}
                                    placeholder="Kerala"
                                    className="outline-none text-sm text-gray-600 w-full font-medium"
                                />
                                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-b from-[#FFC107] to-[#FFB300] text-black font-bold py-3 px-12 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white border border-gray-400 text-black font-bold py-3 px-12 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
