import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
import JobSection from "../components/home/JobSection";
import Footer from "../components/Footer";

const Jobs = () => {
    const [searchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const keyword = searchParams.get("keyword") || "";
    const location = searchParams.get("location") || "";
    const experience = searchParams.get("experience") || "";


    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                // Construct query string
                const params = new URLSearchParams();
                if (keyword) params.append("keyword", keyword);
                if (location) params.append("location", location);
                if (experience) params.append("experience", experience);

                const res = await axios.get(`${API_URL}/api/jobs?${params.toString()}`);

                const fetchedJobs = Array.isArray(res.data) ? res.data : [];
                // Sort: Urgent jobs first
                const sortedJobs = fetchedJobs.sort((a, b) => {
                    if (a.status === "urgent" && b.status !== "urgent") return -1;
                    if (a.status !== "urgent" && b.status === "urgent") return 1;
                    return 0;
                });

                setJobs(sortedJobs);
            } catch (err) {
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [keyword, location, experience]);

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
