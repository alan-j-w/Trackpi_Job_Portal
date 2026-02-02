import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import { API_URL } from "../config";
import Navbar from "../components/Navbar";
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

            <section className="bg-gray-50 py-10 flex-grow">
                <div className="max-w-[1200px] mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">
                        {keyword ? `Results for "${keyword}"` : "All Jobs"}
                    </h1>

                    {/* Simple Search Summary */}
                    {(location || experience) && (
                        <div className="flex gap-2 mb-6">
                            {location && <span className="bg-white border rounded-full px-4 py-1 text-sm">📍 {location}</span>}
                            {experience && <span className="bg-white border rounded-full px-4 py-1 text-sm">💼 {experience}</span>}
                        </div>
                    )}

                    {loading ? (
                        <p>Loading jobs...</p>
                    ) : jobs.length === 0 ? (
                        <p>No jobs found matching your criteria.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {jobs.map(job => (
                                <JobCard
                                    key={job._id}
                                    status={job.status === "urgent" ? "Urgent Hiring" : "New"}
                                    statusColor={job.status === "urgent" ? "red" : "green"}
                                    title={job.title}
                                    company={job.company}
                                    location={job.location}
                                    jobType={job.jobType}
                                    education={job.education}
                                    salary={job.salary}
                                    experience={job.experience}
                                    workMode={job.workMode}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Jobs;
