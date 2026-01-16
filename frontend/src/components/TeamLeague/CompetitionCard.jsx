export default function CompetitionCard({ title }) {
    return (
        <div className="w-72 h-72 rounded-full bg-gradient-to-b from-yellow-600/30 to-black border border-yellow-500/40 flex flex-col items-center justify-center text-center text-white px-6">
            <h3 className="font-semibold mb-3">{title}</h3>
            <p className="text-sm text-gray-300">
                Unleash your creativity and showcase your skills.
            </p>
            <button className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-md text-sm">
                Go on
            </button>
        </div>
    );
}
