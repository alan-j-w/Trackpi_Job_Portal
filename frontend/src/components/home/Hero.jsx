import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// 📌 Import Images
import meeting from "../../assets/hero/meeting.png";
import lady from "../../assets/hero/lady.png";
import mobile from "../../assets/hero/mobile.png";

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
      className="relative w-full bg-white pt-24 pb-16 lg:pt-32 lg:pb-24 font-cabinet overflow-hidden group"
    >
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
              onClick={() => navigate('/resume-gen')}
              className="bg-[#FFB300] px-8 py-3.5 rounded-xl font-bold text-black text-lg shadow-md hover:bg-[#ffca2c] hover:shadow-lg transform active:scale-95 transition-all duration-200"
            >
              Resume Generator
            </button>
            <button className="border-2 border-black px-8 py-3.5 rounded-xl font-bold text-lg text-black hover:bg-black hover:text-white transform active:scale-95 transition-all duration-200">
              Browse Jobs
            </button>
          </div>

          <div className="pt-6 mt-10 flex flex-col md:flex-row md:items-baseline gap-2.5 md:gap-4">
            <p className="italic font-extrabold text-xl uppercase tracking-wider text-gray-900" style={{ WebkitTextStroke: '0.5px rgba(0,0,0,0.8)' }}>
              <em>"WE WON'T LET YOU STAY JOBLESS"</em>
            </p>
            <p className="font-medium text-sm tracking-wide" style={{ fontFamily: "Ponnala, sans-serif" }}>
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
                  Let Us Help You Find A Job That Suits You!
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