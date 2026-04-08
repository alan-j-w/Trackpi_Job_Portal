import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../../assets/logo.png";

const NavbarTalent = () => {
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
                            mixBlendMode: 'screen'
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
                        <button className="text-white hover:scale-110 transition-transform opacity-100 px-2">
                            <i className="ri-volume-up-fill text-2xl"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavbarTalent;
