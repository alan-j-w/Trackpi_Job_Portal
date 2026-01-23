import { Navigate } from "react-router-dom";
import { getUserRole, getDecodedToken } from "../utils/auth";

const ProtectedAdminRoute = ({ children, requiredPermission }) => {
    const role = getUserRole();
    const token = localStorage.getItem("token");
    const decodedToken = getDecodedToken();
    const userPermissions = decodedToken?.permissions || [];

    if (!token) {
        return <Navigate to="/admin/login" replace />;
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
        // Redirect to admin login to show "Unauthorized" or let them login as admin if they have another account
        // Or redirect to home. User asked for "only allowed mail id".
        // If we redirect to /admin/login, the page logic I wrote will check role and show error if not admin.
        // So passing them to /admin/login is safer/better UX for "wrong account".
        return <Navigate to="/admin/login" replace />;
    }
};

export default ProtectedAdminRoute;
