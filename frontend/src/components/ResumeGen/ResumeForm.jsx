import React, { useState } from 'react';
import PersonalInfo from './PersonalInfo';
import Education from './Education';
import Internship from './Internship';
import Skills from './Skills';
import AdditionalSection from './AdditionalSection';
import ProgressBar from './ProgressBar';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useResume } from './ResumeContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ResumeForm = () => {
    const { resumeData } = useResume();
    const [step, setStep] = useState(1);
    const steps = ["Personal Info", "Education", "Internship", "Skills", "Additional section"];

    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const originalElement = document.getElementById('resume-preview');
            const token = localStorage.getItem('token');
            const isLoggedIn = !!token;

            if (!originalElement) {
                throw new Error("Resume preview element not found");
            }

            // Clone the element to render it without scaling
            const clonedElement = originalElement.cloneNode(true);

            // Apply styles to the clone to ensure it renders correctly and at full scale
            // We position it off-screen but keeps it in the DOM for html2canvas to render
            Object.assign(clonedElement.style, {
                position: 'fixed',
                top: '0',
                left: '-9999px',
                width: '210mm',
                minHeight: '297mm', // Ensure full height
                zIndex: '-1',
                transform: 'none', // Reset any potential transforms
                margin: '0', // Reset margins
                overflow: 'visible' // Allow content to flow
            });

            // Append to body
            document.body.appendChild(clonedElement);

            // Wait for images/fonts if needed explicitly, but usually html2canvas handles it.
            // Using higher scale for better quality
            const canvas = await html2canvas(clonedElement, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff' // Ensure white background
            });

            // Remove the clone
            document.body.removeChild(clonedElement);

            const imgData = canvas.toDataURL('image/png');

            // A4 dimensions in mm
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Watermark if not logged in
            if (!isLoggedIn) {
                pdf.setTextColor(200, 200, 200); // Light Grey
                pdf.setFontSize(50);
                pdf.setFont("helvetica", "bold");

                // Add watermark diagonally
                // Translation logic to rotate text center
                pdf.saveGraphicsState();
                pdf.setGState(new pdf.GState({ opacity: 0.3 }));
                pdf.text("TrackPi", 40, 150, { angle: 45, align: "center" });
                pdf.text("TrackPi", 100, 250, { angle: 45, align: "center" });
                pdf.restoreGraphicsState();
            }

            pdf.save(`${resumeData.personalInfo.fullName || 'Resume'}.pdf`);

        } catch (error) {
            console.error("PDF Generation failed", error);
            alert("Failed to generate PDF. Check console for details.");
        } finally {
            setIsDownloading(false);
        }
    };


    const handleNext = () => {
        if (step < steps.length) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };



    return (
        <div className="flex flex-col min-h-screen md:min-h-0">
            {/* Stepper */}
            <ProgressBar currentStep={step} steps={steps} />

            {/* Form Content */}
            <div className="bg-transparent mb-12">
                {step === 1 && <PersonalInfo />}
                {step === 2 && <Education />}
                {step === 3 && <Internship />}
                {step === 4 && <Skills />}
                {step === 5 && <AdditionalSection />}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-6 mt-auto md:mt-10 pb-10">
                <button
                    onClick={handleBack}
                    disabled={step === 1}
                    className="flex items-center gap-2 px-8 py-3 bg-[#FFB300] text-gray-900 rounded-full font-bold shadow-lg hover:bg-[#faa300] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Back <RotateCcw size={18} className="transform rotate-0" /> {/* Using generic icon as placeholder for custom curved arrow */}
                </button>
                <button
                    onClick={step === steps.length ? handleDownload : handleNext}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-8 py-3 bg-[#FFB300] text-gray-900 rounded-full font-bold shadow-lg hover:bg-[#faa300] transition hover:scale-105 disabled:opacity-50"
                >
                    {isDownloading ? 'Generating...' : (step === steps.length ? 'Download' : 'Next')}
                    {!isDownloading && <RotateCcw size={18} className={step === steps.length ? '' : "transform rotate-180"} />}
                </button>
            </div>
        </div>
    );
};

export default ResumeForm;
