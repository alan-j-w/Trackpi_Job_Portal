import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 📌 Import Images
import meeting from "../../assets/hero/meeting.png";
import lady from "../../assets/hero/lady.png";
import mobile from "../../assets/hero/mobile.png";

import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaQuora,
  FaBloggerB,
  FaMediumM,
  FaWhatsapp
} from "react-icons/fa";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-white pt-24 pb-8 lg:pt-32 lg:pb-12 font-cabinet overflow-hidden group pl-[80px] min-h-[800px]" // Reduced min-h and padding
    >
      {/* ---------------- SOCIAL SIDEBAR (LEFT) ---------------- */}
      {/* Fixed near the Resume Generator button: Positioned absolute so it scrolls with the page. 
          Using fixed pixel/rem top to align with the text/button flow better than %. */}
      {/* Updated to allow width expansion for hover effect */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col items-start gap-4 z-50 pl-4 w-auto">

        {/* Instagram */}
        <a
          href="https://www.instagram.com/trackpi_official/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[140px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaInstagram size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">INSTAGRAM</span>
        </a>

        {/* Facebook */}
        <a
          href="https://www.facebook.com/people/Trackpi-Private-Limited/61565947096778/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-[#1877F2] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[140px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaFacebookF size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">FACEBOOK</span>
        </a>

        {/* YouTube */}
        <a
          href="https://www.youtube.com/@trackpi"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-[#FF0000] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaYoutube size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">YOUTUBE</span>
        </a>

        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/company/trackpi-private-limited/posts/?feedView=all&viewAsMember=true"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-[#0A66C2] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaLinkedinIn size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">LINKEDIN</span>
        </a>

        {/* Quora */}
        <a
          href="https://www.quora.com/profile/Trackpi-Private-Limited"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-[#cf2e2e] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[120px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaQuora size={16} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">QUORA</span>
        </a>

        {/* Blogger */}
        <a
          href="https://trackpi.blogspot.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-[#F57D00] text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[130px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaBloggerB size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">BLOGGER</span>
        </a>

        {/* Medium */}
        <a
          href="https://medium.com/@trackpi"
          target="_blank"
          rel="noopener noreferrer"
          className="h-[36px] flex items-center bg-black text-white shadow-md overflow-hidden transition-all duration-300 w-[36px] hover:w-[120px] hover:rounded-r-md"
        >
          <div className="w-[36px] min-w-[36px] h-full flex items-center justify-center">
            <FaMediumM size={18} />
          </div>
          <span className="text-xs font-bold whitespace-nowrap ml-2">MEDIUM</span>
        </a>
      </div>

      {/* ---------------- WHATSAPP BUTTON (RIGHT) ---------------- */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 animate-bounce-slow"
      >
        <FaWhatsapp size={32} />
      </a>


      {/* ---------------- TORCH EFFECT ---------------- */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 179, 0, 0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center lg:items-start gap-16 lg:gap-12">

        {/* ---------------- LEFT CONTENT ---------------- */}
        <div className="flex-1 space-y-8 w-full">
          <h1 className="text-4xl md:text-5xl lg:text-[70px] font-bold leading-[1.1] text-black tracking-tight">
            Unlock Your Potential With <br className="hidden md:block" />
            <span className="text-[#FFB300]">New Opportunities</span>
          </h1>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-lg font-['Montserrat']">
            Trackpi is one of the best business consulting firms in Kerala.
            We have a highly experienced team that develops strategies to promote growth and development.
            With our expert consulting services, we help businesses thrive in a competitive environment.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <button
              onClick={() => navigate("/resume-gen")}
              className="bg-[#FFB300] px-8 py-3.5 rounded-xl font-bold text-black text-lg shadow-md hover:bg-[#ffca2c] hover:shadow-lg transform active:scale-95 transition-all duration-200"
            >
              Resume generator
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="border-2 border-black px-8 py-3.5 rounded-xl font-bold text-lg text-black hover:bg-black hover:text-white transform active:scale-95 transition-all duration-200">
              Browse jobs
            </button>
          </div>

          <div className="pt-6 mt-10 flex flex-row items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
            <p className="italic font-bold text-sm md:text-base tracking-[0.14em] text-black uppercase shrink-0" style={{ fontFamily: '"Playfair Display", serif', lineHeight: '1', textShadow: '0px 2px 2px rgba(0, 0, 0, 0.45)' }}>
              "WE WON'T LET YOU STAY JOBLESS"
            </p>
            <p className="font-medium text-[10px] md:text-xs tracking-wide whitespace-nowrap pt-1 text-gray-800 shrink-0" style={{ fontFamily: "Ponnala, sans-serif" }}>
              — By Trackpi HR Department
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT GRID (OPTIMIZED LAYOUT) ---------------- */}
        {/* Adjusted to ensure perfect alignment: Left Col Height (240+260+24 = 524px) == Right Col Height (340+160+24 = 524px) */}
        <div className="flex-1 w-full grid grid-cols-12 gap-5 lg:gap-6">

          {/* COLUMN 1: Meeting + Mobile (Span 7) */}
          <div className="col-span-12 sm:col-span-7 flex flex-col gap-5 lg:gap-6">

            {/* 1. Meeting Photo */}
            <div className="h-[240px] rounded-tl-[60px] overflow-hidden shadow-lg border border-gray-100 bg-white group/img">
              <img
                src={meeting}
                alt="Team meeting strategy"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
            </div>

            {/* 2. Mobile Display */}
            <div
              className="h-[260px] overflow-hidden drop-shadow-xl border border-gray-100 bg-white group/img"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 80px 100%, 0 calc(100% - 80px))" }}
            >
              <img
                src={mobile}
                alt="Mobile app interface"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* COLUMN 2: Lady + Link (Span 5) */}
          <div className="col-span-12 sm:col-span-5 flex flex-col gap-5 lg:gap-6">

            {/* 3. Lady Photo - Top Aligned with Meeting Photo */}
            <div className="h-[340px] relative rounded-tr-[60px] shadow-lg border border-gray-100 overflow-hidden bg-gradient-to-b from-[#A4B3BD] to-[#E8E6E6] group/img">
              <img
                src={lady}
                alt="Professional consultant"
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
              />
              {/* Tooltip */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md w-[85%] px-4 py-3 rounded-xl shadow-sm border border-gray-200 text-center">
                <p className="text-[11px] font-bold text-gray-800 leading-snug">
                  Let Us Help You Find A Job That Suits You The Best!
                </p>
              </div>
            </div>

            {/* 4. Link Text - Styled as Card - Bottom Aligned with Mobile Photo */}
            {/* Height calculated: Total Left (524) - Lady (340) - Gap (24) = 160px */}
            <div className="h-[160px] rounded-br-[60px] bg-[#F3F5F7] p-6 lg:p-8 flex flex-col justify-center relative overflow-hidden group/card shadow-sm border border-gray-100 transition-all hover:shadow-md hover:bg-gray-100">
              <div className="relative group/link cursor-pointer select-none z-10">
                <p className="text-lg lg:text-xl font-bold leading-tight text-gray-900">
                  Apply to <br />
                  <span className="text-[#FFB300]">multiple vacancies</span> <br />
                  at once <span className="text-2xl inline-block group-hover/link:translate-x-2 transition-transform">›</span>
                </p>
              </div>

              {/* Decorative Arc/Circle within the card - Positioned to look like the design */}
              <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full border-[20px] border-white opacity-80 pointer-events-none"></div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;