import React from "react";

const Step3Experience = ({ formData, setFormData, handleChange, onBack, onSubmit }) => {

    const handleLicenseChange = (type) => {
        setFormData(prev => {
            const licenses = prev.drivingLicenses || [];
            if (licenses.includes(type)) {
                return { ...prev, drivingLicenses: licenses.filter(l => l !== type) };
            } else {
                return { ...prev, drivingLicenses: [...licenses, type] };
            }
        });
    };

    return (
        <div className="h-screen flex flex-col animate-fadeIn">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-30 bg-white pb-6 space-y-8">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        "Need to get recognized by <span className="text-[#FBBF24]">HR quickly?"</span>
                    </h2>
                    <p className="text-gray-600 text-lg">Then add the missing details</p>
                </div>

                {/* Profile Strength Indicator */}
                <div className="flex justify-center mb-12">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="#374151" strokeWidth="12" fill="none" className="opacity-20" />
                            <circle cx="96" cy="96" r="88" stroke="#374151" strokeWidth="12" fill="none" strokeDasharray="552" strokeDashoffset="100" className="opacity-100" /> {/* Grey part */}
                            <circle cx="96" cy="96" r="88" stroke="#FFB300" strokeWidth="12" fill="none" strokeDasharray="552" strokeDashoffset="90" strokeLinecap="round" className="drop-shadow-lg" /> {/* Yellow part */}
                        </svg>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-1">Profile Strength</p>
                            <p className="text-5xl font-extrabold text-[#FFB300]">83%</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Scrollable Content Section */}
            <div className="flex-1 overflow-y-auto px-1">
                {/* Form Sections */}
                <div className="space-y-6">

                    {/* Expected Salary */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-2">Expected Salary</label>
                        <input
                            name="expectedSalary"
                            className="w-full bg-transparent border-b border-dashed border-[#9CA3AF] py-3 text-sm focus:border-[#FFB300] outline-none text-gray-800 placeholder-gray-400 font-medium"
                            placeholder="Eg: 20,000₹"
                            value={formData.expectedSalary}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Driving License */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Do You Have Driving License</label>
                        <div className="flex gap-8">
                            <div onClick={() => handleLicenseChange('two_wheeler')} className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.drivingLicenses.includes('two_wheeler') ? 'border-[#FFB300] bg-[#FFB300]' : 'border-[#FFB300]'}`}>
                                    {/* Allow checkmark or fill? Design implies Checkbox behavior but look like radio/circle. Using consistent fill logic */}
                                </div>
                                <span className="text-sm font-medium text-black">Two wheeler</span>
                            </div>
                            <div onClick={() => handleLicenseChange('four_wheeler')} className="flex items-center gap-2 cursor-pointer select-none">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.drivingLicenses.includes('four_wheeler') ? 'border-[#FFB300] bg-[#FFB300]' : 'border-[#FFB300]'}`}>
                                </div>
                                <span className="text-sm font-medium text-black">Four Wheeler</span>
                            </div>
                        </div>
                    </div>

                    {/* 2 Wheeler */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pr-10">
                            <label className="block text-sm font-bold text-black">Do You Have 2 Wheeler</label>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTwoWheeler === true ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasTwoWheeler === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasTwoWheeler" checked={formData.hasTwoWheeler === true} onChange={() => setFormData({ ...formData, hasTwoWheeler: true })} className="hidden" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasTwoWheeler === false ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasTwoWheeler === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasTwoWheeler" checked={formData.hasTwoWheeler === false} onChange={() => setFormData({ ...formData, hasTwoWheeler: false })} className="hidden" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Laptop */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pr-10">
                            <label className="block text-sm font-bold text-black">Do You Have Laptop</label>
                            <div className="flex items-center gap-8">
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasLaptop === true ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasLaptop === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasLaptop" checked={formData.hasLaptop === true} onChange={() => setFormData({ ...formData, hasLaptop: true })} className="hidden" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer font-medium text-sm">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.hasLaptop === false ? 'border-[#FFB300]' : 'border-gray-800'}`}>
                                        {formData.hasLaptop === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>}
                                    </div>
                                    <input type="radio" name="hasLaptop" checked={formData.hasLaptop === false} onChange={() => setFormData({ ...formData, hasLaptop: false })} className="hidden" />
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-[#FFF9E5] rounded-xl p-6 relative">
                        <div className="absolute top-4 right-4 bg-[#FFB300] rounded-full p-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <label className="block text-sm font-bold text-black mb-4">Social Links</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['linkedin', 'behance', 'facebook', 'twitter'].map((platform) => (
                                <div key={platform} className="flex items-center bg-white rounded-full px-4 py-2 border border-transparent focus-within:border-[#FFB300] shadow-sm">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    <input
                                        name={`socialLinks.${platform}`}
                                        className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 capitalize"
                                        placeholder={platform}
                                        value={formData.socialLinks?.[platform] || ""}
                                        onChange={handleChange}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-8 pb-10">
                    <button onClick={onBack} className="bg-white border text-black font-semibold py-3 px-10 rounded-xl shadow-sm hover:bg-gray-50 transition min-w-[120px]">
                        Back
                    </button>
                    <button onClick={onSubmit} className="bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-3 px-10 rounded-xl shadow-lg transition transform hover:scale-105 min-w-[160px]">
                        Create profile
                    </button>
                </div>

                <p className="text-center text-[#FFB300] text-xs font-medium -mt-6 pb-6">Page 3 of 3</p>
            </div>
        </div>
    );
};

export default Step3Experience;
