import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Briefcase,
    UserPlus,
    Users,
    FileText,
    Handshake,
    MessageSquare,
    ShieldCheck,
    Lock,
    FileInput,
    Megaphone,
    Trophy,
    Video,
    Award,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
import logo from "../assets/logo.png";
import { PERMISSIONS } from "../constants/permissions";
import { getUserRole, getDecodedToken } from "../utils/auth";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [openDropdowns, setOpenDropdowns] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const toggleDropdown = (name) => {
        setOpenDropdowns(prev => ({ ...prev, [name]: !prev[name] }));
        if (!isSidebarOpen) setIsSidebarOpen(true);
    };

    // Auth State
    const role = getUserRole();
    const decodedToken = getDecodedToken();
    const userPermissions = decodedToken?.permissions || [];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/admin/login");
    };

    // DEBUG: Fetch fresh permissions on mount
    const [debugPermissions, setDebugPermissions] = useState(null);
    useState(() => {
        const fetchMe = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setDebugPermissions(data.permissions);
            } catch (error) {
                console.error("Debug fetch failed:", error);
            }
        };
        fetchMe();
    }, []);

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, permission: PERMISSIONS.DASHBOARD_VIEW },
        { name: "Jobs", path: "/admin/jobs", icon: Briefcase, permission: PERMISSIONS.JOBS_VIEW },
        { name: "Signup candidates", path: "/admin/candidates/signup", icon: UserPlus, permission: PERMISSIONS.SIGNUP_VIEW },
        { name: "Job applicants", path: "/admin/candidates/applicants", icon: Users, permission: PERMISSIONS.APPLICANTS_VIEW },
        { name: "Resume candidates", path: "/admin/candidates/resume", icon: FileText, permission: PERMISSIONS.RESUME_VIEW },
        { name: "Our hiring partners", path: "/admin/partners", icon: Handshake, permission: PERMISSIONS.PARTNERS_VIEW },
        { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquare, permission: PERMISSIONS.TESTIMONIALS_VIEW },
        {
            name: "Role Management",
            icon: ShieldCheck,
            children: [
                { name: "Admin management", path: "/admin/management", icon: ShieldCheck, permission: PERMISSIONS.ADMIN_VIEW },
                { name: "User permission", path: "/admin/permissions", icon: Lock, permission: PERMISSIONS.ROLES_VIEW },
                { name: "User management", path: "/admin/users", icon: Users, permission: PERMISSIONS.USERS_VIEW },
            ]
        },
        { name: "Form management", path: "/admin/forms", icon: FileInput, permission: PERMISSIONS.FORMS_MANAGE },
        {
            name: "Talent League",
            icon: Trophy,
            children: [
                { name: "Ad competition", path: "/admin/competition", icon: Megaphone, permission: PERMISSIONS.COMPETITION_VIEW },
                { name: "Comp. Testimonials", path: "/admin/competition/testimonials", icon: MessageSquare, permission: PERMISSIONS.COMPETITION_TESTIMONIALS_VIEW },
                { name: "Comp. candidates", path: "/admin/competition/candidates", icon: Trophy, permission: PERMISSIONS.COMPETITION_CANDIDATES_VIEW },
                { name: "Video management", path: "/admin/videos", icon: Video, permission: PERMISSIONS.VIDEO_VIEW },
                { name: "Previous Winners", path: "/admin/winners", icon: Award, permission: PERMISSIONS.WINNERS_VIEW },
            ]
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } bg-white shadow-xl transition-all duration-300 flex flex-col fixed h-full z-20`}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="absolute -right-3 top-10 bg-yellow-400 p-1 rounded-full shadow-md hover:bg-yellow-500 transition"
                >
                    {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>

                {/* Logo */}
                <div className="h-20 flex items-center justify-center border-b border-gray-100">
                    {isSidebarOpen ? (
                        <img src={logo} alt="TrackPi" className="h-10" />
                    ) : (
                        <span className="text-xl font-bold text-yellow-500">TP</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                    <ul className="space-y-1 px-2">
                        {menuItems.map((item, index) => {
                            // Filter Logic
                            if (role !== "superadmin" && role !== "admin") {
                                if (item.superAdminOnly) return null;
                                if (item.children) {
                                    const visibleChildren = item.children.filter(child => userPermissions.includes(child.permission));
                                    if (visibleChildren.length === 0) return null;
                                } else if (item.permission && !userPermissions.includes(item.permission)) {
                                    return null;
                                }
                            }

                            // Additional check for Safe Admin Mode for Admin role
                            if (role === "admin" && item.superAdminOnly) {
                                return null;
                            }

                            // Dropdown Menu Item
                            if (item.children) {
                                const isActive = item.children.some((child) => location.pathname === child.path);
                                const isOpen = openDropdowns[item.name];

                                return (
                                    <li key={index} className="space-y-1">
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className={`
                                                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                                                ${isActive || isOpen
                                                    ? "bg-yellow-50 text-yellow-600"
                                                    : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                                                }
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={20} />
                                                {isSidebarOpen && (
                                                    <span className="font-medium text-sm whitespace-nowrap">
                                                        {item.name}
                                                    </span>
                                                )}
                                            </div>
                                            {isSidebarOpen && (
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                            )}
                                        </button>

                                        {isSidebarOpen && isOpen && (
                                            <ul className="mt-1 space-y-1">
                                                {item.children.map((child, childIdx) => {
                                                    if (role !== "superadmin" && role !== "admin" && !userPermissions.includes(child.permission)) return null;

                                                    const isChildActive = location.pathname === child.path;
                                                    return (
                                                        <li key={childIdx}>
                                                            <Link
                                                                to={child.path}
                                                                className={`
                                                                    flex items-center gap-3 px-4 pl-11 py-2 rounded-lg transition-all duration-200
                                                                    ${isChildActive
                                                                        ? "bg-yellow-400 text-white shadow-md transform scale-105"
                                                                        : "text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                                                                    }
                                                                `}
                                                            >
                                                                <child.icon size={16} />
                                                                <span className="font-medium text-sm whitespace-nowrap">
                                                                    {child.name}
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }

                            // Standard Nav Item
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={index}>
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-yellow-400 text-white shadow-md transform scale-105" : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"}`}
                                    >
                                        <item.icon size={20} />
                                        {isSidebarOpen && (
                                            <span className="font-medium text-sm whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`
              flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all
              ${!isSidebarOpen && "justify-center"}
            `}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
                    </button>
                    {isSidebarOpen && (
                        <div className="mt-2 text-xs font-bold text-gray-400 text-center uppercase tracking-wider">
                            {role === "superadmin" ? "Super Admin" : role === "admin" ? "Admin" : "Super User"}
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"
                    } p-8 overflow-y-auto`}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
