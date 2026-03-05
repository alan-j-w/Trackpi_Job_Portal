import React, { useEffect, useState } from "react";
import axios from "axios";
import { calculateProfileStrength } from "../utils/profileUtils";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import config from "../config";

import Navbar from "../components/Navbar";
import EditProfileModal from "../components/profile/EditProfileModal";
import EditExperienceModal from "../components/profile/EditExperienceModal";
import EditSkillsModal from "../components/profile/EditSkillsModal";
import EditSummaryModal from "../components/profile/EditSummaryModal";
import EditEducationModal from "../components/profile/EditEducationModal";
import EditLanguageModal from "../components/profile/EditLanguageModal";
import EditResumeModal from "../components/profile/EditResumeModal";
import EditSocialLinksModal from "../components/profile/EditSocialLinksModal";
import EditAdditionalDetailsModal from "../components/profile/EditAdditionalDetailsModal";
import DeleteConfirmationModal from "../components/profile/DeleteConfirmationModal";

import ProfileHeader from "../components/profile/ProfileHeader";
import SectionListModal from "../components/profile/SectionListModal";
import ExperienceCard from "../components/profile/ExperienceCard";
import BulkEditExperienceModal from "../components/profile/BulkEditExperienceModal";
import EducationCard from "../components/profile/EducationCard";
import LanguageRow from "../components/profile/LanguageRow";
import ProfileSummary from "../components/profile/ProfileSummary";
import ExperienceSection from "../components/profile/ExperienceSection";
import SkillsSection from "../components/profile/SkillsSection";
import EducationSection from "../components/profile/EducationSection";
import LanguageSection from "../components/profile/LanguageSection";
import ResumeSection from "../components/profile/ResumeSection";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import JobListing from "../components/profile/JobListing";

const DetailItem = ({ icon, text, isLink, href }) => (
    <div className="flex items-center gap-3 text-sm font-medium text-gray-800">
        <span className="text-black text-lg flex-shrink-0">{icon}</span>
        {isLink ? (
            <a href={href} className="truncate hover:underline" title={text}>{text}</a>
        ) : (
            <span className="truncate" title={text}>{text}</span>
        )}
    </div>
);

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isSummaryEditing, setIsSummaryEditing] = useState(false);

    // List Modal States
    const [isExpListOpen, setIsExpListOpen] = useState(false);
    const [isEduListOpen, setIsEduListOpen] = useState(false);
    const [isLangListOpen, setIsLangListOpen] = useState(false);

    // Experience Modal State
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [currentExperience, setCurrentExperience] = useState(null);
    const [experienceEditIndex, setExperienceEditIndex] = useState(null);
    const [isExperienceEditing, setIsExperienceEditing] = useState(false);

    // Skills Modal State
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
    const [isSkillsAddMode, setIsSkillsAddMode] = useState(true);

    // Education Modal State
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [currentEducation, setCurrentEducation] = useState(null);
    const [educationEditIndex, setEducationEditIndex] = useState(null);
    const [isEducationEditing, setIsEducationEditing] = useState(false);

    // Language Modal State
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState(null);
    const [languageEditIndex, setLanguageEditIndex] = useState(null);
    const [isLanguageEditing, setIsLanguageEditing] = useState(false);

    // Delete Modal State
    const [showDeleteResumeModal, setShowDeleteResumeModal] = useState(false);

    // Generic Delete Confirmation Modal
    const [deleteModal, setDeleteModal] = useState({ open: false, title: "", onConfirm: null });
    const openDeleteModal = (title, onConfirm) => setDeleteModal({ open: true, title, onConfirm });
    const closeDeleteModal = () => setDeleteModal({ open: false, title: "", onConfirm: null });

    // Resume Modal State
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const [isResumeEditing, setIsResumeEditing] = useState(false);

    // Social Links Modal State
    const [isSocialLinksModalOpen, setIsSocialLinksModalOpen] = useState(false);

    // Additional Details Modal State
    const [isAdditionalDetailsModalOpen, setIsAdditionalDetailsModalOpen] = useState(false);

    const navigate = useNavigate();

    // Fetch Profile
    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) { navigate("/login"); return; }

            const res = await axios.get(`${config.API_URL}/api/profile/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data.profile);
        } catch (err) {
            if (err.response?.status === 404) {
                navigate("/create-profile");
            } else if (err.response?.status === 401) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
            } else {
                setError("Failed to load profile");
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Actions & Helpers ---

    const handleAction = (actionType) => {
        if (actionType === 'photo') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            toast("Click the camera icon on your profile picture", { icon: "📷" });
            return;
        }

        const sectionMap = {
            'skills': { id: 'skills-section', open: () => setIsSkillsModalOpen(true) },
            'education': { id: 'education-section', open: handleAddEducation },
            'experience': { id: 'experience-section', open: handleAddExperience },
            'language': { id: 'language-section', open: handleAddLanguage },
            'summary': { id: 'summary-section', open: () => setIsSummaryModalOpen(true) },
            'resume': { id: 'resume-section', open: () => setIsResumeModalOpen(true) },
            'social': { open: () => setIsSocialLinksModalOpen(true) },
            'additional': { open: () => setIsAdditionalDetailsModalOpen(true) },
            'phone': { open: () => setIsEditModalOpen(true) },
            'marital': { open: () => setIsEditModalOpen(true) },
            'dob': { open: () => setIsEditModalOpen(true) },
        };

        const target = sectionMap[actionType];
        if (target) {
            const element = document.getElementById(target.id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => target.open(), 600);
            } else {
                target.open();
            }
        }
    };

    const handleDeleteResume = () => {
        setShowDeleteResumeModal(true);
    };

    const confirmDeleteResume = async () => {
        setShowDeleteResumeModal(false);
        const oldResume = profile.resume;
        setProfile(prev => ({ ...prev, resume: null, resumeUrl: null }));

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${config.API_URL}/api/profile/resume`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Resume deleted");
        } catch (err) {
            console.error("Delete resume failed", err);
            setProfile(prev => ({ ...prev, resume: oldResume, resumeUrl: oldResume }));
            toast.error(err.response?.data?.message || "Failed to delete resume");
        }
    };

    const handleSaveResume = async (file) => {
        if (!file) {
            setIsResumeModalOpen(false);
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);
        const loadingToast = toast.loading("Uploading resume...");
        setIsResumeModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${config.API_URL}/api/profile/resume`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(prev => ({ ...prev, resume: res.data.resume, resumeUrl: res.data.resume }));
            toast.success("Resume uploaded successfully!", { id: loadingToast });
        } catch (err) {
            console.error("Resume upload failed", err);
            toast.error("Failed to upload resume", { id: loadingToast });
        }
    };

    const handleShareProfile = () => {
        const url = `www.trackpi.in/u/${profile._id}`;
        navigator.clipboard.writeText(url);
        toast.success("Profile link copied!");
    };

    const handleDeleteDirectSkill = async (skillToDelete) => {
        openDeleteModal(
            `Are you sure you want to delete "${skillToDelete}"?`,
            async () => {
                closeDeleteModal();
                const oldSkills = profile.skills || [];
                const updatedSkills = oldSkills.filter(s => s !== skillToDelete);
                setProfile(prev => ({ ...prev, skills: updatedSkills }));
                try {
                    const token = localStorage.getItem("token");
                    await axios.post(`${config.API_URL}/api/profile`, { skills: updatedSkills }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Skill deleted");
                } catch (err) {
                    console.error("Delete skill failed", err);
                    setProfile(prev => ({ ...prev, skills: oldSkills }));
                    toast.error("Failed to delete skill");
                }
            }
        );
    };

    const handleUpdateProfile = async (updatedData) => {
        const loadingToast = toast.loading("Updating profile...");
        try {
            const token = localStorage.getItem("token");
            const locationUpdate = {
                city: updatedData.locationCity,
                state: updatedData.locationState,
                country: updatedData.locationCountry || profile.location?.country || "India"
            };

            let updatedEducation = [...(profile.education || [])];
            if (updatedData.educationDegree) {
                if (!updatedEducation.length) {
                    updatedEducation = [{ degree: updatedData.educationDegree, institution: "Unknown", year: "Present" }];
                } else if (updatedEducation.length === 1) {
                    const currentDegree = updatedEducation[0].degree;
                    if (updatedData.educationDegree !== currentDegree) {
                        updatedEducation[0] = { ...updatedEducation[0], degree: updatedData.educationDegree };
                    }
                }
            }

            const payload = {
                ...updatedData,
                location: locationUpdate,
                education: updatedEducation
            };
            delete payload.educationDegree;
            delete payload.locationCity;
            delete payload.locationState;
            delete payload.countryCode;

            await axios.post(`${config.API_URL}/api/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setIsEditModalOpen(false);
            fetchProfile();
            toast.success("Profile updated!", { id: loadingToast });
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Failed to update profile", { id: loadingToast });
        }
    };

    const handleSaveSummary = async (newSummary) => {
        const oldSummary = profile.summary;
        setProfile(prev => ({ ...prev, summary: newSummary }));
        setIsSummaryModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { summary: newSummary }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Summary updated");
        } catch (err) {
            console.error("Update summary failed", err);
            setProfile(prev => ({ ...prev, summary: oldSummary }));
            toast.error("Failed to update summary");
        }
    };

    const handleSaveSkills = async (newSkills) => {
        const oldSkills = profile.skills || [];
        const updatedSkills = newSkills;
        setProfile(prev => ({ ...prev, skills: updatedSkills }));
        setIsSkillsModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { skills: updatedSkills }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Skills updated");
        } catch (err) {
            console.error("Update skills failed", err);
            setProfile(prev => ({ ...prev, skills: oldSkills }));
            toast.error("Failed to update skills");
        }
    };

    const handleSaveEducation = async (newEducation) => {
        const oldEducation = [...(profile.education || [])];
        let updatedEducationList = [...oldEducation];
        if (educationEditIndex !== null) {
            updatedEducationList[educationEditIndex] = newEducation;
        } else {
            updatedEducationList.push(newEducation);
        }
        setProfile(prev => ({ ...prev, education: updatedEducationList }));
        setIsEducationModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { education: updatedEducationList }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Education updated");
        } catch (err) {
            console.error("Update education failed", err);
            setProfile(prev => ({ ...prev, education: oldEducation }));
            toast.error("Failed to update education");
        }
    };

    const handleAddEducation = () => {
        setCurrentEducation(null);
        setEducationEditIndex(null);
        setIsEducationEditing(false);
        setIsEducationModalOpen(true);
    };

    const handleEditEducation = (edu, index) => {
        setCurrentEducation(edu);
        setEducationEditIndex(index);
        setIsEducationEditing(true);
        setIsEducationModalOpen(true);
    };

    const handleDeleteEducation = async (indexToDelete) => {
        const eduToDelete = profile.education[indexToDelete];
        openDeleteModal(
            `Are you sure you want to delete ${eduToDelete.degree} from ${eduToDelete.institution}?`,
            async () => {
                closeDeleteModal();
                const oldEducation = [...(profile.education || [])];
                const updatedEducationList = oldEducation.filter((_, i) => i !== indexToDelete);
                setProfile(prev => ({ ...prev, education: updatedEducationList }));
                try {
                    const token = localStorage.getItem("token");
                    await axios.post(`${config.API_URL}/api/profile`, { education: updatedEducationList }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Education deleted");
                } catch (err) {
                    console.error("Delete education failed", err);
                    setProfile(prev => ({ ...prev, education: oldEducation }));
                    toast.error("Failed to delete education");
                }
            }
        );
    };

    const handleSaveLanguage = async (newLanguage) => {
        const oldLanguages = [...(profile.languages || [])];
        let updatedLanguageList = [...oldLanguages];
        if (languageEditIndex !== null) {
            updatedLanguageList[languageEditIndex] = newLanguage;
        } else {
            updatedLanguageList.push(newLanguage);
        }
        setProfile(prev => ({ ...prev, languages: updatedLanguageList }));
        setIsLanguageModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { languages: updatedLanguageList }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Languages updated");
        } catch (err) {
            console.error("Update language failed", err);
            setProfile(prev => ({ ...prev, languages: oldLanguages }));
            toast.error("Failed to update languages");
        }
    };

    const handleAddLanguage = () => {
        setCurrentLanguage(null);
        setLanguageEditIndex(null);
        setIsLanguageEditing(false);
        setIsLanguageModalOpen(true);
    };

    const handleEditLanguage = (lang, index) => {
        setCurrentLanguage(lang);
        setLanguageEditIndex(index);
        setIsLanguageEditing(true);
        setIsLanguageModalOpen(true);
    };

    const handleAddExperience = () => {
        setCurrentExperience(null);
        setExperienceEditIndex(null);
        setIsExperienceEditing(false);
        setIsExpModalOpen(true);
    };

    const handleEditExperience = (exp, index) => {
        setCurrentExperience(exp);
        setExperienceEditIndex(index);
        setIsExperienceEditing(true);
        setIsExpModalOpen(true);
    };

    const handleSaveExperience = async (experienceData) => {
        const oldExperience = [...(profile.workExperience || [])];
        let newExperienceList = [...oldExperience];
        if (experienceEditIndex !== null) {
            newExperienceList[experienceEditIndex] = experienceData;
        } else {
            newExperienceList.push(experienceData);
        }
        setProfile(prev => ({ ...prev, workExperience: newExperienceList }));
        setIsExpModalOpen(false);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { workExperience: newExperienceList }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Experience updated");
        } catch (err) {
            console.error("Update experience failed", err);
            setProfile(prev => ({ ...prev, workExperience: oldExperience }));
            toast.error("Failed to update experience");
        }
    };

    const handleSaveAllExperiences = async (updatedExperiences) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${config.API_URL}/api/profile`, { workExperience: updatedExperiences }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(prev => ({ ...prev, workExperience: updatedExperiences }));
            setIsExpListOpen(false);
            toast.success("All experiences updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update experiences");
            fetchProfile();
        }
    };

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = type === "resume"
            ? ["application/pdf"]
            : ["image/jpeg", "image/png", "image/webp"];

        if (!validTypes.includes(file.type)) {
            toast.error(type === "resume" ? "Invalid file type. Upload PDF only." : "Invalid image format.");
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB for both images and resume
        if (file.size > maxSize) {
            toast.error("File size too large.");
            return;
        }

        const formData = new FormData();
        formData.append(type === "cover" ? "coverImage" : type === "profile" ? "profileImage" : "resume", file);
        const loadingToast = toast.loading("Uploading...");

        try {
            const token = localStorage.getItem("token");
            const endpoint = type === "cover" ? "cover-image" : type === "profile" ? "profile-image" : "resume";
            const res = await axios.post(`${config.API_URL}/api/profile/${endpoint}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
            toast.success("Upload successful!", { id: loadingToast });
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Upload failed. Try again.", { id: loadingToast });
        }
    };

    const handleDeleteCoverImage = async () => {
        if (!profile.coverImage) return;
        openDeleteModal(
            "Are you sure you want to delete your cover photo?",
            async () => {
                closeDeleteModal();
                const oldCover = profile.coverImage;
                const loadingToast = toast.loading("Deleting cover image...");
                setProfile(prev => ({ ...prev, coverImage: null }));
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`${config.API_URL}/api/profile/cover-image`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Cover image deleted", { id: loadingToast });
                } catch (err) {
                    console.error("Delete cover failed", err);
                    setProfile(prev => ({ ...prev, coverImage: oldCover }));
                    toast.error("Failed to delete cover image", { id: loadingToast });
                }
            }
        );
    };

    const handleDeleteProfileImage = async () => {
        if (!profile.profileImage) return;
        openDeleteModal(
            "Are you sure you want to delete your profile picture?",
            async () => {
                closeDeleteModal();
                const oldImage = profile.profileImage;
                const loadingToast = toast.loading("Deleting profile picture...");
                setProfile(prev => ({ ...prev, profileImage: null }));
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`${config.API_URL}/api/profile/profile-image`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Profile picture deleted", { id: loadingToast });
                } catch (err) {
                    console.error("Delete profile picture failed", err);
                    setProfile(prev => ({ ...prev, profileImage: oldImage }));
                    toast.error("Failed to delete profile picture", { id: loadingToast });
                }
            }
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB300]"></div>
        </div>
    );
    if (!profile) return null;

    const { isComplete } = calculateProfileStrength(profile);
    const locationString = profile.location
        ? `${profile.location.city || ''}, ${profile.location.state || ''}, ${profile.location.country || ''}`.replace(/^, |, $/g, '')
        : "Add Location";

    return (
        <div className="bg-white min-h-screen font-sans pb-8 overflow-x-hidden">
            <Toaster position="top-center" />
            <Navbar />

            <ProfileHeader
                profile={profile}
                onEdit={() => setIsEditModalOpen(true)}
                onCoverUpload={(e) => handleUpload(e, "cover")}
                onDeleteCover={handleDeleteCoverImage}
                onProfileImageUpload={(e) => handleUpload(e, "profile")}
                onDeleteProfileImage={handleDeleteProfileImage}
                onShare={handleShareProfile}
            />

            <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative">

                {/* --- Main Content Grid --- */}
                <div className="flex flex-col lg:flex-row gap-[24px] pb-0">

                    {/* LEFT COLUMN (Content) */}
                    <div className="flex-1 lg:max-w-[822px]">

                        {/* User Details Grid (Inline) */}
                        {/* User Details Grid (Inline) */}
                        <div className="mb-8 max-w-[822px]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                                {/* Col 1 */}
                                <div className="space-y-4">
                                    <DetailItem
                                        icon={<i className="ri-briefcase-line text-lg"></i>}
                                        text={profile.workStatus ? (profile.workStatus.charAt(0).toUpperCase() + profile.workStatus.slice(1)) : "Add work status"}
                                    />
                                    <DetailItem
                                        icon={profile.gender === 'female' ? <i className="ri-women-line text-lg"></i> : <i className="ri-men-line text-lg"></i>}
                                        text={profile.gender === 'male' ? 'He/Him' : profile.gender === 'female' ? 'She/Her' : profile.gender || 'Add gender'}
                                    />
                                </div>

                                {/* Col 2 */}
                                <div className="space-y-4">
                                    <DetailItem
                                        icon={<i className="ri-phone-line text-lg"></i>}
                                        text={<span className="font-medium text-black">{profile.phone || "Add phone"}</span>}
                                    />
                                    <DetailItem
                                        icon={<i className="ri-mail-line text-lg"></i>}
                                        text={<span className="font-medium text-black">{profile.email}</span>}
                                        isLink={true}
                                        href={`mailto:${profile.email}`}
                                    />
                                </div>

                                {/* Col 3 */}
                                <div className="space-y-4">
                                    <DetailItem
                                        icon={<i className="ri-graduation-cap-line text-lg"></i>}
                                        text={profile.education?.length > 0 ? profile.education[0].degree : "Add education"}
                                    />
                                    <DetailItem
                                        icon={<i className="ri-map-pin-line text-lg"></i>}
                                        text={locationString}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-black mb-8 max-w-[822px]"></div>

                        <div id="summary-section">
                            <ProfileSummary
                                summary={profile.summary}
                                onEdit={() => {
                                    setIsSummaryEditing(true);
                                    setIsSummaryModalOpen(true);
                                }}
                                onAdd={() => {
                                    setIsSummaryEditing(false);
                                    setIsSummaryModalOpen(true);
                                }}
                            />
                        </div>
                        <div id="experience-section">
                            <ExperienceSection
                                workExperience={profile.workExperience}
                                onAddExperience={handleAddExperience}
                                onManage={() => setIsExpListOpen(true)}
                            />
                        </div>
                        <div id="skills-section">
                            <SkillsSection
                                skills={profile.skills}
                                onEdit={() => {
                                    setIsSkillsAddMode(false);
                                    setIsSkillsModalOpen(true);
                                }}
                                onAdd={() => {
                                    setIsSkillsAddMode(true);
                                    setIsSkillsModalOpen(true);
                                }}
                                onDelete={handleDeleteDirectSkill}
                            />
                        </div>
                        <div id="education-section">
                            <EducationSection
                                education={profile.education}
                                onAdd={handleAddEducation}
                                onManage={() => setIsEduListOpen(true)}
                            />
                        </div>
                        <div id="language-section">
                            <LanguageSection
                                languages={profile.languages}
                                onAdd={handleAddLanguage}
                                onManage={() => setIsLangListOpen(true)}
                            />
                        </div>
                        <ResumeSection
                            resumeUrl={profile.resumeUrl}
                            onAdd={() => {
                                setIsResumeEditing(false);
                                setIsResumeModalOpen(true);
                            }}
                            onEdit={() => {
                                setIsResumeEditing(true);
                                setIsResumeModalOpen(true);
                            }}
                            onDelete={handleDeleteResume}
                            isGlobalComplete={isComplete}
                        />
                    </div>

                    {/* RIGHT COLUMN (Sidebar) */}
                    <ProfileSidebar profile={profile} onAction={handleAction} />
                </div>

                {/* --- Latest Job Listing --- */}
                <JobListing limit={3} />
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
                isEditing={isSummaryEditing}
            />

            {/* --- Bulk Edit Modal for Experience --- */}
            <BulkEditExperienceModal
                isOpen={isExpListOpen}
                onClose={() => setIsExpListOpen(false)}
                initialExperiences={profile.workExperience}
                onSave={handleSaveAllExperiences}
            />

            <SectionListModal
                isOpen={isEduListOpen}
                onClose={() => setIsEduListOpen(false)}
                title="Education"
                onAdd={handleAddEducation}
            >
                {profile.education?.map((edu, idx) => (
                    <EducationCard
                        key={idx}
                        education={edu}
                        showEdit={true}
                        onEdit={() => handleEditEducation(edu, idx)}
                        onDelete={() => handleDeleteEducation(idx)}
                    />
                ))}
            </SectionListModal>

            <SectionListModal
                isOpen={isLangListOpen}
                onClose={() => setIsLangListOpen(false)}
                title="Language"
                onAdd={handleAddLanguage}
            >
                {profile.languages?.map((lang, idx) => (
                    <LanguageRow
                        key={idx}
                        language={{ ...lang, language: lang.name }} // Map name to language prop if needed, or update Card
                        showEdit={true}
                        onEdit={() => handleEditLanguage(lang, idx)}
                    />
                ))}
            </SectionListModal>



            <EditExperienceModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
                experienceData={currentExperience}
                onSave={handleSaveExperience}
                isEditing={isExperienceEditing}
            />

            <EditSkillsModal
                isOpen={isSkillsModalOpen}
                onClose={() => setIsSkillsModalOpen(false)}
                currentSkills={profile.skills || []}
                onSave={handleSaveSkills}
            />

            <EditEducationModal
                isOpen={isEducationModalOpen}
                onClose={() => setIsEducationModalOpen(false)}
                educationData={currentEducation}
                onSave={handleSaveEducation}
                isEditing={isEducationEditing}
            />

            <EditLanguageModal
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
                languageData={currentLanguage}
                onSave={handleSaveLanguage}
                isEditing={isLanguageEditing}
            />

            <EditResumeModal
                isOpen={isResumeModalOpen}
                onClose={() => setIsResumeModalOpen(false)}
                onSave={handleSaveResume}
                currentResumeUrl={profile.resume}
                isEditing={isResumeEditing}
            />

            <EditSocialLinksModal
                isOpen={isSocialLinksModalOpen}
                onClose={() => setIsSocialLinksModalOpen(false)}
                socialLinks={profile.socialLinks}
                onSave={async (newLinks) => {
                    const loadingToast = toast.loading("Updating social links...");
                    try {
                        const token = localStorage.getItem("token");
                        await axios.post(`${config.API_URL}/api/profile`, { socialLinks: newLinks }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setProfile(prev => ({ ...prev, socialLinks: newLinks }));
                        setIsSocialLinksModalOpen(false);
                        toast.success("Social links updated!", { id: loadingToast });
                    } catch (err) {
                        console.error("Update social links failed", err);
                        toast.error("Failed to update social links", { id: loadingToast });
                    }
                }}
            />

            <EditAdditionalDetailsModal
                isOpen={isAdditionalDetailsModalOpen}
                onClose={() => setIsAdditionalDetailsModalOpen(false)}
                details={{
                    alternatePhone: profile.alternatePhone,
                    drivingLicenses: profile.drivingLicenses,
                    dateOfBirth: profile.dateOfBirth,
                    careerBreak: profile.careerBreak,
                    preferredWorkMode: profile.preferredWorkMode,
                    maritalStatus: profile.maritalStatus
                }}
                onSave={async (formData) => {
                    const loadingToast = toast.loading("Updating additional details...");
                    try {
                        const token = localStorage.getItem("token");

                        // Transform UI data to Backend Schema
                        // Driving License: UI is boolean, Backend seems to expect array or checking length? 
                        // Let's assume backend accepts 'drivingLicenses' array. 
                        // If true -> ["Yes"] (dummy value) or ["License"]? 
                        // ProfileSidebar checks `length > 0`. Let's send ["Available"] if true, [] if false.
                        const drivingLicenses = formData.drivingLicense ? ["Available"] : [];

                        const payload = {
                            alternatePhone: formData.fullAltPhone,
                            drivingLicenses: drivingLicenses,
                            dateOfBirth: formData.dob,
                            careerBreak: formData.careerBreak,
                            preferredWorkMode: formData.preferredWorkMode,
                            maritalStatus: formData.maritalStatus
                        };

                        await axios.post(`${config.API_URL}/api/profile`, payload, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        setProfile(prev => ({
                            ...prev,
                            ...payload
                        }));
                        setIsAdditionalDetailsModalOpen(false);
                        toast.success("Details updated!", { id: loadingToast });
                    } catch (err) {
                        console.error("Update details failed", err);
                        toast.error("Failed to update details", { id: loadingToast });
                    }
                }}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteResumeModal}
                onClose={() => setShowDeleteResumeModal(false)}
                onConfirm={confirmDeleteResume}
                title="Are you sure you want to delete the resume?"
            />

            <DeleteConfirmationModal
                isOpen={deleteModal.open}
                onClose={closeDeleteModal}
                onConfirm={deleteModal.onConfirm}
                title={deleteModal.title}
            />
        </div>
    );
};

export default Profile;
