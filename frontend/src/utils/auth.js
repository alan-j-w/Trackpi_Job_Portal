export const getDecodedToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            window
                .atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

export const getUserRole = () => {
    const decoded = getDecodedToken();
    return decoded ? decoded.role : null;
};

export const hasPermission = (requiredPermission) => {
    const role = getUserRole();
    if (role === 'superadmin') return true;
    const decoded = getDecodedToken();
    const permissions = decoded?.permissions || [];
    return permissions.includes(requiredPermission);
};

