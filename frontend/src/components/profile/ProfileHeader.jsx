import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const VerifiedIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 13.41L17.59 5.82L19 7.23L10 17Z" fill="#FBBF24" />
    </svg>
);

const Tag = ({ label, deletable }) => (
    <span className="border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap">
        <span className="text-[#FFB300] text-lg leading-none">★</span> {label} {deletable && <span className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none">×</span>}
    </span>
);

const ProfileHeader = ({ profile, onEdit }) => {
    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "Add Location";

    return (
        <div className="relative">
            {/* --- Banner --- */}
            <div className="relative w-full h-[266px] bg-gray-200">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
                    <div className="w-full h-full bg-black/5"></div>
                </div>
                <div className="absolute top-6 right-6">
                    <EditIcon />
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">
                <div className="flex flex-col md:flex-row gap-8 relative -mt-[123px] mb-8">

                    {/* Profile Picture */}
                    <div className="flex-shrink-0 relative">
                        <div className="w-[246px] h-[246px] rounded-full bg-white p-1 shadow-sm">
                            <div className="w-full h-full rounded-full bg-gray-100 overflow-hidden relative">
                                {profile.profileImage ? (
                                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-6xl text-gray-300 font-bold">
                                        {profile.fullName.charAt(0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Name & Basic Info */}
                    <div className="pt-[140px] flex-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{profile.fullName}</h1>
                                    <VerifiedIcon />
                                </div>
                                <p className="text-xl text-gray-600 font-medium mb-4">{profile.jobTitle || "Add your job title"}</p>

                                <div className="flex gap-3 mb-8">
                                    <Tag label="HTML" />
                                    <Tag label="HMLT" />
                                    <Tag label="Figma" />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 mt-2">
                                <EditIcon className="w-7 h-7" onClick={onEdit} />
                                <div className="hidden md:flex items-center gap-1 text-[#FFB300] font-bold text-sm cursor-pointer hover:underline">
                                    <span>More tools &gt;</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Row */}
                        <div className="border-t border-b border-gray-200 py-6 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-800 font-medium">
                            <div className="flex items-center gap-3">
                                <span className="capitalize">{profile.workStatus}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>Bsc Computer science</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="capitalize">{profile.gender === 'male' ? 'He/Him' : 'She/Her'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="truncate">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span>{locationString}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
