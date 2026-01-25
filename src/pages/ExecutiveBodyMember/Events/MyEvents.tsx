import React from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { Calendar, MapPin, Users, Edit, MoreVertical } from "lucide-react";

const MOCK_EVENTS = [
  { id: 1, name: "Web Dev Bootcamp", date: "Feb 10, 2026", venue: "Lab 2", registrants: 45, status: "Published", image: null },
  { id: 2, name: "AI Workshop", date: "Feb 15, 2026", venue: "Seminar Hall", registrants: 120, status: "Draft", image: null },
];

export default function MyEvents() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-black dark:text-white">My Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event) => (
          <Card key={event.id} shadow="none" className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="h-40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 relative">
               <div className="absolute top-4 right-4">
                  <Chip size="sm" color={event.status === "Published" ? "success" : "warning"} variant="solid" className="text-white font-bold">
                    {event.status}
                  </Chip>
               </div>
            </div>
            <CardBody className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-black text-black dark:text-white mb-1">{event.name}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {event.date}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {event.venue}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5">
                 <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                    <Users size={16} className="text-[#03a1b0]" />
                    {event.registrants} Reg.
                 </div>
                 <Button size="sm" variant="light" startContent={<Edit size={16} />}>Manage</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
