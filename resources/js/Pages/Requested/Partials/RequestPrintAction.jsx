import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

import { Button } from "@/Components/ui/button";
import RequestLetterPrint from "./RequestLetterPrint";
import { formatName } from "@/Pages/utils";

export default function RequestPrintAction({ request }) {
    const contentRef = useRef(null);
    const print = useReactToPrint({
        contentRef,
    });

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Print LOI for ${formatName(request)}`}
                title="Print request letter"
                onClick={print}
            >
                <Printer className="size-4" />
            </Button>

            <div style={{ display: "none" }} aria-hidden="true">
                <RequestLetterPrint ref={contentRef} request={request} />
            </div>
        </>
    );
}
