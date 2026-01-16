export default function WinnerCard() {
    return (
        <div className="w-64 bg-black border border-yellow-500/40 rounded-2xl p-6 text-center text-white">
            <h4 className="italic text-yellow-400 mb-2">Congratulations</h4>
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-700 mb-3" />
            <h3 className="font-semibold">Alex Joseph</h3>
            <p className="text-sm text-gray-400">UI UX Designer</p>
            <p className="text-xs text-gray-500 mt-2">Trackpi Pvt Limited</p>
        </div>
    );
}
