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
  onDetailsClick,
}) => {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    // Ensure we have a token before showing apply form
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
      <div className="relative mt-10">
        <div className="bg-white border border-gray-300 rounded-[25px] shadow-sm relative">

          {/* STATUS RIBBON */}
          <div
            className="w-[65%] h-[39px] flex items-center px-8 text-white font-semibold text-lg rounded-tl-[25px]"
            style={{ background: ribbonGradient }}
          >
            {status}
          </div>

          {/* WORK MODE */}
          <div className="absolute top-0 right-0 bg-[#FFB300] px-6 py-2 rounded-bl-2xl rounded-tr-[25px] font-bold text-[13px] flex items-center gap-2 z-10">
            <i className="ri-briefcase-4-line"></i>
            {workMode}
          </div>

          {/* CONTENT */}
          <div className="p-6 flex flex-col md:flex-row items-center relative">

            {/* COMPANY LOGO */}
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-20 h-20 bg-[#FFB300] rounded-2xl flex items-center justify-center shadow-md border border-white z-20 overflow-hidden">
              <img
                src={trackpiLogo}
                alt="Company Logo"
                className="w-full h-full object-contain p-2"
              />
            </div>

            {/* MAIN INFO */}
            <div className="flex-grow pl-20 pr-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-[22px] font-bold text-black uppercase tracking-tight">
                    {title}
                  </h3>

                  <p className="text-[15px] text-gray-800 flex items-center gap-1 mt-1 font-medium">
                    <i className="ri-map-pin-line text-[#FFB300]"></i>
                    {company}, {location}
                  </p>
                </div>

                <img
                  src={verifiedJob}
                  alt="Verified Job"
                  className="w-[120px] h-[100px] object-contain hidden lg:block -mt-2"
                />
              </div>

              {/* JOB DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-[13px] font-semibold mt-4">
                {/* Row 1 */}
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

                {/* Row 2 */}
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
            <div className="flex flex-col items-center justify-center gap-4 min-w-[180px] border-l border-gray-200 pl-6 my-4">
              <button
                onClick={handleApplyClick}
                className="w-full bg-[#FFB300] text-black px-6 py-3 rounded-[12px] font-bold text-[15px] hover:bg-[#FFB813] transition-all shadow-sm mt-8"
              >
                Apply Now
              </button>

              <button
                onClick={onDetailsClick}
                className="text-[13px] font-bold text-black hover:underline flex items-center gap-1"
              >
                More details <i className="ri-arrow-right-line"></i>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] overflow-hidden flex flex-col">
            <ApplyJobForm
              jobId={id}
              job={{ title, company, location }}
              onCancel={() => setShowApplyForm(false)}
              onSuccess={() => setShowApplyForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default JobCard;
