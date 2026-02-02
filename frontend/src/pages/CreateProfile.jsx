import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const CreateProfile = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        location: "",
        gender: "",
        jobTitle: "",
        education: "",
        experience: "",
        skills: "",
        expectedSalary: "",
        workMode: "",
        hasDrivingLicense: false,
        hasTwoWheeler: false,
        hasLaptop: false,
        socialLinks: {
            linkedin: "",
            github: "",
            portfolio: "",
            twitter: ""
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith("socialLinks.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                socialLinks: {
                    ...formData.socialLinks,
                    [key]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    const nextStep = () => setStep((s) => s + 1);
    const prevStep = () => setStep((s) => s - 1);

    const submitProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const payload = {
                ...formData,
                skills: formData.skills
                    ? formData.skills.split(",").map(s => s.trim())
                    : []
            };

            await axios.post(`${API_URL}/api/profile`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            navigate("/profile");
        } catch (err) {
            console.error(err);
            alert("Profile creation failed");
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">

                <h1 className="text-2xl font-bold mb-6">
                    Create Profile (Step {step} of 3)
                </h1>

                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <div className="space-y-4">
                        <input className="border p-3 w-full rounded" name="fullName" placeholder="Full Name" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="phone" placeholder="Phone" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="location" placeholder="Location" onChange={handleChange} />

                        <select className="border p-3 w-full rounded" name="gender" onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        <div className="flex justify-end">
                            <button onClick={nextStep} className="bg-yellow-400 px-6 py-2 rounded font-semibold">
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <div className="space-y-4">
                        <input className="border p-3 w-full rounded" name="jobTitle" placeholder="Job Title" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="education" placeholder="Education" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="experience" placeholder="Experience" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="skills" placeholder="Skills (comma separated)" onChange={handleChange} />

                        <div className="flex justify-between">
                            <button onClick={prevStep} className="border px-6 py-2 rounded">← Back</button>
                            <button onClick={nextStep} className="bg-yellow-400 px-6 py-2 rounded font-semibold">
                                Next →
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 3 ================= */}
                {step === 3 && (
                    <div className="space-y-4">
                        <input className="border p-3 w-full rounded" name="expectedSalary" placeholder="Expected Salary" onChange={handleChange} />

                        <select className="border p-3 w-full rounded" name="workMode" onChange={handleChange}>
                            <option value="">Select Work Mode</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                        </select>

                        <div className="space-y-2">
                            <label className="block"><input type="checkbox" name="hasDrivingLicense" onChange={handleChange} /> Has Driving License</label>
                            <label className="block"><input type="checkbox" name="hasTwoWheeler" onChange={handleChange} /> Has Two Wheeler</label>
                            <label className="block"><input type="checkbox" name="hasLaptop" onChange={handleChange} /> Has Laptop</label>
                        </div>

                        <input className="border p-3 w-full rounded" name="socialLinks.linkedin" placeholder="LinkedIn" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="socialLinks.github" placeholder="GitHub" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="socialLinks.portfolio" placeholder="Portfolio" onChange={handleChange} />
                        <input className="border p-3 w-full rounded" name="socialLinks.twitter" placeholder="Twitter" onChange={handleChange} />

                        <div className="flex justify-between">
                            <button onClick={prevStep} className="border px-6 py-2 rounded">← Back</button>
                            <button onClick={submitProfile} className="bg-yellow-500 px-6 py-2 rounded font-bold">
                                Create Profile
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CreateProfile;
