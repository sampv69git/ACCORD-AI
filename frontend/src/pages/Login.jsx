import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiFileText, FiShield, FiZap } from "react-icons/fi";
import API_BASE_URL from "../services/api";

function Login() {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/");
        }
    }, [navigate]);
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!loginData.email || !loginData.password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                navigate("/");

            } else {

                setError(data.message || "Invalid email or password.");
            }

        } catch (error) {
            console.error(error);
            setError("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Navbar />

            <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg shadow-slate-100 border border-slate-200 overflow-hidden grid md:grid-cols-2">

                    <div className="hidden md:flex flex-col justify-between bg-slate-900 text-white p-10">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10">
                                <FiFileText size={18} />
                            </span>
                            <span className="text-xl font-bold">
                                Accord<span className="text-blue-400">AI</span>
                            </span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-semibold leading-snug">
                                Welcome back. Your contracts are waiting.
                            </h2>

                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-white/10">
                                    <FiShield size={15} />
                                </span>
                                <p className="text-sm text-slate-300 leading-6">
                                    Pick up right where you left off — risk analysis, rewrites and history all in one place.
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-white/10">
                                    <FiZap size={15} />
                                </span>
                                <p className="text-sm text-slate-300 leading-6">
                                    Generate a new contract in minutes with AI-assisted drafting.
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">
                            &copy; {new Date().getFullYear()} AccordAI
                        </p>
                    </div>

                    <div className="p-8 sm:p-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Log in
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm">
                            Enter your details to access your account.
                        </p>

                        {error && (
                            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="mt-6 space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>

                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-blue-600 font-medium hover:underline">
                                Create one
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Login;
