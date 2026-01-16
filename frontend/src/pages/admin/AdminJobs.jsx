import { useState } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";

const AdminJobs = () => {
    // Mock Data
    const [jobs, setJobs] = useState([
        { id: 1, title: "Senior React Developer", company: "TechCorp", type: "Full-time", posted: "2023-10-12", applicants: 45, status: "Active" },
        { id: 2, title: "UX Designer", company: "DesignStudio", type: "Contract", posted: "2023-10-15", applicants: 12, status: "Active" },
        { id: 3, title: "Backend Engineer", company: "SysSol", type: "Full-time", posted: "2023-10-10", applicants: 28, status: "Closed" },
        { id: 4, title: "Marketing Manager", company: "GrowthHacks", type: "Part-time", posted: "2023-10-18", applicants: 8, status: "Active" },
    ]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            setJobs(jobs.filter(job => job.id !== id));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Job Management</h2>
                <button className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition shadow-md">
                    <Plus size={18} />
                    <span>Post New Job</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 rounded-tl-lg">Job Title</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Posted Date</th>
                            <th className="p-4">Applicants</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                        {jobs.map((job) => (
                            <tr key={job.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{job.title}</td>
                                <td className="p-4">{job.company}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs">
                                        {job.type}
                                    </span>
                                </td>
                                <td className="p-4">{job.posted}</td>
                                <td className="p-4 font-semibold">{job.applicants}</td>
                                <td className="p-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200" title="View">
                                            <Eye size={16} />
                                        </button>
                                        <button className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100" title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-4 flex justify-between items-center text-gray-500 text-sm">
                <span>Showing 1 to {jobs.length} of {jobs.length} entries</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                </div>
            </div>
        </div>
    );
};

export default AdminJobs;
