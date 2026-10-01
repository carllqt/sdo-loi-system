import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <section className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">LOI Requests</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    View and track submitted letters of intent.
                </p>
                <Link
                    href={route("requests.index")}
                    className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                    View all requests
                </Link>
            </section>
        </AuthenticatedLayout>
    );
}
