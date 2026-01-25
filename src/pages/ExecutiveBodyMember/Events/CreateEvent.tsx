import React from "react";
import { Card, CardBody, Button, Input, Textarea } from "@heroui/react";
import { CalendarPlus, MapPin, Image as ImageIcon, IndianRupee } from "lucide-react";

export default function CreateEvent() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
          <CalendarPlus className="text-[#03a1b0]" /> Create New Event
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card shadow="none" className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl p-2">
            <CardBody className="space-y-6 p-6">
              <Input label="Event Name" placeholder="e.g. Annual Tech Summit" variant="bordered" classNames={{inputWrapper: "border-black/10 dark:border-white/10"}} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input type="datetime-local" label="Start Date" variant="bordered" />
                <Input type="datetime-local" label="End Date" variant="bordered" />
              </div>
              <Input label="Venue" placeholder="e.g. Auditorium A" startContent={<MapPin size={18} className="text-gray-400" />} variant="bordered" />
              <Textarea label="Description" placeholder="What is this event about?" minRows={4} variant="bordered" />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card shadow="none" className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Event Details</h3>
              <Input label="Registration Fee (₹)" type="number" placeholder="0" startContent={<IndianRupee size={16} />} variant="bordered" />
              <Input label="Max Capacity" type="number" placeholder="Unlimited" variant="bordered" />
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <ImageIcon className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-500 font-medium">Upload Cover Image</span>
              </div>

              <Button className="w-full bg-[#03a1b0] text-white font-bold h-12 shadow-lg hover:shadow-cyan-500/20">
                Publish Event
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
}
