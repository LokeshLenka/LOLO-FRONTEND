// // import { Link } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from ".";
// import Badge from "../badge/Badge";
// import { LinkIcon } from "lucide-react";
// import * as React from "react";
// import TablePagination from "@mui/material/TablePagination";

// interface EventRegistration {
//   uuid: string;
//   registered_at: string;
//   is_paid: boolean;
//   registration_status: string;
//   ticket_code: string;
//   payment_status: string;
//   payment_reference: string;
//   event: {
//     uuid: string;
//     name: string;
//   };
// }

// interface PaginatedRegistrations {
//   current_page: number;
//   data: EventRegistration[];
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   links: { url: string | null; label: string; active: boolean }[];
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number;
//   total: number;
// }

// // Example paginated dummy data
// const paginatedRegistrations: PaginatedRegistrations = {
//   current_page: 1,
//   data: [
//     {
//       uuid: "18e8906b-d267-4a21-b4b1-47c226982485",
//       registered_at: "2025-06-26T04:43:36.000000Z",
//       is_paid: true,
//       registration_status: "pending",
//       ticket_code: "LOLO-DC07BB2D-CFA7-4C98-9D82-6CFCCEE3B782",
//       payment_status: "pending",
//       payment_reference: "TXN-IL5LNQFV",
//       event: {
//         uuid: "9497de65-17c2-4ca4-a0b6-c4a96fbbc20b",
//         name: "janis.name",
//       },
//     },
//     // More dummy registrations for pagination
//     ...Array.from({ length: 99 }, (_, i) => ({
//       uuid: `dummy-${i}`,
//       registered_at: `2025-06-2${(i % 9) + 1}T0${(i % 9) + 1}:43:36.000000Z`,
//       is_paid: i % 2 === 0,
//       registration_status: ["confirmed", "pending", "waitlisted", "cancelled"][
//         i % 4
//       ],
//       ticket_code: `LOLO-TICKET-${i}`,
//       payment_status: ["success", "pending", "failed"][i % 3],
//       payment_reference: `TXN-DUMMY-${i}`,
//       event: {
//         uuid: `event-${i}`,
//         name: `Event ${i + 2}`,
//       },
//     })),
//   ],
//   first_page_url: "http://localhost:8000/api/music/event-registrations?page=1",
//   from: 1,
//   last_page: 2,
//   last_page_url: "http://localhost:8000/api/music/event-registrations?page=2",
//   links: [
//     { url: null, label: "« Previous", active: false },
//     {
//       url: "http://localhost:8000/api/music/event-registrations?page=1",
//       label: "1",
//       active: true,
//     },
//     {
//       url: "http://localhost:8000/api/music/event-registrations?page=2",
//       label: "2",
//       active: false,
//     },
//     { url: null, label: "Next »", active: false },
//   ],
//   next_page_url: "http://localhost:8000/api/music/event-registrations?page=2",
//   path: "http://localhost:8000/api/music/event-registrations",
//   per_page: 20,
//   prev_page_url: null,
//   to: 20,
//   total: 40,
// };

// export default function EventRegistrationsTable() {
//   const { data: allRegistrations } = paginatedRegistrations;
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   // Paginate dummy data
//   const registrations = allRegistrations.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const handleChangePage = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
//         <Table>
//           <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//             <TableRow>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Event Name
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Registered At
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Registration Status
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Payment Status
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Payment Reference
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Ticket
//               </TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {registrations.map((reg) => (
//               <TableRow key={reg.uuid}>
//                 <TableCell className="px-5 py-4 sm:px-6 text-start">
//                   <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                     {reg.event.name}
//                   </span>
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                   <span className="capitalize inline-block">
//                     <Badge
//                       size="sm"
//                       color={
//                         reg.registration_status === "confirmed"
//                           ? "success"
//                           : reg.registration_status === "pending"
//                           ? "warning"
//                           : reg.registration_status === "waitlisted"
//                           ? "info"
//                           : "error"
//                       }
//                     >
//                       {reg.registration_status}
//                     </Badge>
//                   </span>
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                   <span className="capitalize inline-block">
//                     <Badge
//                       size="sm"
//                       color={
//                         reg.payment_status === "success"
//                           ? "success"
//                           : reg.payment_status === "pending"
//                           ? "warning"
//                           : "error"
//                       }
//                     >
//                       {reg.payment_status}
//                     </Badge>
//                   </span>
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {reg.payment_reference}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {new Date(reg.registered_at).toLocaleString()}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                   <Link to={`{/}`} className="text-blue-500 hover:underline">
//                     <span className="inline-flex items-center">
//                       <LinkIcon size={18} />
//                       <span className="ml-1"> View</span>
//                     </span>
//                   </Link>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//       {/* MUI TablePagination centered and outside scroll */}
//       <div className="w-full flex justify-center items-center py-2 sm:justify-end sm:pr-4">
//         <TablePagination
//           component="div"
//           count={allRegistrations.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </div>
//     </div>
//   );
// }
