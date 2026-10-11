import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    CheckCircle2,
    Clock3,
    FolderOpen,
    Layers3,
    Settings2,
} from "lucide-react";

import AllRequestTable from "./Partials/AllRequestTable";

const statCards = [
    { key: "all", label: "Total Requests", subtitle: "Updated just now", icon: FolderOpen, color: "text-slate-700", iconClass: "bg-slate-100 text-slate-700" },
    { key: "requested", label: "Requested / Pending", subtitle: "Awaiting initial review", icon: Clock3, color: "text-amber-600", iconClass: "bg-amber-50 text-amber-600" },
    { key: "processing", label: "In Processing", subtitle: "Under evaluation", icon: Settings2, color: "text-blue-600", iconClass: "bg-blue-50 text-blue-600" },
    { key: "completed", label: "Completed", subtitle: "Approved & Signed", icon: CheckCircle2, color: "text-emerald-600", iconClass: "bg-emerald-50 text-emerald-600" },
];

const Index = ({ requests }) => {
    const { requestCounts = {} } = usePage().props;

    return (
        <AuthenticatedLayout
            breadcrumbs={{
                parent: "SDO LOI System",
                parentHref: route("requests.index"),
                current: "All LOI Requests",
            }}
        >
            <Head title="All LOI Requests" />
            <section className="space-y-5 p-1 sm:p-2">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map(({ key, label, subtitle, icon: Icon, color, iconClass }) => (
                        <div key={key} className="group rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className={`text-sm font-medium uppercase tracking-wide ${color}`}>{label}</p>
                                    <p className="mt-2 text-3xl font-semibold tracking-tight">{requestCounts[key] ?? 0}</p>
                                    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                                </div>
                                <div className={`flex size-14 items-center justify-center rounded-2xl ${iconClass}`}>
                                    <Icon className="size-7 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="group flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                <Layers3 className="size-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">All LOI Requests</h1>
                                <p className="mt-1 text-sm text-muted-foreground">Manage teacher Letters of Intent across schools.</p>
                            </div>
                        </div>
                    </div>
                    <AllRequestTable requests={requests} embedded />
                </div>
            </section>
        </AuthenticatedLayout>
    );
};

export default Index;
