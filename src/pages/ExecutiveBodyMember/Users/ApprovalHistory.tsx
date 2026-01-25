import React from "react";
import { Card, CardBody, Chip } from "@heroui/react";
import { CheckCircle2, History, XCircle } from "lucide-react";

const MOCK_HISTORY = [
  {
    id: 101,
    name: "David Wilson",
    role: "Member",
    action: "approved",
    date: "Jan 24, 2026",
    reviewer: "You",
  },
  {
    id: 102,
    name: "Eva Green",
    role: "Volunteer",
    action: "rejected",
    date: "Jan 23, 2026",
    reviewer: "You",
  },
];

export default function ApprovalsHistory() {
  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-4 sm:px-16 mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-2">
        <History className="text-purple-500" /> My Approval History
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_HISTORY.map((item) => (
          <Card
            key={item.id}
            shadow="none"
            className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl"
          >
            <CardBody className="flex flex-row items-center justify-between p-5">
              <div>
                <h4 className="font-bold text-black dark:text-white">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Applied for: {item.role}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Chip
                  startContent={
                    item.action === "approved" ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )
                  }
                  color={item.action === "approved" ? "success" : "danger"}
                  variant="flat"
                  className="capitalize font-bold"
                >
                  {item.action}
                </Chip>
                <span className="text-[10px] text-gray-400">{item.date}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
