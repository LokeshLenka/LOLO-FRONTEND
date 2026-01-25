import React from "react";
import { Card, CardBody } from "@heroui/react";
import { UserPlus, Calendar } from "lucide-react";

const MOCK_REGISTRATIONS = [
  { id: 1, name: "Rahul Verma", username: "rahulv", role: "Student", date: "Jan 20, 2026" },
  { id: 2, name: "Priya Singh", username: "priyas", role: "Student", date: "Jan 18, 2026" },
];

export default function MyRegistrations() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
         <UserPlus className="text-emerald-500" /> Onboarding History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_REGISTRATIONS.map((user) => (
          <Card key={user.id} shadow="none" className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl">
            <CardBody className="p-5 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center text-emerald-600 font-bold">
                     {user.name.charAt(0)}
                  </div>
                  <div>
                     <h4 className="font-bold text-black dark:text-white">{user.name}</h4>
                     <p className="text-xs text-gray-500">@{user.username} • {user.role}</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Onboarded</p>
                  <p className="text-sm font-medium flex items-center gap-1 text-gray-700 dark:text-gray-300">
                     <Calendar size={12} /> {user.date}
                  </p>
               </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
