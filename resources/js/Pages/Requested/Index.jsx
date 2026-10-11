import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { ClipboardList } from "lucide-react";

import RequestedTable from "./Partials/RequestedTable";

export default function Index({ requests }) {
    return (
        <AuthenticatedLayout
            breadcrumbs={{
                parent: "SDO LOI System",
                parentHref: route("requests.index"),
                current: "Requested",
            }}
        >
            <Head title="Requested" />
            <section className="space-y-6 p-1 sm:p-2">
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <ClipboardList className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">LOI request queue</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Requested</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Review newly submitted letters of intent.</p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-muted/40 px-4 py-3 sm:min-w-32">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</p>
                        <p className="mt-1 text-2xl font-semibold">{requests.total}</p>
                    </div>
                </div>
                <RequestedTable requests={requests} />
            </section>
        </AuthenticatedLayout>
    );
}
