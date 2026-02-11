import CompetitionCard from "./CompetitionCard";

export default function ExploreCompetitions() {
    return (
        <section className="bg-black py-20 text-center text-white">
            <h2 className="text-3xl font-bold text-yellow-400 mb-12">
                Explore our competitions
            </h2>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-10">
                <CompetitionCard title="Graphic Designer" />
                <CompetitionCard title="UI UX Designer" />
                <CompetitionCard title="Video Editors" />
            </div>
        </section>
    );
}