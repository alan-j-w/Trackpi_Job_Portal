import trophyWireframe from '../../assets/competitions/trophy-wireframe-blue-large.png';
import chessPiece1 from '../../assets/chess_piece_1_violet.png'; // Main Large Queen (Right)
import chessPiece2 from '../../assets/chess_piece_2_violet.png'; // Medium Queen (Left)
import chessPiece3 from '../../assets/chess_piece_3_violet.png'; // Small Pawn (Far Right)
import lightBeams from '../../assets/light_beams.png';

export default function HeroTalent() {
    return (
        <section className="relative min-h-screen bg-[#0a0a0a] text-white px-6 lg:px-20 flex items-center justify-center overflow-hidden pt-20">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                 .animate-float-delayed {
                    animation: float 6s ease-in-out 3s infinite;
                }
                
                /* Custom Keyframe for the Spotlight Pulse */
                @keyframes spotlight-pulse {
                    0%, 100% { opacity: 0.6; transform: rotate(-45deg) scale(1); }
                    50% { opacity: 0.8; transform: rotate(-45deg) scale(1.1); }
                }

                .purple-spotlight-streak {
                    animation: spotlight-pulse 8s ease-in-out infinite;
                }
            `}</style>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center gap-12">
                {/* Centered Content (Heading) */}
                <div className="relative z-20 flex flex-col items-center text-center w-full max-w-5xl">
                    {/* Floating Trophy */}
                    <img
                        src={trophyWireframe}
                        alt="Trophy"
                        className="absolute -top-20 left-4 w-32 h-32 object-contain opacity-80 animate-float hidden md:block"
                    />
                    <h1 className="font-russo font-normal text-[60px] leading-[1.13] tracking-[-1px] mb-2">
                        <span className="bg-gradient-to-b from-white to-[#FFB300] bg-clip-text text-transparent">
                            A place to display your
                        </span>{" "}
                        <span className="text-[#FFB300] drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">Talent</span>
                        <br />
                        <span className="bg-gradient-to-b from-[#FFB300] to-white bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            with our competition
                        </span>
                    </h1>
                </div>

                {/* Content Row: Text Block + Images */}
                <div className="w-full relative h-[450px] flex items-center">
                    {/* Left Content: Text Block - Aligned to start, but constrained width */}
                    <div className="z-20 w-full lg:w-[600px] flex flex-col items-start text-left -mt-72">
                        <p className="text-white text-lg sm:text-xl leading-relaxed mb-8 font-light">
                            Join our Internship Talent Competition and prove your skills in design,
                            editing, or development. Winners not only earn recognition but also unlock a direct path to
                            our internship program — <span className="text-white italic">where talent meets opportunity!</span>
                        </p>

                        {/* Button with Purple Fill + Yellow Glow Wrapper to match visual target more closely */}
                        <div className="relative p-[1px] rounded-xl bg-gradient-to-r from-yellow-500 via-purple-500 to-yellow-500 animate-gradient-xy w-fit shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            <button className="relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#370C4B] to-[#E141D1] text-white font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 group">
                                Competition
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-[#FFB300] bg-transparent text-[#FFB300] shadow-[0_0_10px_rgba(255,179,0,0.5)] group-hover:bg-[#FFB300] group-hover:text-[#370C4B] transition-colors duration-300">
                                    <i className="ri-arrow-down-line text-sm font-bold"></i>
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Right Content: Chess Pieces Composition - Positioned to simulate 3D space */}
                    <div className="absolute right-0 top-0 w-full h-full hidden lg:block pointer-events-none">
                        {/* Large Piece (Back) */}
                        <img
                            src={chessPiece1}
                            alt="Chess Piece Large"
                            className="absolute right-[150px] top-0 w-[300px] lg:w-[200px] h-auto object-contain z-10"
                        />

                        {/* Medium Piece (Front Left of Large) */}
                        <img
                            src={chessPiece2}
                            alt="Chess Piece Medium"
                            className="absolute right-[300px] top-[80px] w-[200px] lg:w-[100px] h-auto object-contain z-20"
                        />

                        {/* Small Piece (Far Right Bottom) */}
                        <img
                            src={chessPiece3}
                            alt="Chess Piece Small"
                            className="absolute right-[20px] bottom-[200px] w-[100px] lg:w-[150px] h-auto object-contain z-0 opacity-80"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}