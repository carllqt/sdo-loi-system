import { Mail, MailCheck } from "lucide-react";
import { formatDate } from "@/Pages/utils";

export default function ProcessedEmailStatus({ sentAt }) {
    const Icon = sentAt ? MailCheck : Mail;

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                sentAt
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-muted text-muted-foreground"
            }`}
            title={sentAt ? `Email sent on ${formatDate(sentAt)}` : "No successful notification email has been recorded."}
        >
            <Icon className="size-3.5" aria-hidden="true" />
            {sentAt ? "Email sent" : "No email recorded"}
        </span>
    );
}
