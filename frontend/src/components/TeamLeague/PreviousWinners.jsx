export default function PreviousWinners() {
    // Ideally we'd have individual assets, but it seems the uploaded images 
    // might be full layout screenshots. Rendering just one for now.
    const winnerImage = "/assets/winners/winner-final.png";

    return (
        <section className="relative bg-black pt-16 pb-20 text-center overflow-hidden">
            {/* Golden Background Glow */}
            <div
                className="absolute top-0 right-0 w-[600px] h-full pointer-events-none z-0 opacity-40"
                style={{
                    background: 'radial-gradient(ellipse at center right, rgba(255, 179, 0, 0.4) 0%, transparent 70%)',
                    filter: 'blur(100px)'
                }}
            ></div>

            {/* Subtle Light Rays */}
            <div
                className="absolute top-0 right-[-10%] w-[500px] h-full pointer-events-none z-0 opacity-20"
                style={{
                    background: 'repeating-linear-gradient(-35deg, transparent, transparent 150px, rgba(255, 179, 0, 0.2) 150px, rgba(255, 179, 0, 0.2) 300px)',
                    maskImage: 'radial-gradient(circle at center right, black 0%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center right, black 0%, transparent 80%)',
                    filter: 'blur(50px)'
                }}
            ></div>

            <div className="relative z-10 flex justify-center items-center px-4">
                <div className="z-20 pointer-events-none">
                    <img
                        alt="Previous Winner"
                        className="rounded-3xl object-contain shadow-2xl"
                        src="/assets/winners/winner-final.png"
                        style={{ width: "1290.72px", height: "473.05px" }}
                    />
                </div>
            </div>
        </section>
    );
}
