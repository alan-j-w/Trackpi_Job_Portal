import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinkedInCallback from "./pages/LinkedInCallback";
import ResumeGen from "./pages/ResumeGen";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import TalentLeague from "./pages/TalentLeague";
import Creators from "./pages/Creators";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/linkedin/callback" element={<LinkedInCallback />} />
        <Route path="/resume-gen" element={<ResumeGen />} />
        <Route path="/about" element={<About />} />
        <Route path ="/testimonials" element={<Testimonials />} />
        <Route path ="/talent-league" element={<TalentLeague />} />
        <Route path ="/creators" element={<Creators />} />
        
      </Routes>
    </Router>
  );
}
export default App;

