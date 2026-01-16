import { useState } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";

const AdminApplicants = () => {
    // Mock Data
    const [miners, setMiners] = useState([
        { id: 1, name: "John Doe", role: "Frontend Dev", experience: "3 Years", status: "Pending", date: "2023-11-01" },
        { id: 2, name: "Jane Smith", role: "Product Manager", experience: "5 Years", status: "Shortlisted", date: "2023-10-28" },
        { id: 3, name: "Mike Johnson", role: "Backend Dev", experience: "2 Years", status: "Rejected", date: "2023-11-02" },
        { id: 4, name: "Sarah Williams", role: "UX Designer", experience: "4 Years", status: "Pending", date: "2023-10-30" },
    ]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Job Applicants</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Candidate Name</th>
                            <th className="p-4">Applied Role</th>
                            <th className="p-4">Experience</th>
                            <th className="p-4">Applied Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {miners.map((applicant) => (
                            <tr key={applicant.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{applicant.name}</td>
                                <td className="p-4">{applicant.role}</td>
                                <td className="p-4">{applicant.experience}</td>
                                <td className="p-4">{applicant.date}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${applicant.status === "Shortlisted"
                                                ? "bg-green-100 text-green-700"
                                                : applicant.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {applicant.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200" title="View Profile">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100" title="Shortlist">
                                            <CheckCircle size={16} />
                                        </button>
                                        <button className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100" title="Reject">
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminApplicants;
