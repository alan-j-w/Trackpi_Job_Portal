import axios from "axios";

export const redirectAfterLogin = async (navigate) => {
    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

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

