import { useState, useEffect } from "react";
import { Eye, Trash2, FileText, Search, Filter, ArrowUpDown } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import { API_URL } from "../../config";
import DeleteUserModal from "../../components/admin/DeleteUserModal";


const Toggle = ({ checked, onChange, disabled }) => {
    return (
        <button
            disabled={disabled}
            onClick={onChange}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
};

const CircularProgress = ({ percentage }) => {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Progress Color Logic
    let color = "text-[#FFB300]"; // Default Yellow/Orange
    if (percentage > 75) color = "text-green-500";
    if (percentage < 25) color = "text-red-500";

    return (
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-200"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
                <circle
                    className={color}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="20"
                    cy="20"
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">{percentage}%</span>
        </div>
    );
};

const AdminApplicants = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({ totalCount: 0, pendingCount: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    const { jobId } = useParams();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [candidateToDelete, setCandidateToDelete] = useState(null);

    const isPendingFilter = new URLSearchParams(location.search).get("filter") === "pending";

    const isSignupPage = location.pathname.includes("signup");
    const PERM_RESUME = isSignupPage ? PERMISSIONS.SIGNUP_RESUME : PERMISSIONS.APPLICANTS_RESUME;
    const PERM_DELETE = isSignupPage ? PERMISSIONS.SIGNUP_DELETE : PERMISSIONS.APPLICANTS_DELETE;
    const PERM_VIEW_DETAILS = isSignupPage ? PERMISSIONS.SIGNUP_VIEW_DETAILS : PERMISSIONS.APPLICANTS_VIEW_DETAILS;


    // Calculate profile completion percentage
    const calculateProgress = (user, profile) => {
        if (!profile) return 0;
        const fields = [
            profile.fullName,
            profile.phone,
            profile.email,
            profile.location?.city,
            profile.gender,
            profile.resumeUrl,
            profile.profileImage
        ];
        const filledFields = fields.filter(f => f && f.length > 0).length;
        // Basic logic: 7 fields = 100%
        return Math.round((filledFields / 7) * 100);
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem("token");
                let endpoint = jobId 
                    ? `${API_URL}/api/admin/jobs/${jobId}/applicants`
                    : `${API_URL}/api/admin/candidates`;
                
                if (isPendingFilter && jobId) {
                    endpoint += "?status=pending";
                }
                
                const response = await fetch(endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch candidates");

                const result = await response.json();
                const data = jobId ? result.applicants : result;

                if (jobId) {
                    setStats({ totalCount: result.totalCount, pendingCount: result.pendingCount });
                }

                const formattedData = data.map(user => ({
                    id: user._id,
                    name: user.name,
                    role: user.profile?.jobTitle || (user.experience ? `${user.experience}` : "N/A"),
                    phone: user.profile?.phone || user.phone || "N/A",
                    email: user.email,
                    gender: user.profile?.gender || "N/A",
                    resume: user.profile?.resumeUrl || user.resumeUrl,
                    isChecked: user.isChecked,
                    applicationId: user.applicationId
                }));

                setCandidates(formattedData);
            } catch (err) {
                console.error("Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [jobId, location.search]);

    const handleToggleCheck = async (candidate) => {
        // If in pending view, "can only toggled to checked"
        if (isPendingFilter && candidate.isChecked) return;

        try {
            const token = localStorage.getItem("token");
            const newStatus = !candidate.isChecked;
            
            const appId = candidate.applicationId || candidate.id;
            const response = await fetch(`${API_URL}/api/admin/applications/${appId}/toggle-check`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ isChecked: newStatus })
            });

            if (!response.ok) throw new Error("Failed to update status");

            // Optimistic update
            if (isPendingFilter && newStatus) {
                // If it becomes checked in pending view, remove it
                setCandidates(candidates.filter(c => c.applicationId !== appId && c.id !== appId));
                // Decrease pending count
                setStats(prev => ({ ...prev, pendingCount: Math.max(0, prev.pendingCount - 1) }));
            } else {
                setCandidates(candidates.map(c => 
                    (c.applicationId === appId || c.id === appId) ? { ...c, isChecked: newStatus } : c
                ));
                // Adjust pending count if in jobId view
                if (jobId) {
                    setStats(prev => ({ 
                        ...prev, 
                        pendingCount: newStatus ? Math.max(0, prev.pendingCount - 1) : prev.pendingCount + 1 
                    }));
                }
            }
        } catch (err) {
            console.error("Error toggling status:", err);
            alert("Failed to update application status");
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(candidates.map(c => c.applicationId || c.id));
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

    const handleDeleteClick = (id) => {
        setCandidateToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!candidateToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/candidates/${candidateToDelete}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Failed to delete candidate");

            setCandidates(candidates.filter(c => c.id !== candidateToDelete));
            setSelectedIds(selectedIds.filter(sid => sid !== candidateToDelete));
            setIsDeleteModalOpen(false);
            setCandidateToDelete(null);
        } catch (err) {
            console.error("Error deleting candidate:", err);
            alert("Failed to delete candidate");
        }
    };

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-8 min-h-[90vh]">
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isPendingFilter ? "Pending candidates" : jobId ? "All candidates" : isSignupPage ? "Signup candidates" : "Job applicants"}
                    </h1>
                    {jobId && (
                        <div className="flex gap-4 text-sm font-medium">
                            <span className="text-gray-500">Total: <span className="text-gray-900">{stats.totalCount}</span></span>
                            <span className="text-gray-500">Pending: <span className="text-red-500">{stats.pendingCount}</span></span>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-auto text-right">
                    <button
                        onClick={() => setSelectedIds(candidates.map(c => c.id))}
                        className="text-[#FFB300] font-semibold hover:underline flex items-center justify-end gap-1 text-sm cursor-pointer"
                    >
                        Select all <span className="text-[#FFB300]">→</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for jobs or candidates"
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB300] text-gray-600 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto justify-end">
                    <button className="flex items-center gap-2 px-6 py-2 border border-black rounded-lg hover:bg-gray-50 text-black text-sm font-medium transition shadow-sm">
                        Filter <Filter size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gray-100 border border-black rounded-lg hover:bg-gray-200 text-black text-sm font-medium transition shadow-sm">
                        Sort <ArrowUpDown size={14} />
                    </button>
                </div>
            </div>

            {/* Selection Status */}
            {selectedIds.length > 0 && (
                <div className="mb-4 text-sm text-gray-600 flex items-center justify-between bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <span>Selected <span className="font-bold text-[#FFB300]">{selectedIds.length}</span> items</span>
                    {hasPermission(PERM_DELETE) && (
                        <button className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center gap-1">
                            Delete items <span className="text-lg">→</span>
                        </button>
                    )}
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                <th className="p-4 w-[50px] text-left"></th> {/* Checkbox Column */}
                                <th className="p-4 min-w-[150px] font-normal text-center">Applicants Name</th>
                                <th className="p-4 font-normal text-center">Job role</th>
                                <th className="p-4 font-normal text-center">Phone Number</th>
                                <th className="p-4 font-normal text-center">Email</th>
                                <th className="p-4 font-normal text-center">Gender</th>
                                <th className="p-4 font-normal text-center">Resume</th>
                                <th className="p-4 font-normal text-center">Action</th>
                                <th className="p-4 font-normal text-center">{jobId ? "Status" : "Progress Bar"}</th>
                            </tr>
                        </thead>
                        <tbody className="text-black text-sm font-medium">
                            {loading ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-500">Loading candidates...</td></tr>
                            ) : filteredCandidates.length === 0 ? (
                                <tr><td colSpan="9" className="p-10 text-center text-gray-500">No candidates found</td></tr>
                            ) : (
                                filteredCandidates.map((candidate) => (
                                    <tr key={candidate.applicationId || candidate.id} className="border-b border-gray-200 hover:bg-yellow-50/10 transition group">
                                        <td className="p-4 text-left">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-400 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer"
                                                checked={selectedIds.includes(candidate.applicationId || candidate.id)}
                                                onChange={() => handleSelectOne(candidate.applicationId || candidate.id)}
                                            />
                                        </td>
                                        <td className="p-4 text-gray-900 font-semibold text-center">{candidate.name}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.role}</td>
                                        <td className="p-4 text-gray-800 font-medium text-center">{candidate.phone}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.email}</td>
                                        <td className="p-4 text-gray-800 text-center">{candidate.gender}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {candidate.resume && hasPermission(PERM_RESUME) ? (
                                                    <a href={candidate.resume} target="_blank" rel="noopener noreferrer"
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition text-gray-700">
                                                        <FileText size={18} />
                                                    </a>
                                                ) : (
                                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded text-gray-300 cursor-not-allowed">
                                                        <FileText size={18} />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex gap-2 justify-center">
                                                {hasPermission(PERM_VIEW_DETAILS) && (
                                                    <button
                                                        onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
                                                        className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                )}
                                                {hasPermission(PERM_DELETE) && (
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded hover:bg-red-200 transition"
                                                        title="Delete"
                                                        onClick={() => handleDeleteClick(candidate.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center">
                                                {jobId ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Toggle 
                                                            checked={candidate.isChecked} 
                                                            onChange={() => handleToggleCheck(candidate)}
                                                            disabled={isPendingFilter && candidate.isChecked}
                                                        />
                                                        <span className={`text-[10px] font-bold ${candidate.isChecked ? 'text-green-600' : 'text-gray-400'}`}>
                                                            {candidate.isChecked ? 'Checked' : 'Unchecked'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <CircularProgress percentage={candidate.progress || 0} />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="flex justify-end mt-8">
                    <div className="flex items-center gap-2 border border-black rounded px-3 py-1 bg-white shadow-sm cursor-pointer hover:bg-gray-50">
                        <span className="text-sm font-bold text-gray-900">6</span>
                        <ArrowUpDown size={14} className="text-gray-500" />
                    </div>
                </div>
            </div>
            {/* Delete Modal */}
            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete candidates"
                message="Sure you want to delete"
            />
        </div>
    );
};

export default AdminApplicants;
