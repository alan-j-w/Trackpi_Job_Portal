import React, { useState, useEffect, useRef } from "react";

const SearchableDropdown = ({ options, value, onChange, placeholder, disabled, labelKey = "name", valueKey = "isoCode", searchable = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [displayValue, setDisplayValue] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Update display value when value prop changes
    useEffect(() => {
        const selected = options.find(o => o[valueKey] === value);
        if (selected) {
            setDisplayValue(selected[labelKey]);
        } else if (!value) {
            setDisplayValue("");
        }
    }, [value, options, valueKey, labelKey]);

    const filteredOptions = options.filter(option =>
        option[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div
                className={`w-full bg-white px-4 py-3 rounded-xl shadow-sm text-sm outline-none border flex items-center justify-between cursor-pointer transition-colors ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-[#FFB300] border-transparent'}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className={`${displayValue ? "text-black" : "text-[#827E7E]"} truncate pr-4`}>
                    {displayValue || placeholder}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M1 1L5 5L9 1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto animate-fadeIn">
                    {searchable && (
                        <div className="p-2 sticky top-0 bg-white border-b z-10">
                            <input
                                autoFocus
                                className="w-full bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#FFB300] placeholder-gray-400"
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option[valueKey]}
                                    className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${value === option[valueKey] ? 'bg-[#FFF9E5] text-black font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-black'}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option[labelKey]}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-xs text-gray-400 text-center">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableDropdown;
