import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    GraduationCap,
    Mail,
    UserRound,
    LoaderCircle,
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
import { useToast } from "@/Components/ToastContext";
import { formatName, formatDate, maskEmail } from "@/Pages/utils";
import RequestPrintAction from "./RequestPrintAction";

const columnIcons = {
    Name: UserRound,
    Position: BriefcaseBusiness,
    School: GraduationCap,
    Email: Mail,
    "Request Date": CalendarDays,
};

export default function RequestedTable({ requests }) {
    const [processingId, setProcessingId] = useState(null);
    const toast = useToast();

    const moveToProcessing = (request) => {
        setProcessingId(request.id);

        router.patch(route("requests.process", request.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Request moved to Processing", {
                    description: `${formatName(request)} now appears in the Processing module.`,
                });
            },
            onError: () => {
                toast.error("Could not move request to Processing");
            },
            onFinish: () => setProcessingId(null),
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
                                    <TableCell className="px-4 py-3 text-muted-foreground">{formatDate(request.request_date)}</TableCell>
                                    <TableCell className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <RequestPrintAction request={request} />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                                                aria-label={`Move ${formatName(request)} to Processing`}
                                                title="Move to Processing"
                                                disabled={processingId !== null}
                                                onClick={() => moveToProcessing(request)}
                                            >
                                                {processingId === request.id ? (
                                                    <LoaderCircle className="size-4 animate-spin" />
                                                ) : (
                                                    <ArrowRight className="size-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
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
