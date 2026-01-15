import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LinkedInCallback from "./pages/LinkedInCallback";
import ResumeGen from "./pages/ResumeGen";

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
      </Routes>
    </Router>
  );
}
export default App;

