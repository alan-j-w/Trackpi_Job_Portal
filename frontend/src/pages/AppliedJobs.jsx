import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

import config from '../config';

const AppliedJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error("Please login to view applied jobs");
                    setLoading(false);
                    return;
                }

                const configAuth = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const res = await axios.get(`${config.API_URL}/api/applications/my-applications`, configAuth);
                if (res.data.success) {
                    setApplications(res.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
                // toast.error("Failed to fetch applied jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchAppliedJobs();
    }, []);

    // Helper to get badge color based on status
    const getStatusBadge = (status) => {
        // Mock status logic if not available in job
        if (status === 'urgent') return "bg-[#FF4F4F] text-white"; // Red for Urgent
        if (status === 'new') return "bg-[#4CAF50] text-white"; // Green for New
        return "hidden";
    };

    return (
        <div className="bg-[#F8F9FB] min-h-screen pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 md:px-10 pt-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Applied vacancies</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-xl font-semibold text-gray-600">You haven't applied to any jobs yet.</h2>
                        <Link to="/jobs" className="mt-4 inline-block bg-[#FFB300] text-black px-6 py-2 rounded-full font-bold">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.map((app) => {
                            const job = app.jobId;
                            if (!job) return null; // Handle if job was deleted

                            return (
                                <div key={app._id} className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 flex flex-col items-start border border-gray-100 relative overflow-hidden">

                                    {/* 1. Header: Logo, Info, Verified */}
                                    <div className="flex justify-between items-start w-full mb-5">
                                        <div className="flex gap-4">
                                            {/* Company Logo Placeholder */}
                                            <div className="w-[50px] h-[50px] rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center bg-white p-1">
                                                <img src="/company-logo-placeholder.png" alt={job.company} className="w-full h-full object-contain" />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 leading-tight">{job.company}</h3>
                                                <p className="text-gray-500 text-sm mt-0.5">{job.location}</p>
                                            </div>
                                        </div>

                                        {/* Verified Badge (Static for now as per design) */}
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#FFD6A4] bg-[#FFF8EB]">
                                            <div className="w-4 h-4 rounded-full bg-[#FF5722] flex items-center justify-center">
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1.5 4L3.5 6L8.5 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#FF5722] uppercase tracking-wide">Verified Company</span>
                                        </div>
                                    </div>

                                    {/* 2. Job Title & Description */}
                                    <h2 className="text-xl font-bold text-gray-900 mb-3">{job.title}</h2>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {job.description || "No description provided."}
                                    </p>

                                    {/* 3. Tags (Type, Education, Mode) */}
                                    <div className="flex flex-wrap gap-2 mb-6 w-full">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFB300] bg-[#FFFAEB] px-3 py-1.5 rounded-lg border border-[#FFE082]/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></span>
                                            {job.jobType}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFB300] bg-[#FFFAEB] px-3 py-1.5 rounded-lg border border-[#FFE082]/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></span>
                                            {job.education}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFB300] bg-[#FFFAEB] px-3 py-1.5 rounded-lg border border-[#FFE082]/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB300]"></span>
                                            {job.workMode}
                                        </div>
                                    </div>

                                    {/* 4. Details Grid (Gender, Salary, Experience) */}
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 w-full mb-6">
                                        <div className="flex items-center gap-2 text-gray-700 text-xs font-medium">
                                            <span className="text-[#FFB300]">👤</span> {job.gender || "Any"}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-xs font-medium">
                                            <span className="text-[#FFB300]">💼</span> {job.salary}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 text-xs font-medium col-span-2">
                                            <span className="text-[#FFB300]">⏳</span> Minimum {job.experience} experience in sales
                                        </div>
                                    </div>

                                    {/* 5. Footer: WFH Badge, Applied Button, More Details */}
                                    <div className="w-full mt-auto">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFB300] bg-white text-gray-800 text-xs font-bold shadow-sm">
                                                Work from home
                                                <div className="w-5 h-5 bg-[#FFB300] rounded-full flex items-center justify-center text-white">
                                                    <i className="ri-home-4-fill text-xs"></i>
                                                </div>
                                            </div>

                                            {/* Applied Button (Green) */}
                                            <button className="bg-[#4CAF50] text-white px-8 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#43A047] transition cursor-default">
                                                Applied
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between w-full">
                                            {/* Status Badge (Urgent/New) */}
                                            {job.status === 'urgent' ? (
                                                <div className="bg-gradient-to-r from-[#FF5252] to-[#FF8A80] text-white text-[10px] font-bold px-4 py-1 rounded-r-full -ml-6 shadow-sm uppercase tracking-wider">
                                                    Urgent Hiring
                                                </div>
                                            ) : job.status === 'new' ? (
                                                <div className="bg-gradient-to-r from-[#4CAF50] to-[#81C784] text-white text-[10px] font-bold px-4 py-1 rounded-r-full -ml-6 shadow-sm uppercase tracking-wider">
                                                    New
                                                </div>
                                            ) : (
                                                <div></div>
                                            )}

                                            <button className="text-black text-xs font-bold hover:underline flex items-center gap-1 group">
                                                More details
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination (Static for now, can be implemented dynamically) */}
                {applications.length > 9 && (
                    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                            <i className="ri-arrow-left-s-line"></i>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#FFB300] text-white font-bold shadow-md">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-medium">2</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-medium">3</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-medium">4</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 font-medium">5</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600">
                            <i className="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
