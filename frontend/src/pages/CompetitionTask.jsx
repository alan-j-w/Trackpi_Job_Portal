import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import trackpiLogo from "../assets/logo.png";
import goldConfetti from "../assets/Talent league/ui ux/realistic-golden-confetti-background.png";
import logoutImg from "../assets/Talent league/ui ux/logout.png";
import taskPDF from "../assets/Talent league/ui ux/Assessment.pdf";
import { challengeAudio } from "../utils/audioManager";
import { Volume2, VolumeX, ChevronLeft, FileText, Upload, Loader2 } from "lucide-react";

const CompetitionTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: "02",
    hours: "02",
    minutes: "01",
    seconds: "51"
  });

  useEffect(() => {
    const unsubscribe = challengeAudio.subscribe(setIsPlaying);
    challengeAudio.play();
    return unsubscribe;
  }, []);

  const toggleMusic = () => {
    challengeAudio.toggle();
  };

  // Individual 48-Hour Timer (Starts from Registration)
  useEffect(() => {
    const fetchCandidateTimer = async () => {
      try {
        const enrollmentId = localStorage.getItem("enrollmentId");
        if (!enrollmentId) return;

        const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/login`, { enrollmentId });
        
        if (res.data.success && res.data.candidate) {
          const registrationDate = new Date(res.data.candidate.createdAt);
          const targetDate = new Date(registrationDate.getTime() + (48 * 60 * 60 * 1000)); // Exactly 48 hours from registration

          if (new Date() > targetDate) {
            navigate("/competition/completed");
            return;
          }

          const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
              clearInterval(interval);
              setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
              setIsTimeUp(true);
              navigate("/competition/completed");
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
        }
      } catch (err) {
        console.error("Error setting individual timer:", err);
      }
    };

    fetchCandidateTimer();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const enrollmentId = localStorage.getItem("enrollmentId");
      if (!enrollmentId) {
        navigate("/");
        return;
      }
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/login`, { enrollmentId });
        if (response.data.success) {
           const { status, taskUrl } = response.data.candidate;
           if (status === "Pass") navigate("/competition/result");
           else if (status === "Fail") navigate("/competition/failed");
           else if (taskUrl) navigate("/competition/pending");
           else setAuthLoading(false);
        } else {
           navigate("/");
        }
      } catch (err) {
         navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      toast.success("PDF uploaded successfully!");
    } else {
      toast.error("Please upload a PDF file.");
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please upload your PDF task file first.");
      return;
    }

    const enrollmentId = localStorage.getItem("enrollmentId");
    if (!enrollmentId) {
      toast.error("Not logged in. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("taskFile", selectedFile);
      formData.append("enrollmentId", enrollmentId);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/submit-task`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        toast.success("Task PDF Submitted Successfully!");
        navigate("/competition/completed"); 
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit task.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white text-black font-sans flex flex-col pb-20">
      {/* Background Confetti */}
      <img
        src={goldConfetti}
        alt=""
        className="absolute top-0 left-0 w-full h-[600px] object-cover opacity-50 pointer-events-none z-0"
        style={{
          filter: "brightness(2) contrast(1.1) saturate(1.4)",
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
          <Link to="/competition/ui-ux" className="text-[#FFB300] font-russo text-[18px]">
            Competition
          </Link>
          <Link to="/competition/pending" className="text-black font-russo text-[18px] hover:text-[#FFB300] transition">
            Result
          </Link>
          <button
            onClick={() => setShowLogoutModal(true)}
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
      <main className="relative z-20 flex-1 flex flex-col items-center mt-4 px-4 overflow-y-auto">
        <h1 className="font-russo text-[#FFB300] text-[48px] mb-8 text-center">
          Start Your Talent League
        </h1>

        {/* Countdown Timer Row */}
        <div className="flex gap-8 mb-8">
            {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: timeLeft.hours },
                { label: 'MINUTES', val: timeLeft.minutes },
                { label: 'SECONDS', val: timeLeft.seconds }
            ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                    <div className="w-[90px] h-[90px] bg-[#FFB300] rounded-[12px] flex items-center justify-center shadow-[0_8px_16px_rgba(255,179,0,0.25)] border-t border-white/20">
                        <span className="text-black font-russo text-[42px]">{item.val}</span>
                    </div>
                    <span className="text-black text-[11px] font-bold tracking-[0.15em] uppercase">{item.label}</span>
                </div>
            ))}
        </div>

        {/* View Your Task Section */}
        <div className="w-full max-w-[815px] mb-8 text-center flex flex-col items-center">
          <h3 className="text-[#FFB300] font-russo text-[20px] mb-2 uppercase tracking-wide">View Your Task</h3>
          <a
            href={taskPDF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[330px] h-[65px] bg-white border-[1.2px] border-[#A1A1AA] rounded-[12px] flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm group"
          >
            <div className="bg-[#EF4444]/10 p-2 rounded-lg group-hover:bg-[#EF4444]/20 transition-colors">
              <FileText className="text-[#EF4444]" size={36} />
            </div>
          </a>
        </div>

        {/* Submit Your Task Section */}
        <div className="w-full max-w-[900px] mb-10 text-center flex flex-col items-center">
          <h3 className="text-[#FFB300] font-russo text-[20px] mb-2 uppercase tracking-wide">Submit Your Task</h3>
          <div className="w-full min-h-[120px] bg-white border-[1.2px] border-[#A1A1AA] rounded-[12px] p-6 flex flex-col items-center justify-center gap-4 shadow-sm relative">
            <p className="text-[#686868] text-[18px] font-medium font-sans">
              {selectedFile ? `Selected: ${selectedFile.name}` : "Submit your design in figma link or adobe XD link or PDF ."}
            </p>
            <div className="flex flex-col items-center gap-2">
              <label 
                className={`flex items-center justify-center gap-2 w-[160px] h-[40px] rounded-[10px] font-bold text-[16px] transition-all cursor-pointer shadow-sm ${!isTimeUp ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60' : 'bg-white border-[1.2px] border-[#FFB300] text-[#FFB300] hover:bg-[#FFB300]/5'}`}
              >
                  {isTimeUp ? "Upload file" : "Locked"}
                  <Upload size={20} className="ml-1" />
                  <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={!isTimeUp} />
              </label>
              {!isTimeUp && (
                <p className="text-[#FF4D4D] text-[13px] font-medium mt-1">
                  * Only after the time ends you should upload the task
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Final Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !isTimeUp}
          className="w-[240px] h-[52px] bg-[#FFB300] text-white font-bold text-[22px] rounded-[10px] shadow-[0_12px_24px_rgba(255,179,0,0.3)] hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin" size={28} /> : "Submit"}
        </button>
      </main>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#FFB300]/15 to-transparent pointer-events-none z-0"></div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-[32px] w-full max-w-[500px] p-10 flex flex-col items-center animate-pop-in text-center relative shadow-2xl overflow-hidden border border-gray-100">
            <div className="mb-6 h-[180px] overflow-hidden flex items-start justify-center w-full">
              <img
                src={logoutImg}
                alt="Logout Illustration"
                className="w-[280px] h-[350px] object-contain"
                style={{ objectPosition: 'top' }}
              />
            </div>

            <h2 className="text-black font-bold text-3xl mb-2 font-inter">
              Are you logging out?
            </h2>
            <p className="text-gray-600 text-lg mb-10 font-medium font-inter">
              You can always back at any time.
            </p>

            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-[58px] rounded-[12px] font-bold text-xl text-black transition-all active:scale-95 shadow-md flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #FFFFFF 0%, #FFB300 100%)",
                }}
              >
                Cancel
              </button>
              <button
                  onClick={() => {
                    localStorage.removeItem("enrollmentId");
                    navigate("/talent-league");
                  }}
                className="flex-1 h-[58px] rounded-[12px] border-2 border-black font-bold text-xl text-black bg-white hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Russo+One&family=Raleway:wght@400;500;600;700&family=Inter:wght@400;700&display=swap');
        .font-russo { font-family: 'Russo One', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CompetitionTask;
