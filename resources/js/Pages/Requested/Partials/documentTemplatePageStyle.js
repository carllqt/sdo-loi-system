const documentTemplatePageStyle = `
    @page {
        size: 8in 13in;
        margin: 0 !important;
    }

    .document-template-page {
        box-sizing: border-box;
        position: relative;
        width: 8in;
        height: 13in;
        overflow: hidden;
        margin: 0;
        padding: 2.75in 1in 1.5in;
        background: #ffffff;
    }

    .document-template-header,
    .document-template-footer {
        display: block;
        position: absolute;
        left: 0;
        width: 8in;
        max-width: none;
        object-fit: fill;
    }

    .document-template-header {
        top: 0.5in;
        height: 2.22in;
    }

    .document-template-footer {
        bottom: 0.5in;
        height: 0.98in;
    }

    @media print {
        html,
        body {
            width: 8in;
            height: 13.5in;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .document-template-page {
            position: relative;
            overflow: hidden;
            -webkit-box-decoration-break: clone;
            box-decoration-break: clone;
        }

        .document-template-header {
            top: -0.35in;
        }

        .document-template-footer {
            bottom: 0.25in;
        }
    }
`;

export default documentTemplatePageStyle;
