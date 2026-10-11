export function formatName(request) {
    return [request.first_name, request.middle_name, request.last_name]
        .filter(Boolean)
        .join(" ");
}

export function maskEmail(email) {
    if (!email || !email.includes("@")) return "—";

    const [localPart, domain] = email.split("@");
    const visibleCharacter = localPart.charAt(0);

    return `${visibleCharacter}${"*".repeat(Math.max(localPart.length - 1, 3))}@${domain}`;
}

export function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(parsedDate);
}

export function statusClasses(status) {
    switch (status) {
        case "Completed":
            return "bg-emerald-100 text-emerald-800";
        case "Processing":
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-amber-100 text-amber-800";
    }
}
