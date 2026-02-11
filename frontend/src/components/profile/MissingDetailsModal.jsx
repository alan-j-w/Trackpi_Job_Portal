import React, { useEffect } from 'react';
import ProfileStrengthCircle from './ProfileStrengthCircle';

const MissingDetailItem = ({ icon, label, score, onClick }) => (
    <div className="flex items-center justify-between py-2 group">
        <div className="flex items-center gap-3">
            <span className="text-xl text-black w-6 flex justify-center">{icon}</span>
            <span className="text-[13px] font-medium text-black">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-[#DCFCE7] text-[#16A34A] text-[10px] font-bold px-2 py-1 rounded-full flex items-center justify-center min-w-[50px]">
                ↑ {score}
            </span>
            <button
                onClick={onClick}
                className="bg-[#FFF9E5] text-[#F59E0B] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FCD34D] hover:bg-[#FCD34D] hover:text-white transition-colors min-w-[50px] flex justify-center"
            >
                Add
            </button>
        </div>
    </div>
);

const MissingDetailsModal = ({ isOpen, onClose, profile, onAction }) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // Calculate strength locally for display within the modal
    // This logic should ideally match calculateProfileStrength in utils/profileUtils
    // But simplified here for consistent display if not passed down fully calculated
    const calculateStrength = (p) => {
        let score = 20;
        if (p?.languages?.length > 0) score += 10;
        if (p?.skills?.length > 0) score += 7;
        if (p?.education?.length > 0) score += 7;
        if (p?.summary) score += 7;
        if (p?.workExperience?.length > 0) score += 7;
        if (p?.profileImage) score += 10;
        // ... add more conditions based on full logic
        return Math.min(Math.round(score), 100);
    };

    const strength = calculateStrength(profile);
    const strengthStatus = strength >= 100 ? "Excellent" : strength >= 70 ? "Good" : strength >= 50 ? "Intermediate" : "Beginner";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white rounded-[32px] p-8 w-full max-w-[800px] relative max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition p-2 hover:bg-gray-100 rounded-full"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 mt-2">
                    <h2 className="text-lg font-bold text-black mb-6">I am looking for job</h2>

                    {/* Centered Strength Circle */}
                    <div className="relative mb-4">
                        <ProfileStrengthCircle strength={strength} className="w-[180px] h-[180px]" />
                    </div>

                    <div className="text-center mt-2">
                        <span className="text-[14px] text-black font-medium mr-1">Profile Strength:</span>
                        <span className="text-[14px] font-bold text-[#FFB300]">{strengthStatus}</span>
                    </div>
                </div>

                {/* Grid of details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0 relative px-4 md:px-8">
                    {/* Vertical Divider for MD screens */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#FFB300]/20 transform -translate-x-1/2"></div>

                    {/* Left Column */}
                    <div className="space-y-3 md:pr-6">
                        <MissingDetailItem
                            icon={<i className="ri-translate-2 text-xl"></i>}
                            label="Add language"
                            score="10%"
                            onClick={() => onAction('language')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-brain-line text-xl"></i>}
                            label="Add skills"
                            score="07%"
                            onClick={() => onAction('skills')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-graduation-cap-line text-xl"></i>}
                            label="Add education"
                            score="07%"
                            onClick={() => onAction('education')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-user-smile-line text-xl"></i>}
                            label="Add summary"
                            score="07%"
                            onClick={() => onAction('summary')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-briefcase-line text-xl"></i>}
                            label="Add experience"
                            score="07%"
                            onClick={() => onAction('experience')}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-3 md:pl-6 mt-3 md:mt-0">
                        <MissingDetailItem
                            icon={<i className="ri-file-user-line text-xl"></i>}
                            label="Add your resume"
                            score="10%"
                            onClick={() => onAction('resume')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-link text-xl"></i>}
                            label="Add social links"
                            score="07%"
                            onClick={() => onAction('social')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-phone-fill text-xl"></i>}
                            label="Add phone number"
                            score="07%"
                            onClick={() => onAction('phone')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-vip-diamond-line text-xl"></i>}
                            label="Add marital status"
                            score="07%"
                            onClick={() => onAction('marital')}
                        />
                        <MissingDetailItem
                            icon={<i className="ri-calendar-event-line text-xl"></i>}
                            label="Add date of birth"
                            score="07%"
                            onClick={() => onAction('dob')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MissingDetailsModal;
