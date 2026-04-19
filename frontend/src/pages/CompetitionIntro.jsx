import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import challengeMusic from "../assets/Talent league/ui ux/challenge music.mp3.mp3";
import { Volume2, VolumeX, ChevronLeft } from "lucide-react";

const CompetitionIntro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio(challengeMusic));
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "02",
    minutes: "01",
    seconds: "51"
  });

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    return () => audio.pause();
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Dynamic Timer Logic
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 2);
    targetDate.setMinutes(targetDate.getMinutes() + 2);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d < 10 ? `0${d}` : `${d}`,
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const enrollmentId = localStorage.getItem("enrollmentId");
      if (!enrollmentId) {
        navigate("/");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white text-black font-sans flex flex-col">
      {/* Background Confetti */}
      <img
        src={goldConfetti}
        alt=""
        className="absolute top-0 left-0 w-full h-[600px] object-cover opacity-60 pointer-events-none z-0"
        style={{
          filter: "brightness(2) contrast(1.1) saturate(1.4)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />

      {/* Back Arrow */}
      <div className="absolute top-24 left-12 z-20">
        <Link to="/competition/ui-ux" className="text-[#FFB300] hover:scale-110 transition-transform">
          <ChevronLeft size={32} />
        </Link>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full px-12 py-6 flex justify-between items-center bg-transparent mt-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={trackpiLogo} alt="TrackPi Logo" className="h-10 cursor-pointer object-contain" />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <Link to="/competition/ui-ux" className="text-[#FFB300] font-russo text-[18px]">
            Competition
          </Link>
          <Link to="/competition/pending" className="text-black font-russo text-[18px] hover:text-[#FFB300] transition">
            Result
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("enrollmentId");
              navigate("/");
            }}
            className="text-black font-russo text-[18px] hover:text-[#FFB300] transition"
          >
            Logout
          </button>
          <button onClick={toggleMusic} className="text-black hover:scale-110 transition-transform">
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10 px-4">
        <h1 className="font-russo text-[#FFB300] text-[56px] mb-12 text-center">
          Start Your Talent League
        </h1>

        <div className="flex gap-8 mb-12">
          {[
            { label: 'DAYS', val: timeLeft.days },
            { label: 'HOURS', val: timeLeft.hours },
            { label: 'MINUTES', val: timeLeft.minutes },
            { label: 'SECONDS', val: timeLeft.seconds }
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <div className="w-[110px] h-[110px] bg-[#FFB300] rounded-[15px] shadow-[0_12px_24px_rgba(255,179,0,0.3)] flex items-center justify-center border-t border-white/20">
                <span className="font-russo text-black text-[48px]">{item.val}</span>
              </div>
              <span className="text-black text-[13px] font-bold tracking-[0.2em]">{item.label}</span>
            </div>
          ))}
        </div>

        <p className="text-[#FFB300] text-center mb-16 max-w-[800px] text-[22px] font-medium leading-relaxed" style={{ fontFamily: "'Raleway', sans-serif" }}>
          Please joining in on time. Join with your enrollment I D. Join our Internship Talent Competition and prove your skills in design, editing, or development
        </p>

        <button
          onClick={() => navigate("/competition/task")}
          className="w-[190px] h-[48px] border-[1.5px] border-[#1A1A1A] bg-white rounded-[10px] text-[#1A1A1A] font-bold text-[20px] hover:bg-gray-50 transition-all shadow-sm"
        >
          Done
        </button>
      </main>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#FFB300]/10 to-transparent pointer-events-none z-0"></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400;500;600;700&display=swap');
        .font-russo { font-family: 'Russo One', sans-serif; }
      `}</style>
    </div>
  );
};

export default CompetitionIntro;
