import React from "react";
import graphicDesignerImg from "../../assets/illustrations/side_circle_requested.png";
import uiUxDesignerImg from "../../assets/illustrations/ui_ux_middle_requested.png";
import videoEditorImg from "../../assets/illustrations/side_circle_requested.png";
import trophyWireframe from "../../assets/competitions/trophy-wireframe-blue-large.png";

const ExploreCompetitions = () => {
    const competitions = [
        {
            title: "Graphic designer",
            image: graphicDesignerImg,
            description: "Unleash your creativity! The Creative Minds Design Challenge invites talented graphic designers to showcase their skills and imagination.",
        },
        {
            title: "UI UX Designer",
            image: uiUxDesignerImg,
            description: "Unleash your creativity! The Creative Minds Design Challenge invites talented UI UX designers to showcase their skills and imagination.",
            isCenter: true,
        },
        {
            title: "Video editors",
            image: videoEditorImg,
            description: "Unleash your creativity! The Creative Minds Design Challenge invites talented Video editors to showcase their skills and imagination.",
        },
    ];

    return (
        <section className="relative w-full py-20 bg-[#0a0a0a] overflow-hidden">
            {/* Background Glows (Optional, to match theme) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-yellow-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Confetti Background - Restored */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <img
                    src="/assets/confetti_bg.png"
                    alt="Confetti"
                    className="absolute bottom-0 left-0 w-[600px] opacity-80 mix-blend-screen"
                />
            </div>

            {/* Right Side Golden Glow */}
            <div
                className="absolute pointer-events-none z-0"
                style={{
                    width: '837px',
                    height: '1241px',
                    left: '654px',
                    top: '770px',
                    background: 'linear-gradient(180deg, rgba(255, 179, 0, 0.2) 0%, rgba(255, 179, 0, 0) 100%)',
                    filter: 'blur(100px)',
                    opacity: 1
                }}
            />

            {/* Background Trophy */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xs pointer-events-none z-0">
                <img
                    src={trophyWireframe}
                    alt="Trophy Background"
                    className="w-48 h-auto object-contain mx-auto opacity-30"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-16 font-russo">
                    <span className="text-[#FFB300] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                        Explore our competitions
                    </span>
                </h2>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16 relative">

                    {/* Navigation Arrows (Visual Only for now as per image) */}
                    <button className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 text-[#FFB300] text-3xl hover:scale-110 transition-transform z-30">
                        <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-[#FFB300] text-3xl hover:scale-110 transition-transform z-30">
                        <i className="ri-arrow-right-s-line"></i>
                    </button>

                    {competitions.map((comp, index) => (
                        <div
                            key={index}
                            className={`relative rounded-full border border-[#FFB300]/30 bg-gradient-to-b from-[#FFB300]/20 to-[#010102] p-4 flex flex-col items-center text-center transition-all duration-300 group hover:border-[#FFB300] shadow-[0_0_40px_rgba(0,0,0,0.8)]
                                ${comp.isCenter
                                    ? 'w-[260px] h-[260px] md:w-[340px] md:h-[340px] z-20 scale-105 lg:translate-y-16 justify-start pt-6 md:pt-8 gap-0'
                                    : 'w-[220px] h-[220px] md:w-[290px] md:h-[290px] z-10 lg:-translate-y-16 justify-start pt-5 md:pt-6 gap-1'}
                            `}
                        >
                            {/* Decorative Trophy for Graphic Designer Card */}
                            {index === 0 && (
                                <img
                                    src={trophyWireframe}
                                    alt=""
                                    className="absolute left-[20px] top-[35%] -translate-y-1/2 w-[70px] opacity-40 mix-blend-screen pointer-events-none rotate-12"
                                />
                            )}
                            <h3 className="text-white text-sm md:text-lg leading-tight z-10">{comp.title}</h3>

                            <div className={`relative z-10 ${comp.isCenter ? 'w-48 h-48 md:w-56 md:h-56 -mt-4 md:-mt-8 mb-0' : 'w-20 h-20 md:w-28 md:h-28'}`}>
                                <img src={comp.image} alt={comp.title} className="w-full h-full object-contain" />
                            </div>

                            <p className={`text-gray-400 text-[9px] md:text-[11px] px-3 leading-tight z-10 mb-3 ${comp.isCenter ? '-mt-6 md:-mt-10' : ''}`}>
                                {comp.description}
                            </p>

                            <div className="mt-auto mb-3 md:mb-5 z-10">
                                <button className="px-8 py-1 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFC107] text-black font-serif text-[10px] md:text-xs border border-white hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                                    Go on <i className="ri-arrow-right-s-line text-xs md:text-sm"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreCompetitions;
