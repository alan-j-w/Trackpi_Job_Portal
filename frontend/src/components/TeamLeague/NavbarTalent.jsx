import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../../assets/logo.png";

const NavbarTalent = () => {
    const [open, setOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const navigate = useNavigate();

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <nav className="max-w-7xl mx-auto flex items-center justify-between py-6 px-6 md:px-12">

                {/* LOGO */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="TrackPi Logo"
                        className="h-10 md:h-12 w-auto object-contain"
                    />
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-8 ml-auto">
                    {/* Navigation Links */}
                    <ul className="flex gap-8 font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <Link to="/about" className="hover:text-white transition">About us</Link>
                        <Link to="/testimonials" className="hover:text-white transition">Testimonial</Link>
                        <Link to="/contact" className="hover:text-white transition">Contact us</Link>
                    </ul>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4">
                        {/* Log In Button */}
                        <Link
                            to="/login"
                            className="px-6 py-2 rounded-lg border border-purple-500 text-white font-semibold hover:bg-purple-600/20 transition"
                        >
                            Log in
                        </Link>

                        {/* Volume Control */}
                        <button
                            onClick={toggleMute}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? (
                                <i className="ri-volume-mute-fill text-xl"></i>
                            ) : (
                                <i className="ri-volume-up-fill text-xl"></i>
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                    className="md:hidden text-3xl text-white ml-auto"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <i className="ri-close-line"></i> : <i className="ri-menu-line"></i>}
                </button>
            </nav>

            {/* MOBILE MENU DROPDOWN */}
            {open && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-[#0a0514]/95 backdrop-blur-lg border-t border-white/10 py-6 px-6 space-y-6 shadow-xl animate-slideDown z-50">
                    <ul className="flex flex-col gap-4 font-medium text-gray-300">
                        <Link to="/" onClick={() => setOpen(false)} className="hover:text-white">Home</Link>
                        <Link to="/about" onClick={() => setOpen(false)} className="hover:text-white">About us</Link>
                        <Link to="/testimonials" onClick={() => setOpen(false)} className="hover:text-white">Testimonial</Link>
                        <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-white">Contact us</Link>
                    </ul>

                    <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                        <Link
                            to="/login"
                            onClick={() => setOpen(false)}
                            className="px-6 py-3 border border-purple-500 rounded-lg text-center text-white font-semibold hover:bg-purple-600/20"
                        >
                            Log in
                        </Link>

                        <div className="flex items-center justify-between text-gray-300">
                            <span>Sound</span>
                            <button
                                onClick={toggleMute}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white"
                            >
                                {isMuted ? (
                                    <i className="ri-volume-mute-fill text-xl"></i>
                                ) : (
                                    <i className="ri-volume-up-fill text-xl"></i>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavbarTalent;
