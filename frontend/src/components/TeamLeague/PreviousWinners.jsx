import WinnerCard from "./WinnerCard";

export default function PreviousWinners() {
    return (
        <section className="bg-black py-20 text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-12">
                Trackpi Previous Winners
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
                <WinnerCard />
                <WinnerCard />
                <WinnerCard />
                <WinnerCard />
            </div>
        </section>
    );
}
