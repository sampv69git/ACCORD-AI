import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiArrowLeft, FiCopy, FiDownload, FiPrinter } from "react-icons/fi";
import API_BASE_URL from "../services/api";

function ContractViewer() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contract, setContract] = useState(null);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_BASE_URL}/contract/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();
                setContract(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchContract();
    }, [id]);

    const downloadPDF = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/download-pdf/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                alert("Failed to download PDF.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${contract.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Download failed.");
        }
    };

    const downloadDocx = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE_URL}/download-docx/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                alert("Failed to download DOCX.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `${contract.title}.docx`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            alert("Download failed.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(contract.content);
        alert("Contract copied to clipboard!");
    };

    const handlePrint = () => {
        window.print();
    };

    if (!contract) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-sm">
                    Loading contract...
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition"
                    >
                        <FiArrowLeft size={15} />
                        Back to My Contracts
                    </button>

                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">

                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            {contract.title}
                        </h1>

                        <p className="text-slate-500 mt-2">
                            {contract.contract_type}
                        </p>

                        <hr className="my-6 border-slate-200" />

                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={downloadPDF}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition"
                            >
                                <FiDownload size={15} />
                                PDF
                            </button>

                            <button
                                onClick={downloadDocx}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition"
                            >
                                <FiDownload size={15} />
                                DOCX
                            </button>

                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition"
                            >
                                <FiCopy size={15} />
                                Copy
                            </button>

                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition"
                            >
                                <FiPrinter size={15} />
                                Print
                            </button>

                        </div>

                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-8 whitespace-pre-wrap leading-7 sm:leading-8 text-slate-800 font-serif max-h-[70vh] overflow-y-auto scrollbar-thin">
                            {contract.content}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default ContractViewer;
