export default function JoinTeam() {
    return (
        <section className="bg-black py-20 px-6 lg:px-20 text-white">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold mb-6">
                        Join <span className="text-yellow-400">our team</span>
                    </h2>
                    <p className="text-gray-300 mb-4">
                        We are always on the lookout for our next stunning colleague.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Our hiring team reviews all applications anonymously.
                    </p>
                </div>
                <div className="w-full h-64 bg-gray-800 rounded-xl" />
            </div>
        </section>
    );
}
