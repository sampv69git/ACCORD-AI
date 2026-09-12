import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiCheckCircle, FiFileText } from "react-icons/fi";
import API_BASE_URL from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        full_name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (
            !registerData.full_name ||
            !registerData.email ||
            !registerData.password
        ) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Registration successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1200);
            } else {
                setError(data.message || "Registration failed.");
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

                        <div className="space-y-5">
                            <h2 className="text-2xl font-semibold leading-snug">
                                Join AccordAI and review contracts in minutes, not hours.
                            </h2>

                            <ul className="space-y-3">
                                {[
                                    "Instant AI risk analysis",
                                    "One-click clause rewrites",
                                    "Generate contracts from templates",
                                    "Keep every contract organized",
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                                        <FiCheckCircle className="text-blue-400 shrink-0" size={16} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-xs text-slate-400">
                            &copy; {new Date().getFullYear()} AccordAI
                        </p>
                    </div>

                    <div className="p-8 sm:p-10">
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Create account
                        </h1>

                        <p className="text-slate-500 mt-2 text-sm">
                            Get started with AccordAI for free.
                        </p>

                        {error && (
                            <div className="mt-5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mt-5 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="mt-6 space-y-4">

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Jane Doe"
                                    value={registerData.full_name}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={registerData.email}
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
                                    value={registerData.password}
                                    onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
                            >
                                {loading ? "Creating account..." : "Create Account"}
                            </button>

                        </form>

                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Register;
