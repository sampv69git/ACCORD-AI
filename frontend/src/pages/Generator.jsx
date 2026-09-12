import { useState } from "react";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
} from "docx";
import {
    FiBriefcase,
    FiUserCheck,
    FiLock,
    FiHome,
    FiCode,
    FiDownload,
    FiFileText,
    FiLoader,
} from "react-icons/fi";
import API_BASE_URL from "../services/api";

const contractTypes = [
    { value: "Service Agreement", label: "Service Agreement", icon: FiBriefcase },
    { value: "Employment Agreement", label: "Employment Agreement", icon: FiUserCheck },
    { value: "Non-Disclosure Agreement", label: "NDA", icon: FiLock },
    { value: "Rental Agreement", label: "Rental Agreement", icon: FiHome },
    { value: "Freelancer Agreement", label: "Freelancer Agreement", icon: FiCode },
];

const fieldConfig = {
    "Service Agreement": [
        { name: "clientName", label: "Client Name", placeholder: "e.g. Jane Doe" },
        { name: "providerName", label: "Service Provider Name", placeholder: "e.g. Acme Services LLC" },
        { name: "services", label: "Services Provided", placeholder: "e.g. Web design and development" },
        { name: "startDate", label: "Start Date", type: "date" },
        { name: "duration", label: "Contract Duration", placeholder: "e.g. 6 months" },
        { name: "payment", label: "Payment Amount", placeholder: "e.g. $5,000" },
    ],
    "Employment Agreement": [
        { name: "employeeName", label: "Employee Name", placeholder: "e.g. John Smith" },
        { name: "companyName", label: "Company Name", placeholder: "e.g. Acme Corp" },
        { name: "jobTitle", label: "Job Title", placeholder: "e.g. Software Engineer" },
        { name: "joiningDate", label: "Joining Date", type: "date" },
        { name: "salary", label: "Annual Salary", placeholder: "e.g. $80,000" },
    ],
    "Non-Disclosure Agreement": [
        { name: "partyOne", label: "First Party", placeholder: "e.g. Company A" },
        { name: "partyTwo", label: "Second Party", placeholder: "e.g. Company B" },
        { name: "purpose", label: "Purpose of NDA", placeholder: "e.g. Discussing a potential partnership" },
        { name: "confidentialPeriod", label: "Confidentiality Period", placeholder: "e.g. 2 years" },
    ],
    "Rental Agreement": [
        { name: "landlord", label: "Landlord Name", placeholder: "e.g. Robert Brown" },
        { name: "tenant", label: "Tenant Name", placeholder: "e.g. Alice Green" },
        { name: "propertyAddress", label: "Property Address", placeholder: "e.g. 123 Main St, Springfield" },
        { name: "monthlyRent", label: "Monthly Rent", placeholder: "e.g. $1,200" },
        { name: "leaseDuration", label: "Lease Duration", placeholder: "e.g. 12 months" },
    ],
    "Freelancer Agreement": [
        { name: "clientName", label: "Client Name", placeholder: "e.g. Jane Doe" },
        { name: "freelancerName", label: "Freelancer Name", placeholder: "e.g. Sam Carter" },
        { name: "projectDescription", label: "Project Description", placeholder: "e.g. Logo design and branding" },
        { name: "projectDuration", label: "Project Duration", placeholder: "e.g. 4 weeks" },
        { name: "projectPayment", label: "Project Payment", placeholder: "e.g. $1,500" },
    ],
};

const initialFormData = {
    clientName: "", providerName: "", services: "", startDate: "", duration: "", payment: "",
    employeeName: "", companyName: "", jobTitle: "", joiningDate: "", salary: "",
    partyOne: "", partyTwo: "", purpose: "", confidentialPeriod: "",
    landlord: "", tenant: "", propertyAddress: "", monthlyRent: "", leaseDuration: "",
    freelancerName: "", projectDescription: "", projectDuration: "", projectPayment: "",
};

function Generator() {
    const [contractType, setContractType] = useState("");
    const [formData, setFormData] = useState(initialFormData);
    const [generatedContract, setGeneratedContract] = useState("");
    const [generating, setGenerating] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGenerate = async () => {
        if (!contractType) {
            alert("Please select a contract type.");
            return;
        }

        const fields = fieldConfig[contractType].map((f) => f.name);

        for (const field of fields) {
            if (!formData[field]?.trim()) {
                alert(`Please fill the ${field} field.`);
                return;
            }
        }

        try {
            setGenerating(true);

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    contractType,
                    ...formData,
                }),
            });


            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 || response.status === 422) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    alert("Your session has expired. Please log in again.");
                    window.location.href = "/login";
                    return;
                }
                throw new Error(data.error || data.message || data.msg || "Failed to generate contract.");
            }

            setGeneratedContract(data.contract);
        } catch (error) {
            console.error(error);
            alert(error.message || "Error connecting to backend.");
        } finally {
            setGenerating(false);
        }
    };
    const downloadPDF = () => {
        const doc = new jsPDF({
            unit: "mm",
            format: "a4",
        });

        // Title
        doc.setFont("times", "bold");
        doc.setFontSize(18);
        doc.text("Generated Contract", 20, 20);

        // Contract Content
        doc.setFont("times", "normal");
        doc.setFontSize(12);

        const pageWidth = 170;
        const pageHeight = 297;
        const marginTop = 35;
        const marginBottom = 20;
        const lineHeight = 7;

        const lines = doc.splitTextToSize(generatedContract, pageWidth);

        let y = marginTop;

        lines.forEach((line) => {
            if (y > pageHeight - marginBottom) {
                doc.addPage();
                y = 20;
            }

            doc.text(line, 20, y);
            y += lineHeight;
        });

        doc.save("Generated_Contract.pdf");
    };
    const downloadDOCX = async () => {
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            heading: HeadingLevel.HEADING_1,
                            children: [
                                new TextRun({
                                    text: "Generated Contract",
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                        }),

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: generatedContract,
                                    size: 24,
                                }),
                            ],
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);

        saveAs(blob, "Generated_Contract.docx");
    };

    const activeType = contractTypes.find((t) => t.value === contractType);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8 text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Contract Generator
                        </h1>
                        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
                            Generate professional legal contracts using AI in under a minute.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 items-start">

                        <div className="lg:col-span-2 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">

                            <label className="block text-sm font-semibold text-slate-700 mb-3">
                                Select Contract Type
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                                {contractTypes.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setContractType(value);
                                            setGeneratedContract("");
                                        }}
                                        className={`flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition ${contractType === value
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-xs font-medium leading-tight">
                                            {label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {contractType && (
                                <div className="mt-8 grid sm:grid-cols-2 gap-4">
                                    {fieldConfig[contractType].map((field) => (
                                        <div
                                            key={field.name}
                                            className={field.type === "date" ? "" : "sm:col-span-2"}
                                        >
                                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type || "text"}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {contractType && (
                                <div className="mt-8">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl transition"
                                    >
                                        {generating ? (
                                            <>
                                                <FiLoader className="animate-spin" size={16} />
                                                Generating...
                                            </>
                                        ) : (
                                            `Generate ${contractType}`
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10">
                                {activeType ? <activeType.icon size={20} /> : <FiFileText size={20} />}
                            </span>

                            <h3 className="mt-4 text-lg font-semibold">
                                {activeType ? activeType.label : "Pick a contract type"}
                            </h3>

                            <p className="mt-2 text-sm text-slate-300 leading-6">
                                {activeType
                                    ? "Fill in the details on the left and AccordAI will draft a complete, ready-to-edit contract for you."
                                    : "Choose one of the templates to see the fields you'll need to fill in."}
                            </p>

                            <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 leading-5">
                                Generated contracts are a starting point — always have important agreements reviewed before signing.
                            </div>
                        </div>

                    </div>

                    {generatedContract && (
                        <div className="mt-8 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Generated Contract
                                </h2>

                                <div className="flex gap-3">
                                    <button
                                        onClick={downloadPDF}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl text-sm transition"
                                    >
                                        <FiDownload size={15} />
                                        PDF
                                    </button>

                                    <button
                                        onClick={downloadDOCX}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-5 py-2 rounded-xl text-sm transition"
                                    >
                                        <FiDownload size={15} />
                                        DOCX
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-8 max-h-[700px] overflow-y-auto scrollbar-thin">
                                <div className="whitespace-pre-wrap leading-7 sm:leading-8 text-slate-800 text-[15px]">
                                    {generatedContract}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Generator;
