import { MailCheck, MailX } from "lucide-react";
import { formatDate } from "@/Pages/utils";

export default function ProcessedEmailStatus({ sentAt }) {
    const Icon = sentAt ? MailCheck : MailX;

    return (
        <span
            role="img"
            aria-label={sentAt ? "Email sent" : "No email recorded"}
            className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full ${
                sentAt
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-muted text-muted-foreground"
            }`}
            title={sentAt ? `Email sent on ${formatDate(sentAt)}` : "No successful notification email has been recorded."}
        >
            <Icon className="size-3.5" aria-hidden="true" />
        </span>
    );
}
