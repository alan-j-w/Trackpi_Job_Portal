export default function JoinTeam() {
    return (
        <section className="relative bg-black pt-0 pb-20 px-6 lg:px-20 text-white overflow-hidden">
            {/* Yellow light shade background effect */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFB300]/10 blur-[150px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <div className="relative z-10 flex justify-center items-center">
                <div className="w-full max-w-6xl pointer-events-none">
                    <img
                        src="/assets/team/join-team-final.png"
                        alt="Join our team"
                        className="w-full h-auto rounded-xl object-contain"
                    />
                </div>
            </div>
        </section>
    );
}
