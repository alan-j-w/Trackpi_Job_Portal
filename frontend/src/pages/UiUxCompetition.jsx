import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Award, Users, CheckCircle, ArrowRight, X } from "lucide-react";
import toast from "react-hot-toast";

// Assets (Using placeholders or existing assets if available)
import heroBackground from "../assets/competitions/hero_background.png";
import designerIllustration from "../assets/illustrations/ui_ux_middle_requested.png";
import trophyWireframe from "../assets/competitions/trophy-wireframe-new.png";
import winnerAvatar from "../assets/competitions/chess_piece1.png"; // Placeholder for winners

const UiUxCompetition = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        portfolio: "",
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, role: "UI/UX Designer" }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success("Successfully registered for the competition!");
                setIsModalOpen(false);
                setFormData({ name: "", email: "", phone: "", portfolio: "" });
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (error) {
            toast.error("An error occurred during registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen overflow-x-hidden bg-black text-white font-sans">
            {/* Hero Section (Section 1) */}
            <section className="relative w-full h-screen overflow-hidden bg-black">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={heroBackground}
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-100"
                    />
                    {/* Minimal Overlays to maintain clarity */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                        }}
                    ></div>
                </div>

                {/* Top Left: Back Arrow */}
                <div className="absolute top-8 left-8 z-20">
                    <Link to="/talent-league" className="text-yellow-500 hover:scale-110 transition-transform">
                        <i className="ri-arrow-go-back-fill text-2xl drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]"></i>
                    </Link>
                </div>

                {/* Bottom Right: Volume Icon */}
                <div className="absolute bottom-10 right-10 z-20">
                    <button className="text-white hover:scale-110 transition-transform opacity-80 hover:opacity-100">
                        <i className="ri-volume-up-fill text-2xl"></i>
                    </button>
                </div>

                {/* Bottom Left: Buttons and Watch Now */}
                <div className="absolute bottom-12 left-10 lg:left-24 z-20 flex flex-col gap-6 items-start">
                    <div className="flex gap-4">
                        <button className="px-8 py-3 rounded-xl border-[1px] border-yellow-500 bg-black text-white font-bold text-sm hover:bg-white/10 transition shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
                            Testimonials
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold text-sm shadow-[0_10px_30px_rgba(234,179,8,0.3)] hover:scale-105 transition"
                        >
                            Register Competition
                        </button>
                    </div>
                    <button className="flex items-center gap-2 text-white/80 font-medium hover:text-white transition group">
                        Watch now <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                    </button>
                </div>
            </section>

            {/* Downwards Content (Section 2) */}
            <section className="relative px-6 lg:px-20 py-24 bg-black overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/2 right-0 w-[40%] h-[60%] bg-yellow-500/5 blur-[120px] rounded-full translate-x-1/4 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
                    {/* Left: Text Content */}
                    <div className="flex-1 space-y-8 z-10">
                        <h2 className="text-3xl lg:text-4xl font-russo text-yellow-500 tracking-tight">
                            Talent league for <span className="text-white">UI UX Designers</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-lg font-raleway w-full lg:max-w-xl">
                            Whether you're a beginner, student, or professional, this competition is your chance to demonstrate your design thinking, visual skills, and ability to solve user problems through intuitive design. Submit your best work, impress our judging panel, and stand a chance to earn certificates, recognition, and exciting rewards—including opportunities for internships based on performance.
                        </p>
                    </div>

                    {/* Right: Graphic */}
                    <div className="flex-1 relative z-10 flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Decorative Golden Circle */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-yellow-500/10 border border-yellow-500/20 rounded-full blur-xl"></div>
                            <img
                                src={designerIllustration}
                                alt="Design Illustration"
                                className="relative z-10 w-full max-w-[450px] animate-float"
                            />
                        </div>
                    </div>
                </div>

                {/* Upcoming Competition Block */}
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h3 className="text-2xl lg:text-3xl font-russo text-yellow-500 mb-10 uppercase tracking-widest">
                        UPCOMING COMPETITION
                    </h3>

                    <div className="inline-block relative">
                        {/* Background wireframe trophy on the left */}
                        <div className="absolute left-[-200px] bottom-[-50px] opacity-20 hidden lg:block">
                            <img src={trophyWireframe} alt="Trophy" className="w-64 rotate-[-15deg]" />
                        </div>

                        {/* Competition Card */}
                        <div className="bg-[#111] border border-white/10 rounded-[30px] p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col items-center gap-6">
                                <div className="bg-yellow-500 text-black px-8 py-2 rounded-full font-russo text-xl shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                                    July month
                                </div>
                                <div className="flex items-center gap-12 text-center">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Start Date</p>
                                        <p className="text-xl lg:text-2xl font-bold">20-07-2025</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">End Date</p>
                                        <p className="text-xl lg:text-2xl font-bold">26-07-2025</p>
                                    </div>
                                </div>
                            </div>
                            {/* Confetti/Sparkle effect overlay placeholder */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Excellence Rewards */}
            <section className="px-6 lg:px-20 py-20 bg-[#050505]">
                <h3 className="text-3xl font-bold text-center mb-16 text-yellow-500 uppercase tracking-widest">Design Excellence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                            <Trophy className="text-yellow-500" size={32} />
                        </div>
                        <p className="font-bold uppercase text-sm tracking-tighter">You win our competition</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                            <Award className="text-yellow-500" size={32} />
                        </div>
                        <p className="font-bold uppercase text-sm tracking-tighter">Get Internship in TrackPi</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
                            <Users className="text-yellow-500" size={32} />
                        </div>
                        <p className="font-bold uppercase text-sm tracking-tighter">You can build your dream portfolio</p>
                    </div>
                </div>
                <div className="mt-20 text-center">
                    <p className="text-xl font-bold text-yellow-500 animate-pulse">YOU ARE THE NEXT CHAMPION</p>
                </div>
            </section>

            {/* Previous Winners */}
            <section className="px-6 lg:px-20 py-24 text-center">
                <h3 className="text-3xl font-bold mb-16 text-yellow-500">Previous competitions Winners</h3>
                <div className="flex flex-wrap justify-center gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={`p-6 bg-[#111] border border-white/5 rounded-2xl w-64 ${i === 2 ? 'scale-110 border-yellow-500/30 bg-[#1A1A1A]' : 'opacity-60'}`}>
                            <div className="mb-4 text-xs font-bold text-yellow-500 uppercase tracking-widest">Congratulations</div>
                            <img src={winnerAvatar} alt="Winner" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-yellow-500" />
                            <h4 className="font-bold text-lg">Alex Joseph</h4>
                            <p className="text-xs text-gray-500">UI/UX Designer</p>
                            <p className="text-[10px] mt-2 text-gray-400">TrackPi offered him hiring process and build his portfolio.</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Section */}
            <section className="px-6 lg:px-20 py-24 bg-gradient-to-t from-[#111] to-black">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-extrabold">Join <span className="text-yellow-500">our UI UX Team</span></h2>
                        <p className="text-gray-400">
                            We are always on the lookout for our next stunning colleague. If you'd like to reach out to us regarding your skills and how we can help them grow and act differently, we are hoping to apply your job. As you roll our hiring process, we will be in touch with you if you're qualified as per the requirements. Please learn about our hiring process and consider applying after that.
                        </p>
                        <p className="text-gray-500 text-sm">The TrackPi hiring team reviews all applications and we'll be in touch if there's a fit. If you need to get in touch with them, please email <u className="text-gray-300">hr@trackpi.in</u></p>
                    </div>
                    <div className="flex-1">
                        <div className="bg-yellow-500/5 p-4 rounded-3xl border border-white/5">
                            <img src={designerIllustration} alt="Team" className="rounded-2xl" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#1A1A1A] w-full max-w-md rounded-3xl border border-white/10 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                                <X size={24} />
                            </button>
                        </div>
                        <h3 className="text-2xl font-bold mb-6 text-yellow-500">Register for Competition</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                                <input
                                    required name="name" value={formData.name} onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</label>
                                <input
                                    required type="email" name="email" value={formData.email} onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone Number</label>
                                <input
                                    required name="phone" value={formData.phone} onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Portfolio Link</label>
                                <input
                                    required name="portfolio" value={formData.portfolio} onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-yellow-500/50 transition"
                                    placeholder="Dribbble, Behance, or Website"
                                />
                            </div>
                            <button
                                disabled={loading}
                                className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl mt-6 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:bg-yellow-400 transition flex items-center justify-center gap-2"
                            >
                                {loading ? "Registering..." : "Submit Registration"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default UiUxCompetition;
