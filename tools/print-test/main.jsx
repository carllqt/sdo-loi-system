import React from "react";
import { createRoot } from "react-dom/client";
import { PDFViewer } from "@react-pdf/renderer";
import RequestLetterPrint from "../../resources/js/Pages/Requested/Partials/RequestLetterPrint";

// Local testing window only; no application route or preview button.
const sample = {
    first_name: "Fatima",
    middle_name: "C.",
    last_name: "Dela Peña",
    gender: "Female",
    position: "Legal Assistant I",
    school: "Schools Division Office",
};

function LayoutTest() {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <style>{`body { margin: 0; background: #e2e8f0; }`}</style>
            <div style={{ padding: "12px 20px", background: "white", font: "14px Arial, sans-serif" }}>
                Save RequestLetterPrint.jsx to update this PDF. Use the PDF toolbar to print or download.
            </div>
            <PDFViewer style={{ width: "100%", flex: 1, border: 0 }} showToolbar>
                <RequestLetterPrint request={sample} assetBasePath="/public" title="LOI layout test" />
            </PDFViewer>
        </div>
    );
}

createRoot(document.getElementById("root")).render(<LayoutTest />);
