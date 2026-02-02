import { useState, useEffect } from "react";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../config";
import { getUserRole } from "../../utils/auth";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [roles, setRoles] = useState([]); // To populate Permission dropdown
    const [formData, setFormData] = useState({
        name: "",
        employeeId: "", // Not in DB yet, but in UI
        email: "",
        permission: "" // Role ID or Permission name
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUserRole = getUserRole();
    const isSuperAdmin = currentUserRole === "superadmin";
    const canManage = currentUserRole === "superadmin" || currentUserRole === "admin";

    const formatLastSeen = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return "N/A";

        const day = date.getDate().toString().padStart(2, '0');
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = months[date.getMonth()];

        let hour = date.getHours();
        const ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'
        const formattedHour = hour.toString().padStart(2, '0');

        const minute = date.getMinutes().toString().padStart(2, '0');

        return `(${day} ${month} - ${formattedHour}:${minute}${ampm})`;
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            // Filter by role=admin to exclude jobseekers
            const response = await axios.get(`${API_URL}/api/admin/users?role=superuser`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mappedUsers = response.data.map(user => ({
                ...user,
                // Mocking visual fields for now
                employeeId: user._id.substring(0, 8).toUpperCase(),
                lastSeen: user.lastLogin ? formatLastSeen(user.lastLogin) : "Never",
                // Display first permission or role name as "Permission"
                permission: user.permissions && user.permissions.length > 0 ? user.permissions[0] : "Admin Access"
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/api/admin/permissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(response.data);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u._id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(uid => uid !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            // Mapping UI fields to Backend API
            // 'User name' in UI -> email in Backend (as per common auth patterns)
            // 'Full name' -> name
            // 'Permission' dropdown -> roleId (assuming we assign a role)

            const payload = {
                name: formData.name,
                email: formData.email, // "User name" input
                roleId: formData.permission // Assuming dropdown values are Role IDs
            };

            await axios.post(`${API_URL}/api/admin/create-superuser`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("User created successfully");
            setIsModalOpen(false);
            fetchUsers();
            fetchRoles();
            setFormData({ name: "", employeeId: "", email: "", permission: "" });
        } catch (error) {
            console.error("Error creating user:", error);
            alert("Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 bg-white min-h-screen font-sans">
            <h2 className="text-2xl font-bold text-black mb-6">User management</h2>

            <div className="flex justify-between items-center mb-6">
                {/* Search Bar */}
                <div className="relative w-96">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search Employee id  or  User name"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB300]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Add User Button */}
                {canManage && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#FFB300] hover:bg-[#ffca2c] text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm text-black"
                    >
                        Add user +
                    </button>
                )}
            </div>

            <div className="flex justify-end mb-2">
                <button className="text-yellow-500 text-sm hover:underline">Select all &rarr;</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[#FFB300] text-gray-800 font-semibold text-sm">
                                {canManage && (
                                    <th className="p-4 pl-6 w-12">
                                        {/* Header Checkbox Removed */}
                                    </th>
                                )}
                                <th className="p-4">Employee I D</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Permission</th>
                                <th className="p-4">Last seen</th>
                                {canManage && <th className="p-4 pr-6 text-right">Action</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        {canManage && (
                                            <td className="p-4 pl-6 align-middle">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user._id)}
                                                    onChange={() => handleSelectOne(user._id)}
                                                    className="w-5 h-5 rounded border-gray-300 focus:ring-[#FFB300]"
                                                />
                                            </td>
                                        )}
                                        <td className="p-4 align-middle text-gray-700">{user.employeeId}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{user.name}</span>
                                                <span className="text-gray-500 text-sm">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle text-gray-700">
                                            {roles.find(r => r.users?.some(u => u._id === user._id))?.name || "Custom"}
                                        </td>
                                        <td className="p-4 align-middle text-gray-700">{user.lastSeen}</td>
                                        {canManage && (
                                            <td className="p-4 align-middle text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-1.5 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 transition">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="p-1.5 bg-red-100 rounded text-red-500 hover:bg-red-200 transition">
                                                        <Trash2 size={16} />
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

                {/* Footer */}
                <div className="flex justify-between items-center p-4 border-t border-gray-100">
                    <div className="flex gap-2 text-sm text-gray-600">
                        {canManage && (
                            <>
                                <span>Selected <span className="text-yellow-500 font-bold">{selectedUsers.length}</span> items</span>
                                {selectedUsers.length > 0 && (
                                    <button className="text-yellow-500 hover:underline">Delete &rarr;</button>
                                )}
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="appearance-none border border-black rounded px-3 py-1 pr-8 bg-white text-gray-900 focus:outline-none text-sm"
                        >
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <span className="text-xs">▼</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-2xl relative border border-gray-100">
                        <h3 className="text-xl font-bold mb-6 text-gray-900">User information</h3>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-8 mb-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="Aleena thomas"
                                            required
                                        />
                                    </div>

                                    {/* User Name (Email) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">User name</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="Aleena@thomas1245"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Employee ID */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Employee I D</label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={formData.employeeId}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400"
                                            placeholder="46863225"
                                        // Optional since backend doesn't support it yet
                                        />
                                    </div>

                                    {/* Permission */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Permission</label>
                                        <div className="relative">
                                            <select
                                                name="permission"
                                                value={formData.permission}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-400 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-yellow-400 bg-white"
                                                required
                                            >
                                                <option value="" disabled>Select Permission</option>
                                                {roles.map(role => (
                                                    <option key={role._id} value={role._id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                                <span className="text-xs">▼</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-center gap-6 mt-12">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-12 py-2 bg-gradient-to-r from-yellow-400 to-yellow-200 text-black font-medium rounded shadow-sm hover:shadow-md transition"
                                >
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-12 py-2 border border-gray-400 text-black font-medium rounded hover:bg-gray-50 transition"
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

export default UserManagement;
