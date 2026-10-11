import { Head } from "@inertiajs/react";
import RequestForm from "./Partials/RequestForm";

export default function Index({ positions = [], schools = [] }) {
    return (
        <>
            <Head title="Submit an LOI Request" />
            <main className="bg-white px-4 py-8 sm:px-6 sm:py-10">
                <section className="mx-auto w-full max-w-xl rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
                    <header className="mb-6">
                        <img
                            src="/logo.png"
                            alt="SDO LOI System"
                            className="mb-4 size-9 rounded-lg object-cover"
                        />
                        <p className="text-sm font-medium text-blue-700">
                            Letters of Intent
                        </p>
                        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
                            Submit your request
                        </h1>
                        <p className="mt-2 text-sm leading-5 text-slate-600">
                            Complete the form with your current contact and
                            school details. Your request will be added to the
                            SDO LOI review queue.
                        </p>
                    </header>

                    <RequestForm
                        positions={positions}
                        schools={schools}
                    />
                </section>
            </main>
        </>
    );
}
