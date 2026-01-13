// src/components/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-start py-4 px-6 md:px-10">

        {/* 🔥 LOGO LEFT */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="TrackPi Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* 🚀 MENU SECTION RIGHT */}
        <div className="flex items-center gap-10 ml-auto">

          {/* 🌐 NAV LINKS (DESKTOP) */}
          <ul className="hidden md:flex gap-10 font-medium text-gray-800">
            <Link to="/" className="hover:text-[#FFB300]">Home</Link>
            <Link to="/about" className="hover:text-[#FFB300]">About us</Link>
            <Link to="/testimonials" className="hover:text-[#FFB300]">Testimonial</Link>
            <Link to="/talent-league" className="hover:text-[#FFB300]">Talent League</Link>
            <Link to="/contact" className="hover:text-[#FFB300]">Contact us</Link>
          </ul>

          {/* 🟡 AUTH BUTTONS (DESKTOP) */}
          <div className="hidden md:flex gap-3 items-center">
            <Link
              to="/login"
              className="px-6 py-2 hover:text-[#FFB300] transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-[#FFB300] rounded-full text-black font-semibold shadow hover:bg-[#ffca2c] transition"
            >
              Get started
            </Link>
          </div>

          {/* 📱 MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-3xl ml-auto active:scale-90 transition"
            onClick={() => setOpen(!open)}
          >
            {open
              ? <i className="ri-close-line"></i>
              : <i className="ri-menu-line"></i>
            }
          </button>
        </div>
      </nav>

      {/* 📱 MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white py-6 px-6 space-y-6 shadow-lg animate-slideDown">
          <ul className="flex flex-col gap-4 font-medium text-gray-700">
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About us</Link>
            <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonial</Link>
            <Link to="/talent-league" onClick={() => setOpen(false)}>Talent League</Link>
            <Link to="/contact" onClick={() => setOpen(false)}>Contact us</Link>
          </ul>

          <div className="flex flex-col gap-3 pt-4">
            <Link
              to="/login"
              className="px-6 py-2 border rounded-full font-medium text-center hover:bg-gray-100">
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-[#FFB300] text-center rounded-full font-semibold hover:bg-[#ffca2c]">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
