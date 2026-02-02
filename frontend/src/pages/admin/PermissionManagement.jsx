import { useState, useEffect } from "react";
import { Edit, Trash2, Search, Plus, UserCheck, Shield, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

const PermissionManagement = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this permission?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/api/admin/permissions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(roles.filter(role => role._id !== id));
        } catch (error) {
            console.error("Error deleting role:", error);
            alert("Failed to delete permission");
        }
    };

    const toggleSelect = (id) => {
        if (selectedRoles.includes(id)) {
            setSelectedRoles(selectedRoles.filter(roleId => roleId !== id));
        } else {
            setSelectedRoles([...selectedRoles, id]);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRoles(filteredRoles.map(role => role._id));
        } else {
            setSelectedRoles([]);
        }
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 bg-[#F8F9FA] min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Team Roles</h1>
                    <p className="text-gray-500 mt-1">Manage admin roles and their access permissions.</p>
                </div>

                <button
                    onClick={() => navigate("/admin/permissions/create")}
                    className="flex items-center gap-2 bg-[#FFB300] hover:bg-[#e09e00] text-black px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95 duration-200"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Create New Role
                </button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-[#FFB300] transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search roles..."
                        className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB300]/50 focus:border-[#FFB300] transition-all shadow-sm text-gray-700 placeholder-gray-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {selectedRoles.length > 0 && (
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
                        <span className="text-sm font-medium text-gray-600">
                            <span className="text-[#FFB300] font-bold">{selectedRoles.length}</span> selected
                        </span>
                        <div className="h-4 w-[1px] bg-gray-200"></div>
                        <button className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors">
                            <Trash2 size={14} /> Delete Selected
                        </button>
                    </div>
                )}
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-[#FFB300]/20 bg-gray-50/50">
                                <th className="p-5 pl-8 w-14">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <span className="text-[#FFB300] font-bold">#</span>
                                        </div>
                                    </div>
                                </th>
                                <th className="p-5 text-xs uppercase tracking-wider font-bold text-gray-500">Role Name</th>
                                <th className="p-5 text-xs uppercase tracking-wider font-bold text-gray-500">Assigned Admins</th>
                                <th className="p-5 text-xs uppercase tracking-wider font-bold text-gray-500">Created By</th>
                                <th className="p-5 text-xs uppercase tracking-wider font-bold text-gray-500">Created At</th>
                                <th className="p-5 pr-8 text-right text-xs uppercase tracking-wider font-bold text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-16 text-center text-gray-500 animate-pulse">Loading permissions...</td></tr>
                            ) : filteredRoles.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Shield size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-gray-500">No roles found</p>
                                            <p className="text-sm">Create a new role to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRoles.map((role) => {
                                    const createdDate = new Date(role.createdAt);
                                    const userCount = role.users?.length || 0;

                                    return (
                                        <tr key={role._id} className="group hover:bg-yellow-50/30 transition-colors duration-150">
                                            <td className="p-5 pl-8">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRoles.includes(role._id)}
                                                    onChange={() => toggleSelect(role._id)}
                                                    className="w-5 h-5 rounded-[4px] border-gray-300 text-[#FFB300] focus:ring-[#FFB300] cursor-pointer transition-all"
                                                />
                                            </td>
                                            <td className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#FFB300]/10 flex items-center justify-center text-[#FFB300]">
                                                        <Shield size={18} />
                                                    </div>
                                                    <span className="font-bold text-gray-900 text-sm md:text-base">{role.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${userCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <UserCheck size={12} />
                                                    {userCount} Admin{userCount !== 1 && 's'}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700">{role.createdBy?.name || "Unknown"}</span>
                                                    <span className="text-xs text-gray-400">Owner</span>
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col text-sm text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        <span>{createdDate.toLocaleDateString("en-GB")}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
                                                        <Clock size={10} />
                                                        <span>{createdDate.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-5 pr-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => navigate(`/admin/permissions/edit/${role._id}`)}
                                                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-[#FFB300] hover:text-white hover:border-[#FFB300] transition-all shadow-sm"
                                                        title="Edit Role"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(role._id)}
                                                        className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                                        title="Delete Role"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PermissionManagement;
