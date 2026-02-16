import { Navigate } from "react-router-dom";
import { getUserRole, getDecodedToken } from "../utils/auth";

const ProtectedAdminRoute = ({ children, requiredPermission, requiredRole }) => {
    const role = getUserRole();
    const token = localStorage.getItem("token");
    const decodedToken = getDecodedToken();
    const userPermissions = decodedToken?.permissions || [];

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // Role-based restriction (e.g., Super Admin only)
    if (requiredRole && role !== requiredRole) {
        // If user doesn't have the required role, redirect to dashboard or limited view
        return <Navigate to="/admin/dashboard" replace />;
    }

    // Super Admin & Admin bypass permission checks (Full Access)
    if (role === "superadmin" || role === "admin") {
        return children;
    }

    // Super User (Restricted Admin) - Check Permissions
    if (role === "superuser") {
        if (requiredPermission && !userPermissions.includes(requiredPermission)) {
            // Redirect if authorized but no permission for specific page
            return <Navigate to="/admin/dashboard" replace />;
        }
        return children;
    }

    // Not an admin role
    return <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
