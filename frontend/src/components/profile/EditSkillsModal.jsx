import React, { useState, useEffect } from "react";

const EditSkillsModal = ({ isOpen, onClose, currentSkills, onSave }) => {
    const [skills, setSkills] = useState(currentSkills || []);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setSkills(currentSkills || []);
        setInputValue(""); // Clear input when modal opens/updates
    }, [currentSkills, isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!skills.includes(inputValue.trim())) {
                setSkills([...skills, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleSave = () => {
        let finalSkills = [...skills];
        if (inputValue.trim() && !skills.includes(inputValue.trim())) {
            finalSkills.push(inputValue.trim());
        }
        onSave(finalSkills);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-10 relative" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-2xl font-bold mb-8 text-black">Manage Skills</h2>

                <div className="mb-10">
                    <label className="block text-sm font-bold text-black mb-3">Skills</label>
                    <div className="flex flex-wrap gap-3 mb-4">
                        {skills.map((skill, idx) => (
                            <span key={idx} className="border border-[#FFB300] px-4 py-2 rounded-lg bg-white text-gray-800 text-sm font-bold flex items-center gap-2 shadow-sm">
                                <span className="text-[#FFB300] text-lg">★</span>
                                {skill}
                                <span
                                    onClick={() => removeSkill(skill)}
                                    className="cursor-pointer ml-1 hover:text-red-500 text-lg leading-none"
                                >
                                    ×
                                </span>
                            </span>
                        ))}
                    </div>

                    <div className="relative border-b border-gray-400">
                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent py-2 outline-none text-sm text-black placeholder-gray-500"
                            placeholder="Type a skill and press Enter..."
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleSave}
                        className="bg-gradient-to-b from-[#FFE587] to-[#FFB300] text-black font-bold py-3 px-12 rounded-lg shadow-sm hover:shadow-md transition w-40 border border-[#FFB300]/50"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-white border border-gray-400 text-black font-bold py-3 px-12 rounded-lg hover:bg-gray-50 transition w-40"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSkillsModal;
