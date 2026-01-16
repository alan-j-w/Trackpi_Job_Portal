import React from 'react';
import Navbar from '../components/Navbar';
import { ResumeProvider } from '../components/ResumeGen/ResumeContext';
import ResumeForm from '../components/ResumeGen/ResumeForm';
import ResumePreview from '../components/ResumeGen/ResumePreview';

const ResumeGen = () => {
    return (
        <ResumeProvider>
            <div className="min-h-screen bg-[#FFFBF2] flex flex-col font-sans">
                <Navbar />

                {/* Main Content */}
                <div className="pt-24 pb-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6">

                    {/* Page Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900">Candidate Details</h1>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Left Side: Form */}
                        <div className="w-full md:w-[55%] flex flex-col gap-6">
                            <ResumeForm />
                        </div>

                        {/* Right Side: Preview */}
                        {/* Right Side: Preview */}
                        <div className="flex w-full md:w-[45%] flex-shrink-0 relative mt-8 md:mt-0 md:sticky md:top-24 h-[500px] md:h-[calc(100vh-6rem)] items-center justify-center bg-gray-200 rounded-xl shadow-inner border border-gray-300 overflow-hidden">
                            {/* 
                        A4 is 297mm.
                        Scale to fit height of container.
                     */}
                            <div className="transform scale-[0.3] sm:scale-[0.4] md:scale-[0.35] lg:scale-[0.4] xl:scale-[0.5] 2xl:scale-[0.6] transition-transform duration-300 origin-center shadow-2xl">
                                <ResumePreview />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ResumeProvider>
    );
};

export default ResumeGen;
