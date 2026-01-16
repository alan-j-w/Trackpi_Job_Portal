import React from 'react';
import { useResume } from './ResumeContext';

const PersonalInfo = () => {
    const { resumeData, updatePersonalInfo } = useResume();
    const { personalInfo } = resumeData;

    const handleChange = (e) => {
        const { name, value } = e.target;
        updatePersonalInfo({ [name]: value });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800">Personal Info</h3>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    value={personalInfo.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={personalInfo.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={personalInfo.phone}
                        onChange={handleChange}
                        placeholder="+123-456-7890"
                        className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                <input
                    type="text"
                    name="address"
                    value={personalInfo.address}
                    onChange={handleChange}
                    placeholder="New York, NY"
                    className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Professional Role</label>
                <input
                    type="text"
                    name="role"
                    value={personalInfo.role}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Summary</label>
                <textarea
                    name="summary"
                    value={personalInfo.summary}
                    onChange={handleChange}
                    placeholder="Brief summary of your professional background..."
                    rows="4"
                    className="w-full border-b-2 border-gray-300 focus:border-[#FFB300] outline-none py-2 bg-transparent transition resize-none"
                />
            </div>
        </div>
    );
};

export default PersonalInfo;
