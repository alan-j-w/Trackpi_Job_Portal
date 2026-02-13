import React, { useState, useEffect } from 'react';

const BulkEditExperienceModal = ({ isOpen, onClose, initialExperiences, onSave }) => {
    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setExperiences(initialExperiences || []);
        }
    }, [isOpen, initialExperiences]);

    const handleChange = (index, field, value) => {
        const updated = [...experiences];
        updated[index] = { ...updated[index], [field]: value };
        setExperiences(updated);
    };

    const handleDelete = (index) => {
        const updated = experiences.filter((_, i) => i !== index);
        setExperiences(updated);
    };

    const handleAdd = () => {
        setExperiences([
            ...experiences,
            {
                jobTitle: '',
                company: '',
                employmentType: 'Full-time',
                startDate: '',
                endDate: '',
                location: '',
                description: ''
            }
        ]);
    };

    const handleSubmit = () => {
        onSave(experiences);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Edit Experience</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                    {experiences.map((exp, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative group">
                            {/* Delete Button (Absolute) */}
                            <button
                                onClick={() => handleDelete(index)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                                title="Remove this experience"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Experience {index + 1}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={exp.jobTitle}
                                        onChange={(e) => handleChange(index, 'jobTitle', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition"
                                        placeholder="Ex: Full Stack Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                    <input
                                        type="text"
                                        value={exp.company}
                                        onChange={(e) => handleChange(index, 'company', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition"
                                        placeholder="Ex: Microsoft"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                    <select
                                        value={exp.employmentType}
                                        onChange={(e) => handleChange(index, 'employmentType', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition bg-white"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="text"
                                        value={exp.startDate}
                                        onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition"
                                        placeholder="MMM YYYY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="text"
                                        value={exp.endDate}
                                        onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition"
                                        placeholder="MMM YYYY or Present"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleChange(index, 'location', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition"
                                    placeholder="Ex: Bangalore, India"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={exp.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#FFB300] focus:border-transparent outline-none transition resize-none"
                                    placeholder="Describe your role and achievements..."
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleAdd}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-[#FFB300] hover:text-[#FFB300] transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Another Experience
                    </button>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 rounded-lg bg-[#FFB300] text-black font-bold hover:bg-[#ffca2c] transition shadow-sm"
                    >
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkEditExperienceModal;
