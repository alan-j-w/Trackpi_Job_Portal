import React, { useState, useEffect } from "react";
import SearchableDropdown from "../../pages/create-profile/components/SearchableDropdown";

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

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
        educationDegree: "",
        locationCity: "",
        locationState: "",
        countryCode: "+91",
        maritalStatus: "",
        dob: "",
        socialLinks: { linkedin: "", twitter: "", facebook: "", portfolio: "" }
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
                phone: profileData.phone?.replace(/^\+91/, '') || "",
                email: profileData.email || "",
                educationDegree: profileData.education?.[0]?.degree || "",
                locationCity: profileData.location?.city || "",
                locationState: profileData.location?.state || "",
                countryCode: "+91",
                maritalStatus: profileData.maritalStatus || "",
                dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : "",
                socialLinks: {
                    linkedin: profileData.socialLinks?.linkedin || "",
                    twitter: profileData.socialLinks?.twitter || "",
                    facebook: profileData.socialLinks?.facebook || "",
                    portfolio: profileData.socialLinks?.portfolio || "" // Behance/Portfolio
                }
            });
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
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
        const finalData = { ...formData };

        // Auto-add pending skill input if user forgot to press Enter
        if (skillInput.trim()) {
            const newSkill = skillInput.trim();
            if (!finalData.skills.includes(newSkill)) {
                finalData.skills = [...finalData.skills, newSkill];
            }
        }

        if (finalData.phone && !finalData.phone.startsWith('+91')) {
            finalData.phone = '+91' + finalData.phone;
        }
        onSave(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
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
                            placeholder="John Doe"
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
                            placeholder="Sales Executive"
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
                        <div className="relative">
                            <label className="block text-sm font-bold text-black mb-2">District</label>
                            <SearchableDropdown
                                options={KERALA_DISTRICTS.map(d => ({ name: d, value: d }))}
                                value={formData.locationCity}
                                onChange={(val) => handleChange({ target: { name: 'locationCity', value: val } })}
                                placeholder="Select District"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>

                        {/* State */}
                        <div className="relative">
                            <label className="block text-sm font-bold text-black mb-2">State</label>
                            <SearchableDropdown
                                options={[{ name: "Kerala", value: "Kerala" }]}
                                value={formData.locationState || "Kerala"}
                                onChange={(val) => handleChange({ target: { name: 'locationState', value: val } })}
                                placeholder="Select State"
                                valueKey="value"
                                labelKey="name"
                                searchable={false}
                            />
                        </div>
                    </div>

                    {/* Marital Status & DOB */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">Marital Status</label>
                            <div className="relative">
                                <SearchableDropdown
                                    options={["Single", "Married", "Divorced", "Widowed"].map(s => ({ name: s, value: s }))}
                                    value={formData.maritalStatus}
                                    onChange={(val) => handleChange({ target: { name: 'maritalStatus', value: val } })}
                                    placeholder="Select Status"
                                    valueKey="value"
                                    labelKey="name"
                                    searchable={false}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm font-medium text-black placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-4">Social Links</label>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-sm font-medium text-gray-600">LinkedIn</span>
                                <input
                                    name="linkedin"
                                    value={formData.socialLinks.linkedin}
                                    onChange={handleSocialChange}
                                    className="flex-1 border-b border-gray-300 py-1 outline-none focus:border-[#FFB300] text-sm"
                                    placeholder="LinkedIn URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-sm font-medium text-gray-600">Twitter</span>
                                <input
                                    name="twitter"
                                    value={formData.socialLinks.twitter}
                                    onChange={handleSocialChange}
                                    className="flex-1 border-b border-gray-300 py-1 outline-none focus:border-[#FFB300] text-sm"
                                    placeholder="Twitter URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-sm font-medium text-gray-600">Facebook</span>
                                <input
                                    name="facebook"
                                    value={formData.socialLinks.facebook}
                                    onChange={handleSocialChange}
                                    className="flex-1 border-b border-gray-300 py-1 outline-none focus:border-[#FFB300] text-sm"
                                    placeholder="Facebook URL"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-24 text-sm font-medium text-gray-600">Behance</span>
                                <input
                                    name="portfolio"
                                    value={formData.socialLinks.portfolio}
                                    onChange={handleSocialChange}
                                    className="flex-1 border-b border-gray-300 py-1 outline-none focus:border-[#FFB300] text-sm"
                                    placeholder="Behance/Portfolio URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 pt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-b from-[#FFF5CC] to-[#FFB300] text-black font-bold py-3 px-12 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
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
