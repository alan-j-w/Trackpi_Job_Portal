import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import EditProfileModal from "../components/profile/EditProfileModal";
import EditSummaryModal from "../components/profile/EditSummaryModal";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileSummary from "../components/profile/ProfileSummary";
import ExperienceSection from "../components/profile/ExperienceSection";
import SkillsSection from "../components/profile/SkillsSection";
import EducationSection from "../components/profile/EducationSection";
import LanguageSection from "../components/profile/LanguageSection";
import ResumeSection from "../components/profile/ResumeSection";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import JobListing from "../components/profile/JobListing";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch Profile
    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            const res = await axios.get("http://localhost:8000/api/profile/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            if (err.response?.status === 404) navigate("/create-profile");
            else setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (updatedData) => {
        try {
            const token = localStorage.getItem("token");

            // Reconstruct payload for backend

            // 1. Handle Location
            const locationUpdate = {
                city: updatedData.locationCity,
                state: updatedData.locationState,
                country: "India" // Default for now if not in modal
            };

            // 2. Handle Education (Update first entry or create new)
            let updatedEducation = [...(profile.education || [])];
            if (updatedData.educationDegree) {
                if (updatedEducation.length > 0) {
                    updatedEducation[0] = { ...updatedEducation[0], degree: updatedData.educationDegree };
                } else {
                    updatedEducation = [{ degree: updatedData.educationDegree, institution: "Unknown", year: "Present" }];
                }
            }

            const payload = {
                ...updatedData,
                location: locationUpdate,
                education: updatedEducation
            };

            // Remove modal-specific keys
            delete payload.educationDegree;
            delete payload.locationCity;
            delete payload.locationState;
            delete payload.countryCode;

            await axios.post("http://localhost:8000/api/profile", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsEditModalOpen(false);
            fetchProfile(); // Refresh data
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        }
    };

    const handleSaveSummary = async (newSummary) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/profile", { summary: newSummary }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsSummaryModalOpen(false);
            fetchProfile(); // Refresh data
        } catch (err) {
            console.error("Update summary failed", err);
            alert("Failed to update summary");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
        </div>
    );
    if (!profile) return null;

    return (
        <div className="bg-white min-h-screen font-sans pb-20 overflow-x-hidden">
            <Navbar />

            <ProfileHeader profile={profile} onEdit={() => setIsEditModalOpen(true)} />

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">

                {/* --- Main Content Grid --- */}
                <div className="flex flex-col lg:flex-row gap-[40px] pb-12">

                    {/* LEFT COLUMN (Content) */}
                    <div className="flex-1 lg:max-w-[822px]">
                        <ProfileSummary
                            summary={profile.summary}
                            onEdit={() => setIsSummaryModalOpen(true)}
                        />
                        <ExperienceSection workExperience={profile.workExperience} />
                        <SkillsSection skills={profile.skills} />
                        <EducationSection education={profile.education} />
                        <LanguageSection />
                        <ResumeSection />
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <ProfileSidebar profile={profile} />
                </div>

                {/* --- Latest Job Listing --- */}
                <JobListing />

                <div className="text-right text-xs text-[#FFB300] max-w-7xl mx-auto px-4 hover:underline cursor-pointer">
                    www.trackpi.profilpaulwalker34567.in ↗
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profileData={profile}
                onSave={handleUpdateProfile}
            />

            <EditSummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setIsSummaryModalOpen(false)}
                currentSummary={profile.summary}
                onSave={handleSaveSummary}
            />
        </div>
    );
};

export default Profile;
