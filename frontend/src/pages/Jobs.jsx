import Navbar from "../components/Navbar";
import JobSection from "../components/home/JobSection";
import Footer from "../components/Footer";

const Jobs = () => {
    return (
        <div className="font-poppins min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                <JobSection className="pt-32 pb-16" />
            </div>
            <Footer />
        </div>
    );
};

export default Jobs;
