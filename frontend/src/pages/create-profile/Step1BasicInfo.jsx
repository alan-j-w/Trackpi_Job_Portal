import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import fresherIcon from "../../assets/fresher_icon.png";
import experiencedIcon from "../../assets/experienced_icon.png";
import SearchableDropdown from "./components/SearchableDropdown";
import { fetchLocationDetails } from "../../utils/locationUtils";
import config from "../../config";
import OtpVerificationModal from "../../components/OtpVerificationModal";

const Step1BasicInfo = ({
    formData,
    setFormData,
    handleChange,
    primaryPhoneCode,
    setPrimaryPhoneCode,
    altPhoneCode,
    setAltPhoneCode,
    onNext
}) => {
    // Location State
    const [countries, setCountries] = useState(Country.getAllCountries());
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false); // Modal state

    // Country Code UI State
    const [showPrimaryCountryDropdown, setShowPrimaryCountryDropdown] = useState(false);
    const [showAltCountryDropdown, setShowAltCountryDropdown] = useState(false);
    const [countryCodeSearch, setCountryCodeSearch] = useState("");

    const primaryDropdownRef = useRef(null);
    const altDropdownRef = useRef(null);

    // Work Experience State
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
    const [experienceForm, setExperienceForm] = useState({
        jobTitle: "",
        employmentType: "",
        company: "",
        currentlyWorking: false,
        startDate: "",
        endDate: "",
        location: "",
        description: ""
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (primaryDropdownRef.current && !primaryDropdownRef.current.contains(event.target)) {
                setShowPrimaryCountryDropdown(false);
            }
            if (altDropdownRef.current && !altDropdownRef.current.contains(event.target)) {
                setShowAltCountryDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const countryOptions = Country.getAllCountries().map(c => ({
        code: `+${c.phonecode}`,
        flag: c.flag,
        name: c.name,
        iso: c.isoCode
    }));

    const filteredCountryCodes = countryOptions.filter(c =>
        c.name.toLowerCase().includes(countryCodeSearch.toLowerCase()) ||
        c.code.includes(countryCodeSearch)
    );

    // Location Handlers
    const handleCountryChange = (countryCode) => {
        setFormData(prev => ({ ...prev, country: countryCode, state: "", city: "" }));
        const stateList = State.getStatesOfCountry(countryCode);
        setStates(stateList);
        setCities([]);
    };

    const handleStateChange = (stateCode) => {
        setFormData(prev => ({ ...prev, state: stateCode, city: "" }));
        const cityList = City.getCitiesOfState(formData.country, stateCode);
        setCities(cityList);
    };

    const handleCityChange = (cityName) => {
        setFormData(prev => ({ ...prev, city: cityName }));
    };

    // Auto-fill location by Pincode
    const handlePincodeChange = async (e) => {
        const value = e.target.value;
        const newFormData = { ...formData, pincode: value };

        // Update form data first to show typing
        setFormData(newFormData);

        // If 6 digits, fetch location
        if (value.length === 6) {
            try {
                const details = await fetchLocationDetails(value);
                if (details) {
                    const countryCode = "IN"; // API is India only

                    // Logic from handleCountryChange but without conflicting state updates
                    const stateList = State.getStatesOfCountry(countryCode);
                    const matchedState = stateList.find(s => s.name.toLowerCase() === details.state.toLowerCase());

                    if (matchedState) {
                        setStates(stateList);
                        const cityList = City.getCitiesOfState(countryCode, matchedState.isoCode);
                        setCities(cityList);

                        const matchedCity = cityList.find(c => c.name.toLowerCase() === details.city.toLowerCase());

                        setFormData(prev => ({
                            ...prev,
                            country: countryCode,
                            state: matchedState.isoCode,
                            city: matchedCity ? matchedCity.name : details.city,
                            pincode: value // ensure pincode stays
                        }));
                    } else {
                        // Fallback if state match fails
                        setFormData(prev => ({ ...prev, country: countryCode }));
                        setStates(stateList);
                    }
                }
            } catch (err) {
                console.error("Pincode fetch failed", err);
            }
        }
    };



    // OTP Functions
    const sendOtp = async () => {
        try {
            await axios.post(`${config.API_URL}/api/auth/send-otp`, {
                phone: `${primaryPhoneCode}${formData.phone}`
            });
            setOtpSent(true);
            setShowOtpModal(true); // Open Modal
            // alert("OTP sent to your phone (Check server console for demo)"); // Optional feedback
        } catch (err) {
            console.error("Send OTP Failed", err);
            alert("Failed to send OTP");
        }
    };

    const verifyOtp = async (enteredOtp) => {
        try {
            const res = await axios.post(`${config.API_URL}/api/auth/verify-otp`, {
                phone: `${primaryPhoneCode}${formData.phone}`,
                otp: enteredOtp
            });

            if (res.data.success) {
                setPhoneVerified(true);
                setShowOtpModal(false); // Close Modal
                alert("Phone verified successfully!");
            } else {
                alert("Invalid OTP");
            }
        } catch (err) {
            console.error("Verify OTP Failed", err);
            alert("OTP verification failed");
        }
    };

    // Validation
    // Validation (Logic Only - Minimal)
    const canProceed = () => {
        // Minimal validation as requested
        return (
            formData.fullName.trim() !== "" &&
            formData.phone.trim() !== "" &&
            formData.email.trim() !== ""
            // Add other critical fields if strictly required, but usually name/contact is bare minimum to start
        );
    };

    const saveStep1AndContinue = async () => {
        // Validation Check with Feedback
        if (!canProceed()) {
            // Logic only, minimal feedback or just block
            alert("Please fill required fields (Name, Phone, Email) to proceed.");
            return;
        }

        // Proceed to next step without saving to DB
        onNext();
    };

    return (
        <>
            <div className="text-center mb-24 max-w-[580px] mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Launch <span className="text-[#FFB300]">Career</span>
                </h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    Complete the registration form below to showcase your skills, get discovered by top employers, and open the door to life-changing job opportunities designed just for you.
                </p>
            </div>

            <div className="space-y-6">

                {/* Name */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.fullName.trim() ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Name <span className="text-[#FF0000]">*</span></label>
                    <input
                        className="w-full bg-transparent border-b border-dashed border-[#827E7E]/50 py-2 text-sm text-black placeholder-[#827E7E] outline-none focus:border-[#FFB300]"
                        name="fullName"
                        placeholder="Enter your name"
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                </div>

                {/* Primary Phone Number & Verify */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${phoneVerified ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Primary phone number <span className="text-[#FF0000]">*</span></label>
                    <p className="text-[10px] text-[#827E7E] mb-2">WhatsApp active number</p>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-end justify-between gap-4">
                            <div className="flex-1 flex items-center gap-2 border-b border-dashed border-[#827E7E]/50 pb-2 relative">
                                {/* Country Code Dropdown */}
                                <div className="relative" ref={primaryDropdownRef}>
                                    <div
                                        className="bg-white rounded px-2 py-1 flex items-center gap-1 shadow-sm h-8 cursor-pointer min-w-[60px] justify-between"
                                        onClick={() => setShowPrimaryCountryDropdown(!showPrimaryCountryDropdown)}
                                    >
                                        <span className="text-xs font-semibold whitespace-nowrap">{primaryPhoneCode}</span>
                                        <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-black transform transition-transform duration-200" style={{ transform: showPrimaryCountryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            <path d="M6 9L1 4H11L6 9Z" />
                                        </svg>
                                    </div>

                                    {showPrimaryCountryDropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-fadeIn">
                                            <div className="p-2 sticky top-0 bg-white border-b z-10">
                                                <input
                                                    autoFocus
                                                    className="w-full bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FFB300]"
                                                    placeholder="Search country..."
                                                    value={countryCodeSearch}
                                                    onChange={(e) => setCountryCodeSearch(e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            {filteredCountryCodes.map((c, idx) => (
                                                <div
                                                    key={`${c.iso}-${idx}`}
                                                    className="px-4 py-2 hover:bg-[#FFF9E5] cursor-pointer flex items-center gap-3 transition-colors"
                                                    onClick={() => {
                                                        setPrimaryPhoneCode(c.code);
                                                        setShowPrimaryCountryDropdown(false);
                                                        setCountryCodeSearch("");
                                                    }}
                                                >
                                                    <span className="text-lg">{c.flag}</span>
                                                    <span className="text-sm font-medium text-gray-700">{c.name}</span>
                                                    <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <input
                                    className="w-full bg-transparent text-sm text-black placeholder-[#827E7E] outline-none"
                                    name="phone"
                                    placeholder="Enter your number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    readOnly={phoneVerified} // Lock if verified
                                />
                            </div>

                            {!phoneVerified ? (
                                <button
                                    type="button"
                                    onClick={sendOtp}
                                    disabled={formData.phone.length < 10}
                                    className={`bg-white border text-sm px-6 py-1.5 rounded-xl border-[#FFB300] font-medium transition-all ${formData.phone.length < 10
                                        ? 'opacity-50 cursor-not-allowed grayscale'
                                        : 'hover:bg-[#FFF9E5] opacity-100'
                                        }`}
                                >
                                    {otpSent ? "Resend OTP" : "Verify"}
                                </button>
                            ) : (
                                <span className="text-green-600 font-bold text-sm">Verified ✓</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* OTP Modal */}
                <OtpVerificationModal
                    isOpen={showOtpModal}
                    onClose={() => setShowOtpModal(false)}
                    phone={`${primaryPhoneCode}${formData.phone}`}
                    onVerify={verifyOtp}
                    onResend={sendOtp}
                />

                {/* Alternate Phone Number */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.altPhone.length >= 10 ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-2">Alternate Phone Number</label>
                    <div className="flex items-center gap-2 border-b border-dashed border-[#827E7E]/50 pb-2 relative">
                        {/* Alt Country Code Dropdown */}
                        <div className="relative" ref={altDropdownRef}>
                            <div
                                className="bg-white rounded px-2 py-1 flex items-center gap-1 shadow-sm h-8 cursor-pointer min-w-[60px] justify-between"
                                onClick={() => setShowAltCountryDropdown(!showAltCountryDropdown)}
                            >
                                <span className="text-xs font-semibold whitespace-nowrap">{altPhoneCode}</span>
                                <svg width="8" height="8" viewBox="0 0 12 12" fill="currentColor" className="text-black transform transition-transform duration-200" style={{ transform: showAltCountryDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <path d="M6 9L1 4H11L6 9Z" />
                                </svg>
                            </div>

                            {showAltCountryDropdown && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 animate-fadeIn">
                                    <div className="p-2 sticky top-0 bg-white border-b z-10">
                                        <input
                                            autoFocus
                                            className="w-full bg-gray-50 px-3 py-2 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FFB300]"
                                            placeholder="Search country..."
                                            value={countryCodeSearch}
                                            onChange={(e) => setCountryCodeSearch(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    {filteredCountryCodes.map((c, idx) => (
                                        <div
                                            key={`${c.iso}-${idx}`}
                                            className="px-4 py-2 hover:bg-[#FFF9E5] cursor-pointer flex items-center gap-3 transition-colors"
                                            onClick={() => {
                                                setAltPhoneCode(c.code);
                                                setShowAltCountryDropdown(false);
                                                setCountryCodeSearch("");
                                            }}
                                        >
                                            <span className="text-lg">{c.flag}</span>
                                            <span className="text-sm font-medium text-gray-700">{c.name}</span>
                                            <span className="text-xs text-gray-400 ml-auto">{c.code}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <input
                            className="w-full bg-transparent text-sm text-black placeholder-[#827E7E] outline-none"
                            name="altPhone"
                            placeholder="Enter your number"
                            value={formData.altPhone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Email ID */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.email.includes('@') ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Email ID <span className="text-[#FF0000]">*</span></label>
                    <input
                        className="w-full bg-transparent border-b border-dashed border-[#827E7E]/50 py-2 text-sm text-black placeholder-[#827E7E] outline-none focus:border-[#FFB300]"
                        name="email"
                        placeholder="www.you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Location */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${(formData.pincode && formData.country && formData.state && formData.city) ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-4">Location <span className="text-[#FF0000]">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            className="bg-white px-4 py-3 rounded-xl shadow-sm text-sm outline-none focus:ring-1 focus:ring-[#FFB300] placeholder-[#827E7E]"
                            name="pincode"
                            placeholder="Pin Code"
                            value={formData.pincode}
                            onChange={handlePincodeChange}
                        />
                        <SearchableDropdown
                            options={countries}
                            value={formData.country}
                            onChange={handleCountryChange}
                            placeholder="Select Country"
                            valueKey="isoCode"
                            labelKey="name"
                        />

                        <SearchableDropdown
                            options={states}
                            value={formData.state}
                            onChange={handleStateChange}
                            placeholder="Select State"
                            disabled={!states.length}
                            valueKey="isoCode"
                            labelKey="name"
                        />

                        <SearchableDropdown
                            options={cities}
                            value={formData.city}
                            onChange={handleCityChange}
                            placeholder="Select City"
                            disabled={!cities.length}
                            valueKey="name"
                            labelKey="name"
                        />
                    </div>
                </div>

                {/* Date of Birth */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.dob ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-1">Date of Birth <span className="text-[#FF0000]">*</span></label>
                    <div className="relative border-b border-dashed border-[#827E7E]/50 pb-2">
                        <input
                            type="date"
                            className="w-full bg-transparent text-sm outline-none text-[#827E7E] uppercase"
                            name="dob"
                            placeholder="dd-mm-yyyy"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Gender */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.gender ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-3">Gender <span className="text-[#FF0000]">*</span></label>
                    <div className="flex gap-16">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'male' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.gender === 'male' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Male</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === 'female' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.gender === 'female' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Female</span>
                        </label>
                    </div>
                </div>

                {/* Marital Status */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.maritalStatus ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-3">Marital Status <span className="text-[#FF0000]">*</span></label>
                    <div className="flex gap-16">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.maritalStatus === 'married' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.maritalStatus === 'married' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="maritalStatus" value="married" checked={formData.maritalStatus === "married"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Married</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.maritalStatus === 'single' ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                {formData.maritalStatus === 'single' && <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]" />}
                            </div>
                            <input type="radio" name="maritalStatus" value="single" checked={formData.maritalStatus === "single"} onChange={handleChange} className="hidden" />
                            <span className="text-sm text-black">Single</span>
                        </label>
                    </div>
                </div>

                {/* Work Status */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                        <div className={`${formData.workStatus ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-semibold text-black mb-4">Work Status <span className="text-[#FF0000]">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fresher Card */}
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, workStatus: 'fresher', workExperiences: [] }))}
                            className={`relative group cursor-pointer`}
                        >
                            <div className={`bg-white rounded-[24px] p-6 pr-32 h-[100px] flex items-center border-2 transition-all ${formData.workStatus === 'fresher' ? 'border-[#FFB300] shadow-md' : 'border-transparent'}`}>
                                <div>
                                    <h3 className="font-bold text-sm text-black">I'm a fresher</h3>
                                    <p className="text-[10px] text-[#827E7E] mt-1 leading-tight">I am a student / I am completed<br />graduation. ( Including Internship)</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-[-20px] w-[160px] pointer-events-none flex items-end justify-center">
                                <img src={fresherIcon} alt="Fresher" className="w-full h-auto object-contain transform translate-y-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                        </div>

                        {/* Experienced Card */}
                        <div
                            onClick={() => setFormData(prev => ({ ...prev, workStatus: 'experienced' }))}
                            className={`relative group cursor-pointer`}
                        >
                            <div className={`bg-white rounded-[24px] p-6 pr-32 h-[100px] flex items-center border-2 transition-all ${formData.workStatus === 'experienced' ? 'border-[#FFB300] shadow-md' : 'border-transparent'}`}>
                                <div>
                                    <h3 className="font-bold text-sm text-black">I'm experienced</h3>
                                    <p className="text-[10px] text-[#827E7E] mt-1">I have work experience.</p>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-[-30px] w-[220px] pointer-events-none flex items-end justify-center z-10">
                                <img src={experiencedIcon} alt="Experienced" className="w-full h-auto object-contain transform translate-y-5 transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                        </div>
                    </div>
                </div>

                {formData.workStatus === "experienced" && (
                    <div className="bg-[#FFF9E5] rounded-xl px-6 py-6 relative mt-6">

                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-sm">Work Experience <span className="text-red-500">*</span></h3>
                                <p className="text-xs text-gray-500">
                                    Your employment details will help recruiters understand your experience
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setEditingExperienceIndex(null);
                                    setExperienceForm({
                                        jobTitle: "",
                                        employmentType: "",
                                        company: "",
                                        currentlyWorking: false,
                                        startDate: "",
                                        endDate: "",
                                        location: "",
                                        description: ""
                                    });
                                    setShowExperienceModal(true);
                                }}
                                className="text-[#FFB300] font-bold text-sm"
                            >
                                Add another work experience +
                            </button>
                        </div>

                        {/* Experience List */}
                        <div className="space-y-4">
                            {formData.workExperiences.map((exp, index) => (
                                <div key={index} className="border-b border-[#FFB300] pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-bold text-black">{exp.jobTitle}</h4>
                                    <p className="text-sm text-gray-700">{exp.company}, {exp.location}</p>
                                    <p className="text-xs text-gray-500">
                                        {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                                    </p>
                                    <div className="mt-2 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setEditingExperienceIndex(index);
                                                setExperienceForm(exp);
                                                setShowExperienceModal(true);
                                            }}
                                            className="text-xs font-bold text-[#FFB300] hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    workExperiences: prev.workExperiences.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="text-xs font-bold text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {formData.workExperiences.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No experience added yet.</p>
                            )}
                        </div>

                    </div>
                )}


                {/* Resume */}
                {/* Resume */}
                <div className="bg-[#FFF9E5] rounded-xl px-6 py-5 relative">
                    <div className="absolute top-4 right-4">
                        <div className={`${formData.resumeFile || formData.resumeUrl ? 'bg-[#22C55E]' : 'bg-[#FFB300]'} w-5 h-5 rounded-full flex items-center justify-center shadow-sm transition-colors duration-300`}>
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <label className="block text-sm font-bold text-black mb-4">Resume <span className="text-[#FF0000]">*</span></label>
                    <div className="flex flex-col md:flex-row gap-4">
                        <button className="flex-1 bg-[#FFB300] hover:bg-[#ffaa00] text-black font-bold py-3 px-4 rounded-lg shadow-sm transition text-sm">
                            Create ATS friendly CV
                        </button>

                        <div className="flex-1">
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.type !== "application/pdf") {
                                            alert("Only PDF files are allowed.");
                                            return;
                                        }
                                        if (file.size > 5 * 1024 * 1024) {
                                            alert("File size too large (max 5MB)");
                                            return;
                                        }
                                        setFormData(prev => ({
                                            ...prev,
                                            resumeFile: file,
                                            resumeName: file.name
                                        }));
                                    }
                                }}
                            />
                            <label
                                htmlFor="resume-upload"
                                className={`w-full h-full border-2 border-[#FFB300] text-[#FFB300] font-bold py-3 px-4 rounded-lg hover:bg-[#FFF9E5] transition flex items-center justify-center gap-2 text-sm cursor-pointer ${formData.resumeName ? 'bg-yellow-50' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                </svg>
                                <span className="truncate max-w-[150px]">{formData.resumeName || "Upload Resume"}</span>
                            </label>
                        </div>
                    </div>
                    {formData.resumeName && (
                        <p className="text-[10px] text-gray-500 mt-2 text-right italic">Selected: {formData.resumeName}</p>
                    )}
                </div>

                {/* Next Button */}
                <div className="flex justify-center mt-8">
                    <button
                        onClick={saveStep1AndContinue}
                        className="bg-[#FFB300] text-black font-bold py-3 px-20 rounded-xl shadow-lg transition transform text-lg hover:scale-105 hover:bg-[#ffaa00]"
                    >
                        Next
                    </button>
                </div>

                {/* Page Indicator */}
                <p className="text-center text-[#FFB300] text-xs font-medium">Page 1 of 3</p>

                {/* Work Experience Modal */}
                {showExperienceModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-white w-[700px] rounded-2xl p-8 relative animate-fadeIn shadow-2xl max-h-[90vh] overflow-y-auto">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-black">Work Experience <span className="text-red-500">*</span></h2>
                                    <p className="text-xs text-gray-500">Details like job title, company name, etc, help employers understand your work</p>
                                </div>
                                <button onClick={() => setShowExperienceModal(false)} className="text-gray-500 hover:text-black font-bold text-xl">✕</button>
                            </div>

                            <div className="space-y-5">

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Job title <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Enter your job title"
                                        value={experienceForm.jobTitle}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, jobTitle: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Employment type</label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Full time", "Part time", "Internship", "Freelance", "Trainee", "Self employee"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${experienceForm.employmentType === type ? 'border-[#FFB300]' : 'border-gray-400'}`}>
                                                    {experienceForm.employmentType === type && <div className="w-2 h-2 rounded-full bg-[#FFB300]" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="employmentType"
                                                    className="hidden"
                                                    checked={experienceForm.employmentType === type}
                                                    onChange={() => setExperienceForm({ ...experienceForm, employmentType: type })}
                                                />
                                                <span className="text-sm text-gray-600">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Company name or organisation? <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Enter your company name"
                                        value={experienceForm.company}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                                    />
                                </div>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${experienceForm.currentlyWorking ? 'bg-[#FFB300] border-[#FFB300]' : 'border-gray-400'}`}>
                                        {experienceForm.currentlyWorking && <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={experienceForm.currentlyWorking}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, currentlyWorking: e.target.checked })}
                                    />
                                    <span className="text-sm font-bold text-black">I am presently working</span>
                                </label>

                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold mb-1">Joining date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#FFB300]"
                                            value={experienceForm.startDate}
                                            onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold mb-1">End date</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-500 outline-none focus:border-[#FFB300]"
                                            disabled={experienceForm.currentlyWorking}
                                            value={experienceForm.endDate}
                                            onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Company Location <span className="text-red-500">*</span></label>
                                    <input
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm"
                                        placeholder="Type your designation"
                                        value={experienceForm.location}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Job profile</label>
                                    <textarea
                                        className="w-full border-b border-gray-300 py-2 outline-none focus:border-[#FFB300] text-sm resize-none"
                                        placeholder="List your major duties and successes, Highlighting specific projects."
                                        rows={3}
                                        value={experienceForm.description}
                                        onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                                    />
                                    <p className="text-right text-xs text-gray-400 mt-1">4000 character(s) left</p>
                                </div>

                            </div>

                            <div className="flex justify-end gap-4 mt-8">
                                <button
                                    className="border border-[#FFB300] text-[#FFB300] font-bold px-8 py-2.5 rounded-lg hover:bg-[#FFF9E5] transition"
                                    onClick={() => setShowExperienceModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="bg-[#FFB300] text-black font-bold px-10 py-2.5 rounded-lg hover:bg-[#ffaa00] transition shadow-md"
                                    onClick={() => {
                                        if (editingExperienceIndex !== null) {
                                            setFormData(prev => {
                                                const newExp = [...prev.workExperiences];
                                                newExp[editingExperienceIndex] = experienceForm;
                                                return { ...prev, workExperiences: newExp };
                                            });
                                        } else {
                                            setFormData(prev => ({
                                                ...prev,
                                                workExperiences: [...prev.workExperiences, experienceForm]
                                            }));
                                        }
                                        setShowExperienceModal(false);
                                        setEditingExperienceIndex(null); // Reset index
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Step1BasicInfo;
