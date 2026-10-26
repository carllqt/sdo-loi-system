import { useEffect, useRef, useState } from "react";
import { FileText, Printer } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { formatName } from "@/Pages/utils";
import { useToast } from "@/Components/ToastContext";
import createRequestPdf from "./createRequestPdf";

export default function RequestPrintAction({ request }) {
    const busyRef = useRef(false);
    const printCleanupRef = useRef(null);
    const [creatingPdf, setCreatingPdf] = useState(false);
    const toast = useToast();
    const title = `LOI - ${formatName(request)}`;

    useEffect(() => () => printCleanupRef.current?.(), []);

    const printPdfInPlace = (blob) => new Promise((resolve, reject) => {
        printCleanupRef.current?.();
        const url = URL.createObjectURL(blob);
        const frame = document.createElement("iframe");
        frame.title = `Print ${title}`;
        frame.setAttribute("aria-hidden", "true");
        frame.tabIndex = -1;
        frame.style.cssText = "position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none";

        let loadTimeout;
        const cleanup = () => {
            clearTimeout(loadTimeout);
            window.removeEventListener("afterprint", afterPrint);
            frame.remove();
            URL.revokeObjectURL(url);
            if (printCleanupRef.current === cleanup) printCleanupRef.current = null;
        };
        const afterPrint = () => setTimeout(cleanup, 0);
        printCleanupRef.current = cleanup;
        loadTimeout = setTimeout(() => {
            cleanup();
            reject(new Error("The print document did not load."));
        }, 30000);

        frame.addEventListener("load", () => {
            clearTimeout(loadTimeout);
            try {
                window.addEventListener("afterprint", afterPrint, { once: true });
                frame.contentWindow.addEventListener("afterprint", afterPrint, { once: true });
                frame.contentWindow.focus();
                frame.contentWindow.print();
                // Keep the frame until printing ends (or the next print/unmount).
                resolve();
            } catch (error) {
                cleanup();
                reject(error);
            }
        }, { once: true });
        frame.addEventListener("error", () => {
            cleanup();
            reject(new Error("The print document could not be opened."));
        }, { once: true });
        frame.src = url;
        document.body.appendChild(frame);
    });

    const openDocument = async (printImmediately = false) => {
        if (busyRef.current) return;
        // Only the PDF button opens a tab. Printing uses an invisible frame here.
        const preview = printImmediately ? null : window.open("", "_blank");
        if (!printImmediately && !preview) {
            toast.error("Allow pop-ups to open the LOI document.");
            return;
        }
        if (preview) {
            preview.opener = null;
            preview.document.title = title;
            preview.document.body.textContent = "Preparing your LOI PDF…";
        }
        busyRef.current = true;
        setCreatingPdf(true);
        let url;

        try {
            const blob = await createRequestPdf(request, title);
            if (printImmediately) {
                await printPdfInPlace(blob);
                return;
            }
            if (preview.closed) return;
            url = URL.createObjectURL(blob);
            preview.addEventListener("pagehide", () => URL.revokeObjectURL(url), { once: true });

            const viewer = preview.document.createElement("iframe");
            viewer.title = title;
            viewer.style.cssText = "display:block;width:100%;height:100vh;border:0";
            viewer.src = url;
            preview.document.body.style.margin = "0";
            preview.document.body.replaceChildren(viewer);
        } catch {
            if (url) URL.revokeObjectURL(url);
            if (preview && !preview.closed) preview.close();
            toast.error(printImmediately ? "Could not open the print dialog" : "Could not create the LOI PDF", {
                description: "Check that the document assets loaded and your browser supports PDF printing, then try again.",
            });
        } finally {
            busyRef.current = false;
            setCreatingPdf(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Print LOI for ${formatName(request)}`}
                title={creatingPdf ? "Preparing document…" : "Print request letter"}
                disabled={creatingPdf}
                onClick={() => openDocument(true)}
            >
                <Printer className="size-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-sky-700 hover:text-sky-800"
                aria-label={`View LOI PDF for ${formatName(request)}`}
                title={creatingPdf ? "Preparing document…" : "Open LOI PDF in a new tab"}
                disabled={creatingPdf}
                onClick={() => openDocument(false)}
            >
                <FileText className="size-4" />
            </Button>
        </>
    );
}
