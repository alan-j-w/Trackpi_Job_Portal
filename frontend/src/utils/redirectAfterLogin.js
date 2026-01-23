import axios from "axios";
import { getUserRole } from "./auth";

export const redirectAfterLogin = async (navigate) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    const role = getUserRole();

    // REMOVED: Auto-redirect admins to dashboard
    // If they login via normal site, they should go to normal profile/home.
    // if (role === "superadmin" || role === "admin") {
    //    navigate("/admin/dashboard");
    //    return;
    // }

    try {
        const res = await axios.get("http://localhost:8000/api/profile/status", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.data?.hasProfile) {
            navigate("/profile");
        } else {
            navigate("/create-profile");
        }
    } catch (err) {
        console.error("Redirect error:", err);

        // Token invalid or expired → force logout
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }
};


