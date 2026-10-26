import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { DialogTitle } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import Modal from "@/Components/Modal";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/Components/ToastContext";

function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function AddRequestDialog({ positions = [], schools = [] }) {
    const [open, setOpen] = useState(false);
    const toast = useToast();
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: "", middle_name: "", last_name: "", gender: "", position: "", school: "", email: "", request_date: today(),
    });
    const close = () => {
        if (processing) return;
        setOpen(false);
        reset();
        clearErrors();
    };
    const submit = (event) => {
        event.preventDefault();
        post(route("requests.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                toast.success("Request added", { description: "The employee now appears in Requested." });
            },
        });
    };
    const fields = [
        { name: "first_name", label: "First name", required: true, autoComplete: "given-name" },
        { name: "middle_name", label: "Middle name / initial", autoComplete: "additional-name" },
        { name: "last_name", label: "Last name", required: true, autoComplete: "family-name" },
        { name: "gender", label: "Gender", options: [{ id: "Male", name: "Male" }, { id: "Female", name: "Female" }], required: true },
        { name: "request_date", label: "Request date", type: "date", required: true },
        { name: "position", label: "Position", options: positions, required: true },
        { name: "school", label: "School", options: schools, required: true },
        { name: "email", label: "Email (optional)", type: "email", autoComplete: "email", wide: true },
    ];

    return (
        <>
            <Button type="button" size="lg" onClick={() => { setData("request_date", today()); setOpen(true); }}>
                <Plus className="size-4" /> Add Request
            </Button>
            <Modal show={open} onClose={close} closeable={!processing}>
                <div className="bg-card p-6 text-card-foreground">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <DialogTitle className="text-lg font-semibold">Add request</DialogTitle>
                            <p className="mt-1 text-sm text-muted-foreground">Enter the employee’s details to create a pending LOI request.</p>
                        </div>
                        <Button type="button" variant="ghost" size="icon" aria-label="Close dialog" onClick={close} disabled={processing}>
                            <X className="size-4" />
                        </Button>
                    </div>
                    <form onSubmit={submit}>
                        <fieldset disabled={processing} className="grid max-h-[65vh] gap-4 overflow-y-auto px-1 pb-1 sm:grid-cols-2">
                            {fields.map(({ name, label, options, wide, ...attributes }) => {
                                const inputProps = {
                                    id: `add-request-${name}`, name, value: data[name],
                                    onChange: (event) => setData(name, event.target.value),
                                    "aria-invalid": Boolean(errors[name]),
                                    "aria-describedby": errors[name] ? `add-request-${name}-error` : undefined,
                                    className: "mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60",
                                    ...attributes,
                                };
                                return (
                                    <div key={name} className={wide ? "sm:col-span-2" : ""}>
                                        <label htmlFor={inputProps.id} className="text-sm font-medium">{label}{attributes.required ? " *" : ""}</label>
                                        {options ? (
                                            <select {...inputProps}>
                                                <option value="">Select {label.toLowerCase()}</option>
                                                {options.map((option) => <option key={option.id} value={option.name}>{option.name}</option>)}
                                            </select>
                                        ) : <input {...inputProps} type={attributes.type ?? "text"} maxLength={255} />}
                                        {errors[name] && <p id={`add-request-${name}-error`} className="mt-1 text-sm text-destructive">{errors[name]}</p>}
                                        {name === "email" && <p className="mt-1 text-xs text-muted-foreground">Needed to send the processed-document notification.</p>}
                                    </div>
                                );
                            })}
                        </fieldset>
                        <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                            <Button type="button" variant="outline" onClick={close} disabled={processing}>Cancel</Button>
                            <Button type="submit" disabled={processing}>{processing ? "Saving…" : "Save request"}</Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
