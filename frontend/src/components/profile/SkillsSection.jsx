import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const Tag = ({ label, deletable }) => (
    <span className="border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap">
        <span className="text-[#FFB300] text-lg leading-none">★</span> {label} {deletable && <span className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none">×</span>}
    </span>
);

const SkillsSection = ({ skills }) => {
    return (
        <div className="py-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-lg text-black">Skills</h2>
                <EditIcon className="w-7 h-7" />
            </div>
            <div className="flex flex-wrap gap-3">
                <Tag label="HTML" deletable />
                <Tag label="HMLT" deletable />
                <Tag label="Figma" deletable />
                <Tag label="User Research" deletable />
                {skills?.map((skill, idx) => (
                    <Tag key={idx} label={skill} deletable />
                ))}
            </div>
        </div>
    );
};

export default SkillsSection;
