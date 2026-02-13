import React, { useState } from "react";
import EditExperienceModal from "../../components/profile/EditExperienceModal";
import { calculateProfileStrength } from "../../utils/profileUtils";
import ProfileStrengthCircle from "../../components/profile/ProfileStrengthCircle";

const Step3Experience = ({ formData, setFormData, handleChange, onBack, onSubmit }) => {

    const { strength } = calculateProfileStrength({
        ...formData,
        education: formData.educationList,
        workExperience: formData.workExperiences
    });

    // ================= EXPERIENCE LOGIC =================
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [currentExperienceData, setCurrentExperienceData] = useState(null);

    const openExperienceModal = (index = null) => {
        if (index !== null) {
            setEditingExperienceIndex(index);
            setCurrentExperienceData(formData.workExperiences[index]);
        } else {
            setEditingExperienceIndex(null);
            setCurrentExperienceData(null);
        }
        setShowExperienceModal(true);
    };

    const handleExperienceSave = (newExp) => {
        setFormData(prev => {
            const list = [...(prev.workExperiences || [])];
            if (editingExperienceIndex !== null) {
                list[editingExperienceIndex] = newExp;
            } else {
                list.push(newExp);
            }
            return { ...prev, workExperiences: list };
        });
        setShowExperienceModal(false);
    };

    const handleExperienceDelete = (index) => {
        setFormData(prev => ({
            ...prev,
            workExperiences: prev.workExperiences.filter((_, i) => i !== index)
        }));
    };

    const handleLicenseChange = (type) => {
        setFormData(prev => {
            const licenses = prev.drivingLicenses || [];
            if (licenses.includes(type)) {
                return { ...prev, drivingLicenses: licenses.filter(l => l !== type) };
            } else {
                return { ...prev, drivingLicenses: [...licenses, type] };
            }
        });
    };

    return (
        <div className="h-screen flex flex-col animate-fadeIn">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-30 bg-white pb-6 space-y-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        "Need to get recognized by <span className="text-[#FBBF24]">HR quickly?"</span>
                    </h2>
                    <p className="text-gray-600 text-lg">Then add the missing details</p>
                </div>

                {/* Profile Strength Indicator */}
                <div className="flex justify-center mb-12">
                    <ProfileStrengthCircle strength={strength} />
                </div>

            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto px-1">
                {/* Form Sections */}
                <div className="space-y-6">

                    {/* Work Experience */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <label className="block text-sm font-bold text-black">Work experience</label>
                            <button
                                onClick={() => openExperienceModal()}
                                className="text-[#FFB300] font-bold text-sm hover:underline"
                            >
                                Add Experience +
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mb-4 font-medium">Add your work experience to build trust</p>

                        {/* Experience List */}
                        <div className="space-y-3 mt-4">
                            {(formData.workExperiences || []).map((exp, index) => (
                                <div key={index} className="bg-transparent rounded-xl p-4 border border-[#FFB300] flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-black mb-0.5">{exp.jobTitle}</p>
                                        <p className="text-xs text-black font-medium mb-0.5">{exp.company}</p>
                                        <p className="text-[11px] text-gray-500 font-medium">{exp.startDate} - {exp.endDate} | {exp.employmentType}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openExperienceModal(index)} className="text-gray-400 hover:text-[#FFB300] mt-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                        </button>
                                        <button onClick={() => handleExperienceDelete(index)} className="text-gray-400 hover:text-red-500 mt-1">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expected Salary */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-2">Expected Salary</label>
                        <input
                            name="expectedSalary"
                            className="w-full bg-transparent border-b border-dashed border-[#9CA3AF] py-3 text-sm focus:border-[#FFB300] outline-none text-gray-800 placeholder-gray-400 font-medium"
                            placeholder="Eg: 20,000₹"
                            value={formData.expectedSalary}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Driving License */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Do You Have Driving License</label>
                        <div className="flex gap-8">
                            <div onClick={() => handleLicenseChange('two_wheeler')} className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.drivingLicenses.includes('two_wheeler') ? 'border-[#FFB300] bg-[#FFB300]' : 'border-[#FFB300]'}`}>
                                    {/* Allow checkmark or fill? Design implies Checkbox behavior but look like radio/circle. Using consistent fill logic */}
                                </div>
                                <span className="text-sm font-medium text-black">Two wheeler</span>
                            </div>
                            <div onClick={() => handleLicenseChange('four_wheeler')} className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.drivingLicenses.includes('four_wheeler') ? 'border-[#FFB300] bg-[#FFB300]' : 'border-[#FFB300]'}`}>
                                </div>
                                <span className="text-sm font-medium text-black">Four Wheeler</span>
                            </div>
                        </div>
                    </div>

                    {/* 2 Wheeler */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pr-10">
                            <label className="block text-sm font-bold text-black">Do You Have 2 Wheeler</label>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTwoWheeler === true ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasTwoWheeler === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasTwoWheeler" checked={formData.hasTwoWheeler === true} onChange={() => setFormData({ ...formData, hasTwoWheeler: true })} className="hidden" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTwoWheeler === false ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasTwoWheeler === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasTwoWheeler" checked={formData.hasTwoWheeler === false} onChange={() => setFormData({ ...formData, hasTwoWheeler: false })} className="hidden" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Laptop */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pr-10">
                            <label className="block text-sm font-bold text-black">Do You Have Laptop</label>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasLaptop === true ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasLaptop === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasLaptop" checked={formData.hasLaptop === true} onChange={() => setFormData({ ...formData, hasLaptop: true })} className="hidden" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasLaptop === false ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasLaptop === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasLaptop" checked={formData.hasLaptop === false} onChange={() => setFormData({ ...formData, hasLaptop: false })} className="hidden" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Social Links</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['linkedin', 'behance', 'facebook', 'twitter'].map((platform) => (
                                <div key={platform} className="flex items-center bg-white rounded-full px-4 py-2 border border-transparent focus-within:border-[#FFB300] shadow-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    <input
                                        name={`socialLinks.${platform}`}
                                        className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 capitalize"
                                        placeholder={platform}
                                        value={formData.socialLinks?.[platform] || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-8 pb-10">
                    <button onClick={onBack} className="bg-white border text-black font-semibold py-3 px-10 rounded-xl shadow-sm hover:bg-gray-50 transition min-w-[120px]">
                        Back
                    </button>
                    <button onClick={onSubmit} className="bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-3 px-10 rounded-xl shadow-lg transition transform hover:scale-105 min-w-[160px]">
                        Create profile
                    </button>
                </div>

                <p className="text-center text-[#FFB300] text-xs font-medium -mt-6 pb-6">Page 3 of 3</p>
            </div>

            {/* Experience Modal */}
            <EditExperienceModal
                isOpen={showExperienceModal}
                onClose={() => setShowExperienceModal(false)}
                experienceData={currentExperienceData}
                onSave={handleExperienceSave}
                isEditing={editingExperienceIndex !== null}
            />
        </div>
    );
};

export default Step3Experience;
