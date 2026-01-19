import { useState } from "react";
import { UserPlus, Trash2, Shield } from "lucide-react";

const AdminManagement = () => {
    // Mock Admin Data
    const [admins, setAdmins] = useState([
        { id: 1, name: "Admin One", email: "admin1@trackpi.com", role: "admin", status: "Active" },
        { id: 2, name: "Admin Two", email: "admin2@trackpi.com", role: "admin", status: "Active" },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this admin?")) {
            setAdmins(admins.filter(a => a.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Shield className="text-yellow-500" />
                        Admin Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage admin users and their access.</p>
                </div>
                <button className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition shadow-md">
                    <UserPlus size={18} />
                    <span>Add New Admin</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{admin.name}</td>
                                <td className="p-4">{admin.email}</td>
                                <td className="p-4 capitalize">{admin.role}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                        {admin.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                        title="Remove Admin"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminManagement;
