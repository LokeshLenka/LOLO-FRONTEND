import React from "react";
import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { Ticket, Search } from "lucide-react";

export default function EventRegistrations() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
           <Ticket className="text-[#03a1b0]" /> Registrations
        </h1>
        <div className="relative">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-[#03a1b0]" placeholder="Search student..." />
        </div>
      </div>

      <div className="space-y-2">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Event</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Fee</div>
        </div>

        {/* List Items */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} shadow="none" className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <CardBody className="grid grid-cols-12 gap-4 items-center p-4">
              <div className="col-span-4 flex items-center gap-3">
                <Avatar size="sm" />
                <div>
                   <p className="font-bold text-sm text-black dark:text-white">Student Name {i}</p>
                   <p className="text-xs text-gray-500">Reg: 21B91A050{i}</p>
                </div>
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-700 dark:text-gray-300">Web Dev Bootcamp</div>
              <div className="col-span-2 text-xs text-gray-500">Jan 24, 2026</div>
              <div className="col-span-2">
                <Chip size="sm" color="success" variant="flat" className="font-bold">Paid</Chip>
              </div>
              <div className="col-span-1 text-right font-mono text-sm">₹500</div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
