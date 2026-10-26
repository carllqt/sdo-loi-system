import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../resources/css/app.css';
import RequestPrintAction from '../../resources/js/Pages/Requested/Partials/RequestPrintAction';
import createRequestPdf from '../../resources/js/Pages/Requested/Partials/createRequestPdf';
import ToastContext from '../../resources/js/Components/ToastContext';

const sample = { first_name: 'Juan', middle_name: 'D.', last_name: 'Dela Cruz', gender: 'Male', position: 'Teacher I', school: 'Example School' };
function Check() {
    const [result, setResult] = useState('Ready');
    const [download, setDownload] = useState('');
    const toast = { error(title, options) { setResult(`${title}\n${options?.description ?? ''}`); } };
    async function generate() {
        setResult('Generating PDF...');
        try {
            const blob = await createRequestPdf(sample, 'LOI action check');
            setDownload(URL.createObjectURL(blob));
            setResult(`PDF ready: ${blob.size} bytes; ${blob.type}`);
        } catch (error) { setResult(`${error.name}: ${error.message}\n${error.stack}`); }
    }
    return <ToastContext.Provider value={toast}><main className="space-y-4 p-8">
        <h1>LOI PDF and print check</h1><p>Sample data only. No requests are saved.</p>
        <div className="flex gap-4"><RequestPrintAction request={sample} /><button onClick={generate}>Check PDF generation</button></div>
        <pre role="status" className="whitespace-pre-wrap">{result}</pre>
        {download && <a href={download} download="loi-check.pdf">Download test PDF</a>}
    </main></ToastContext.Provider>;
}
createRoot(document.getElementById('root')).render(<Check />);
