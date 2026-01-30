import React from 'react';

const JobListing = () => {
    // Mock Jobs for "Latest Job Listing"
    const mockJobs = [
        { title: "UI/UX Designer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 45,000", badge: "Urgent Hiring" },
        { title: "Frontend Developer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 40,000", badge: "Urgent Hiring" },
        { title: "Graphic Designer", company: "TrackPi Private Limited", location: "Kochi, Kerala", verified: true, type: "Full time", salary: "35,000 - 40,000", badge: "New" }
    ];

    return (
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
    );
};

export default JobListing;
