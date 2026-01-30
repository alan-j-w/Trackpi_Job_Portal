import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const ResumeSection = () => {
    return (
        <div className="py-8 pb-12">
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-black">Resume</h2>
                <div className="flex gap-4 text-gray-400 items-center">
                    <svg className="w-5 h-5 cursor-pointer hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <EditIcon className="w-7 h-7" />
                    <svg className="w-5 h-5 cursor-pointer hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
            </div>
            <div className="border border-gray-300 rounded-lg p-2 max-w-[400px] bg-white">
                <div className="flex gap-4">
                    <div className="w-24 h-full min-h-[80px] bg-gray-50 border border-gray-200 rounded flex flex-col items-center justify-center p-2 relative">
                        <span className="text-[8px] tracking-widest text-gray-400 font-bold mb-1">WALTON</span>
                        <div className="w-12 h-0.5 bg-gray-300 mb-0.5"></div>
                        <div className="w-8 h-0.5 bg-gray-300 mb-0.5"></div>
                    </div>
                    <div className="py-2 flex-1">
                        {/* Placeholder for filename/details if needed */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeSection;
