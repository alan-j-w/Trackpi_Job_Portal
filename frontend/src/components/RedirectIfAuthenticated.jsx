import { Navigate, Outlet } from "react-router-dom";

const RedirectIfAuthenticated = () => {
    const token = localStorage.getItem("token");

    if (token) {
        // If authenticated, redirect to profile 
        // (We could use redirectAfterLogin logic here too, but a simple 
        // redirect to /profile is usually safe as the Profile page 
        // can handle redirection to /create-profile if needed, 
        // or we assume they have a profile if they are hitting this route 
        // after initial login/signup flow).
        // The user specifically asked for "redirect to our user profile page".
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default RedirectIfAuthenticated;
