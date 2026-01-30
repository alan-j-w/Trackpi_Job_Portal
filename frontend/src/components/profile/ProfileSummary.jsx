import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const ProfileSummary = ({ summary, onEdit }) => {
    return (
        <div className="pb-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-lg text-black">Profile Summary</h2>
                <EditIcon className="w-7 h-7" onClick={onEdit} />
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {summary || "Add a summary about yourself..."}
            </p>
        </div>
    );
};

export default ProfileSummary;
