import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from "../../config";

const JobListing = ({ limit }) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${config.API_URL}/api/jobs`);
                setJobs(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Helper to determine badge properties based on status
    const getBadgeProps = (status) => {
        if (status === 'urgent') {
            return { text: 'Urgent Hiring', gradient: 'from-[#FF416C] to-[#FF4B2B]' };
        } else if (status === 'new') {
            return { text: 'New', gradient: 'from-[#56ab2f] to-[#a8e063]' };
        }
        return null;
    };

    if (loading) return <div className="text-center py-20">Loading jobs...</div>;

    const displayedJobs = limit ? jobs.slice(0, limit) : jobs;

    return (
        <div className="relative pb-24 pt-8 px-4 mt-16">
            {/* Header Section */}
            <div className="flex justify-center mb-16 relative">
                <div className="relative inline-block">
                    {/* CSS Border Eclipse */}
                    <div className="border-[2px] border-[#FFB300] px-12 py-3 rounded-[50%] transform -rotate-2 relative z-10 bg-white shadow-sm">
                        <h2 className="text-3xl font-bold text-black m-0 leading-tight transform rotate-2">
                            Latest Job Listing
                        </h2>
                    </div>

                    {/* Cursor Icon */}
                    <div className="absolute -bottom-5 -right-4 text-[#FFB300] drop-shadow-md z-20">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 2V18.5L8.5 14L11.5 21L14.5 19.5L11.5 12.5L16 12.5L5.5 2Z" stroke="white" strokeWidth="1.5" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {displayedJobs.map((job, idx) => {
                    const badgeProps = getBadgeProps(job.status);

                    return (
                        <div key={job._id || idx} className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 flex flex-col items-start border border-gray-100 relative overflow-hidden">

                            {/* 1. Header: Logo, Info, Verified */}
                            <div className="flex justify-between items-start w-full mb-5">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center p-1 shadow-sm shrink-0">
                                        <div className="relative w-full h-full flex items-center justify-center">
                                            <span className="font-bold text-[#FFB300] text-[10px] leading-tight text-center transform -rotate-12">TrackPi</span>
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="font-extrabold text-[15px] text-black leading-tight">{job.company}</h4>
                                        <p className="text-[12px] text-gray-500 font-medium mt-0.5">{job.location}</p>
                                    </div>
                                </div>

                                {/* Verified Pill (Static for now as per design) */}
                                <div className="bg-[#FFF5EB] border border-[#FFE0C2] rounded-full px-3 py-1 flex items-center gap-1.5 shrink-0">
                                    <div className="w-4 h-4 bg-[#FF4D4D] rounded-full flex items-center justify-center">
                                        <i className="ri-check-line text-white text-[10px] font-bold"></i>
                                    </div>
                                    <span className="text-[#FF4D4D] text-[10px] font-bold tracking-wide">Verified Company</span>
                                </div>
                            </div>

                            {/* 2. Job Title */}
                            <h3 className="font-bold text-xl text-black mb-3">{job.title}</h3>

                            {/* 3. Description */}
                            <p className="text-[11px] text-gray-500 mb-5 leading-relaxed font-medium line-clamp-3">
                                {job.description}
                            </p>

                            {/* 4. Tags Grid */}
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 w-full mb-6">
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                                    <i className="ri-briefcase-line text-[#FFB300] text-sm"></i>
                                    <span>{job.jobType}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                                    <i className="ri-graduation-cap-line text-[#FFB300] text-sm"></i>
                                    <span>{job.education}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                                    <i className="ri-home-4-line text-[#FFB300] text-sm"></i>
                                    <span>{job.workMode}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700">
                                    <i className="ri-user-line text-[#FFB300] text-sm"></i>
                                    <span>{job.gender}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700 col-span-2">
                                    <i className="ri-wallet-3-line text-[#FFB300] text-sm"></i>
                                    <span>{job.salary}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-700 col-span-2">
                                    <i className="ri-time-line text-[#FFB300] text-sm"></i>
                                    <span>{job.experience}</span>
                                </div>
                            </div>

                            {/* 5. Badge & Apply */}
                            <div className="flex items-center justify-between w-full mb-5 mt-auto">
                                {badgeProps ? (
                                    <div className={`
                                        text-white text-[11px] font-bold px-5 py-2 rounded-r-full shadow-md
                                        -ml-6 bg-gradient-to-r ${badgeProps.gradient}
                                    `}>
                                        {badgeProps.text}
                                    </div>
                                ) : <div></div>}

                                <button className="bg-[#FFB300] text-black text-[12px] font-bold px-8 py-2.5 rounded-xl hover:bg-[#ffaa00] shadow-md transition-transform active:scale-95">
                                    Apply Now
                                </button>
                            </div>

                            {/* 6. Bottom Row: Work from home & Details */}
                            <div className="flex justify-between items-center w-full pt-1 border-gray-100">
                                {/* Work From Home Pill */}
                                <div className="flex items-center gap-2 border border-[#FFB300] rounded-full pl-4 pr-1 py-1 bg-white shadow-sm">
                                    <span className="text-[11px] font-bold text-black">{job.benefits || "Work from home"}</span>
                                    <div className="bg-[#FFB300] w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm">
                                        <i className="ri-home-4-fill text-xs"></i>
                                    </div>
                                </div>

                                <button className="text-[11px] text-black font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    More details <i className="ri-arrow-right-line"></i>
                                </button>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Bottom Link - Only show if limited or there's more */}
            {limit && (
                <div className="flex justify-end mt-8 max-w-7xl mx-auto px-4">
                    <button
                        onClick={() => navigate('/jobs')}
                        className="text-black text-sm font-bold flex items-center gap-2 group hover:text-[#FFB300] transition-colors"
                    >
                        <span className="border-b-2 border-[#FF4D4D] pb-1 group-hover:border-[#FFB300]">Explore for more jobs</span>
                        <i className="ri-arrow-right-line text-lg group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobListing;
