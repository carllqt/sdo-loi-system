import {
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    Clock3,
    GraduationCap,
    LoaderCircle,
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
import TablePagination from "@/Components/TablePagination";
import ProcessedEmailStatus from "@/Components/ProcessedEmailStatus";
import { formatName, formatDate, maskEmail, statusClasses } from "@/Pages/utils";

const columnIcons = {
    Name: UserRound,
    Position: BriefcaseBusiness,
    School: GraduationCap,
    Email: Mail,
    Status: Clock3,
    "Request Date": CalendarDays,
};

function StatusIcon({ status }) {
    if (status === "Completed") return <CheckCircle2 className="size-3.5" aria-hidden="true" />;
    if (status === "Processing") return <LoaderCircle className="size-3.5 animate-spin" aria-hidden="true" />;
    return <Clock3 className="size-3.5" aria-hidden="true" />;
}

export default function CompletedTable({ requests }) {
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
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                role="img"
                                                aria-label={request.status}
                                                title={request.status}
                                                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full ${statusClasses(request.status)}`}
                                            >
                                                <StatusIcon status={request.status} />
                                            </span>
                                            <ProcessedEmailStatus sentAt={request.processed_email_sent_at} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-muted-foreground">{formatDate(request.request_date)}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="6" className="h-32 text-center text-muted-foreground">
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
