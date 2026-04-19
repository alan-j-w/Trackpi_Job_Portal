import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../../assets/logo.png";
import songAudio from "../../assets/Talent league/ui ux/song.mp3.mp3";

const NavbarTalent = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio(songAudio);
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <header className="absolute top-0 left-0 w-full z-50">
            <nav className="max-w-7xl mx-auto flex items-center justify-between pt-2 pb-6 px-6 md:px-12">
                {/* LOGO */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="TrackPi Logo"
                        className="object-contain"
                        style={{
                            width: '68.29px',
                            height: '40.17px',
                            mixBlendMode: 'screen',
                            filter: 'brightness(0.9) contrast(1.5)'
                        }}
                    />
                </Link>
                {/* NAV LINKS & ACTIONS WRAPPER (Moved to right) */}
                <div className="flex items-center gap-14 lg:gap-24">
                    {/* NAV LINKS */}
                    <ul className="hidden md:flex items-center gap-8 lg:gap-11 text-[#D1D1D1] font-medium text-[16px]">
                        <li className="hover:text-white transition cursor-pointer">
                            <Link to="/">Home</Link>
                        </li>
                        <li className="hover:text-white transition cursor-pointer">
                            <Link to="/about">About us</Link>
                        </li>
                        <li className="hover:text-white transition cursor-pointer">
                            <Link to="/testimonials">Testimonial</Link>
                        </li>
                        <li className="hover:text-white transition cursor-pointer">
                            <Link to="/contact">Contact us</Link>
                        </li>
                    </ul>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-6">
                        <Link to="/login">
                            <button className="px-8 py-2 border border-white/60 rounded-[8px] text-[15px] font-medium text-white hover:bg-white/10 transition">
                                Log in
                            </button>
                        </Link>
                        <button onClick={togglePlay} className="px-3 py-1 border border-white/60 rounded-[8px] text-white hover:scale-105 transition-transform opacity-100 flex items-center justify-center">
                            <i className={isPlaying ? "ri-volume-up-fill text-xl" : "ri-volume-mute-fill text-xl"}></i>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavbarTalent;
