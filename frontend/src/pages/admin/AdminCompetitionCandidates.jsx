import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Download, Eye, ChevronDown, Filter, Trash2, X, FileText } from "lucide-react";
import { hasPermission } from "../../utils/auth";
import { PERMISSIONS } from "../../constants/permissions";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

const AdminCompetitionCandidates = () => {
    const token = localStorage.getItem("token");

    const [candidates, setCandidates] = useState([
        { _id: "1", name: "Angel", enrollmentId: "ENDG425028", department: "UI/UX Designer", phone: "87695674387", email: "angel13@gmail.com", status: "Pending", isLive: true, createdAt: new Date().toISOString() },
        { _id: "2", name: "Alona", enrollmentId: "ENDG354193", department: "MERN Stack Developer", phone: "9678564748", email: "alona@gmail.com", status: "Pass", isLive: true, createdAt: new Date().toISOString() },
        { _id: "3", name: "Akhil Joseph", enrollmentId: "ENDG784929", department: "Graphic Designer", phone: "9756875634", email: "akhi@gmail.com", status: "Pending", isLive: true, createdAt: new Date().toISOString() },
        { _id: "4", name: "Anju Joseph", enrollmentId: "ENDG106180", department: "HR", phone: "9856745676", email: "anju123@gmail.com", status: "Fail", isLive: true, createdAt: new Date().toISOString() },
        { _id: "5", name: "Dony", enrollmentId: "ENDG560550", department: "UI/UX Designer", phone: "87695674387", email: "joyal123@gmail.com", status: "Pass", isLive: true, createdAt: new Date().toISOString() }
    ]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Sort and Filter states
    const [sortOrder, setSortOrder] = useState("newest");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDept, setFilterDept] = useState("all");

    /* FETCH */
    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/candidates/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setCandidates(data.candidates || []);
            else toast.error(data.message);
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, []);

    /* HANDLERS */
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = (isLive) => {
        const targetList = isLive ? liveCandidates : previousCandidates;
        const targetIds = targetList.map(c => c._id);
        const allSelected = targetIds.every(id => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !targetIds.includes(id)));
        } else {
            setSelectedIds(prev => [...new Set([...prev, ...targetIds])]);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/candidates/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Candidate status updated to ${status}`);
                fetchCandidates();
            } else toast.error("Update failed");
        } catch {
            toast.error("Network error");
        }
    };

    const confirmBulkDelete = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/competitions/candidates/bulk-delete`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                toast.success("Candidates deleted");
                setSelectedIds([]);
                fetchCandidates();
            } else toast.error("Delete failed");
        } catch {
            toast.error("Network error");
        } finally {
            setIsDeleteModalOpen(false);
        }
    };

    /* FILTER & SORT */
    const filteredAndSorted = candidates
        .filter(c =>
            (c.name.toLowerCase().includes(search.toLowerCase()) || c.enrollmentId.toLowerCase().includes(search.toLowerCase())) &&
            (filterStatus === "all" || c.status.toLowerCase() === filterStatus.toLowerCase()) &&
            (filterDept === "all" || c.department.toLowerCase() === filterDept.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
            return 0;
        });

    const liveCandidates = filteredAndSorted.filter(c => c.isLive);
    const previousCandidates = filteredAndSorted.filter(c => !c.isLive);

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            {/* TOP BAR */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        placeholder="Search candidates or enrollment number"
                        className="w-full h-14 bg-white border border-gray-200 pl-14 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all font-medium shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <button className="h-10 px-6 bg-white border border-gray-200 rounded-xl flex items-center gap-3 font-bold text-sm text-gray-600 hover:border-yellow-400 transition-all shadow-sm">
                            Sort <ChevronDown size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                            <button onClick={() => setSortOrder("newest")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">Newest First</button>
                            <button onClick={() => setSortOrder("oldest")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">Oldest First</button>
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="h-10 px-6 bg-white border border-gray-200 rounded-xl flex items-center gap-3 font-bold text-sm text-gray-600 hover:border-yellow-400 transition-all shadow-sm">
                            Status <ChevronDown size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                            <button onClick={() => setFilterStatus("all")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">All Status</button>
                            <button onClick={() => setFilterStatus("pending")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">Pending</button>
                            <button onClick={() => setFilterStatus("pass")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">Pass</button>
                            <button onClick={() => setFilterStatus("fail")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">Fail</button>
                        </div>
                    </div>

                    <div className="relative group">
                        <button className="h-10 px-6 bg-white border border-gray-200 rounded-xl flex items-center gap-3 font-bold text-sm text-gray-600 hover:border-yellow-400 transition-all shadow-sm">
                            Department <Filter size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
                            <button onClick={() => setFilterDept("all")} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">All Departments</button>
                            <option className="hidden">---</option>
                            {["MERN Stack Developer", "UI/UX Designer", "Graphic Designer", "HR"].map(dept => (
                                <button key={dept} onClick={() => setFilterDept(dept)} className="w-full px-5 py-3 text-left text-sm font-medium hover:bg-yellow-50 text-gray-600">{dept}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTIONS */}
            <CandidateTableSection
                title="Live candidates"
                candidates={liveCandidates}
                loading={loading}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={() => toggleSelectAll(true)}
                handleUpdateStatus={handleUpdateStatus}
                hasEditPermission={hasPermission(PERMISSIONS.COMPETITION_CANDIDATES_EDIT)}
            />

            <CandidateTableSection
                title="Previous candidates"
                candidates={previousCandidates}
                loading={loading}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                toggleSelectAll={() => toggleSelectAll(false)}
                handleUpdateStatus={handleUpdateStatus}
                hasEditPermission={hasPermission(PERMISSIONS.COMPETITION_CANDIDATES_EDIT)}
                wrapperClass="mt-16"
            />

            {/* BULK ACTIONS */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white px-10 py-5 rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-10 animate-in slide-in-from-bottom-10 z-30">
                    <div className="text-gray-600 font-bold">Selected <span className="text-yellow-600">{selectedIds.length}</span> items</div>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs hover:underline decoration-2"
                    >
                        Delete <Trash2 size={16} />
                    </button>
                </div>
            )}

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmBulkDelete}
                title="Delete Candidates"
                message={`Are you sure you want to delete ${selectedIds.length} candidate(s)?`}
            />
        </div>
    );
};

/* ================= HELPER COMPONENTS ================= */

const CandidateTableSection = ({
    title,
    candidates,
    loading,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    handleUpdateStatus,
    hasEditPermission,
    wrapperClass = ""
}) => {
    return (
        <div className={wrapperClass}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h3>
                <button
                    onClick={toggleSelectAll}
                    className="text-yellow-600 font-bold text-sm underline underline-offset-4"
                >
                    Select All
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-yellow-400/30 text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                                <th className="p-6 text-center w-[60px]"></th>
                                <th className="p-6">Candidate Name</th>
                                <th className="p-6">Enrollment ID</th>
                                <th className="p-6">Department</th>
                                <th className="p-6">Phone Number</th>
                                <th className="p-6 text-center">Email</th>
                                <th className="p-6 text-center">Download</th>
                                <th className="p-6 text-center">Action</th>
                                <th className="p-6 text-center">Result</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="9" className="p-20 text-center text-gray-400 font-medium italic">Loading...</td></tr>
                            ) : candidates.length === 0 ? (
                                <tr><td colSpan="9" className="p-20 text-center text-gray-400 font-medium italic">No candidates found in this section.</td></tr>
                            ) : (
                                candidates.map((c) => (
                                    <tr key={c._id} className="hover:bg-yellow-50/20 transition-all font-medium text-gray-700">
                                        <td className="p-6">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(c._id)}
                                                    onChange={() => toggleSelect(c._id)}
                                                    className="w-5 h-5 rounded-lg border-2 border-gray-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer transition-all"
                                                />
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-900">{c.name}</td>
                                        <td className="p-6 font-black text-gray-900">{c.enrollmentId}</td>
                                        <td className="p-6">{c.department}</td>
                                        <td className="p-6">{c.phone}</td>
                                        <td className="p-6 text-center text-gray-400">{c.email}</td>
                                        <td className="p-6">
                                            <div className="flex justify-center">
                                                {c.taskUrl ? (
                                                    <button
                                                        onClick={() => window.open(`https://docs.google.com/viewer?url=${encodeURIComponent(c.taskUrl)}`, '_blank')}
                                                        title="View submitted task PDF"
                                                        className="p-2.5 bg-red-50 rounded-xl text-red-500 hover:bg-red-100 transition-all shadow-sm flex items-center justify-center"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        disabled
                                                        title="No task submitted yet"
                                                        className="p-2.5 bg-gray-100 rounded-xl text-gray-300 cursor-not-allowed shadow-sm"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center">
                                                <button className="p-2.5 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-all shadow-md shadow-yellow-200/50">
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center">
                                                <ResultToggle
                                                    status={c.status}
                                                    onUpdate={(val) => handleUpdateStatus(c._id, val)}
                                                    disabled={!hasEditPermission}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ResultToggle = ({ status, onUpdate, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getStatusStyle = (s) => {
        switch (s.toLowerCase()) {
            case "pass": return "bg-green-600 text-white border-green-600 hover:bg-green-700";
            case "fail": return "bg-red-600 text-white border-red-600 hover:bg-red-700";
            default: return "bg-white text-gray-700 border-gray-200 hover:border-yellow-400";
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`min-w-[100px] py-2 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-widest transition-all shadow-sm ${getStatusStyle(status)}`}
            >
                {status || "Pending"}
            </button>
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-2xl z-20 overflow-hidden animate-in zoom-in-95 duration-150">
                    {["Pending", "Pass", "Fail"].map(s => (
                        <button
                            key={s}
                            onClick={() => { onUpdate(s); setIsOpen(false); }}
                            className="w-full px-5 py-3 text-left text-[11px] font-black uppercase tracking-widest hover:bg-yellow-50 text-gray-700 border-b border-gray-50 last:border-0"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


export default AdminCompetitionCandidates;
