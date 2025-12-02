import { Link } from "react-router-dom";
import Badge from "../badge/Badge";
import { LinkIcon } from "lucide-react";

interface EventRegistrationCard {
  uuid: string;
  registered_at: string;
  is_paid: boolean;
  registration_status: string;
  ticket_code: string;
  payment_status: string;
  payment_reference: string;
  event: {
    uuid: string;
    name: string;
    image?: string;
  };
}

// Dummy data — user-facing
const cards: EventRegistrationCard[] = [
  {
    uuid: "18e8906b-d267-4a21-b4b1-47c226982485",
    registered_at: "2025-06-26T04:43:36.000000Z",
    is_paid: true,
    registration_status: "confirmed",
    ticket_code: "LOLO-DC07BB2D-CFA7-4C98-9D82-6CFCCEE3B782",
    payment_status: "success",
    payment_reference: "TXN-IL5LNQFV",
    event: {
      uuid: "9497de65-17c2-4ca4-a0b6-c4a96fbbc20b",
      name: "LoLo Summer Fest",
      image: "https://picsum.photos/seed/lolo1/800/480",
    },
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    uuid: `user-${i}`,
    registered_at: new Date(Date.now() - i * 86400000).toISOString(),
    is_paid: i % 2 === 0,
    registration_status: ["confirmed", "pending", "waitlisted", "cancelled"][i % 4],
    ticket_code: `LOLO-TICKET-U-${i}`,
    payment_status: ["success", "pending", "failed"][i % 3],
    payment_reference: `TXN-USER-${i}`,
    event: {
      uuid: `event-${i}`,
      name: `Local Gig ${i + 1}`,
      image: `https://picsum.photos/seed/event-${i}/800/480`,
    },
  })) as EventRegistrationCard[],
];

export default function EventCards() {
  return (
    <section className="py-6 px-4">
      <h2 className="text-2xl font-semibold mb-4">My Event Registrations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((reg) => (
          <article
            key={reg.uuid}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <div className="h-44 sm:h-48 overflow-hidden bg-gray-100">
              <img
                src={reg.event.image}
                alt={reg.event.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {reg.event.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Registered: {new Date(reg.registered_at).toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge
                  size="sm"
                  color={
                    reg.registration_status === "confirmed"
                      ? "success"
                      : reg.registration_status === "pending"
                      ? "warning"
                      : reg.registration_status === "waitlisted"
                      ? "info"
                      : "error"
                  }
                >
                  {reg.registration_status}
                </Badge>

                <Badge
                  size="sm"
                  color={
                    reg.payment_status === "success"
                      ? "success"
                      : reg.payment_status === "pending"
                      ? "warning"
                      : "error"
                  }
                >
                  {reg.payment_status}
                </Badge>

                <span className="ml-auto text-sm text-gray-600 dark:text-gray-300">
                  ₹{reg.is_paid ? "Paid" : "—"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Ticket: <span className="font-medium text-gray-800 dark:text-white">{reg.ticket_code}</span>
                </div>
                <Link to={`/events/${reg.event.uuid}`} className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2">
                  <LinkIcon size={16} />
                  <span className="text-sm">View</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="px-4 py-2 bg-lolo-pink text-white rounded-md">Load more</button>
      </div>
    </section>
  );
}
