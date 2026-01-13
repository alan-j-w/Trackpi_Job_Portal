import Navbar from "../components/Navbar";
import Hero from "../components/home/Hero";
import HowToGetHired from "../components/home/HowToGetHired";
import Stats from "../components/home/Stats";
import Partners from "../components/home/Partners";
import JobSection from "../components/home/JobSection";

import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="font-poppins">
      <Navbar />
      <Hero />
      <HowToGetHired />
      <Stats />
      <Partners />
      <JobSection />
      <Footer />


    </div>
  );
};

export default Home;
