import { forwardRef } from "react";
import "./RequestLetterPrint.css";
import documentTemplatePageStyle from "./documentTemplatePageStyle";

const formatRequestDate = (value) => {
    if (!value) return "";

    const dateOnly = String(value).slice(0, 10);
    const date = new Date(`${dateOnly}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
};

const getFormalName = (request) => {
    const middleInitial = request.middle_name?.trim()?.charAt(0);

    return [
        request.first_name,
        middleInitial ? `${middleInitial}.` : null,
        request.last_name,
    ]
        .filter(Boolean)
        .join(" ")
        .toLocaleUpperCase("en-PH");
};

const RequestLetterPrint = forwardRef(function RequestLetterPrint({ request }, ref) {
    if (!request) return null;

    const name = getFormalName(request);
    const date = formatRequestDate(request.request_date);

    return (
        <article ref={ref} className="loi-print-page document-template-page">
            <style>{documentTemplatePageStyle}</style>

            <img
                className="loi-print-header document-template-header"
                src="/sdo-header.png"
                alt="Schools Division Office of the City of Ilagan letterhead"
            />

            <h1 className="loi-print-title">LETTER OF INTRODUCTION</h1>

            <p className="loi-print-date">{date}</p>

            <div className="loi-print-recipient">
                <p>The Manager</p>
                <p className="loi-print-recipient-emphasis">LANDBANK OF THE PHILIPPINES</p>
                <p>Ilagan, Branch</p>
            </div>

            <p className="loi-print-salutation">Sir/Madam:</p>

            <p className="loi-print-paragraph">
                This is to introduce {name}, {request.position} of {request.school},
                under the Schools Division Office of the City of Ilagan, Isabela.
            </p>

            <p className="loi-print-paragraph">
                Kindly acknowledge the specimen signature of {name} written below for
                Account Opening.
            </p>

            <table className="loi-print-signature-table">
                <colgroup>
                    <col className="loi-print-name-column" />
                    <col className="loi-print-position-column" />
                    <col className="loi-print-signature-column" />
                </colgroup>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Signature</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{name}</td>
                        <td>{request.position}</td>
                        <td><span className="loi-print-signature-line" /></td>
                    </tr>
                </tbody>
            </table>

            <p className="loi-print-short-paragraph">For your reference.</p>
            <p className="loi-print-short-paragraph">Thank you.</p>

            <p className="loi-print-closing">Very truly yours,</p>

            <div className="loi-print-signatory">
                <p className="loi-print-signatory-name">EDUARDO C. ESCORPISCO JR., EdD, CESO V</p>
                <p>Schools Division Superintendent</p>
            </div>

            <p className="loi-print-reference">cjas/admin - {date}</p>

            <img
                className="loi-print-footer document-template-footer"
                src="/sdo-footer.png"
                alt="Schools Division Office of the City of Ilagan footer"
            />
        </article>
    );
});

export default RequestLetterPrint;

