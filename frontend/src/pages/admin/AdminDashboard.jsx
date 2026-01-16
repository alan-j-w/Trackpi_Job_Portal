import { Users, Briefcase, FileText, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
    const stats = [
        { title: "Total Candidates", count: "1,240", icon: Users, color: "bg-blue-500" },
        { title: "Active Jobs", count: "45", icon: Briefcase, color: "bg-green-500" },
        { title: "Resumes Built", count: "892", icon: FileText, color: "bg-purple-500" },
        { title: "Hired", count: "128", icon: CheckCircle, color: "bg-yellow-500" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.count}</h3>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} text-white bg-opacity-90`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-500">
                            <span>+4.5%</span>
                            <span className="text-gray-400 ml-2">from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section Placeholder */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center text-gray-400">
                Chart or Recent Activity Table will go here
            </div>
        </div>
    );
};

export default AdminDashboard;
