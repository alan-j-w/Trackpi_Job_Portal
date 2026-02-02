import { useState, useEffect } from "react";
import { Users, Shield, Edit, Trash2, Search, X, Copy } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";
import { getUserRole } from "../../utils/auth";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null);
    const [selectedAdmins, setSelectedAdmins] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(7);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roleId: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUserRole = getUserRole();
    const isSuperAdmin = currentUserRole === "superadmin";

    useEffect(() => {
        fetchAdmins();
        fetchRoles();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/users?role=admin,superadmin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend now filters for us
            const adminUsers = response.data;
            setAdmins(adminUsers);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = (admin) => {
        // Find role based on user permissions or if backend sends roleId
        let matchedRoleId = "";
        if (roles.length > 0) matchedRoleId = roles[0]._id; // Default fallback

        setFormData({
            name: admin.name,
            email: admin.email,
            password: "", // Don't show password
            roleId: matchedRoleId
        });
        setEditingAdminId(admin._id);
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        // Optimistic update
        setAdmins(admins.map(admin => admin._id === id ? { ...admin, status: newStatus } : admin));

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/admin/admin-status/${id}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error updating status:", error);
            // Revert on error
            setAdmins(admins.map(admin => admin._id === id ? { ...admin, status: currentStatus } : admin));
            alert("Failed to update status");
        }
    };

    const handleCopyPassword = () => {
        navigator.clipboard.writeText("********");
        alert("Password copied to clipboard (Mock)");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this admin? They will be demoted to a Job Seeker.")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/api/admin/remove-admin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmins(admins.filter(a => a._id !== id));
            setSelectedAdmins(selectedAdmins.filter(adminId => adminId !== id));
        } catch (error) {
            console.error("Error deleting admin:", error);
            alert("Failed to remove admin");
        }
    };

    const handleBulkDelete = async () => {
        if (selectedAdmins.length === 0) return;
        if (!window.confirm(`Are you sure you want to remove ${selectedAdmins.length} admins?`)) return;

        // Implement bulk delete logic (calls single delete for now or bulk API if exists)
        // For efficiency, we should have a bulk API, but loop is okay for now.
        for (const id of selectedAdmins) {
            await handleDelete(id); // Use the existing function but maybe suppress alerts or optimise?
        }
        // Ideally: await axios.post('/api/admin/bulk-remove', { ids: selectedAdmins }) ...
        setSelectedAdmins([]);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked || e.type === 'click') { // checkbox or link click
            const ids = filteredAdmins.map(a => a._id);
            setSelectedAdmins(ids);
        } else {
            setSelectedAdmins([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedAdmins.includes(id)) {
            setSelectedAdmins(selectedAdmins.filter(aid => aid !== id));
        } else {
            setSelectedAdmins([...selectedAdmins, id]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            if (editingAdminId) {
                await axios.put(`${API_URL}/api/admin/users/${editingAdminId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin details updated successfully!");
                fetchAdmins();
            } else {
                if (!formData.roleId) {
                    alert("Role is required for new admin");
                    setIsSubmitting(false);
                    return;
                }
                await axios.post(`${API_URL}/api/admin/create-admin`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin created successfully!");
                fetchAdmins();
            }
            closeModal();
        } catch (error) {
            console.error("Error saving admin:", error);
            alert(error.response?.data?.message || "Failed to save admin");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAdminId(null);
        setFormData({ name: "", email: "", password: "", roleId: "" });
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic (Mock for now, just slicing if needed or visual)
    // For now showing all filteredAdmins but adhering to "7 items" selector visual

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-8">
                {/* Search Bar */}
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for candidates"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB300] shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Add Admin Button - Super Admin Only */}
                {isSuperAdmin && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white border text-black px-6 py-3 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center min-w-[140px]"
                        style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.05)" }}
                    >
                        Add admin +
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black">Admin management</h2>
                {isSuperAdmin && (
                    <button
                        onClick={() => handleSelectAll({ target: { checked: true }, type: 'click' })}
                        className="text-[#FFB300] font-medium hover:underline text-sm flex items-center"
                    >
                        Select all <span className="ml-1">→</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl border border-[#FFB300] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white text-gray-900 font-semibold text-sm">
                            <th className="p-4 w-12 text-center text-gray-500">Sl No</th>
                            <th className="p-4 font-semibold">Username</th>
                            <th className="p-4 font-semibold">Email ID</th>
                            <th className="p-4 font-semibold">Admin Type</th>
                            {isSuperAdmin && <th className="p-4 text-center font-semibold">Action</th>}
                            {isSuperAdmin && <th className="p-4 text-center font-semibold">Status</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredAdmins.length === 0 ? (
                            <tr><td colSpan="7" className="p-8 text-center text-gray-500">No admins found.</td></tr>
                        ) : (
                            filteredAdmins.map((admin, index) => (
                                <tr key={admin._id} className="hover:bg-gray-50 transition text-sm group">
                                    <td className="p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            {isSuperAdmin && (
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAdmins.includes(admin._id)}
                                                    onChange={() => handleSelectOne(admin._id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-[#FFB300] focus:ring-[#FFB300]"
                                                />
                                            )}
                                            <span className="text-gray-900 font-medium">{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-900 font-medium align-middle">{admin.name}</td>
                                    <td className="p-4 text-gray-600 align-middle">{admin.email}</td>
                                    <td className="p-4 text-gray-700 align-middle">
                                        {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                    </td>
                                    {isSuperAdmin && (
                                        <td className="p-4 text-center align-middle">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(admin)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-gray-600 transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin._id)}
                                                    className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 rounded text-red-500 transition"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {isSuperAdmin && (
                                        <td className="p-4 text-center align-middle">
                                            <div className="inline-flex rounded-full border border-gray-200 p-0.5 bg-white">
                                                <button
                                                    onClick={() => handleStatusToggle(admin._id, admin.status)}
                                                    disabled={admin.status === 'active'}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${admin.status === 'active'
                                                        ? 'bg-[#FFB300] text-white shadow-sm'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Activate
                                                </button>
                                                <button
                                                    onClick={() => handleStatusToggle(admin._id, admin.status)}
                                                    disabled={admin.status === 'inactive'}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${admin.status === 'inactive'
                                                        ? 'bg-red-600 text-white shadow-sm'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer with Bulk Actions and Pagination */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                    {isSuperAdmin && (
                        <>
                            <span className="text-sm text-gray-600">Selected <span className="font-bold text-[#FFB300]">{selectedAdmins.length}</span> items</span>
                            {selectedAdmins.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="text-[#FFB300] text-sm hover:underline flex items-center"
                                >
                                    Delete <span className="ml-1">→</span>
                                </button>
                            )}
                        </>
                    )}
                </div>

                <div className="relative">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="appearance-none bg-white border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm"
                    >
                        <option value={7}>7</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
                        {/* Close button removed as per design image usually doesn't have top-right X if Cancel button exists, but keeping for UX or making hidden if strictly following image. Image doesn't show X, but Cancel button. I'll keep X for accessibility but maybe cleaner to rely on Cancel. Let's remove X to match "pop this" image style strictly? No, X is always good. I'll keep it subtle or remove if requested. Image doesn't show it. Let's remove it and rely on Cancel. */}

                        <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">{editingAdminId ? "Edit Admin" : "Add Admin"}</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-6">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">User Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Username"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Email ID */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email ID"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Admin Type */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Admin Type</label>
                                    <div className="relative">
                                        <select
                                            name="roleId"
                                            value={formData.roleId}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#FFB300] focus:border-transparent transition shadow-sm cursor-pointer"
                                            required={!editingAdminId}
                                        >
                                            <option value="" disabled>Admin Type</option>
                                            {roles.map(role => (
                                                <option key={role._id} value={role._id}>{role.name}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center mt-8 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-12 py-3 bg-[#FFB300] hover:bg-[#ffca2c] text-white font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                                >
                                    {isSubmitting ? "Saving..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-12 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
