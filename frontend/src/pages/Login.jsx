import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

/* Assets */
import loginIllustration from "../assets/illustrations/login-illustration.png";

const Login = () => {
    const navigate = useNavigate();

    /* ---------------- GOOGLE LOGIN ---------------- */
    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.post("http://localhost:8000/api/auth/google", {
                    access_token: tokenResponse.access_token,
                });

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                navigate("/");
            } catch (error) {
                console.error("Google login failed:", error.response?.data || error.message);
                alert("Google login failed");
            }
        },
        onError: () => alert("Google login failed"),
    });

    /* ---------------- LINKEDIN LOGIN (OPENID CONNECT) ---------------- */
    const handleLinkedInAuth = () => {
        const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
        const redirectUri = "http://localhost:5173/linkedin/callback";
        const scope = "openid profile email";

        const state = Math.random().toString(36).substring(2);
        localStorage.setItem("linkedin_oauth_state", state);

        const authUrl =
            "https://www.linkedin.com/oauth/v2/authorization" +
            "?response_type=code" +
            `&client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&state=${state}`;

        window.location.href = authUrl;
    };

    return (
        <section className="min-h-screen bg-[linear-gradient(180deg,#FFFFFF_0%,#F2F2F2_60%,#A6A6A6_100%)] flex items-center justify-center p-4">
            <div className="max-w-[1280px] w-full flex flex-col md:flex-row items-center justify-between px-4 lg:px-16 gap-10">

                {/* ================= LEFT ================= */}
                <div className="max-w-[564px] text-left">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-bold text-[#383636] mb-8"
                    >
                        ← Back
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-[48px] font-black leading-[124%] tracking-[-0.03em] mb-[-10px]">
                            <span className="text-[#383636]">One Step Closer To</span> <br />
                            <span className="text-[#615D5D]">Your Dream Job</span>
                        </h1>

                        <div className="mt-[-10px] mb-[-25px]">
                            <img
                                src={loginIllustration}
                                alt="Login Illustration"
                                className="w-full max-w-[360px]"
                            />
                        </div>

                        <p className="text-black text-[16px] max-w-[455px] text-center">
                            Trackpi is one of the best business consulting firms in Kerala.
                            We have a highly experienced team that develops strategies to
                            promote growth and development.
                        </p>
                    </div>
                </div>

                {/* ================= RIGHT CARD ================= */}
                <div className="w-[515px] h-[514px] bg-white border border-black rounded-[50px] p-[55px] flex flex-col justify-center text-center">

                    <h2 className="text-2xl font-bold mb-[35px]">
                        Welcome Back To <span className="text-[#FFB300]">Trackpi</span>
                    </h2>

                    {/* GOOGLE */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full py-2 flex justify-center gap-3 font-semibold"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                        />
                        Sign in with Google
                    </button>

                    <div className="flex items-center gap-4 my-8">
                        <div className="flex-1 h-[1.5px] bg-gray-300"></div>
                        <span>Or</span>
                        <div className="flex-1 h-[1.5px] bg-gray-300"></div>
                    </div>

                    {/* LINKEDIN */}
                    <button
                        onClick={handleLinkedInAuth}
                        className="w-full py-2 flex justify-center gap-3 font-semibold"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475661/linkedin-color.svg"
                            className="w-5 h-5"
                        />
                        Sign in with LinkedIn
                    </button>

                    <p className="text-sm text-gray-600 mt-8">
                        If you don’t have an account,{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-[#FFB300] font-semibold cursor-pointer"
                        >
                            Get started.
                        </span>
                    </p>

                </div>
            </div>
        </section>
    );
};

export default Login;
