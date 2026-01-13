import { useEffect, useState, useRef } from "react";
import JobCard from "./JobCard";
import Pagination from "./Pagination";
import "remixicon/fonts/remixicon.css";

const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [openSort, setOpenSort] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [sortType, setSortType] = useState("Sort");

  // Specific Filters State (Multi-select)
  const [filters, setFilters] = useState({
    education: [],
    jobType: [], // Contract type
    industry: [],
    experience: [],
    posted: []
  });

  const [expandedSections, setExpandedSections] = useState({
    education: true,
    jobType: true,
    industry: true,
    experience: true,
    posted: true
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 2;

  // Refs
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setOpenFilter(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------- Data Fetching -------------------- */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/jobs");
        const data = await res.json();
        // Mocking 'views' and 'createdAt' for demonstration if missing
        const enrichedData = Array.isArray(data) ? data.map((job, index) => ({
          ...job,
          views: job.views || Math.floor(Math.random() * 1000) + 50, // Mock views key
          createdAt: job.createdAt || new Date(Date.now() - index * 86400000).toISOString() // Mock date
        })) : [];
        setJobs(enrichedData);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* -------------------- Constants & Options -------------------- */
  const filterCategories = [
    {
      id: "education",
      label: "Education required",
      options: ["Plus two", "Diploma", "Graduate", "Post graduate"]
    },
    {
      id: "jobType",
      label: "Contract type",
      options: ["Full Time", "Internship", "Freelance", "Part Time"]
    },
    {
      id: "industry",
      label: "Industry",
      options: ["Accounting", "Banking", "Designing", "IT", "Marketing", "Finance"]
    },
    {
      id: "experience",
      label: "Experience level",
      options: ["Freshers", "Entry Level (1-2 yr)", "Mid Level (4-5 yr)", "Senior Level (5+ yr)"]
    },

  ];

  /* -------------------- Logic -------------------- */

  const matchFilters = (job) => {
    // 1. Education
    if (filters.education && filters.education.length > 0) {
      const jobEdu = job.education?.toLowerCase() || "";
      const matches = filters.education.some(f => jobEdu.includes(f.toLowerCase()));
      if (!matches) return false;
    }

    // 2. Contract Type (jobType)
    if (filters.jobType && filters.jobType.length > 0) {
      const jobType = job.jobType?.toLowerCase() || "";
      const matches = filters.jobType.some(f => {
        if (f === "job") return jobType.includes("full time");
        if (f === "Part Time") return jobType.includes("part time");
        return jobType.includes(f.toLowerCase());
      });
      if (!matches) return false;
    }

    // 3. Industry
    if (filters.industry && filters.industry.length > 0) {
      const text = (job.title + " " + job.company).toLowerCase();
      const matches = filters.industry.some(f => text.includes(f.toLowerCase()));
      if (!matches) return false;
    }

    // 4. Experience
    if (filters.experience && filters.experience.length > 0) {
      const jobExp = job.experience?.toLowerCase() || "";
      const matches = filters.experience.some(f => {
        if (f === "Freshers") return jobExp.includes("fresher") || jobExp.includes("0");
        if (f.startsWith("Entry")) return jobExp.includes("1") || jobExp.includes("2");
        if (f.startsWith("Mid")) return jobExp.includes("3") || jobExp.includes("4") || jobExp.includes("5");
        if (f.startsWith("Senior")) return jobExp.includes("5") || jobExp.includes("6");
        return jobExp.includes(f.toLowerCase());
      });
      if (!matches) return false;
    }

    // 5. Job Posted (Logic moved to Sort, but if used as distinct filter, we can keep logic here.
    // Currently treating it as visual sort toggle.)

    return true;
  };

  const currentFilteredJobs = jobs.filter((job) => {
    if (!job) return false;
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm ||
      job.title?.toLowerCase().includes(term) ||
      job.company?.toLowerCase().includes(term) ||
      job.location?.toLowerCase().includes(term);

    return matchSearch && matchFilters(job);
  });

  // Sort Logic
  const sortedJobs = [...currentFilteredJobs].sort((a, b) => {
    const posted = filters.posted || [];

    // 1. Urgent Priority
    if (posted.includes("Urgent")) {
      if (a.status === "urgent" && b.status !== "urgent") return -1;
      if (a.status !== "urgent" && b.status === "urgent") return 1;
    }

    // 2. Most Viewed Priority (Simulated)
    if (posted.includes("Most viewed")) {
      if ((b.views || 0) !== (a.views || 0)) {
        return (b.views || 0) - (a.views || 0);
      }
    }

    // 3. Newest Priority
    if (posted.includes("Newest")) {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    }

    // Default: Newest first usually
    return 0;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = sortedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(sortedJobs.length / jobsPerPage);

  console.log("DEBUG: jobs.length:", jobs.length);
  console.log("DEBUG: sortedJobs.length:", sortedJobs.length);
  console.log("DEBUG: totalPages:", totalPages);
  console.log("DEBUG: currentPage:", currentPage);

  // Handlers
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (type) => {
    setSortType(type);
    setOpenSort(false);

    // Legacy handler, now logic is mainly in the toggle of the dropdown
    setCurrentPage(1);
  };

  const activeFilterCount = Object.values(filters).flat().length - (filters.posted ? filters.posted.length : 0);

  return (
    <section className="py-16 bg-white font-['Poppins']">
      <div className="max-w-[1200px] mx-auto px-4">

        {/* 1. Header Title */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="max-w-[421px]">
            <h2 className="text-[40px] md:text-[48px] font-bold text-black tracking-tight uppercase leading-none">
              JOB LISTING
            </h2>
            <p className="text-[16px] text-gray-600 mt-2 font-medium">
              All available jobs in one place. Filter and apply
            </p>
          </div>
        </div>

        {/* 2. Search Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 max-w-[980px] mx-auto w-full">
          <div className="relative flex-grow w-full">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FFB300]">
              <i className="ri-search-line text-xl"></i>
            </div>
            <div className="absolute left-14 top-1/2 -translate-y-1/2 w-[1px] h-6 bg-gray-300"></div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search your favorite company or job role"
              className="w-full h-[44px] pl-20 pr-6 rounded-[12px] border border-[#FFB300] outline-none text-sm placeholder:text-gray-400 text-gray-700 shadow-sm"
            />
          </div>
          <button className="w-full md:w-auto h-[44px] px-10 bg-[#FFB300] hover:bg-[#ffc133] text-black font-bold text-sm rounded-[12px] transition-colors shadow-sm">
            Search
          </button>
        </div>

        {/* 3. Filters Toolbar */}
        <div className="flex justify-between items-center mb-10 max-w-4xl mx-auto w-full z-20 relative">

          {/* SORT BUTTON & DROPDOWN */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setOpenSort(!openSort);
                setOpenFilter(false);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-black rounded-[12px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              Sort <i className="ri-arrow-up-down-line text-xl font-light"></i>
            </button>

            {openSort && (
              <div className="absolute top-full left-0 mt-3 bg-white shadow-xl border border-gray-100 rounded-[16px] w-[260px] z-50 overflow-hidden animate-fadeIn">
                <div className="flex flex-col">
                  {["Most viewed", "Newest", "Urgent"].map((option, index) => {
                    const isSelected = filters.posted.includes(option);
                    return (
                      <div
                        key={option}
                        onClick={() => {
                          // Toggle logic
                          setFilters(prev => {
                            const current = prev.posted || [];
                            // Single Select Logic if preferred, or Multi? Image shows radio-like behavior?
                            // User requirement implies these might be toggles. Let's keep multi for flexibility unless instructed.
                            // Actually, sort usually implies single selection, but user checkboxes imply multi.
                            // Let's allow multi but visually handle it.
                            const updated = current.includes(option)
                              ? current.filter(item => item !== option)
                              : [...current, option];
                            return { ...prev, posted: updated };
                          });
                          setCurrentPage(1);
                        }}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                          // Gradient background for the whole row? Or just hovered?
                          // User image has a gray gradient background for the item.
                          // Let's apply a subtle gradient to the row.
                          "bg-gradient-to-r from-[#F2F2F2] to-white border-b border-gray-100 last:border-0 hover:from-gray-200"
                          }`}
                      >
                        {/* Checkbox Styled as Rounded Square */}
                        <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center mr-3 transition-colors ${isSelected
                          ? "border-black text-black"
                          : "border-black bg-transparent"
                          }`}>
                          {/* Checkmark always visible if selected */}
                          {isSelected && <i className="ri-check-line text-sm font-bold"></i>}
                        </div>

                        {/* Label */}
                        <span className="text-[15px] font-medium text-black">
                          {option}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* FILTER DROPDOWN (Pixel Perfect Accordion) */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setOpenFilter(!openFilter)}
              className="flex items-center gap-2 px-6 py-3 bg-[#E0E0E0] rounded-[12px] text-base font-bold text-[#1C1C1C] hover:bg-[#d4d4d4] transition-colors"
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              <i className="ri-filter-3-line ml-2"></i>
            </button>

            {openFilter && (
              <div className="absolute top-full right-0 mt-3 bg-white shadow-2xl border border-gray-100 rounded-[16px] w-[280px] md:w-[320px] max-h-[600px] overflow-y-auto z-50 p-4 animate-fadeIn">

                <div className="flex justify-between items-center px-1 py-1 border-b mb-3 pb-2">
                  <span className="font-bold text-sm">Filter By</span>
                  <button
                    onClick={() => {
                      setFilters({ education: [], jobType: [], industry: [], experience: [], posted: [] });
                      setSortType("Sort");
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Clear all
                  </button>
                </div>

                {filterCategories.map((category) => (
                  <div key={category.id} className="mb-4">
                    {/* Header */}
                    <button
                      onClick={() => toggleSection(category.id)}
                      className="flex justify-between items-center w-full mb-2"
                    >
                      <h4 className="text-[16px] font-medium text-black">
                        {category.label}
                      </h4>
                      {expandedSections[category.id] ? (
                        <i className="ri-arrow-up-s-line text-xl text-black"></i>
                      ) : (
                        <i className="ri-arrow-down-s-line text-xl text-black"></i>
                      )}
                    </button>

                    {/* Options */}
                    {expandedSections[category.id] && (
                      <div className="space-y-2">
                        {category.options.map((option) => {
                          const isSelected = filters[category.id]?.includes(option);
                          return (
                            <div
                              key={option}
                              onClick={() => toggleFilter(category.id, option)}
                              className="flex items-center group cursor-pointer"
                            >
                              {/* Custom Checkbox Look */}
                              <div className={`w-5 h-5 rounded-[4px] border flex items-center justify-center mr-3 transition-colors ${isSelected ? "bg-[#1C1C1C] border-[#1C1C1C]" : "bg-transparent border-gray-400 group-hover:border-black"
                                }`}>
                                {isSelected && <i className="ri-check-line text-white text-xs"></i>}
                              </div>

                              {/* Label with striped background style */}
                              <div className="flex-grow py-2 px-3 bg-gradient-to-r from-gray-100 to-transparent rounded-md text-[14px] text-gray-800 font-medium">
                                {option}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>

        {/* 4. Job Listings */}
        <div className="flex flex-col gap-6 max-w-[1200px] mx-auto mb-16">
          {loading && <p className="text-center">Loading jobs...</p>}

          {!loading && currentJobs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
              <button
                onClick={() => {
                  setFilters({ education: [], jobType: [], industry: [], experience: [], posted: [] });
                  setSortType("Sort");
                  setOpenFilter(false);
                }}
                className="mt-4 text-[#FFB300] font-bold hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {!loading &&
            currentJobs.map((job, idx) => (
              <JobCard
                key={job._id || idx}
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


        {/* 5. Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>
    </section>
  );
};

export default JobSection;
