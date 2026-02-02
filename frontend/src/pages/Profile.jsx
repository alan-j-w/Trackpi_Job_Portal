import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const res = await axios.get(`${API_URL}/api/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setProfile(res.data.profile);
            } catch (err) {
                console.error(err.response?.data || err.message);

                if (err.response?.status === 404) {
                    navigate("/create-profile");
                } else {
                    setError("Failed to load profile");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) return <p className="text-center mt-10">Loading profile...</p>;

    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white shadow rounded-xl p-8">

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{profile.fullName}</h1>
                    <button
                        onClick={() => navigate("/create-profile")}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Edit Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <ProfileField label="Email" value={profile.user?.email} />
                    <ProfileField label="Phone" value={profile.phone} />
                    <ProfileField label="Location" value={profile.location} />
                    <ProfileField label="Gender" value={profile.gender} />

                    <ProfileField label="Job Title" value={profile.jobTitle} />
                    <ProfileField label="Education" value={profile.education} />
                    <ProfileField label="Experience" value={profile.experience} />
                    <ProfileField label="Work Mode" value={profile.workMode} />

                    <ProfileField label="Expected Salary" value={profile.expectedSalary} />

                    <ProfileField
                        label="Skills"
                        value={profile.skills?.length ? profile.skills.join(", ") : ""}
                    />

                </div>

            </div>
        </div>
    );
};

const ProfileField = ({ label, value }) => {
    return (
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-lg font-medium">
                {value || "—"}
            </p>
        </div>
    );
};

export default Profile;
