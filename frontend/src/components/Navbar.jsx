// src/components/Navbar.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Check if we are on the profile page - REMOVED, using token instead
  // const isProfilePage = location.pathname === "/profile";

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Clear user info if stored
    navigate("/");
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-start py-4 px-6 md:px-10">

        {/* 🔥 LOGO LEFT */}
        <Link to="/" className="flex items-center">
          {location.pathname === "/profile" ? (
            <span className="text-2xl font-bold text-gray-900">My Profile</span>
          ) : location.pathname === "/testimonials" && token ? (
            <span className="text-2xl font-bold text-gray-900">Testimonials</span>
          ) : (
            <img
              src={logo}
              alt="TrackPi Logo"
              className="h-12 w-auto object-contain"
            />
          )}
        </Link>

        {/* 🚀 MENU SECTION RIGHT */}
        <div className="flex items-center gap-10 ml-auto">

          {/* 🌐 NAV LINKS (DESKTOP) */}
          <ul className="hidden md:flex gap-10 font-medium text-gray-800 items-center">
            {token ? (
              // 🟢 Authenticated User Menu
              <>
                <Link to="/profile" className="hover:text-[#FFB300] border-b-2 border-gray-300 pb-1">Home</Link>
                <a href="https://chat.whatsapp.com/sample-group-invite" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFB300] flex items-center gap-1 text-[#2F80ED] border-b border-[#2F80ED] pb-0.5">
                  Join our community <i className="ri-external-link-line"></i>
                </a>
                <Link to="/testimonials" className="hover:text-[#FFB300]">Testimonial</Link>
                <Link to="/jobs" className="hover:text-[#FFB300]">Brows job</Link>
                <Link to="/applied-jobs" className="hover:text-[#FFB300]">Applied vacancies</Link>
              </>
            ) : (
              // 🔵 Guest / Landing Page Menu
              <>
                <Link to="/" className="hover:text-[#FFB300]">Home</Link>
                <Link to="/about" className="hover:text-[#FFB300]">About us</Link>
                <Link to="/testimonials" className="hover:text-[#FFB300]">Testimonial</Link>
                <Link to="/talent-league" className="hover:text-[#FFB300]">Talent League</Link>
                <Link to="/contact" className="hover:text-[#FFB300]">Contact us</Link>
              </>
            )}
          </ul>

          {/* 🟡 AUTH BUTTONS (DESKTOP) */}
          <div className="hidden md:flex gap-3 items-center">
            {token ? (
              // Authenticated Logout Button
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-white border border-[#FFB300] rounded-lg text-black font-medium shadow-sm hover:bg-[#FFB300] hover:text-white transition"
              >
                Log out
              </button>
            ) : (
              <>
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
              </>
            )}
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
        <div className="md:hidden bg-white py-6 px-6 space-y-6 shadow-lg animate-slideDown z-50 fixed top-[80px] left-0 w-full border-t border-gray-100">
          <ul className="flex flex-col gap-4 font-medium text-gray-700">
            {token ? (
              // 🟢 Authenticated Mobile Menu
              <>
                <Link to="/profile" onClick={() => setOpen(false)}>Home</Link>
                <a href="https://chat.whatsapp.com/sample-group-invite" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Join our community</a>
                <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonial</Link>
                <Link to="/jobs" onClick={() => setOpen(false)}>Brows job</Link>
                <Link to="/applied-jobs" onClick={() => setOpen(false)}>Applied vacancies</Link>
              </>
            ) : (
              // 🔵 Guest Mobile Menu
              <>
                <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                <Link to="/about" onClick={() => setOpen(false)}>About us</Link>
                <Link to="/testimonials" onClick={() => setOpen(false)}>Testimonial</Link>
                <Link to="/talent-league" onClick={() => setOpen(false)}>Talent League</Link>
                <Link to="/contact" onClick={() => setOpen(false)}>Contact us</Link>
              </>
            )}
          </ul>

          <div className="flex flex-col gap-3 pt-4">
            {token ? (
              // Authenticated Mobile Logout
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="px-6 py-2 bg-white border border-[#FFB300] text-center rounded-lg text-black font-medium hover:bg-[#FFB300] hover:text-white"
              >
                Log out
              </button>
            ) : (
              // Default Login/Signup
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 border rounded-full font-medium text-center hover:bg-gray-100">
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 bg-[#FFB300] text-center rounded-full font-semibold hover:bg-[#ffca2c]">
                  Get started
                </Link>
              </>
            )}

          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
