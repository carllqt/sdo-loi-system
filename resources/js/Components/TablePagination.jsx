import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

export default function TablePagination({ requests }) {
    if (!requests?.links || requests.links.length <= 3) return null;

    const previous = requests.links[0];
    const next = requests.links.at(-1);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t bg-muted/20 px-4 py-3">
            <p className="text-sm text-muted-foreground">
                Showing {requests.from ?? 0} to {requests.to ?? 0} of {requests.total}
            </p>
            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href={previous?.url ?? "#"}
                            className={!previous?.url ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {requests.links.slice(1, -1).map((link, index) => (
                        <PaginationItem key={`${link.label}-${index}`}>
                            <PaginationLink
                                href={link.url ?? "#"}
                                isActive={link.active}
                                className={!link.url ? "pointer-events-none opacity-50" : ""}
                            >
                                {link.label.replace(/<[^>]*>/g, "")}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <PaginationNext
                            href={next?.url ?? "#"}
                            className={!next?.url ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
