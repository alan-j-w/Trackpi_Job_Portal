import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, ExternalLink, Play, Search } from "lucide-react";

const AdminHiringPartners = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [hiringPartners, setHiringPartners] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    /* FETCH */
    const fetchHiringPartners = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/api/admin/hiringpartners?limit=100", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setHiringPartners(data.data || []);
            else toast.error(data.message);
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHiringPartners();
    }, []);

    /* FILTER */
    const filteredHiringPartners = hiringPartners.filter(
        (t) =>
            t.organizationname.toLowerCase().includes(search.toLowerCase()) ||
            t.email.toLowerCase().includes(search.toLowerCase())
    );

    /* DELETE */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete testimonial?")) return;
        await fetch(`http://localhost:8000/api/admin/hiringpartners/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Deleted");
        fetchHiringPartners();
    };

    /* SELECT */
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredHiringPartners.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredHiringPartners.map((t) => t._id));
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Delete ${selectedIds.length} testimonials?`)) return;

        await Promise.all(
            selectedIds.map((id) =>
                fetch(`http://localhost:8000/api/admin/hiringpartners/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                })
            )
        );

        toast.success("Deleted successfully");
        setSelectedIds([]);
        fetchHiringPartners();
    };

    return (
        <div className="p-6">
            {/* TOP */}
            <div className="flex justify-between mb-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        placeholder="Search for hiring partners"
                        className="w-[420px] h-[45px] border px-4 pl-10 rounded-lg outline-none focus:border-yellow-400 transition-colors"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => navigate("/admin/partners/add")}
                    className="bg-[#FFB300] text-white px-5 py-2 rounded-lg font-medium"
                >
                    Add more +
                </button>
            </div>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Our Hiring Partners</h1>
                <button
                    onClick={toggleSelectAll}
                    className="text-sm font-medium text-yellow-500 hover:text-yellow-600"
                >
                    {selectedIds.length === filteredHiringPartners.length && filteredHiringPartners.length > 0
                        ? "Unselect all →"
                        : "Select all →"}
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden p-3">
                <div className="grid grid-cols-12 px-4 py-3 border border-yellow-400 rounded-lg font-semibold text-center">
                    <div className="col-span-2 text-left">Organization Name</div>
                    <div className="col-span-2">Logo</div>
                    <div className="col-span-2">Email</div>
                    <div className="col-span-3 pl-14">About Company</div>
                    <div className="col-span-2 pl-4">Action</div>
                </div>

                {filteredHiringPartners.map((t) => (
                    <div
                        key={t._id}
                        className="grid grid-cols-12 px-3 py-5 border-b last:border-0 items-center text-center"
                    >
                        {/* NAME + CHECKBOX */}
                        <div className="col-span-2 flex items-center gap-3 text-left">
                            <input
                                type="checkbox"
                                className="w-3 h-3 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                checked={selectedIds.includes(t._id)}
                                onChange={() => toggleSelect(t._id)}
                            />
                            <span className="font-semibold">{t.organizationname}</span>
                        </div>

                        <div className="col-span-2 flex justify-center items-center">
                            <div className="w-[120px] h-[50px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-md border">
                                {t.logo?.url ? (
                                    <img src={t.logo.url} alt={t.organizationname} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                                        <span className="text-xs font-bold text-gray-400">NA</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-2 text-center font-semibold truncate px-2" title={t.email}>{t.email}</div>
                        <div className="col-span-3 pl-14 text-sm text-black-600 font-semibold leading-relaxed text-left">
                            {expandedId === t._id ? (
                                <>
                                    <p>{t.aboutcompany}</p>
                                    <span
                                        className="block mt-1 text-orange-500 cursor-pointer"
                                        onClick={() => setExpandedId(null)}
                                    >
                                        See less
                                    </span>
                                </>
                            ) : (
                                <>
                                    <p>{t.aboutcompany?.slice(0, 70)}...</p>
                                    <span
                                        className="block mt-1 text-orange-500 cursor-pointer"
                                        onClick={() => setExpandedId(t._id)}
                                    >
                                        See more.....
                                    </span>
                                </>
                            )}
                        </div>
                        <div className="col-span-3 pl-14 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/admin/partners/edit/${t._id}`)}
                                    className="p-2 bg-gray-300 rounded-lg"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => handleDelete(t._id)}
                                    className="p-2 bg-gray-300 text-red-600 rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <button
                                onClick={() => navigate(`/admin/partners/${t._id}`)}
                                className="flex items-center gap-1 text-orange-500 text-sm"
                            >
                                View Details <ExternalLink size={14} />
                            </button>
                        </div>

                    </div>
                ))}

                {!loading && filteredHiringPartners.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No hiring partners yet. Click <strong>Add more +</strong>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 mt-6 text-sm">
                    <span className="text-gray-600">
                        Selected <span className="text-yellow-500 font-bold">{selectedIds.length}</span> items
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="text-yellow-500 font-medium hover:underline flex items-center gap-1"
                    >
                        Delete →
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminHiringPartners;
