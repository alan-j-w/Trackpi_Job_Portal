import HeroTalent from "./HeroTalent";
import ExploreCompetitions from "./ExploreCompetitions";
import TrackpiTalentHunt from "./TrackpiTalentHunt";
import NavbarTalent from "./NavbarTalent"; // Assuming a specific navbar or use global

export default function TalentHunt() {
    return (
        <div className="bg-[#0a0a0a] min-h-screen">
            {/* Note: Navbar might be in App.jsx or Layout, adding Hero directly */}
            <HeroTalent />
            <ExploreCompetitions />
            <TrackpiTalentHunt />
        </div>
    );
}
