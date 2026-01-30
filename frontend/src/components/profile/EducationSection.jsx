import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const PlusIcon = ({ className }) => (
    <svg className={`w-5 h-5 cursor-pointer hover:text-black text-gray-400 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const EducationSection = ({ education }) => {
    return (
        <div className="py-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-black">Education</h2>
                <div className="flex gap-4">
                    <EditIcon className="w-7 h-7" />
                    <PlusIcon />
                </div>
            </div>
            {education?.map((edu, idx) => (
                <div key={idx} className="flex gap-4 mb-6 last:mb-0">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-gray-100 p-2 shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/University_of_Calicut_logo.svg/1200px-University_of_Calicut_logo.svg.png" alt="University" className="w-full h-full object-contain opacity-80" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-black">{edu.institution}</h3>
                        <p className="text-sm text-gray-700 font-medium">{edu.degree}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Full time | {edu.year}</p>
                        <p className="text-xs text-gray-800 mt-0.5">Grade: A</p>
                    </div>
                </div>
            ))}
            {(!education || education.length === 0) && <p className="text-sm text-gray-400 italic">No education added.</p>}
        </div>
    );
};

export default EducationSection;
