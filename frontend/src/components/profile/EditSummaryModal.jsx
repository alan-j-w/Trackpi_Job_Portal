import React, { useState, useEffect } from "react";

const EditSummaryModal = ({ isOpen, onClose, currentSummary, onSave, isEditing }) => {
    const [summary, setSummary] = useState(currentSummary || "");

    // Calculate word count
    const wordCount = summary.trim() ? summary.trim().split(/\s+/).length : 0;
    const isOverLimit = wordCount > 150;

    useEffect(() => {
        if (isOpen) {
            if (isEditing) {
                setSummary(currentSummary || "");
            } else {
                setSummary("");
            }
        }
    }, [currentSummary, isOpen, isEditing]);

    const handleSave = () => {
        if (isOverLimit) return;
        onSave(summary);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={onClose}>
            <div className="bg-gradient-to-b from-white to-[#FFF9E5] rounded-[32px] w-full max-w-[700px] mx-4 p-12 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>

                <h2 className="text-2xl font-bold mb-8 text-black">{isEditing ? "Edit Summary" : "Add Summary"}</h2>

                <div className={`border rounded-xl p-5 mb-2 transition-colors ${isOverLimit ? 'border-red-500 bg-red-50' : 'border-gray-600 bg-white'}`}>
                    <textarea
                        className="w-full h-40 outline-none resize-none text-black text-base leading-relaxed placeholder-gray-400 font-normal bg-transparent"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Write a brief summary about yourself (max 150 words)..."
                    ></textarea>
                </div>

                <div className={`text-right text-sm mb-8 font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                    {wordCount}/150 words
                </div>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleSave}
                        disabled={isOverLimit}
                        className={`w-48 py-3 font-bold rounded-lg border shadow-sm transition-all ${isOverLimit
                                ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-b from-[#FFF5CC] to-[#FFB300] text-black border-[#FFB300]/50 hover:from-[#FFF0B3] hover:to-[#FFA000]'
                            }`}
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
