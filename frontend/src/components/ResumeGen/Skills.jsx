import React, { useState } from 'react';
import { useResume } from './ResumeContext';
import { Plus, Trash2 } from 'lucide-react';

const Skills = () => {
    const { resumeData, setResumeData } = useResume();
    const { skills } = resumeData;
    const { hard = [], soft = [] } = skills; // Fallback defaults

    const [newSkill, setNewSkill] = useState({ type: 'hard', value: '' });

    const handleAdd = () => {
        if (!newSkill.value) return;
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [newSkill.type]: [...(prev.skills[newSkill.type] || []), newSkill.value]
            }
        }));
        setNewSkill({ ...newSkill, value: '' });
    };

    const handleRemove = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index)
            }
        }));
    };

    return (
        <div className="space-y-8 animate-fadeIn">

            {/* Hard Skills Section */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Hard Skills</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {hard.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemove('hard', index)} className="text-gray-400 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSkill.type === 'hard' ? newSkill.value : ''}
                        onChange={(e) => setNewSkill({ type: 'hard', value: e.target.value })}
                        onFocus={() => setNewSkill({ ...newSkill, type: 'hard' })}
                        placeholder="Add your hard skills"
                        className="flex-1 border p-3 rounded-lg border-gray-300 focus:border-[#FFB300] outline-none transition"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={newSkill.type !== 'hard' || !newSkill.value}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg transition disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Soft Skills Section */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-3">Soft Skills</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {soft.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium flex items-center gap-2">
                            {skill}
                            <button onClick={() => handleRemove('soft', index)} className="text-gray-400 hover:text-red-500">
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSkill.type === 'soft' ? newSkill.value : ''}
                        onChange={(e) => setNewSkill({ type: 'soft', value: e.target.value })}
                        onFocus={() => setNewSkill({ ...newSkill, type: 'soft' })}
                        placeholder="Add your soft skills"
                        className="flex-1 border p-3 rounded-lg border-gray-300 focus:border-[#FFB300] outline-none transition"
                    />
                    <button
                        onClick={handleAdd}
                        disabled={newSkill.type !== 'soft' || !newSkill.value}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-lg transition disabled:opacity-50"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Skills;
