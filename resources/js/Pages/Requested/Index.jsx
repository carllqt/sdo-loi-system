import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ToastContext";
import AddRequestDialog from "./Partials/AddRequestDialog";

import RequestedTable from "./Partials/RequestedTable";

export default function Index({ requests, positions, schools, syncResult }) {
    const [syncing, setSyncing] = useState(false);
    const [syncError, setSyncError] = useState("");
    const toast = useToast();
    const sync = () => {
        setSyncing(true);
        setSyncError("");
        router.post(route("requests.syncGoogleSheet"), {}, {
            preserveScroll: true,
            onSuccess: (page) => {
                const result = page.props.syncResult;
                if (result) toast.success("Google Forms sync finished", {
                    description: `${result.imported} added · ${result.skipped} duplicates skipped · ${result.gender_updated ?? 0} genders filled · ${result.invalid} need correction`,
                });
            },
            onError: (errors) => setSyncError(errors.sync ?? "Could not sync the Sheet. Please try again."),
            onFinish: () => setSyncing(false),
        });
    };
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
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button type="button" size="lg" variant="outline" disabled={syncing} onClick={sync}>
                        <RefreshCw className="size-4" /> {syncing ? "Syncing…" : "Sync Google Forms"}
                    </Button>
                    <AddRequestDialog positions={positions} schools={schools} />
                </div>
                {syncError && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{syncError}</p>}
                {syncResult && !syncError && (
                    <div role="status" className="rounded-lg border bg-card p-4 text-sm">
                        <p className="font-medium">Last sync: {syncResult.imported} added, {syncResult.skipped} duplicates skipped, {syncResult.invalid} need correction.</p>
                        {syncResult.gender_updated > 0 && <p className="mt-1 text-muted-foreground">Gender filled for {syncResult.gender_updated} existing requests.</p>}
                        {syncResult.missing_email > 0 && <p className="mt-1 text-muted-foreground">{syncResult.missing_email} new requests have no email address. Collect email addresses in the Form for notification emails.</p>}
                        {syncResult.issues?.length > 0 && <ul className="mt-2 list-inside list-disc text-destructive">{syncResult.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}
                    </div>
                )}
                <RequestedTable requests={requests} />
            </section>
        </AuthenticatedLayout>
    );
}
