import React, { useState, useEffect, useRef } from "react";
import { Country } from "country-state-city";

const EditAdditionalDetailsModal = ({ isOpen, onClose, details, onSave }) => {
    const [formData, setFormData] = useState({
        altPhoneCode: "+91",
        altPhone: "",
        drivingLicense: false, // stored as boolean or array in backend? ProfileSidebar says "Yes" if array length > 0. Let's assume we map UI boolean to backend logic.
        dob: "",
        careerBreak: false, // boolean
        preferredWorkMode: "",
        maritalStatus: ""
    });

    // Country Code State
    const [countries, setCountries] = useState(Country.getAllCountries());
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (details) {
            // Parse existing data
            // Note: detailed mapping depends on how backend stores it. 
            // ProfileSidebar shows: drivingLicenses?.length ? "Yes" : "No"
            // We need to handle this conversion on Save.

            setFormData({
                altPhoneCode: details.altPhoneCode || "+91", // This might need to be extracted from the phone string if not stored separately
                altPhone: details.alternatePhone ? details.alternatePhone.replace(/^\+\d+/, '') : (details.alternatePhone || ""), // specific logic needed if phone is stored with code
                drivingLicense: details.drivingLicenses && details.drivingLicenses.length > 0,
                dob: details.dateOfBirth || "",
                careerBreak: details.careerBreak || false,
                preferredWorkMode: details.preferredWorkMode || "",
                maritalStatus: details.maritalStatus || ""
            });

            // Attempt to extract phone code if it exists in the string
            if (details.alternatePhone && details.alternatePhone.includes('+')) {
                // Simple extraction logic, might be improved
                const match = details.alternatePhone.match(/^(\+\d+)(.*)$/);
                if (match) {
                    setFormData(prev => ({ ...prev, altPhoneCode: match[1], altPhone: match[2] }));
                }
            }
        }
    }, [details, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // Prepare data for save
        // We need to map "drivingLicense" boolean back to what the backend expects (likely an array or boolean depending on schema, let's look at schema logic later, but sidebar implies array)
        // For now pass the form data, and let Profile.jsx handle the transformation if needed, OR transform here.
        // Let's pass the raw form data and a "computed" object.

        const submissionData = {
            ...formData,
            fullAltPhone: `${formData.altPhoneCode}${formData.altPhone}`
        };
        onSave(submissionData);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.phonecode.includes(countrySearch)
    );

    if (!isOpen) return null;

    // Helper for Radio Button
    const RadioGroup = ({ label, name, options, value, onChange }) => (
        <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-3">{label}</label>
            <div className="flex flex-wrap gap-8">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.value ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                            {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                        </div>
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={value === opt.value}
                            onChange={onChange}
                            className="hidden"
                        />
                        <span className="text-sm text-black">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    // Helper for Boolean Radio
    const BooleanRadioGroup = ({ label, name, value, onChange }) => (
        <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-3">{label}</label>
            <div className="flex gap-16">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === true ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                        {value === true && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                    </div>
                    <input
                        type="radio"
                        name={name}
                        checked={value === true}
                        onChange={() => setFormData(prev => ({ ...prev, [name]: true }))}
                        className="hidden"
                    />
                    <span className="text-sm text-black">Yes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === false ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                        {value === false && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                    </div>
                    <input
                        type="radio"
                        name={name}
                        checked={value === false}
                        onChange={() => setFormData(prev => ({ ...prev, [name]: false }))}
                        className="hidden"
                    />
                    <span className="text-sm text-black">No</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn p-4">
            <div className="bg-white w-[700px] rounded-[24px] p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">

                <h2 className="text-xl font-bold text-black mb-8">Additional Details</h2>

                <div className="space-y-2">

                    {/* Alternate Phone */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-black mb-2">Alternate phone number</label>
                        <div className="flex items-center gap-3 border-b border-dashed border-gray-300 pb-2">
                            {/* Country Code Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="flex items-center gap-2 cursor-pointer bg-white border border-gray-200 rounded px-2 py-1 shadow-sm min-w-[70px] justify-between"
                                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                >
                                    <span className="text-sm font-medium">{formData.altPhoneCode}</span>
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transform transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`}>
                                        <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {showCountryDropdown && (
                                    <div className="absolute top-full left-0 mt-1 w-60 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10">
                                        <input
                                            autoFocus
                                            className="w-full px-3 py-2 border-b text-sm outline-none"
                                            placeholder="Search..."
                                            value={countrySearch}
                                            onChange={(e) => setCountrySearch(e.target.value)}
                                        />
                                        {filteredCountries.map((c, idx) => (
                                            <div
                                                key={`${c.isoCode}-${idx}`}
                                                className="px-4 py-2 hover:bg-yellow-50 cursor-pointer text-sm flex justify-between"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, altPhoneCode: `+${c.phonecode}` }));
                                                    setShowCountryDropdown(false);
                                                }}
                                            >
                                                <span>{c.name}</span>
                                                <span className="text-gray-400">+{c.phonecode}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <input
                                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400 text-gray-700"
                                placeholder="Enter phone number"
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Driving License */}
                    <BooleanRadioGroup
                        label="Do you have driving license"
                        name="drivingLicense"
                        value={formData.drivingLicense}
                    />

                    {/* Date of Birth */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-black mb-2">Date of Birth</label>
                        <div className="border-b border-dashed border-gray-300 pb-2 flex justify-between items-center">
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="bg-transparent text-sm outline-none text-gray-500 w-full uppercase"
                                placeholder="DD/MM/YYYY"
                            />
                        </div>
                    </div>

                    {/* Career Break */}
                    <BooleanRadioGroup
                        label="Do you have career break"
                        name="careerBreak"
                        value={formData.careerBreak}
                    />

                    {/* Preferred Work Mode */}
                    <RadioGroup
                        label="Preferred Work Mode"
                        name="preferredWorkMode"
                        value={formData.preferredWorkMode}
                        onChange={handleChange}
                        options={[
                            { label: "On-site", value: "on-site" },
                            { label: "Remote", value: "remote" },
                            { label: "Work from home", value: "wfh" },
                            { label: "Hybrid", value: "hybrid" }
                        ]}
                    />

                    {/* Marital Status */}
                    <RadioGroup
                        label="Marital Status"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        options={[
                            { label: "Married", value: "married" },
                            { label: "Single", value: "single" }
                        ]}
                    />

                </div>

                {/* Footer Buttons */}
                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={handleSubmit}
                        className="px-12 py-2.5 rounded-lg bg-gradient-to-r from-[#FFD572] to-[#FEBD38] text-black font-bold text-sm shadow-sm hover:shadow-md transition transform hover:scale-105"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="px-12 py-2.5 rounded-lg border border-gray-300 text-black font-medium text-sm hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAdditionalDetailsModal;
