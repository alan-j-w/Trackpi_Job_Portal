import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HeroTalent from "../components/TeamLeague/HeroTalent";
import ExploreCompetitions from "../components/TeamLeague/ExploreCompetitions";
import TalentHunt from "../components/TeamLeague/TalentHunt";
import PreviousWinners from "../components/TeamLeague/PreviousWinners";
import JoinTeam from "../components/TeamLeague/JoinTeam";

export default function TalentLeague() {
    return (
        <>
            <Navbar />
            <HeroTalent />
            <ExploreCompetitions />
            <TalentHunt />
            <PreviousWinners />
            <JoinTeam />
            <Footer />
        </>
    );
}
