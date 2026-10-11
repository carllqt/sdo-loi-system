import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { CheckCircle2 } from "lucide-react";

import CompletedTable from "./Partials/CompletedTable";

export default function Index({ requests }) {
    return (
        <AuthenticatedLayout
            breadcrumbs={{
                parent: "SDO LOI System",
                parentHref: route("requests.index"),
                current: "Completed",
            }}
        >
            <Head title="Completed" />
            <section className="space-y-6 p-1 sm:p-2">
                <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                            <CheckCircle2 className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">LOI request queue</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Completed</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Review completed letters of intent.</p>
                        </div>
                    </div>
                    <div className="rounded-lg border bg-muted/40 px-4 py-3 sm:min-w-32">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total</p>
                        <p className="mt-1 text-2xl font-semibold">{requests.total}</p>
                    </div>
                </div>
                <CompletedTable requests={requests} />
            </section>
        </AuthenticatedLayout>
    );
}
