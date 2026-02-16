import React, { useState, useEffect } from "react";

const EditExperienceModal = ({ isOpen, onClose, experienceData, onSave, isEditing }) => {
    const [formData, setFormData] = useState({
        jobTitle: "",
        employmentType: "",
        company: "",
        location: "", // Combined into company in UI or separate? UI shows "Company name or organisation" with value "Trackpi private limited, kakkanad, Ernalulam". Let's assume it's one field or we split it. For now, treating as one 'company' field or separate 'location'. Let's add location field but maybe hidden if UI merges it? The UI input value looks merged. Let's keep separate in state but maybe render differently. Actually, let's just use 'company' for now to match UI "Company name or organisation" input.
        currentlyWorking: false,
        startDate: "",
        endDate: "Present",
        description: "",
        salary: "",
        workMode: ""
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditing && experienceData) {
                setFormData({
                    jobTitle: experienceData.jobTitle || "",
                    employmentType: experienceData.employmentType || "",
                    company: experienceData.company || "",
                    location: experienceData.location || "",
                    currentlyWorking: experienceData.currentlyWorking || experienceData.endDate === 'Present',
                    startDate: experienceData.startDate || "",
                    endDate: experienceData.endDate || "",
                    description: experienceData.description || "",
                    salary: experienceData.salary || "",
                    workMode: experienceData.workMode || ""
                });
            } else {
                // Reset for Add mode
                setFormData({
                    jobTitle: "",
                    employmentType: "",
                    company: "",
                    location: "",
                    currentlyWorking: false,
                    startDate: "",
                    endDate: "",
                    description: "",
                    salary: "",
                    workMode: ""
                });
            }
        }
    }, [isOpen, experienceData, isEditing]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'currentlyWorking' && checked) {
                newData.endDate = 'Present';
            }
            return newData;
        });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#FFFFF0] rounded-xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-xl font-bold mb-8 text-black">Work experience</h2>

                <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Job title</label>
                        <input
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500"
                            placeholder="Sales Executive"
                        />
                    </div>

                    {/* Employment Type */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-3">Employment type</label>
                        <div className="flex flex-wrap gap-6">
                            {['Full time', 'Part time', 'Internship', 'Freelance', 'Trainee', 'Self employee'].map(type => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center ${formData.employmentType === type ? 'border-[#FFB300] bg-[#FFB300]' : ''}`}>
                                        {formData.employmentType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="employmentType"
                                        value={type}
                                        checked={formData.employmentType === type}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-500">{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Company name or organisation</label>
                        <input
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500"
                            placeholder="Trackpi private limited, kakkanad, Ernalulam"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Location</label>
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500"
                            placeholder="e.g. New York, USA"
                        />
                    </div>

                    {/* Salary & Work Mode Row */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">Salary</label>
                            <input
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500"
                                placeholder="e.g. ₹5,000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-black mb-1">Work Mode</label>
                            <select
                                name="workMode"
                                value={formData.workMode}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black"
                            >
                                <option value="">Select</option>
                                <option value="onsite">Onsite</option>
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>

                    {/* Currently Working */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="currentlyWorking"
                            checked={formData.currentlyWorking}
                            onChange={handleChange}
                            className="w-4 h-4 border border-orange-400 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <label className="text-sm font-bold text-black">I am presently working</label>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-8 pt-2">
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">Joining date</label>
                            <div className="relative border border-gray-400 rounded-full px-4 py-2 bg-[#F9F9F9]">
                                <input
                                    type="text" // Using text to match UI placeholder style "01/03/2025" logic. Or type="date". UI shows calendar icon inside.
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none text-sm text-black"
                                    placeholder="01/03/2025"
                                    // Make it a date picker on focus or use a library. For now simple text/date.
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </span>
                            </div>
                        </div>
                        <div>
                            {/* End Date or Present */}
                            {formData.currentlyWorking ? (
                                <div className="mt-7 border border-gray-400 rounded-full px-4 py-2 bg-[#F9F9F9] opacity-80">
                                    <span className="text-sm text-black font-medium">Present</span>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-black mb-2">End date</label>
                                    <div className="relative border border-gray-400 rounded-full px-4 py-2 bg-[#F9F9F9]">
                                        <input
                                            type="text"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="w-full bg-transparent outline-none text-sm text-black"
                                            placeholder="DD/MM/YYYY"
                                            onFocus={(e) => e.target.type = 'date'}
                                            onBlur={(e) => { if (!e.target.value) e.target.type = 'text' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-transparent border-b border-black py-2 outline-none text-sm font-medium text-black placeholder-gray-500 min-h-[80px] resize-none"
                            placeholder="Describe your role and responsibilities..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-6 pt-8">
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-b from-[#FFE587] to-[#FFB300] text-black font-bold py-2.5 px-12 rounded-lg shadow-sm hover:shadow-md transition w-40 border border-[#FFB300]/50"
                        >
                            Submit
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-white border border-black text-black font-bold py-2.5 px-12 rounded-lg hover:bg-gray-50 transition w-40"
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditExperienceModal;
