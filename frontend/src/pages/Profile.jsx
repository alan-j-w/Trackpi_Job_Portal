import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import EditProfileModal from "../components/EditProfileModal"; // Import Modal

// --- Icons ---

const EditIcon = ({ className }) => (
    <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
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

const PlusIcon = ({ className }) => (
    <svg className={`w-5 h-5 cursor-pointer hover:text-black text-gray-400 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const Profile = () => {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch Profile
    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            const res = await axios.get("http://localhost:8000/api/profile/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            if (err.response?.status === 404) navigate("/create-profile");
            else setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem("token");

            // Reconstruct payload for backend

            // 1. Handle Location
            const locationUpdate = {
                city: updatedData.locationCity,
                state: updatedData.locationState,
                country: "India" // Default for now if not in modal
            };

            // 2. Handle Education (Update first entry or create new)
            let updatedEducation = [...(profile.education || [])];
            if (updatedData.educationDegree) {
                if (updatedEducation.length > 0) {
                    updatedEducation[0] = { ...updatedEducation[0], degree: updatedData.educationDegree };
                } else {
                    updatedEducation = [{ degree: updatedData.educationDegree, institution: "Unknown", year: "Present" }];
                }
            }

            const payload = {
                ...updatedData,
                location: locationUpdate,
                education: updatedEducation
            };

            // Remove modal-specific keys
            delete payload.educationDegree;
            delete payload.locationCity;
            delete payload.locationState;
            delete payload.countryCode;

            await axios.post("http://localhost:8000/api/profile", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsEditModalOpen(false);
            fetchProfile(); // Refresh data
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
        </div>
    );
    if (!profile) return null;

    // --- Derived Data ---
    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "Add Location";

    // Strength Calculation
    let strength = 30;
    if (profile.education?.length) strength += 20;
    if (profile.workExperience?.length) strength += 20;
    if (profile.skills?.length) strength += 10;
    if (profile.resumeUrl) strength += 10;
    if (profile.socialLinks?.linkedin) strength += 10;
    const strengthStatus = strength >= 90 ? "Excellent" : strength >= 70 ? "Good" : strength >= 50 ? "Intermediate" : "Beginner";

    // Mock Jobs for "Latest Job Listing"
    const mockJobs = [
        { title: "UI/UX Designer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 45,000", badge: "Urgent Hiring" },
        { title: "Frontend Developer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 40,000", badge: "Urgent Hiring" },
        { title: "Graphic Designer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 40,000", badge: "New" }
    ];

    return (
        <div className="bg-white min-h-screen font-sans pb-20 overflow-x-hidden">
            <Navbar />

            {/* --- Banner --- */}
            <div className="relative w-full h-[266px] bg-gray-200">
                {/* Banner Image Placeholder (Desk/Laptop theme) */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center">
                    <div className="w-full h-full bg-black/5"></div> {/* Slight overlay if needed */}
                </div>

                {/* Edit Banner Button */}
                <div className="absolute top-6 right-6">
                    <EditIcon />
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">

                {/* --- Header Content (Overlapping) --- */}
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

                                {/* Tags */}
                                <div className="flex gap-3 mb-8">
                                    <Tag label="HTML" />
                                    <Tag label="HMLT" />
                                    <Tag label="Figma" />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 mt-2">
                                {/* Edit Icon for Name/Basic Info */}
                                <div onClick={() => setIsEditModalOpen(true)}>
                                    <EditIcon className="w-7 h-7" />
                                </div>

                                <div className="hidden md:flex items-center gap-1 text-[#FFB300] font-bold text-sm cursor-pointer hover:underline">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>More tools &gt;</span>
                                </div>
                            </div>
                        </div>

                        {/* Info Row */}
                        <div className="border-t border-b border-gray-200 py-6 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-800 font-medium">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span className="capitalize">{profile.workStatus}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                <span>Bsc Computer science</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <span className="capitalize">{profile.gender === 'male' ? 'He/Him' : 'She/Her'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span className="truncate">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>{locationString}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Main Content Grid --- */}
                <div className="flex flex-col lg:flex-row gap-[40px] pb-12">

                    {/* LEFT COLUMN (Content) - Approx 822px in design */}
                    <div className="flex-1 lg:max-w-[822px]">

                        {/* Summary */}
                        <div className="pb-8 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="font-bold text-lg text-black">Profile Summary</h2>
                                <EditIcon className="w-7 h-7" />
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Office ipsum you must be muted. Ping good quick-win churning conversation talk speed functional info people. After pups with run left money. Lot dive awareness cadence cross-pollination cross-pollination latest impact shark. If that before jumping crystallize post pants... <span className="text-[#FFB300] cursor-pointer font-medium hover:underline">Read More</span>
                            </p>
                        </div>

                        {/* Experience */}
                        <div className="py-8 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-lg text-black">Experience</h2>
                                <div className="flex gap-4">
                                    <EditIcon className="w-7 h-7" />
                                    <PlusIcon />
                                </div>
                            </div>
                            {profile.workExperience?.length > 0 ? (
                                <div className="space-y-6">
                                    {profile.workExperience.map((exp, idx) => (
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

                        {/* Skills */}
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
                                {profile.skills?.map((skill, idx) => (
                                    <Tag key={idx} label={skill} deletable />
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="py-8 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-lg text-black">Education</h2>
                                <div className="flex gap-4">
                                    <EditIcon className="w-7 h-7" />
                                    <PlusIcon />
                                </div>
                            </div>
                            {profile.education?.map((edu, idx) => (
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
                            {(!profile.education || profile.education.length === 0) && <p className="text-sm text-gray-400 italic">No education added.</p>}
                        </div>

                        {/* Language */}
                        <div className="py-8 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="font-bold text-lg text-black">Language</h2>
                                <div className="flex gap-4"><EditIcon className="w-7 h-7" /><PlusIcon /></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 max-w-lg">
                                <LanguageRow name="English" level={3} />
                                <LanguageRow name="Hindi" level={3} />
                                <LanguageRow name="Tamil" level={2} />
                                <LanguageRow name="Malayalam" level={3} />
                            </div>
                        </div>

                        {/* Resume */}
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

                    </div>

                    {/* RIGHT COLUMN (Sidebar) - Approx 418px in design */}
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
                </div>

                {/* --- Latest Job Listing (Full Width) --- */}
                <div className="relative pb-24">
                    <div className="flex justify-center mb-8">
                        <div className="border border-[#FFB300] bg-white text-black px-8 py-2.5 rounded-full font-bold text-lg shadow-sm flex items-center relative z-10">
                            Latest Job Listing
                            <span className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-[#FFB300] text-3xl">✦</span>
                        </div>
                        {/* Dashed line background */}
                        <div className="absolute top-6 left-0 right-0 border-t border-dashed border-[#FFB300] -z-0"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mockJobs.map((job, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 bg-[#FFF9E5] rounded flex items-center justify-center font-bold text-[#FFB300] text-xs">
                                            TrackPi
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-sm text-black">TrackPi Private Limited</h4>
                                            </div>
                                            <p className="text-xs text-gray-500">{job.location}</p>
                                        </div>
                                    </div>
                                    <span className="bg-[#FFF0F0] text-red-500 text-[10px] px-2 py-0.5 rounded-full border border-red-100 font-medium">Verified Company</span>
                                </div>

                                <h3 className="font-bold text-base mb-2">{job.title}</h3>

                                <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-3">
                                    Office ipsum you must be muted. Unpack team productive club productive didn't alpha 4-blocker pulling need. You competitors creep room and that management horse charts baked pulling.
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4 text-[10px] font-medium">
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> Full time</span>
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> Any postgraduation</span>
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> Work from home</span>
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> Female</span>
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> {job.salary}</span>
                                    <span className="flex items-center gap-1 text-gray-600"><span className="text-[#FFB300]">●</span> Minimum one year exp...</span>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded text-white ${job.badge === 'Urgent Hiring' ? 'bg-[#FF4D4D]' : 'bg-[#22C55E]'}`}>
                                        {job.badge}
                                    </span>
                                    <div className="flex gap-4 items-center">
                                        <button className="bg-[#FFB300] text-black text-xs font-bold px-6 py-2 rounded-lg hover:bg-[#ffaa00]">Apply Now</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                        Work from home <span className="bg-[#FFB300] rounded-full w-3 h-3 flex items-center justify-center text-white text-[8px]">🏠</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-bold cursor-pointer hover:underline">More details →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-right text-sm font-bold mt-4 cursor-pointer hover:underline">Explore for more jobs →</p>
                </div>


                <div className="text-right text-xs text-[#FFB300] max-w-7xl mx-auto px-4 hover:underline cursor-pointer">www.trackpi.profilpaulwalker34567.in ↗</div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profileData={profile}
                onSave={handleUpdateProfile}
            />
        </div>
    );
};


// --- Subcomponents ---

const Tag = ({ label, deletable }) => (
    <span className="border border-[#FFB300] px-4 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-bold flex items-center gap-2 shadow-sm whitespace-nowrap">
        <span className="text-[#FFB300] text-lg leading-none">★</span> {label} {deletable && <span className="text-gray-400 cursor-pointer ml-1 hover:text-red-500 text-lg leading-none">×</span>}
    </span>
);

const LanguageRow = ({ name, level }) => (
    <div className="flex justify-between items-center">
        <span className="font-bold text-xs text-black w-24">{name}</span>
        <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(dot => (
                <div key={dot} className={`w-3 h-3 rounded-full ${dot <= level ? 'bg-[#FFB300]' : 'border border-gray-200 bg-gray-50'}`}></div>
            ))}
        </div>
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
}

export default Profile;
