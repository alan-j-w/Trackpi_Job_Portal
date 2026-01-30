import React from 'react';

const EditIcon = ({ className, onClick }) => (
    <div onClick={onClick} className={`w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm border border-gray-100 hover:bg-gray-50 transition ${className}`}>
        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    </div>
);

const PlusIcon = ({ className }) => (
    <svg className={`w-5 h-5 cursor-pointer hover:text-black text-gray-400 transition-colors ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
);

const LanguageRow = ({ name, level }) => (
    <div className="flex justify-between items-center">
        <span className="font-bold text-xs text-black w-24">{name}</span>
        <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(dot => (
                <div key={dot} className={`w-3 h-3 rounded-full ${dot <= level ? 'bg-[#FFB300]' : 'border border-gray-200 bg-gray-50'}`}></div>
            ))}
        </div>
    </div>
);

const LanguageSection = () => {
    return (
        <div className="py-8 border-b border-gray-200">
            <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-lg text-black">Language</h2>
                <div className="flex gap-4"><EditIcon className="w-7 h-7" /><PlusIcon /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 max-w-lg">
                <LanguageRow name="English" level={3} />
                <LanguageRow name="Hindi" level={3} />
                <LanguageRow name="Tamil" level={2} />
                <LanguageRow name="Malayalam" level={3} />
            </div>
        </div>
    );
};

export default LanguageSection;
