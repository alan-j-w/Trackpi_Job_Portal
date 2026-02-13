import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobById } from "../../jobService";
import trackpiLogo from "../../assets/badges/trackpi-striped.png";
import LoginRequiredModal from "../LoginRequiredModal";

const JobDetailsModal = ({ jobId, onClose }) => {
    // const { id } = useParams(); // URL routing disabled for overlay mode
    // const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    // Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await getJobById(jobId);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchJob();
    }, [jobId]);

    if (loading) return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl">Loading...</div>
        </div>
    );
    if (!job) return null;

    const tabs = [
        "Overview",
        "Description",
        "Key Skills & Eligibility",
        "Compensation & Benefits",
        "Key Responsibilities",
    ];

    /* --- TAB CONTENT RENDERERS --- */
    const renderContent = () => {
        switch (activeTab) {
            case "Overview":
                return (
                    <div className="rounded-[30px] p-[1px] bg-gradient-to-r from-black to-[#FFB300]">
                        <div className="relative overflow-hidden rounded-[28px] p-5 bg-[#FFFDF5] h-full">
                            {/* Decorative Shades inside the box */}
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>

                            {/* Content */}
                            <div className="relative z-10 space-y-2 text-gray-800 text-sm">
                                <h2 className="text-3xl text-black mb-4">Overview</h2>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Position Title</span> : <span className="font-normal text-[13px]">{job.title}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Organization</span> : <span className="font-normal text-[13px]">{job.company}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Job Location</span> : <span className="font-normal text-[13px]">{job.location}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Total Vacancies</span> : <span className="font-normal text-[13px]">{job.vacancies || "N/A"}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Working Days</span> : <span className="font-normal text-[13px]">{job.workingDays || "Standard"}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Working Hours</span> : <span className="font-normal text-[13px]">{job.workingHours || "Standard"}</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Job type</span> : <span className="font-normal text-[13px]">Field work (Full time)</span></div>
                                <div className="flex items-center gap-4"><span className="w-3 h-3 rounded-full bg-[#D9D9D9] border border-[#FFB300]"></span> <span className="w-32 font-bold">Salary Scale</span> : <span className="font-normal text-[13px]">{job.salary?.split('(')[0]} (negotiable depending on experience)</span></div>
                            </div>
                        </div>
                    </div>
                );
            case "Description":
                return (
                    <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-black to-[#FFB300] h-full">
                        <div className="relative overflow-hidden text-gray-700 text-sm leading-relaxed p-6 rounded-[19px] bg-[#FFFDF5] h-full">
                            {/* Decorative Shades */}
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Heading for Description if needed, or just content */}
                                <h2 className="text-3xl text-black mb-4">Description</h2>
                                {/* If job.description contains newlines, we can render them as paragraphs */}
                                {job.description.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 last:mb-0 text-[13px] font-normal text-gray-800 max-w-[700px] leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case "Key Skills & Eligibility":
                return (
                    <div className="rounded-[40px] p-[1px] bg-gradient-to-r from-black to-[#FFB300]">
                        <div className="relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 rounded-[39px] p-8 bg-[#FFFDF5] h-full">
                            {/* Decorative Shades */}
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>

                            {/* COLUMN 1: Key Skills */}
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-4 text-black">Key skills</h3>
                                <ul className="list-none space-y-3">
                                    {job.skills?.split(/,|\n/).map((skill, index) => {
                                        const cleanSkill = skill.trim();
                                        if (!cleanSkill) return null;
                                        return (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="mt-1 w-3 h-3 rounded-full bg-[#D9D9D9] border-2 border-[#FFB300] shadow-sm flex-shrink-0"></span>
                                                <span className="text-[15px] font-medium text-gray-700">{cleanSkill}</span>
                                            </li>
                                        );
                                    }) || <li>Not specified</li>}
                                </ul>
                            </div>

                            {/* COLUMN 2: Eligibility Criteria */}
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-4 text-black">Eligibility Criteria:</h3>
                                <ul className="list-none space-y-3">
                                    {job.eligibility?.split('\n').map((item, index) => {
                                        const cleanItem = item.trim();
                                        if (!cleanItem) return null;
                                        return (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="mt-1 w-3 h-3 rounded-full bg-[#D9D9D9] border-2 border-[#FFB300] shadow-sm flex-shrink-0"></span>
                                                <span className="text-[15px] font-medium text-gray-700">{cleanItem}</span>
                                            </li>
                                        );
                                    }) || <li>Not specified</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            case "Compensation & Benefits":
                return (
                    <div className="rounded-[30px] p-[1px] bg-gradient-to-r from-black to-[#FFB300]">
                        <div className="relative overflow-hidden rounded-[29px] p-8 bg-[#FFFDF5] h-full">
                            {/* Decorative Shades */}
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl text-black mb-4">Compensation & Benefits</h2>
                                {/* Salary Section */}
                                <div className="mb-6">
                                    <p className="text-[17px] font-medium text-gray-900 inline-block">
                                        Salary Range: {job.salary?.split('(')[0]} (negotiable depending on experience)
                                    </p>
                                </div>

                                {/* Benefits Section */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3 text-black">Incentives:</h3>
                                    <ul className="flex flex-col space-y-3">
                                        {(() => {
                                            const benefits = job.benefits?.split(/,|\n/).map(b => b.trim()).filter(b => b) || [];
                                            const firstItem = "Performance based commission";
                                            // Remove if it exists to avoid dupes, or is the item to remove
                                            const filtered = benefits.filter(b =>
                                                b.toLowerCase() !== firstItem.toLowerCase() &&
                                                !b.toLowerCase().includes("mobile/internet reimbursement") &&
                                                !b.toLowerCase().includes("health insurance") &&
                                                !b.toLowerCase().includes("professional training programs")
                                            );
                                            const finalBenefits = [
                                                firstItem,
                                                ...filtered,
                                                "Other Perks : Health insurance, mobile/data reimbursement, training programs",
                                                "Career Growth : Opportunity to advance into senior sales or business development roles based on consistent performance"
                                            ];

                                            return finalBenefits.map((benefit, index) => (
                                                <li key={index} className="flex items-center gap-3">
                                                    <span className="w-4 h-4 rounded-full bg-[#D9D9D9] border-2 border-[#FFB300] flex items-center justify-center shadow-sm flex-shrink-0"></span>
                                                    <span className="text-[15px] font-medium text-gray-700">{benefit}</span>
                                                </li>
                                            ));
                                        })() || <li>Not specified</li>}
                                    </ul>
                                </div>


                            </div>
                        </div>
                    </div >
                );
            case "Key Responsibilities":
                return (
                    <div className="rounded-[30px] p-[1px] bg-gradient-to-r from-black to-[#FFB300]">
                        <div className="relative overflow-hidden rounded-[29px] p-8 bg-[#FFFDF5] h-full">
                            {/* Decorative Shades */}
                            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#FFB300]/20 rounded-full blur-2xl pointer-events-none"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl text-black mb-4">Key Responsibilities</h2>
                                <ul className="list-none space-y-3">
                                    {job.responsibilities?.split("\n").map((resp, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="mt-1 w-3 h-3 rounded-full bg-[#D9D9D9] border-2 border-[#FFB300] shadow-sm flex-shrink-0"></span>
                                            <span className="text-[15px] font-medium text-gray-700">{resp}</span>
                                        </li>
                                    )) || <li>{job.responsibilities || "Not specified"}</li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        // Backdrop / Page Wrapper
        <div className="fixed inset-0 z-[60] w-full h-full bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
            {/* Modal Container */}
            <div className={`bg-white backdrop-blur-md w-full max-w-5xl rounded-[40px] shadow-2xl border border-white relative max-h-[90vh] flex flex-col animate-fadeInUp overflow-hidden transition-all duration-300`}>

                {/* Decorative Shaded Circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),10px_10px_20px_rgba(0,0,0,0.1)] z-0 pointer-events-none opacity-80"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-white via-gray-100 to-gray-300 rounded-full shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.1),10px_10px_20px_rgba(0,0,0,0.1)] z-0 pointer-events-none opacity-80"></div>

                {/* Header */}
                <div className="flex justify-between items-start p-8 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#FFB300] rounded-xl flex items-center justify-center shadow-md">
                            <img src={trackpiLogo} alt="Logo" className="w-12 object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold uppercase tracking-wide">{job.title}</h2>
                            <p className="text-sm font-medium text-gray-700">{job.company}, {job.location}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-3 text-xl">
                            <i className="ri-instagram-fill cursor-pointer text-black hover:text-gray-700"></i>
                            <i className="ri-twitter-fill cursor-pointer text-black hover:text-gray-700"></i>
                            <i className="ri-youtube-fill cursor-pointer text-black hover:text-gray-700"></i>
                        </div>
                        <button onClick={onClose} className="text-2xl text-gray-600 hover:text-black transition-colors">
                            <i className="ri-close-line"></i>
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="px-8 flex gap-12 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-2 text-lg font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                                ? "text-black border-gray-500"
                                : "text-gray-500 hover:text-gray-700 border-transparent"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Body */}
                <div className={`px-8 pb-8 pt-2 flex-grow overflow-y-auto ${activeTab === "Compensation & Benefits" ? "[&::-webkit-scrollbar]:hidden" : ""}`} style={activeTab === "Compensation & Benefits" ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                    <div className="h-full relative">
                        {renderContent()}
                    </div>
                </div>

                {/* Footer / Apply Button */}
                <div className="p-6 flex justify-center border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
                    <button
                        onClick={() => setShowLoginPopup(true)} // Shows login popup on click
                        className="bg-[#FFB800] text-black w-[400px] py-3 rounded-full font-bold text-lg shadow-lg hover:bg-[#FFC933] transition-all transform hover:scale-105"
                    >
                        Apply now
                    </button>
                </div>

                {/* Ellipse 97 Decoration */}
                <div className="absolute -bottom-10 -right-10 w-[302px] h-[302px] bg-white rounded-full blur-[80px] opacity-[0.53] pointer-events-none"></div>

            </div>

            {/* ================= LOGIN POPUP ================= */}
            {showLoginPopup && (
                <div className="absolute z-[70]">
                    <LoginRequiredModal onClose={() => setShowLoginPopup(false)} />
                </div>
            )}

        </div>
    );
};

export default JobDetailsModal;
