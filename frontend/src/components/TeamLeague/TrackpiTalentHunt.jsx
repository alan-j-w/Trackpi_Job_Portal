import React from "react";
import talentHuntIllustration from "../../assets/illustrations/talent_hunt_illustration.png";

const TrackpiTalentHunt = () => {
    return (
        <section className="relative w-full py-20 bg-[#0a0a0a] overflow-hidden">
            {/* Background Glow (Optional) */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-20">

                {/* Section Heading */}
                <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-12 text-center font-russo">
                    <span className="text-[#FFB300] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Trackpi</span> Talent Hunt
                </h2>

                <div className="flex flex-col items-center justify-center gap-12 text-center">



                    {/* Image Content - Centered */}
                    <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-[1700px]">
                            {/* Image Container with Glow */}
                            <div className="absolute inset-0 bg-purple-600/20 blur-xl rounded-full transform scale-90"></div>
                            <img
                                src={talentHuntIllustration}
                                alt="Trackpi Talent Hunt"
                                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TrackpiTalentHunt;
