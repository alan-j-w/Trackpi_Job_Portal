import React, { useState, useRef, useEffect } from 'react';

const EditIcon = ({ className, onClick, children }) => (
    <div onClick={(e) => { e.stopPropagation(); onClick(e); }} className={`cursor-pointer transition flex items-center justify-center ${className}`}>
        {children || (
            <svg className="w-full h-full text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        )}
    </div>
);

const VerifiedIcon = () => (
    <div className="group relative flex items-center justify-center cursor-help ml-1.5" title="Verified User">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1L14.6 3.9L18.4 3.1L18.9 7L22.4 8.6L20.5 12L22.4 15.4L18.9 17L18.4 20.9L14.6 20.1L12 23L9.4 20.1L5.6 20.9L5.1 17L1.6 15.4L3.5 12L1.6 8.6L5.1 7L5.6 3.1L9.4 3.9L12 1Z" fill="#FFB300" />
            <path d="M10 16.5L6.5 13L7.9 11.6L10 13.7L16.1 7.6L17.5 9L10 16.5Z" fill="white" />
        </svg>
    </div>
);

const Tag = ({ label, deletable }) => (
    <span className="border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-black text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap">
        <span className="text-[#FFB300] text-lg leading-none">★</span> {label} {deletable && <span className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none">×</span>}
    </span>
);

const ProfileHeader = ({ profile, onEdit, onCoverUpload, onProfileImageUpload, onDeleteCover, onDeleteProfileImage, onShare, readOnly }) => {
    const coverInputRef = React.useRef(null);
    const profileInputRef = React.useRef(null);
    const [showCoverMenu, setShowCoverMenu] = useState(false);
    const menuRef = useRef(null);

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "Add Location";

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowCoverMenu(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        if (showCoverMenu || showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCoverMenu, showProfileMenu]);

    return (
        <div className="relative pt-[64px]">
            {/* Hidden Inputs */}
            <input
                type="file"
                ref={coverInputRef}
                onChange={onCoverUpload}
                className="hidden"
                accept="image/*"
            />
            <input
                type="file"
                ref={profileInputRef}
                onChange={onProfileImageUpload}
                className="hidden"
                accept="image/*"
            />

            {/* --- Banner --- */}
            <div className="relative w-full h-[266px] bg-gray-100 group">
                {profile.coverImage ? (
                    <>
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${profile.coverImage}')` }}
                        >
                            <div className="w-full h-full bg-black/5"></div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-end justify-center">
                        <img src="/cover-placeholder.png" alt="Add cover" className={`h-[200px] object-contain ${readOnly ? '' : 'cursor-pointer hover:opacity-100'} opacity-90 transition`} onClick={() => !readOnly && coverInputRef.current?.click()} />
                    </div>
                )}

                <div className="absolute inset-0 max-w-[1440px] mx-auto px-4 md:px-12 pointer-events-none">
                    <div className="absolute top-6 right-4 md:right-12 pointer-events-auto z-30" ref={menuRef}>
                        {!readOnly && (
                            <EditIcon
                                onClick={() => setShowCoverMenu(!showCoverMenu)}
                                className="bg-white border border-gray-300 shadow-md hover:bg-gray-50 w-[41px] h-[41px] rounded-full p-2.5 text-black relative"
                            />
                        )}

                        {/* Dropdown Menu */}
                        {showCoverMenu && (
                            <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-100 min-w-[200px] z-50 overflow-hidden animate-fadeIn">
                                <button
                                    onClick={() => {
                                        coverInputRef.current?.click();
                                        setShowCoverMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Update cover image
                                </button>
                                <button
                                    onClick={() => {
                                        if (onDeleteCover) onDeleteCover();
                                        setShowCoverMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete cover image
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">
                <div className="flex flex-col md:flex-row gap-8 relative -mt-[100px] mb-8">

                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative group cursor-pointer" ref={profileMenuRef}>
                        <div
                            className="w-[220px] h-[220px] rounded-full bg-white p-1 shadow-sm relative"
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Overlay for upload hint */}
                                {!readOnly && (
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                        <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                            <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Picture Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute top-[200px] left-[150px] bg-white rounded-lg shadow-xl border border-gray-100 min-w-[200px] z-50 overflow-hidden animate-fadeIn">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        profileInputRef.current?.click();
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Update profile picture
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onDeleteProfileImage) onDeleteProfileImage();
                                        setShowProfileMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete profile picture
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Name & Basic Info */}
                    <div className="pt-[115px] flex-1">
                        <div className="flex justify-between items-start">
                            <div className="relative w-full max-w-[600px]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{profile.fullName}</h1>
                                            <VerifiedIcon />
                                        </div>
                                        <p className="text-xl text-gray-600 font-medium mb-4">{profile.jobTitle || "Add your job title"}</p>
                                    </div>
                                    <EditIcon className="w-5 h-5 text-gray-500 hover:text-black mb-6 mr-4" onClick={onEdit} />
                                </div>


                                <div className="flex flex-wrap gap-3 mb-4">
                                    {profile.skills && profile.skills.length > 0 ? (
                                        profile.skills.map((skill, index) => (
                                            <Tag key={index} label={skill} />
                                        ))
                                    ) : (
                                        <span
                                            className="text-gray-400 text-sm italic cursor-pointer hover:text-[#FFB300] transition-colors"
                                            onClick={onEdit}
                                        >
                                            Add skills to showcase your expertise
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 mt-2">
                                {/* More tools link */}
                                <div className="hidden md:flex relative group items-center z-40">
                                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity min-h-[34px] py-4">
                                        <i className="ri-tools-fill text-[#52514F] text-[18px]"></i>
                                        <span
                                            className="text-[16px] font-medium"
                                            style={{
                                                background: 'linear-gradient(90deg, #222121 24%, #FFB300 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            More tools
                                        </span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFB300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform duration-200 group-hover:rotate-90">
                                            <path d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>

                                    {/* Hover Dropdown */}
                                    <div className="absolute top-[80%] right-0 pt-2 w-[280px] hidden group-hover:block z-50">
                                        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                                            {/* Create ATS Friendly CV */}
                                            <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition text-center">
                                                <span className="text-sm font-bold text-black">Create ATS Friendly CV</span>
                                            </div>

                                            {/* Profile Link Section */}
                                            <div className="px-3 py-3 bg-white flex items-center justify-between gap-2">
                                                <span className="text-[#FFB300] text-xs truncate flex-1 hover:underline cursor-pointer">
                                                    {`www.trackpi.in/u/${profile._id || 'user123'}`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {/* Send Icon */}
                                                    <button onClick={onShare} className="text-[#FFB300] hover:scale-110 transition p-0.5">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                                    </button>
                                                    {/* Copy Icon */}
                                                    <button onClick={onShare} className="text-[#FFB300] hover:scale-110 transition p-0.5">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
