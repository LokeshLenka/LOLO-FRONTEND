import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody, Image, Button } from "@heroui/react";
import Badge from "../badge/Badge";
import { is } from "zod/v4/locales";
import { Eye, Ticket } from "lucide-react";

interface EventRegistration {
  uuid: string;
  registered_at: string;
  is_paid: boolean;
  registration_status: "confirmed" | "pending" | "waitlisted" | "cancelled";
  ticket_code: string;
  payment_status: "success" | "pending" | "failed";
  payment_reference: string;
  event: {
    uuid: string;
    name: string;
    image?: string;
  };
}

const isDark = document.documentElement.classList.contains("dark");

export default function EventRegistrationCards() {
  // Generate mock stock images
  const stock = (seed: string, w = 640, h = 360) =>
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

  // Mock data
  const TOTAL = 100;
  const make = (i: number): EventRegistration => ({
    uuid: `uuid-${i}`,
    registered_at: `2025-06-1${(i % 9) + 1}T0${(i % 9) + 1}:43:36.000000Z`,
    is_paid: i % 2 === 0,
    registration_status: (
      ["confirmed", "pending", "waitlisted", "cancelled"] as const
    )[i % 4],
    ticket_code: `LOLO-TICKET-${i}`,
    payment_status: (["success", "pending", "failed"] as const)[i % 3],
    payment_reference: `TXN-${i}`,
    event: {
      uuid: `event-${i}`,
      name: `Event Name ${i + 1}`,
      image: stock(`event-${i}`, 640, 360),
    },
  });

  const all = React.useMemo(
    () => Array.from({ length: TOTAL }, (_, i) => make(i)),
    []
  );

  // Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);

  const start = page * rowsPerPage;
  const pageItems = all.slice(start, start + rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const badgeColor = (s: string) =>
    s === "confirmed"
      ? "success"
      : s === "pending"
      ? "warning"
      : s === "waitlisted"
      ? "info"
      : "error";

  return (
    <section
      aria-label="Event registrations"
      className="relative w-full min-h-screen p-0 sm:p-5 rounded-2xl overflow-hidden bg-transparent"
    >
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Event Registrations
        </h2> */}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {pageItems.map((reg) => (
            <Card
              key={reg.uuid}
              shadow="none"
              className="border border-gray-200 bg-white/20 dark:border-white/[0.05] dark:bg-white/[0.03]
             text-black dark:text-white 
             transition-all duration-500 ease-out 
             hover:scale-[1.02] hover:shadow-2xl hover:border-black/20 hover:dark:border-white/30 
             rounded-lg overflow-hidden 
             "
            >
              {/* Header with Image */}
              <CardHeader className="p-0 overflow-hidden relative group">
                <img
                  src={reg.event.image}
                  alt={`${reg.event.name} cover`}
                  className="object-cover w-full h-40 sm:h-44 md:h-48 
                 transition-all duration-700 ease-out 
                 group-hover:scale-105 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </CardHeader>

              {/* Body */}
              <CardBody className="px-5 py-4 flex flex-col gap-4">
                {/* Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50 line-clamp-1">
                    {reg.event.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <Badge
                      size="sm"
                      color={badgeColor(reg.registration_status)}
                    >
                      {reg.registration_status}
                    </Badge>
                    <Badge size="sm" color={badgeColor(reg.payment_status)}>
                      {reg.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-400">
                  {/* <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Ticket Code:
                    </span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">
                      {reg.ticket_code}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Payment Ref:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {reg.payment_reference}
                    </span>
                  </div> */}

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      Registered :
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {new Date(reg.registered_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2 grid grid-cols-2 gap-5">
                  <div>
                    <Button
                      as={Link}
                      to={`/tickets/${reg.uuid}`}
                      aria-label="View Ticket"
                      className="w-full h-12 flex justify-center px-1 py-2 
                   rounded-lg 
                   shadow-md border-2 hover:border border-[#03a1b0] hover:border-[#008b99]
                   dark:border-lolo-cyan/30 dark:hover:border-lolo-cyan/50 text-[#03a1b0] dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-lolo-cyan/60 
                   focus:ring-offset-2
                   transition-all duration-300 ease-out"
                    >
                      <Eye size={18}></Eye>Details
                    </Button>
                  </div>
                  <div>
                    <Button
                      as={Link}
                      to={`/tickets/${reg.uuid}`}
                      aria-label="View Ticket"
                      className="w-full h-12 flex justify-center px-1 py-2 
                   rounded-lg 
                   shadow-md bg-[#03a1b0] hover:bg-[#008b99]
                   dark:bg-lolo-cyan/50 dark:hover:bg-lolo-cyan/30 text-white
                   focus:outline-none focus:ring-2 focus:ring-lolo-cyan/60 
                   focus:ring-offset-2 transition-all duration-300 ease-out"
                    >
                      <Ticket size={18}></Ticket>Ticket
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="fixed bottom-0 w-full absolute bg-white/90 dark:bg-black/90 backdrop-blur-sm left-0 justify-center items-center py-1 sm:justify-end text-gray-800 dark:text-gray-100">
          <TablePagination
            component="div"
            count={TOTAL}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Per Page"
            sx={{
              color: "inherit",
              ".MuiSvgIcon-root": { color: "inherit" },
              // ↓ styles for dropdown menu selection on dark theme
              "& .MuiTablePagination-select": {
                color: "inherit",
              },
            }}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    sx: {
                      // background for dropdown
                      bgcolor: isDark ? "#0c0c0e" : "#ffffff",
                      // text color
                      color: isDark ? "#ffffff" : "#000000",
                      // selected row highlight
                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: isDark ? "#004c54" : "#03a1b0", // <-- teal/greenish highlight
                        color: isDark ? "#ffffff" : "#000000",
                      },
                      // "& .MuiMenuItem-root.Mui-selected:hover": {
                      //   bgcolor: "#005a5e", // hover effect
                      // },
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </section>
  );
}
