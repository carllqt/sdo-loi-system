import { useForm } from "@inertiajs/react";
import { Check, ChevronDown } from "lucide-react";
import { useToast } from "@/Components/ToastContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

const fields = [
    { name: "first_name", label: "First name", autoComplete: "given-name" },
    {
        name: "middle_name",
        label: "Middle name",
        autoComplete: "additional-name",
    },
    { name: "last_name", label: "Last name", autoComplete: "family-name" },
    { name: "position", label: "Position" },
    { name: "school", label: "School" },
    { name: "email", label: "Email", type: "email", autoComplete: "email" },
];

const inputClassName = (hasError) =>
    `mt-2 h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
        hasError ? "border-rose-400" : "border-slate-200"
    }`;

export default function RequestForm({ positions = [], schools = [] }) {
    const toast = useToast();
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        school: "",
        email: "",
    });

    const submit = (event) => {
        event.preventDefault();
        post(route("loi-requests.store"), {
            onSuccess: () => {
                reset();
                toast.success("Request submitted", {
                    description: "Your LOI request has been sent for review.",
                });
            },
        });
    };

    return (
        <>
            <form onSubmit={submit}>
                <div
                    className="grid sm:grid-cols-2"
                    style={{ columnGap: "20px", rowGap: "24px" }}
                >
                    {fields.map(({ name, label, type = "text", ...attributes }) => (
                        <div
                            key={name}
                            className={
                                name === "school" || name === "email"
                                    ? "sm:col-span-2"
                                    : ""
                            }
                        >
                            <label
                                htmlFor={name}
                                className="block text-sm font-medium leading-5 text-slate-700"
                            >
                                {label} <span aria-hidden="true" className="text-rose-600">*</span>
                            </label>

                            {name === "position" ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <button
                                                id="position"
                                                type="button"
                                                aria-invalid={Boolean(errors.position)}
                                                aria-describedby={errors.position ? "position-error" : undefined}
                                                className={`${inputClassName(Boolean(errors.position))} flex items-center justify-between text-left ${data.position ? "text-slate-900" : "text-slate-400"}`}
                                                style={{ height: "44px" }}
                                            />
                                        }
                                    >
                                        <span>{data.position || "Select a teaching position"}</span>
                                        <ChevronDown className="size-4 text-slate-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" sideOffset={4} className="max-h-64">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Teaching positions</DropdownMenuLabel>
                                            {positions.length ? (
                                                positions.map((position) => (
                                                    <DropdownMenuItem
                                                        key={position.id}
                                                        onClick={() => setData("position", position.name)}
                                                    >
                                                        <Check
                                                            className={`size-4 ${data.position === position.name ? "opacity-100 text-blue-700" : "opacity-0"}`}
                                                        />
                                                        {position.name}
                                                    </DropdownMenuItem>
                                                ))
                                            ) : (
                                                <DropdownMenuItem disabled>No positions available</DropdownMenuItem>
                                            )}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : name === "school" ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <button
                                                id="school"
                                                type="button"
                                                aria-invalid={Boolean(errors.school)}
                                                aria-describedby={errors.school ? "school-error" : undefined}
                                                className={`${inputClassName(Boolean(errors.school))} flex items-center justify-between text-left ${data.school ? "text-slate-900" : "text-slate-400"}`}
                                                style={{ height: "44px" }}
                                            />
                                        }
                                    >
                                        <span className="min-w-0 truncate">
                                            {data.school || "Select your school"}
                                        </span>
                                        <ChevronDown className="size-4 shrink-0 text-slate-500" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" sideOffset={4} className="max-h-72">
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel>Schools</DropdownMenuLabel>
                                            {schools.length ? (
                                                schools.map((school) => (
                                                    <DropdownMenuItem
                                                        key={school.id}
                                                        onClick={() => setData("school", school.name)}
                                                    >
                                                        <Check
                                                            className={`size-4 shrink-0 ${data.school === school.name ? "opacity-100 text-blue-700" : "opacity-0"}`}
                                                        />
                                                        <span className="min-w-0 flex-1 whitespace-normal">
                                                            {school.name}
                                                        </span>
                                                        <span className="ml-2 shrink-0 text-xs text-slate-400">
                                                            {school.code}
                                                        </span>
                                                    </DropdownMenuItem>
                                                ))
                                            ) : (
                                                <DropdownMenuItem disabled>No schools available</DropdownMenuItem>
                                            )}
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <input
                                    id={name}
                                    name={name}
                                    type={type}
                                    value={data[name]}
                                    onChange={(event) => setData(name, event.target.value)}
                                    className={inputClassName(Boolean(errors[name]))}
                                    maxLength={255}
                                    required
                                    aria-invalid={Boolean(errors[name])}
                                    aria-describedby={errors[name] ? `${name}-error` : undefined}
                                    style={{ height: "44px" }}
                                    {...attributes}
                                />
                            )}

                            {errors[name] && (
                                <p id={`${name}-error`} className="mt-1.5 text-sm text-rose-600">
                                    {errors[name]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-9 flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-6 text-sm font-semibold text-white shadow-sm shadow-blue-900/15 transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-48"
                        style={{ height: "48px" }}
                    >
                        {processing ? "Submitting…" : "Submit request"}
                    </button>
                </div>
            </form>
        </>
    );
}
