import rightSideGlow from "../../assets/competitions/right_side_glow.png";

export default function JoinTeam() {
    return (
        <section className="relative bg-black pt-0 pb-20 px-6 lg:px-20 text-white overflow-hidden">
            {/* Golden Background Glow */}
            <div
                className="absolute top-0 right-0 w-[600px] h-full pointer-events-none z-0 opacity-40"
                style={{
                    background: 'radial-gradient(ellipse at center right, rgba(255, 179, 0, 0.4) 0%, transparent 70%)',
                    filter: 'blur(80px)'
                }}
            ></div>

            {/* Subtle Light Rays */}
            <div
                className="absolute top-[10%] right-[-5%] w-[400px] h-full pointer-events-none z-0 opacity-20"
                style={{
                    background: 'repeating-linear-gradient(-25deg, transparent, transparent 120px, rgba(255, 179, 0, 0.25) 120px, rgba(255, 179, 0, 0.25) 240px)',
                    maskImage: 'radial-gradient(circle at center right, black 0%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center right, black 0%, transparent 80%)',
                    filter: 'blur(40px)'
                }}
            ></div>

            <div className="relative z-10 flex justify-center items-center">
                <div className="w-full max-w-6xl pointer-events-none">
                    <img
                        src="/assets/team/join-team-final.png"
                        alt="Join our team"
                        className="relative z-10 w-full h-auto rounded-xl object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
