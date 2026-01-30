import { useState, useEffect } from "react";
import { FileText, Search, Trash2 } from "lucide-react"; // Icons
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";

const ResumeCandidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const PERM_DOWNLOAD = PERMISSIONS.RESUME_DOWNLOAD; // Assuming this permission exists or reuse reasonable one
    const PERM_DELETE = PERMISSIONS.APPLICANTS_DELETE; // Reuse delete permission

    useEffect(() => {
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:8000/api/admin/candidates", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to fetch candidates");

            const data = await response.json();

            // Filter for only those with resumes if needed, or just show all but highlight resumes
            // Requirement says "Resume build candidates", implying those who built a resume.
            // Let's filter for now to be safe, or show all. If the tab is specifically "Resume build", likely filtered.
            // Converting date to DD-MM-YYYY
            const formattedData = data
                .filter(user => user.profile?.resumeUrl) // Only showing those with resumes
                .map(user => {
                    const dateObj = new Date(user.createdAt);
                    const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${dateObj.getFullYear()}`;

                    return {
                        id: user._id,
                        name: user.name,
                        phone: user.profile?.phone || "N/A",
                        createDate: dateStr,
                        resumeUrl: user.profile?.resumeUrl
                    };
                });

            setCandidates(formattedData);
        } catch (err) {
            console.error("Error fetching candidates:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(candidates.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this candidate?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8000/api/admin/candidates/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete candidate");

            setCandidates(candidates.filter(c => c.id !== id));
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } catch (err) {
            console.error("Error deleting candidate:", err);
            alert("Failed to delete candidate");
        }
    };

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-8 min-h-[90vh]">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for candidates"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] text-gray-600 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold text-gray-900">Resume build candidates</h1>
                <button
                    onClick={() => setSelectedIds(candidates.map(c => c.id))}
                    className="text-[#FFB300] font-semibold hover:underline text-sm flex items-center gap-1"
                >
                    Select all <span className="text-lg">→</span>
                </button>
            </div>


            {/* Selection Status */}
            {selectedIds.length > 0 && (
                <div className="mb-4 text-sm text-gray-600 flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <span>Selected <span className="font-bold text-[#FFB300]">{selectedIds.length}</span> items</span>
                    <button className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1">
                        Delete <span className="text-lg">→</span>
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#FFB300] text-black text-[15px]">
                            <th className="p-4 w-[50px]">
                                {/* Header Checkbox if needed, or keep empty as per design image which seems to have individual boxes */}
                            </th>
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold text-center">Phone number</th>
                            <th className="p-4 font-semibold text-center">Create date</th>
                            <th className="p-4 font-semibold text-center">Resume</th>
                            <th className="p-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-black text-sm font-medium divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredCandidates.length === 0 ? (
                            <tr><td colSpan="6" className="p-10 text-center text-gray-500">No candidates found</td></tr>
                        ) : (
                            filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-yellow-50/10 transition">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-gray-400 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                                            checked={selectedIds.includes(candidate.id)}
                                            onChange={() => handleSelectOne(candidate.id)}
                                        />
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium">{candidate.name}</td>
                                    <td className="p-4 text-center text-gray-800">{candidate.phone}</td>
                                    <td className="p-4 text-center text-gray-600">{candidate.createDate}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <a
                                                href={candidate.resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download // Hint to browser to download
                                                className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition text-black"
                                                title="Download Resume"
                                            >
                                                <FileText size={16} fill="black" className="text-black" />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => handleDelete(candidate.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded hover:bg-red-200 transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Mock to match image */}
            <div className="flex justify-end mt-4">
                <div className="border border-gray-300 rounded px-3 py-1 bg-white text-sm font-bold shadow-sm">
                    6 ▼
                </div>
            </div>
        </div>
    );
};

export default ResumeCandidates;
