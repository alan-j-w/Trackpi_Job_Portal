import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import challengeMusic from "../assets/Talent league/ui ux/challenge music.mp3.mp3";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";

const CompetitionFinished = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio(challengeMusic));

  useEffect(() => {
    document.title = "Competition Completed | TrackPi";
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
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Playback failed:", err);
        });
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white text-black font-sans flex flex-col">
      {/* Decorative Confetti Top */}
      <img
        src={goldConfetti}
        alt=""
        className="absolute top-0 left-0 w-full h-[500px] object-cover opacity-60 pointer-events-none z-0"
        style={{
          filter: "brightness(1) contrast(1.1) saturate(1.4)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />



      {/* Navbar */}
      <nav className="relative z-10 w-full px-12 py-6 flex justify-between items-center bg-transparent mt-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={trackpiLogo} alt="TrackPi Logo" className="h-10 cursor-pointer object-contain" />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <Link
            to="/competition/ui-ux"
            className="text-[#FFB300] font-semibold text-lg hover:text-yellow-400 transition"
          >
            Competition
          </Link>
          <Link
            to="/competition/result"
            className="text-black font-semibold text-lg hover:text-yellow-400 transition"
          >
            Result
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("enrollmentId");
              navigate("/");
            }}
            className="text-black font-semibold text-lg hover:text-gray-700 transition"
          >
            Logout
          </button>

          <button 
            onClick={toggleMusic}
            className="text-black hover:scale-110 transition-transform flex items-center justify-center"
          >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-20 px-4">
        <div className="text-center max-w-[1000px]">
          <h1
            style={{
              fontFamily: "'Russo One', sans-serif",
              fontSize: "64px",
              fontWeight: 400,
              lineHeight: "1.2",
            }}
            className="text-black mb-10"
          >
            Your Competition <span className="text-[#FFB300]">Completed</span>
          </h1>

          <p
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontSize: "30px",
              fontWeight: 500,
              lineHeight: "1.4",
              color: "#000000",
            }}
            className="max-w-[900px] mx-auto"
          >
            The competition has successfully concluded. You may now proceed to view{" "}
            <span className="text-[#FFB300]">your results on the results page.</span>
          </p>
        </div>
      </main>

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-0"
        style={{
          background: "linear-gradient(to top, rgba(255, 179, 0, 0.25) 0%, transparent 100%)",
        }}
      ></div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400;500;600;700&display=swap');
      `}</style>
    </div>
  );
};

export default CompetitionFinished;
