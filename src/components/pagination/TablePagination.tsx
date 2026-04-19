// src/components/membership-head/TablePagination.tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MetaData {
  current_page: number;
  last_page: number;
  total: number;
  per_page?: number;
  from?: number;
  to?: number;
}

interface TablePaginationProps {
  meta: MetaData | null | undefined;
  onPageChange: (page: number) => void;
}

export function TablePagination({ meta, onPageChange }: TablePaginationProps) {
  // If there's no meta, or the total is 0, or it's just 1 page, don't render pagination controls
  if (!meta) {
    return null;
  }

  const { current_page, last_page, total, per_page = 15 } = meta;

  // Safely calculate from/to if they are missing from the API response
  const from = meta.from ?? (current_page - 1) * per_page + 1;
  const to = meta.to ?? Math.min(current_page * per_page, total);

  // Logic to generate the page numbers with ellipses
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (last_page <= maxVisiblePages) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      if (current_page <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", last_page);
      } else if (current_page >= last_page - 2) {
        pages.push(
          1,
          "ellipsis",
          last_page - 3,
          last_page - 2,
          last_page - 1,
          last_page,
        );
      } else {
        pages.push(
          1,
          "ellipsis",
          current_page - 1,
          current_page,
          current_page + 1,
          "ellipsis",
          last_page,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 gap-4 sm:gap-0">
      {/* Left side: Item counter */}
      <div className="text-sm text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {from}
        </span>{" "}
        to{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">
          {total}
        </span>{" "}
        results
      </div>

      {/* Right side: Pagination controls */}
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => current_page > 1 && onPageChange(current_page - 1)}
              className={`rounded-none cursor-pointer ${
                current_page === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(page as number)}
                  isActive={current_page === page}
                  className={`rounded-none cursor-pointer ${
                    current_page === page
                      ? "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                current_page < last_page && onPageChange(current_page + 1)
              }
              className={`rounded-none cursor-pointer ${
                current_page === last_page
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
