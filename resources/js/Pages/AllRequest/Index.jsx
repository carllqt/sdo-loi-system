import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import { formatName, formatDate, statusClasses } from "@/Pages/utils";

export default function Index({ requests }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h1 className="text-xl font-semibold">All LOI Requests</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        View and track submitted letters of intent.
                    </p>
                </div>
            }
        >
            <Head title="All LOI Requests" />

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">Requests</h2>
                        <p className="text-sm text-muted-foreground">
                            {requests.total}{" "}
                            {requests.total === 1 ? "request" : "requests"}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border bg-card">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-200 text-left text-sm">
                            <thead className="bg-muted/60 text-xs uppercase text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Position
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        School
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium">
                                        Request Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {requests.data.length ? (
                                    requests.data.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {formatName(request)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {request.position}
                                            </td>
                                            <td className="px-4 py-3">
                                                {request.school}
                                            </td>
                                            <td className="px-4 py-3">
                                                {request.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(request.status)}`}
                                                >
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {formatDate(
                                                    request.request_date,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            No LOI requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.links.length > 3 && (
                        <nav
                            className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3"
                            aria-label="Pagination"
                        >
                            <p className="text-sm text-muted-foreground">
                                Showing {requests.from ?? 0} to{" "}
                                {requests.to ?? 0} of {requests.total}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {requests.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url ?? "#"}
                                        preserveScroll
                                        className={`rounded-md border px-3 py-1.5 text-sm ${link.active ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"} ${!link.url ? "pointer-events-none opacity-50" : ""}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </nav>
                    )}
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
