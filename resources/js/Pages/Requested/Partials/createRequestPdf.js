import { createElement } from "react";

// Both actions render this one PDF document, with selectable text and no canvas capture.
export default async function createRequestPdf(request, title) {
    const [{ pdf }, { default: RequestLetterPrint }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./RequestLetterPrint"),
    ]);
    return pdf(createElement(RequestLetterPrint, { request, title })).toBlob();
}
