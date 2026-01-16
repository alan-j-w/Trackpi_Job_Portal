export default function HeroTalent() {
    return (
        <section className="relative min-h-screen bg-black text-white px-6 lg:px-20 flex items-center">
            <div className="max-w-2xl z-10">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    A place to display your <span className="text-yellow-400">Talent</span>
                    <br /> with our competition
                </h1>
                <p className="mt-6 text-gray-300">
                    Join our Internship Talent Competition and prove your skills in design,
                    editing, or development. Winners earn recognition and a direct path to
                    our internship program.
                </p>
                <button className="mt-8 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 font-semibold">
                    Competition
                </button>
            </div>

            <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-purple-900/40 rounded-full" />
        </section>
    );
}
