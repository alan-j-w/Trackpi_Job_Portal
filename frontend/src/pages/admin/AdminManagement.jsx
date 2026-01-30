import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Edit, CheckCircle, XCircle, Copy, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        roleId: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingAdminId, setEditingAdminId] = useState(null);

    useEffect(() => {
        fetchAdmins();
        fetchRoles();
    }, []);

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/admin/users?role=admin", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:8000/api/admin/permissions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied directly to clipboard!");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this admin? They will be demoted to a Job Seeker.")) return;

        try {
            const token = localStorage.getItem("token");
            // Use PUT to demote/remove admin instead of DELETE
            await axios.put(`http://localhost:8000/api/admin/remove-admin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdmins(admins.filter(a => a._id !== id));
            alert("Admin removed and demoted successfully.");
        } catch (error) {
            console.error("Error deleting admin:", error);
            alert("Failed to remove admin");
        }
    };

    const handleEdit = (admin) => {
        // Find role based on user permissions or other logic if needed, 
        // essentially reverse engineering roleId from permissions if we don't have it.
        // But for now, let's try to match the user's permissions to a role.
        let matchedRoleId = "";

        // Find role that has this user in its users list
        const foundRole = roles.find(r => r.users.some(u => u._id === admin._id || u === admin._id));
        if (foundRole) {
            matchedRoleId = foundRole._id;
        }

        setFormData({
            name: admin.name,
            email: admin.email,
            password: "", // Password update not supported here or kept blank
            roleId: matchedRoleId
        });
        setEditingAdminId(admin._id);
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:8000/api/admin/admin-status/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update local state
            setAdmins(admins.map(admin =>
                admin._id === id ? { ...admin, status: newStatus } : admin
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Password is optional for edit, but maybe we shouldn't even send it if empty
        if (!formData.name || !formData.email) {
            alert("Name and Email are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            if (editingAdminId) {
                // Update implementation
                await axios.put(`http://localhost:8000/api/admin/users/${editingAdminId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin details updated successfully!");
            } else {
                // Create implementation
                if (!formData.roleId) {
                    alert("Role is required for new admin");
                    setIsSubmitting(false);
                    return;
                }
                await axios.post("http://localhost:8000/api/admin/create-admin", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Admin added/promoted successfully!");
            }

            setIsModalOpen(false);
            setFormData({ name: "", email: "", password: "", roleId: "" });
            setEditingAdminId(null);
            fetchAdmins(); // Refresh list
            fetchRoles(); // Refresh roles
        } catch (error) {
            console.error("Error saving admin:", error);
            alert(error.response?.data?.message || "Failed to save admin");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", password: "", roleId: "" });
        setEditingAdminId(null);
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-white min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for admins..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFB300] focus:border-[#FFB300] outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingAdminId(null);
                        setFormData({ name: "", email: "", password: "", roleId: "" });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-black px-6 py-3 rounded-lg font-bold transition shadow-sm">
                    Add admin <Plus size={18} />
                </button>
            </div>

            <h2 className="text-xl font-bold mb-4">Admin management</h2>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-bold text-sm">
                                <th className="p-4 w-12 text-center whitespace-nowrap">SI No</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email ID</th>
                                {/* <th className="p-4">Password</th> */}
                                <th className="p-4">Admin Type</th>
                                <th className="p-4 text-center">Edit</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredAdmins.length === 0 ? (
                                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No admins found.</td></tr>
                            ) : (
                                filteredAdmins.map((admin, index) => {
                                    // Try to determine role name. Assuming permissions match a role or user has role string
                                    // Since we assign permissions directly, mapping back to a role name is tricky unless we store roleId in user.
                                    // For now, let's look for a role that matches the permissions length/content or just show "Custom" if not found.
                                    // Ideally, User model should store 'adminRoleId' ref. 
                                    // The controller we wrote just sets permissions.
                                    // Let's just show "Admin" or check if superadmin.
                                    // Determine Admin Type
                                    let adminType = "Admin";
                                    if (admin.role === "superadmin") {
                                        adminType = "Super Admin";
                                    } else {
                                        // Find which role this user belongs to
                                        // roles state contains all AdminRoles with populated users
                                        const foundRole = roles.find(r => r.users.some(u => u._id === admin._id || u === admin._id));
                                        if (foundRole) {
                                            adminType = foundRole.name;
                                        } else {
                                            adminType = "Custom / No Role";
                                        }
                                    }

                                    return (
                                        <tr key={admin._id} className="hover:bg-yellow-50/20 transition">
                                            <td className="p-4 text-center font-medium">{index + 1}</td>
                                            <td className="p-4 font-medium">{admin.name}</td>
                                            <td className="p-4 text-gray-600">{admin.email}</td>
                                            {/* 
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <span>Password</span>
                                                    <Copy size={14} className="cursor-pointer hover:text-[#FFB300]" onClick={() => handleCopy("Cannot copy actual password")} />
                                                </div>
                                            </td>
                                            */}
                                            <td className="p-4">{adminType}</td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(admin)}
                                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                                                        <Edit size={16} className="text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(admin._id)}
                                                        className="p-2 bg-red-100 rounded hover:bg-red-200">
                                                        <Trash2 size={16} className="text-red-500" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center">
                                                    <div className="inline-flex rounded-full shadow-sm border border-gray-200 p-0.5 bg-gray-50">
                                                        <button
                                                            onClick={() => handleStatusToggle(admin._id, 'active')}
                                                            className={`px-4 py-1.5 text-xs font-bold rounded-l-full transition-all duration-200 ${admin.status === 'active'
                                                                ? 'bg-[#FFB300] text-black shadow-sm'
                                                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                                                                }`}
                                                        >
                                                            Activate
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusToggle(admin._id, 'inactive')}
                                                            className={`px-4 py-1.5 text-xs font-bold rounded-r-full transition-all duration-200 ${admin.status === 'inactive'
                                                                ? 'bg-red-500 text-white shadow-sm'
                                                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                                                                }`}
                                                        >
                                                            Deactivate
                                                        </button>
                                                    </div>
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

            {/* Footer Pagination Mock */}
            <div className="mt-4 text-gray-500 text-sm">
                Selected <span className="text-[#FFB300] font-bold">0</span> items
            </div>

            {/* Add Admin Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-10 w-full max-w-2xl shadow-2xl relative">
                        <h2 className="text-2xl font-bold text-center mb-8">{editingAdminId ? "Edit Admin" : "Add Admin"}</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md mx-auto w-full">
                            {/* Username */}
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-bold text-gray-700 text-center md:text-left">User Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Username"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB300] outline-none text-center md:text-left"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-bold text-gray-700 text-center md:text-left">Email ID</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email ID"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB300] outline-none text-center md:text-left"
                                />
                            </div>

                            {/* Password - REMOVED per user request (Auto-generated on backend) */}
                            {/* 
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-gray-700">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB300] outline-none"
                                />
                            </div>
                            */}

                            {/* Admin Type */}
                            <div className="flex flex-col gap-2 w-full">
                                <label className="font-bold text-gray-700 text-center md:text-left">Admin Type</label>
                                <div className="relative">
                                    <select
                                        name="roleId"
                                        value={formData.roleId}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FFB300] outline-none appearance-none bg-white text-center md:text-left"
                                    >
                                        <option value="">Select Admin Type</option>
                                        {roles.map(role => (
                                            <option key={role._id} value={role._id}>{role.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center gap-6 mt-6">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-12 py-3 bg-[#FFA500] hover:bg-[#ffb733] text-white font-bold rounded-xl transition shadow-md disabled:opacity-50 text-lg w-full md:w-auto">
                                    {isSubmitting ? "Submitting..." : "Submit"}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-12 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition shadow-md text-lg w-full md:w-auto">
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
