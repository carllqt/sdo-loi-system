import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Check,
    BriefcaseBusiness,
    CalendarDays,
    Clock3,
    GraduationCap,
    Mail,
    UserRound,
} from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/Components/ui/button";
import TablePagination from "@/Components/TablePagination";
import ProcessedEmailStatus from "@/Components/ProcessedEmailStatus";
import { useToast } from "@/Components/ToastContext";
import { formatName, formatDate, maskEmail, statusClasses } from "@/Pages/utils";

const columnIcons = {
    Name: UserRound,
    Position: BriefcaseBusiness,
    School: GraduationCap,
    Email: Mail,
    Status: Clock3,
    "Request Date": CalendarDays,
};

export default function ProcessingTable({ requests }) {
    const [completingId, setCompletingId] = useState(null);
    const [sendingEmailId, setSendingEmailId] = useState(null);
    const toast = useToast();

    const moveToCompleted = (request) => {
        setCompletingId(request.id);

        router.patch(route("requests.complete", request.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Request moved to Completed", {
                    description: `${formatName(request)} now appears in the Completed module.`,
                });
            },
            onError: (errors) => {
                toast.error("Could not move request to Completed", {
                    description: errors.request ?? "Refresh the page and try again.",
                });
            },
            onFinish: () => setCompletingId(null),
        });
    };

    const sendProcessedEmail = (request) => {
        setSendingEmailId(request.id);

        router.post(route("requests.notifyProcessed", request.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Notification submitted", {
                    description: `The email service accepted the notice for ${formatName(request)}. Delivery may take a moment.`,
                });
            },
            onError: (errors) => {
                toast.error(errors.email_title ?? "Could not send notification email", {
                    description: errors.email ?? "An unexpected error occurred. Refresh the page and try again.",
                });
            },
            onFinish: () => setSendingEmailId(null),
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/40">
                    <TableRow>
                        {Object.entries(columnIcons).map(([label, Icon]) => (
                            <TableHead key={label} className="px-4 text-xs font-bold uppercase tracking-wide text-foreground">
                                <span className="inline-flex items-center gap-2">
                                    <Icon className="size-4 text-foreground" />
                                    {label}
                                </span>
                            </TableHead>
                        ))}
                        <TableHead className="px-4 text-xs font-bold uppercase tracking-wide text-foreground">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                        {requests.data.length ? (
                            requests.data.map((request) => (
                                <TableRow key={request.id} className="group">
                                    <TableCell className="px-4 py-3 font-medium">{formatName(request)}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{request.position}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{request.school}</TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{maskEmail(request.email)}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex flex-col items-start gap-1.5">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses(request.status)}`}>
                                                {request.status}
                                            </span>
                                            <ProcessedEmailStatus sentAt={request.processed_email_sent_at} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{formatDate(request.request_date)}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="text-sky-700 hover:bg-sky-50 hover:text-sky-800"
                                                aria-label={`Send processed-documents email to ${formatName(request)}`}
                                                title="Send processed-documents email"
                                                disabled={sendingEmailId !== null || completingId !== null}
                                                onClick={() => sendProcessedEmail(request)}
                                            >
                                                <Mail className="size-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                                aria-label={`Move ${formatName(request)} to Completed`}
                                                title={request.processed_email_sent_at ? "Move to Completed" : "Send the notification email first"}
                                                disabled={!request.processed_email_sent_at || completingId !== null || sendingEmailId !== null}
                                                onClick={() => moveToCompleted(request)}
                                            >
                                                <Check className="size-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="7" className="h-32 text-center text-muted-foreground">
                                    No LOI requests found.
                                </TableCell>
                            </TableRow>
                        )}
                </TableBody>
            </Table>

            <TablePagination requests={requests} />
        </div>
    );
}
