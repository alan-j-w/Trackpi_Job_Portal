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

const ExperienceSection = ({ workExperience, onEdit }) => {
    return (
        <div className="py-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-black">Experience</h2>
                <div className="flex gap-4">
                    <EditIcon className="w-7 h-7" />
                    <PlusIcon />
                </div>
            </div>
            {workExperience?.length > 0 ? (
                <div className="space-y-6">
                    {workExperience.map((exp, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="w-14 h-14 bg-[#FFB300] rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
                                <span className="text-xs transform -rotate-12 bg-white text-[#FFB300] px-1 py-0.5 rounded shadow-sm">TrackPi</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base text-gray-900">{exp.jobTitle}</h3>
                                <div className="text-sm text-gray-700 font-medium">
                                    {exp.company}
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span className="text-gray-900 font-medium">{exp.employmentType || "Internship"}</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    <span>{exp.location}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-900">₹5,000</span>
                                    <span className="text-gray-300">|</span>
                                    <span>Remote</span>
                                </div>

                                <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">
                                    Job Profile ipsum you must be muted. Ping good quick-win churning conversation talk speed functional info people. After pups with run left money. Lot dive awareness cadence cross-pollination cross-pollination latest impact shark. If that before jumping crystallize post pants.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-sm text-gray-400 italic">No experience added.</p>}
        </div>
    );
};

export default ExperienceSection;
