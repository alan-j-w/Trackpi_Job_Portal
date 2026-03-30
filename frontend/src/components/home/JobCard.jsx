// src/components/JobCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "remixicon/fonts/remixicon.css";

/* Assets */
import verifiedJob from "../../assets/badges/verified-job.png";
import trackpiLogo from "../../assets/badges/trackpi-striped.png";
import LoginRequiredModal from "../LoginRequiredModal";
import ApplyJobForm from "./ApplyJobForm";

const JobCard = ({
  id,
  title = "Job Title",
  company = "Company Name",
  location = "Location",
  education = "Any Degree",
  jobType = "Full Time",
  salary = "Not disclosed",
  experience = "Not specified",
  workMode = "On-site",
  gender = "Any",
  status = "New",
  statusColor = "green",
  hasApplied = false,
  onApplySuccess,
  onDetailsClick,
}) => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const handleApplyClick = () => {
    if (hasApplied) return;
    const token = localStorage.getItem("token");
    if (token) {
      setShowApplyForm(true);
    } else {
      setShowLoginPopup(true);
    }
  };

  /* Status Ribbon */
  const ribbonGradient =
    statusColor === "red"
      ? "linear-gradient(90deg, #E35353 0%, rgba(227,83,83,0) 100%)"
      : "linear-gradient(90deg, #53E37B 0%, rgba(83,227,123,0) 100%)";

  return (
    <>
      {/* ================= CARD ================= */}
      <div className="relative">
        <div className="bg-white border border-gray-300 rounded-[25px] shadow-sm relative">

          {/* STATUS RIBBON */}
          <div
            className="w-[65%] h-[39px] flex items-center px-6 text-white font-semibold text-base rounded-tl-[25px]"
            style={{ background: ribbonGradient }}
          >
            {status}
          </div>

          {/* WORK MODE */}
          <div className="absolute top-0 right-0 bg-[#FFB300] px-4 py-2 rounded-bl-2xl rounded-tr-[25px] font-bold text-[12px] sm:text-[13px] flex items-center gap-1 sm:gap-2 z-10">
            <i className="ri-briefcase-4-line"></i>
            {workMode}
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">

            {/* COMPANY LOGO — inline on mobile, absolute on larger screens */}
            <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 md:absolute md:-left-6 md:top-1/2 md:-translate-y-1/2 bg-[#FFB300] rounded-2xl flex items-center justify-center shadow-md border border-white z-20 overflow-hidden">
              <img
                src={trackpiLogo}
                alt="Company Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* MAIN INFO */}
            <div className="flex-grow md:pl-16 pr-0 md:pr-4 w-full">
              <div className="flex flex-wrap justify-between items-start mb-2 gap-2">
                <div>
                  <h3 className="text-[18px] sm:text-[22px] font-bold text-black uppercase tracking-tight">
                    {title}
                  </h3>

                  <p className="text-[14px] sm:text-[15px] text-gray-800 flex items-center gap-1 mt-1 font-medium">
                    <i className="ri-map-pin-line text-[#FFB300]"></i>
                    {company}, {location}
                  </p>
                </div>

                <img
                  src={verifiedJob}
                  alt="Verified Job"
                  className="w-[80px] h-[70px] sm:w-[100px] sm:h-[80px] object-contain hidden sm:block -mt-2"
                />
              </div>

              {/* JOB DETAILS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-[12px] sm:text-[13px] font-semibold mt-4">
                <div className="flex items-center gap-2">
                  <i className="ri-briefcase-line text-[#FFB300] text-lg"></i>
                  {jobType}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-graduation-cap-line text-[#FFB300] text-lg"></i>
                  {education}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-briefcase-4-line text-[#FFB300] text-lg"></i>
                  {workMode}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-user-line text-[#FFB300] text-lg"></i>
                  {gender}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-money-rupee-circle-line text-[#FFB300] text-lg"></i>
                  {salary}
                </div>

                <div className="flex items-center gap-2">
                  <i className="ri-time-line text-[#FFB300] text-lg"></i>
                  {experience}
                </div>
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="flex flex-row md:flex-col items-center justify-start md:justify-center gap-3 md:gap-4 w-full md:w-auto md:min-w-[180px] md:border-l md:border-gray-200 md:pl-6 pt-2 md:my-4">
              {hasApplied ? (
                <button
                  disabled
                  className="flex-1 md:flex-none md:w-full bg-gray-300 text-gray-600 px-6 py-3 rounded-full font-bold text-[14px] sm:text-[15px] shadow-none cursor-not-allowed flex items-center justify-center gap-1"
                >
                  Applied <i className="ri-check-line border text-[12px] border-gray-500 rounded-full w-4 h-4 flex items-center justify-center"></i>
                </button>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="flex-1 md:flex-none md:w-full bg-[#FFB300] text-black px-6 py-3 rounded-full font-bold text-[14px] sm:text-[15px] hover:bg-[#FFB813] transition-all shadow-md transform hover:scale-105"
                >
                  Apply Now
                </button>
              )}

              <button
                onClick={onDetailsClick}
                className="flex-1 md:flex-none text-[13px] font-bold text-black hover:underline flex items-center justify-center gap-1 py-3 group"
              >
                More details <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOGIN POPUP ================= */}
      {showLoginPopup && (
        <LoginRequiredModal onClose={() => setShowLoginPopup(false)} />
      )}

      {/* ================= APPLY FORM POPUP ================= */}
      {showApplyForm && (
        <ApplyJobForm
            jobId={id}
            job={{ title, company, location }}
            onCancel={() => setShowApplyForm(false)}
            onSuccess={() => {
              if (onApplySuccess) onApplySuccess();
              setShowApplyForm(false);
            }}
        />
      )}
    </>
  );
};

export default JobCard;
