AccordAI

AI-powered contract analysis and generation.

AccordAI helps users analyze legal contracts, flag risky clauses, generate new contracts from templates, and chat directly with their documents. The AI reasoning is powered by a cloud LLM API (Groq) rather than a model running on your machine — see the Privacy & Data Handling section below before uploading sensitive documents.


✨ Features


Contract Analysis — Upload a contract (PDF, DOCX, or a scanned/photographed image) and get an AI-generated breakdown: contract type, parties, effective date, duration, payment terms, governing law, an overall risk score, and specific risky clauses with plain-English explanations and suggested fixes.
Clause Rewriting — One click asks the AI to rewrite a flagged clause to reduce risk; accept or reject the suggestion into a live "enhanced contract" preview.
Contract Chat — Ask free-form questions about the uploaded contract and get answers grounded in its full text.
Contract Generation — Generate a new contract from a template (Service Agreement, Employment Agreement, NDA, Rental Agreement, Freelancer Agreement) by filling in a form.
Export — Download analyzed or generated contracts as PDF or DOCX.
Contract Dashboard — Search, filter, and manage the history of everything you've analyzed or generated.
Authentication — Email/password accounts with JWT sessions; contracts are private per user.


🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Flask, Flask-SQLAlchemy, SQLite |
| Frontend | React, Vite, React Router, Tailwind CSS |
| AI / LLM | Groq Cloud API (`openai/gpt-oss-120b`) — cloud-hosted, not local |
| Document Parsing | PyMuPDF (PDF text), python-docx (DOCX), Tesseract OCR + pytesseract + Pillow (scanned PDFs/images) |
| Auth | Flask-JWT-Extended, Flask-Bcrypt |
| Export | ReportLab (server-side PDF), jsPDF + docx + file-saver (client-side) |


🔒 Privacy & Data Handling

Every analysis, chat, clause rewrite, and generation request sends the relevant contract text to Groq's cloud API for processing. Nothing in this app runs the LLM locally, and no redaction or anonymization happens before that text is sent.

According to Groq's own policy (see [Services Agreement](https://console.groq.com/docs/legal/services-agreement) and [Your Data in GroqCloud](https://console.groq.com/docs/your-data)):
- Inputs/outputs are not used to train Groq's models unless you explicitly opt in.
- Requests are not retained by default, aside from temporary logs (up to 30 days) kept only for troubleshooting or abuse investigation.
- Eligible customers can enable a zero data retention setting for that exception too.

This app does not currently configure zero data retention, and relies entirely on Groq's stated policy rather than any technical guarantee on our end. If you plan to upload real, sensitive, or client-confidential contracts, review Groq's terms yourself and decide whether that's acceptable for your use case — this is not a fully local or air-gapped tool.


🧠 Why These Design Choices?

SQLite over PostgreSQL — Kept the backend lightweight and simple for a single-user, local-first application.
Groq over a local model — Groq's hosted inference is fast and requires no local GPU/hardware to run well, at the cost of sending contract text to a third party (see Privacy section above).
Pure LLM extraction over rule-based/ML classifiers — No labeled training data was available for risk classification, so contract fields and risky clauses are extracted directly by prompting the LLM rather than through regex or a trained classifier.
