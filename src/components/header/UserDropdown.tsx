// import { useState } from "react";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { Check, CircleUserRound } from "lucide-react";

// export default function UserDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   // Profile selection logic
//   // Profiles array with category
//   const baseProfiles = ["Music", "Management"];
//   // const promotedProfiles = ["CM", "MH", "EBM"];
//   // UserProfiles: always one from baseProfiles, optionally one from promotedProfiles

//   const UserProfiles = ["Management", "Promoted : MCH"]; // Example: user has Music and EBM

//   // const [selectedProfiles, setSelectedProfiles] =
//   //   useState<string[]>(UserProfiles);

//   const [activeProfile, setActiveProfile] = useState<string>(
//     UserProfiles[0] ?? baseProfiles[0]
//   );
//   const [profilesOpen, setProfilesOpen] = useState(false);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }
//   function closeDropdown() {
//     setIsOpen(false);
//   }
//   function handleProfileClick(p: string) {
//     setActiveProfile(p);
//     setProfilesOpen(false);
//     closeDropdown();
//   }

//   return (
//     <div className="relative">
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
//       >
//         <span className="rounded-full h-12 w-12">
//           {/* <img src="/images/user/owner.jpg" alt="User" /> */}
//           <CircleUserRound className="mt-2 ml-2" size={30} />
//         </span>
//         <span className="block mr-1 font-medium text-theme-sm">Lokesh</span>
//         <svg
//           className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           width="18"
//           height="20"
//           viewBox="0 0 18 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>
//       <Dropdown
//         isOpen={isOpen}
//         onClose={closeDropdown}
//         className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
//       >
//         <div>
//           <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
//             Lokesh Lenka
//           </span>
//           <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
//             lenkalokesh12@gmail.com
//           </span>
//         </div>
//         <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
//           <li className="relative">
//             <div>
//               <button
//                 type="button"
//                 onClick={() => setProfilesOpen((s) => !s)}
//                 className="flex w-full items-center justify-between gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//               >
//                 <div className="flex flex-col items-start">
//                   <span className="block">Profiles</span>
//                   <span className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
//                     Active: {activeProfile}
//                   </span>
//                 </div>
//                 <svg
//                   className={`transition-transform duration-150 ${
//                     profilesOpen ? "rotate-180" : ""
//                   }`}
//                   width="18"
//                   height="20"
//                   viewBox="0 0 18 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
//                     stroke="currentColor"
//                     strokeWidth="1.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </button>
//               {profilesOpen && (
//                 <div className="absolute left-0 z-10 mt-2 w-[220px] rounded-lg border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
//                   <div className="mb-1 px-1 text-theme-xs text-gray-500">
//                     Switch profiles
//                   </div>
//                   <ul className="flex flex-col gap-1">
//                     {selectedProfiles.map((p) => {
//                       const isActive = activeProfile === p;
//                       return (
//                         <li key={p}>
//                           <DropdownItem
//                             onItemClick={() => handleProfileClick(p)}
//                             tag="button"
//                             className="flex items-center justify-between gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//                           >
//                             <div className="flex items-center gap-3">
//                               <span
//                                 className={
//                                   isActive ? "font-semibold text-green-500" : ""
//                                 }
//                               >
//                                 {p}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               {isActive && (
//                                 <span className="text-theme-xs text-gray-500">
//                                   <Check className="text-green-500" />
//                                 </span>
//                               )}
//                             </div>
//                           </DropdownItem>
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </li>
//           {/* <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               tag="a"
//               to="/support"
//               className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
//             >
//               <svg
//                 className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM11.0991 7.52507C11.0991 8.02213 11.5021 8.42507 11.9991 8.42507H12.0001C12.4972 8.42507 12.9001 8.02213 12.9001 7.52507C12.9001 7.02802 12.4972 6.62507 12.0001 6.62507H11.9991C11.5021 6.62507 11.0991 7.02802 11.0991 7.52507ZM12.0001 17.3714C11.5859 17.3714 11.2501 17.0356 11.2501 16.6214V10.9449C11.2501 10.5307 11.5859 10.1949 12.0001 10.1949C12.4143 10.1949 12.7501 10.5307 12.7501 10.9449V16.6214C12.7501 17.0356 12.4143 17.3714 12.0001 17.3714Z"
//                   fill=""
//                 />
//               </svg>
//               Support
//             </DropdownItem>
//           </li> */}
//         </ul>
//       </Dropdown>
//     </div>
//   );
// }
