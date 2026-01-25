import React from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { UserPlus, Mail, Phone, Lock } from "lucide-react";

export default function RegisterMember() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto flex flex-col justify-center max-w-4xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-black dark:text-white mb-2">
          Register New Member
        </h1>
        <p className="text-gray-500">
          Manually onboard a new student or faculty member.
        </p>
      </div>

      <Card
        shadow="none"
        className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-3xl p-4"
      >
        <CardBody className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              variant="bordered"
            />
            <Input
              label="Username"
              placeholder="johndoe123"
              variant="bordered"
            />
            <Input
              label="Email Address"
              placeholder="john@college.edu"
              startContent={<Mail size={16} />}
              variant="bordered"
            />
            <Input
              label="Phone Number"
              placeholder="+91 99999 99999"
              startContent={<Phone size={16} />}
              variant="bordered"
            />

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Role" placeholder="Select role" variant="bordered">
                <SelectItem key="student">Student</SelectItem>
                <SelectItem key="faculty">Faculty</SelectItem>
              </Select>
              <Input
                label="Temporary Password"
                type="password"
                placeholder="••••••••"
                startContent={<Lock size={16} />}
                variant="bordered"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button variant="flat">Cancel</Button>
            <Button
              className="bg-[#03a1b0] text-white font-bold px-8 shadow-lg shadow-cyan-500/20"
              startContent={<UserPlus size={18} />}
            >
              Create Account
            </Button>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
