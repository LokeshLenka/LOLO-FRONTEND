// import * as React from "react";
// import TablePagination from "@mui/material/TablePagination";
// import { Table, TableBody, TableCell, TableHeader, TableRow } from ".";

// interface Credit {
//   id: number;
//   uuid: string;
//   user_id: number;
//   event_id: number;
//   assigned_by: number;
//   amount: number;
//   created_at: string;
//   updated_at: string;
//   deleted_at?: string | null;
//   event: {
//     uuid: string;
//     name: string;
//   };
// }

// // Dummy data for credits
// const credits: Credit[] = Array.from({ length: 99 }, (_, i) => ({
//   id: i + 1,
//   uuid: `uuid-${i + 1}`,
//   user_id: 1000 + i,
//   event_id: 2000 + i,
//   assigned_by: 3000 + i,
//   amount: Math.round(Math.random() * 1000) / 100,
//   created_at: new Date(Date.now() - i * 86400000).toISOString(),
//   updated_at: new Date(Date.now() - i * 86400000).toISOString(),
//   deleted_at: null,
//   event: {
//     uuid: `event-uuid-${i + 1}`,
//     name: `Event Name ${i + 1}`,
//   },
// }));

// export default function CreditsTable() {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   // Paginate dummy data
//   const paginatedCredits = credits.slice(
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
//                 S.No
//               </TableCell>
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
//                 Credits Earned
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Assigned By
//               </TableCell>
//               <TableCell
//                 isHeader
//                 className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//               >
//                 Assigned At
//               </TableCell>
//             </TableRow>
//           </TableHeader>
//           <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {paginatedCredits.map((credit) => (
//               <TableRow key={credit.id}>
//                 <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {credit.id}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {credit.event.name}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {credit.amount}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {credit.assigned_by}
//                 </TableCell>
//                 <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
//                   {new Date(credit.created_at).toLocaleString()}
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
//           count={credits.length}
//           page={page}
//           onPageChange={handleChangePage}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </div>
//     </div>
//   );
// }
