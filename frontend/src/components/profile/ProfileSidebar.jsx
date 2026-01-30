import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const StrengthItem = ({ label, score, icon }) => (
    <div className="flex justify-between items-center text-[10px] font-bold text-gray-700">
        <div className="flex items-center gap-2">
            <span className="text-gray-900">{icon}</span>
            <span>{label}</span>
        </div>
        <span className="bg-[#DCFCE7] text-[#16A34A] px-2.5 py-0.5 rounded-full">+{score}</span>
    </div>
);

const DetailItem = ({ icon, label, value }) => (
    <div className="flex gap-4 items-start">
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const SocialLink = ({ platform, url }) => {
    // Icons
    const icons = {
        LinkedIn: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
        Twitter: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>,
        Facebook: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
        Behance: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 2.325-3.726 2.325-2.903 0-4.577-2.134-4.577-4.666 0-3.336 2.508-4.653 4.366-4.653 1.958 0 3.737 1.258 3.937 3.518h-2.152c-.172-.751-.836-1.1-1.611-1.1-.967 0-1.631.789-1.631 2.219 0 1.218.675 1.905 1.621 1.905.811 0 1.547-.48 1.83-1.548h1.943zm-14.726 2.324h-3v-6.326h3.69c1.942 0 3.256.762 3.256 3.164 0 2.459-1.282 3.162-3.946 3.162zm.305-4.102h-1.305v2.091h1.492c1.233 0 1.636-.59 1.636-1.042 0-.541-.334-1.049-1.823-1.049zm-.305-2.583h-1.305v1.89h1.365c1.026 0 1.487-.506 1.487-.959 0-.482-.397-.931-1.547-.931zm-3 7.361v-14h-5v14h5z" /></svg>
    };

    return (
        <div className="mb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-black mb-0.5">
                {icons[platform] || <span className="w-3 h-3 bg-gray-200 rounded-full"></span>}
                {platform}
            </div>
            <a href={url || "#"} className="text-[10px] text-[#FFB300] hover:underline block truncate font-medium">
                {url ? url.replace(/^https?:\/\//, '') : `www.${platform.toLowerCase()}.com/user`}
            </a>
        </div>
    );
};

const ProfileSidebar = ({ profile }) => {
    // Strength Calculation
    let strength = 30;
    if (profile.education?.length) strength += 20;
    if (profile.workExperience?.length) strength += 20;
    if (profile.skills?.length) strength += 10;
    if (profile.resumeUrl) strength += 10;
    if (profile.socialLinks?.linkedin) strength += 10;
    const strengthStatus = strength >= 90 ? "Excellent" : strength >= 70 ? "Good" : strength >= 50 ? "Intermediate" : "Beginner";

    return (
        <div className="flex-1 lg:max-w-[418px]">

            {/* 1. Profile Strength */}
            <div className="bg-white rounded-[32px] border border-gray-200 p-8 mb-8 pb-10 flex flex-col items-center relative shadow-sm">
                <h3 className="font-bold text-sm mb-8">I am looking for job</h3>

                <div className="relative w-52 h-52 flex items-center justify-center mb-6">
                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                        <path
                            className="text-[#FFB300]"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeDasharray={`${strength}, 100`}
                            strokeWidth="3.8"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#896608" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#FFC107" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-[10px] text-gray-500 font-bold mb-1">Profile Strength</span>
                        <span className="text-4xl font-bold text-[#FFB300]">{strength}%</span>
                    </div>
                </div>

                <p className="text-sm font-bold text-center mb-8">Profile Strength: <span className="text-[#FFB300]">{strengthStatus}</span></p>

                <div className="w-full space-y-4 px-2">
                    <StrengthItem label="Add language" score="10%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>} />
                    <StrengthItem label="Add skills" score="07%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} />
                    <StrengthItem label="Add education" score="07%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>} />
                    <StrengthItem label="Add summary" score="07%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />
                    <StrengthItem label="Add experience" score="07%" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                </div>

                <button className="w-full mt-8 bg-[#FFF9E5] text-black font-bold py-3.5 rounded-xl text-xs hover:bg-[#ffeebb] transition shadow-sm border border-[#FFB300]/20">
                    See all missing details
                </button>
            </div>

            {/* 2. Additional Details */}
            <div className="bg-white rounded-[32px] border border-gray-200 p-8 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg">Additional Details</h3>
                    <EditIcon className="w-7 h-7" />
                </div>
                <div className="space-y-6">
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} label="Alternate Phone Number" value={profile.altPhone || "+91 9862449586"} />
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>} label="Driving License" value={profile.drivingLicenses?.length ? "Yes" : "Yes"} />
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} label="Date of Birth" value={profile.dob || "20/03/1999"} />
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} label="Career Break" value="Yes | 2 years" />
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} label="Preferred Work Mode" value={profile.preferredWorkMode || "Remote"} />
                    <DetailItem icon={<svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Marital Status" value={profile.maritalStatus || "Married"} />
                </div>
            </div>

            {/* 3. Social Links */}
            <div className="bg-white rounded-[32px] border border-gray-200 p-8 mb-12 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Social Links</h3>
                    <EditIcon className="w-7 h-7" />
                </div>
                <div className="space-y-4">
                    <SocialLink platform="LinkedIn" url={profile.socialLinks?.linkedin || "www.linkedin.com/in/paulwalker"} />
                    <SocialLink platform="Twitter" url={profile.socialLinks?.twitter || "twitter.com/paulwalker"} />
                    <SocialLink platform="Facebook" url={profile.socialLinks?.facebook || "www.paulwalker.com"} />
                    <SocialLink platform="Behance" url={profile.socialLinks?.portfolio || "behance.net/paulwalker"} />
                </div>
            </div>

        </div>
    );
};

export default ProfileSidebar;
