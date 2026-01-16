import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const Education = () => {
    const { resumeData, setResumeData } = useResume();
    const { education } = resumeData;

    // Local state for the new entry being added form
    const [newEdu, setNewEdu] = useState({
        school: '',
        degree: '',
        year: '',
        gpa: '', // Added GPA field based on the design
        description: '' // Added description based on design
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEdu({ ...newEdu, [name]: value });
    };

    const handleAdd = () => {
        if (!newEdu.school || !newEdu.degree) return;
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { ...newEdu, id: Date.now() }]
        }));
        setNewEdu({ school: '', degree: '', year: '', gpa: '', description: '' });
    };

    const handleRemove = (id) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.filter(edu => edu.id !== id)
        }));
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800">Education</h3>

            {/* List of added education */}
            <div className="space-y-4">
                {education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-start group">
                        <div>
                            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                            {edu.gpa && <p className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                        </div>
                        <button
                            onClick={() => handleRemove(edu.id)}
                            className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add New Education Form */}
            <div className="bg-white p-4 border rounded-xl space-y-4">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Add Education</h4>
                <div>
                    <input
                        type="text"
                        name="school"
                        value={newEdu.school}
                        onChange={handleChange}
                        placeholder="School / University"
                        className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="degree"
                        value={newEdu.degree}
                        onChange={handleChange}
                        placeholder="Degree (e.g. BSc Computer Science)"
                        className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                    />
                    <div className="flex gap-4">
                        <input
                            type="text"
                            name="year"
                            value={newEdu.year}
                            onChange={handleChange}
                            placeholder="Year"
                            className="w-1/2 border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                        />
                        <input
                            type="text"
                            name="gpa"
                            value={newEdu.gpa}
                            onChange={handleChange}
                            placeholder="GPA"
                            className="w-1/2 border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                        />
                    </div>
                </div>

                <textarea
                    name="description"
                    value={newEdu.description}
                    onChange={handleChange}
                    placeholder="Relevant Coursework, Honors, etc."
                    rows="2"
                    className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition resize-none"
                />

                <button
                    onClick={handleAdd}
                    disabled={!newEdu.school || !newEdu.degree}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} /> Add Education
                </button>
            </div>
        </div>
    );
};

export default Education;
