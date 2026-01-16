import { Navigate } from "react-router-dom";
import { getUserRole, getDecodedToken } from "../utils/auth";

const ProtectedAdminRoute = ({ children, requiredPermission }) => {
    const role = getUserRole();
    const token = localStorage.getItem("token");
    const decodedToken = getDecodedToken();
    const userPermissions = decodedToken?.permissions || [];

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role === "superadmin") {
        return children;
    }

    if (role === "admin") {
        // If a specific permission is required, check for it
        if (requiredPermission && !userPermissions.includes(requiredPermission)) {
            // Redirect to admin dashboard if authorized but no permission for specific page
            return <Navigate to="/admin/dashboard" replace />;
        }
        return children;
    } else {
        // User is logged in but not an admin
        return <Navigate to="/" replace />;
    }
};

export default ProtectedAdminRoute;
