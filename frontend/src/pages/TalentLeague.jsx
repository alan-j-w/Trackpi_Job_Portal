import NavbarTalent from "../components/TeamLeague/NavbarTalent";
import Footer from "../components/Footer";



import TalentHunt from "../components/TeamLeague/TalentHunt";
import PreviousWinners from "../components/TeamLeague/PreviousWinners";
import JoinTeam from "../components/TeamLeague/JoinTeam";

export default function TalentLeague() {
    return (
        <>
            <NavbarTalent />

            <TalentHunt />
            <PreviousWinners />
            <JoinTeam />
            <Footer />
        </>
    );
}
