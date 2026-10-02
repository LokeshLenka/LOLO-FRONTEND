import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface CMBreadcrumbItem {
  label: string;
  /** Route to link to. Omit for the current page (rendered as plain text). */
  to?: string;
}

export function CMBreadcrumb({ items }: { items: CMBreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-y-1 text-xs">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isLink = item.to && !isLast;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="mx-1.5 h-3.5 w-3.5 text-zinc-400 dark:text-[#667085]" />
                </li>
              )}
              <li className="flex min-w-0 items-center">
                {isLink ? (
                  <Link
                    to={item.to as string}
                    className="uppercase tracking-[0.15em] text-zinc-500 transition-colors hover:text-zinc-900 dark:text-[#667085] dark:hover:text-[#F2F4F7]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="max-w-[240px] truncate uppercase tracking-[0.15em] text-zinc-900 dark:text-[#F2F4F7]"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
