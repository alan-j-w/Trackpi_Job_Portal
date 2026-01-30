import React, { useState, useEffect } from "react";

const EditSummaryModal = ({ isOpen, onClose, currentSummary, onSave }) => {
    const [summary, setSummary] = useState(currentSummary || "");

    useEffect(() => {
        setSummary(currentSummary || "");
    }, [currentSummary]);

    const handleSave = () => {
        onSave(summary);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="bg-gradient-to-b from-white to-[#FFF9E5] rounded-[32px] w-full max-w-[700px] mx-4 p-12 relative shadow-2xl">

                <h2 className="text-2xl font-bold mb-8 text-black">Profile summery</h2>

                <div className="border border-gray-600 rounded-xl p-5 mb-10">
                    <textarea
                        className="w-full h-40 outline-none resize-none text-black text-base leading-relaxed placeholder-gray-400 font-normal"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a brief summary about yourself..."
                    ></textarea>
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleSave}
                        className="w-48 py-3 bg-gradient-to-b from-[#FFF5CC] to-[#FFB300] text-black font-bold rounded-lg border border-[#FFB300]/50 shadow-sm hover:from-[#FFF0B3] hover:to-[#FFA000] transition-all"
                    >
                        Submit
                    </button>
                    <button
                        onClick={onClose}
                        className="w-48 py-3 bg-white text-black font-bold rounded-lg border border-gray-600 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditSummaryModal;
