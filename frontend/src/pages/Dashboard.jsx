import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiFileText, FiSearch, FiTrash2, FiEye, FiInbox } from "react-icons/fi";
import API_BASE_URL from "../services/api";

function Dashboard() {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMode, setFilterMode] = useState("All");

    const navigate = useNavigate();
    useEffect(() => {

        const fetchContracts = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(`${API_BASE_URL}/my-contracts`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                setContracts(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchContracts();


    }, []);
    const handleDelete = async (contractId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contract?"
        );

        if (!confirmDelete) return;

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/contract/${contractId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {

                setContracts((prev) =>
                    prev.filter((contract) => contract.id !== contractId)
                );

            } else {

                const data = await response.json();
                alert(data.message);

            }

        } catch (error) {

            console.error(error);
            alert("Failed to delete contract.");

        }
    };
    const filteredContracts = contracts.filter((contract) => {

        const matchesSearch =
            contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.contract_type.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            filterMode === "All" || contract.mode === filterMode;

        return matchesSearch && matchesFilter;
    });

    const stats = [
        { label: "Total Contracts", value: contracts.length },
        { label: "Analyzed", value: contracts.filter((c) => c.mode === "Analyzed").length },
        { label: "Generated", value: contracts.filter((c) => c.mode === "Generated").length },
    ];

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            My Contracts
                        </h1>

                        <p className="text-slate-500 mt-2">
                            View, manage and organize all your analyzed and generated contracts.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5"
                            >
                                <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                                    {stat.value}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">

                        <div className="flex flex-col md:flex-row gap-4">

                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by title or contract type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <select
                                value={filterMode}
                                onChange={(e) => setFilterMode(e.target.value)}
                                className="border border-slate-300 rounded-xl px-4 py-3 text-sm min-w-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="All">All Contracts</option>
                                <option value="Generated">Generated</option>
                                <option value="Analyzed">Analyzed</option>
                            </select>

                        </div>

                    </div>


                    <div className="space-y-4">

                        {loading ? (
                            <div className="text-center py-16 text-slate-400 text-sm">
                                Loading your contracts...
                            </div>
                        ) : filteredContracts.length === 0 ? (

                            <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300 py-16 px-6">
                                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
                                    <FiInbox size={22} />
                                </span>
                                <p className="text-slate-700 font-medium">
                                    No contracts found
                                </p>
                                <p className="text-slate-500 text-sm mt-1 max-w-sm">
                                    {contracts.length === 0
                                        ? "Upload a contract to analyze, or generate a new one to see it here."
                                        : "Try adjusting your search or filter."}
                                </p>
                            </div>

                        ) : (

                            filteredContracts.map((contract) => (

                                <div
                                    key={contract.id}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-5 sm:p-6"
                                >
                                    <div className="flex justify-between items-start gap-4">

                                        <div className="flex items-start gap-3 min-w-0">
                                            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-xl bg-blue-50 text-blue-600">
                                                <FiFileText size={18} />
                                            </span>
                                            <div className="min-w-0">
                                                <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                                                    {contract.title}
                                                </h2>

                                                <p className="text-sm text-slate-500 mt-0.5">
                                                    {contract.contract_type}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${contract.mode === "Generated"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {contract.mode}
                                        </span>

                                    </div>

                                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                                        <p className="text-sm text-slate-500">
                                            Created on {contract.created_at}
                                        </p>

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() => navigate(`/contract/${contract.id}`)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition text-sm font-medium"
                                            >
                                                <FiEye size={15} />
                                                View
                                            </button>

                                            <button
                                                onClick={() => handleDelete(contract.id)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition text-sm font-medium"
                                            >
                                                <FiTrash2 size={15} />
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>
            </div>
        </>
    );
}

export default Dashboard;
