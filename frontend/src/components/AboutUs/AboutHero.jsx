import meetingImg from "../../assets/about images/meeting.png";

const AboutHero = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-[50px] font-bold mb-4 leading-[36px]">
                    About <span className="text-yellow-400">Trackpi</span>
                </h2>

                <p className="font-lato text-[24px] text-[#555555] leading-[1.5] mb-6">
                    Trackpi is one of the best business consulting companies in Kerala,
                    based in Kochi. We help businesses succeed by providing a strategic
                    advantage over competitors with expert guidance. Trackpi also offers
                    opportunities for freelance associates to earn and grow, becoming part of
                    our team.
                </p>

                <button className="bg-yellow-400 px-6 py-3 rounded-full font-semibold">
                    Company Brochure →
                </button>
            </div>

            <img
                src={meetingImg}
                alt="About Trackpi"
                className="rounded-2xl w-full"
            />
        </section>
    );
};

export default AboutHero;
