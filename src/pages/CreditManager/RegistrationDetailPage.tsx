import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarRange,
  CircleDollarSign,
  CreditCard,
  Pencil,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditFormSheet } from "@/components/credit-manager/CreditFormSheet";
import { EligibilityBadge, type EligibilityStatus } from "@/components/credit-manager/EligibilityBadge";
import { assignerName, canManageCredit } from "@/components/credit-manager/creditUtils";
import { useCMRegistrationDetail } from "@/hooks/useCMRegistrationDetail";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-zinc-200 py-3 last:border-b-0 dark:border-[#344054]">
      <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
        {label}
      </span>
      <span className="max-w-[60%] break-all text-right text-sm text-zinc-950 dark:text-[#F2F4F7]">
        {value}
      </span>
    </div>
  );
}

function renderStatus(
  status?: string,
  kind: "registration" | "payment" = "registration",
) {
  const normalized = (status ?? "").toLowerCase();

  let className =
    "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#98A2B3]";

  if (normalized === "confirmed") {
    className =
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  } else if (normalized === "pending") {
    className =
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  } else if (
    kind === "payment" &&
    (normalized === "paid" || normalized === "completed")
  ) {
    className =
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  return (
    <Badge
      variant="outline"
      className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${className}`}
    >
      {status ?? "Unknown"}
    </Badge>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

export default function RegistrationDetailPage() {
  const navigate = useNavigate();
  const { registrationUuid = "", username = "" } = useParams<{
    registrationUuid: string;
    username: string;
  }>();
  const { detail, isLoading, isError, assignCredit, updateCredit } =
    useCMRegistrationDetail(registrationUuid);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const registration = detail.registration;
  const credit = detail.credit;

  const pageTitle = useMemo(() => {
    if (!registration) return "Registration Detail";
    return `${registration.user?.username ?? "Unknown User"} · ${registration.event?.name ?? "Unknown Event"}`;
  }, [registration]);

  const eligibility: { status: EligibilityStatus; note: string } = useMemo(() => {
    const role = registration?.user?.role?.toLowerCase();
    const promoted = registration?.user?.promoted_role?.toLowerCase();
    const eventType = registration?.event?.type?.toLowerCase();

    if (eventType === "public") {
      return {
        status: "public",
        note: "This is a public event registration. Public-event registrations are never eligible for credits.",
      };
    }
    if (!role || role === "public") {
      return {
        status: "public",
        note: "This user has a public role and is not eligible for credits.",
      };
    }
    if (
      role === "management" ||
      promoted === "credit_manager" ||
      promoted === "executive_body_member" ||
      promoted === "membership_head"
    ) {
      return {
        status: "management",
        note: "Management member — eligible for credits for every event, with or without registration.",
      };
    }
    if (role === "music") {
      return {
        status: "registered",
        note: "Music member with a confirmed registration — eligible for credits for this event.",
      };
    }
    return {
      status: "registered",
      note: "Registered participant — eligible for credits for this event.",
    };
  }, [registration]);

  const creditBlocked =
    eligibility.status === "public" || eligibility.status === "not_eligible";

  const handleCreditSubmit = async (amount: number) => {
    if (!registration?.event?.uuid) return;
    const userId = registration.user_id ?? credit?.user_id;

    if (!userId) {
      throw new Error("user_id is required from API response");
    }

    if (credit?.uuid) {
      await updateCredit({
        creditUuid: credit.uuid,
        user_id: userId,
        amount,
        eventUuid: registration.event.uuid,
      });
    } else {
      await assignCredit({
        user_id: userId,
        amount,
        eventUuid: registration.event.uuid,
      });
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-[#344054] md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
            Credit Manager
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-[#F2F4F7]">
            {pageTitle}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-[#98A2B3]">
            View registration context and manage assigned credits from one page.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() =>
            navigate(`/${username}/credit_manager/event-registrations`)
          }
          className="rounded-none border-zinc-300 dark:border-[#344054]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registrations
        </Button>
      </div>

      {!isLoading && !isError && registration ? (
        <div
          className={`flex flex-col gap-2 border p-4 text-sm md:flex-row md:items-center md:justify-between ${
            creditBlocked
              ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              : "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <EligibilityBadge status={eligibility.status} />
            <span className="text-[13px]">{eligibility.note}</span>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-[#344054] dark:bg-[#1D2939]"
            />
          ))}
        </div>
      ) : isError || !registration ? (
        <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
          <CardContent className="p-8 text-center text-sm text-red-600 dark:text-red-400">
            Failed to load registration details.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
                    Registration
                  </p>
                  <div>{renderStatus(registration.registration_status)}</div>
                </div>
                <BadgeCheck className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
              </CardContent>
            </Card>

            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
                    Payment
                  </p>
                  <div>
                    {renderStatus(registration.payment_status, "payment")}
                  </div>
                </div>
                <CircleDollarSign className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
              </CardContent>
            </Card>

            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
                    Credit Status
                  </p>
                  <div>
                    <Badge
                      variant="outline"
                      className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
                        credit
                          ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#F2F4F7]"
                          : "border-zinc-200 bg-white text-zinc-500 dark:border-[#344054] dark:bg-[#161F2E] dark:text-[#98A2B3]"
                      }`}
                    >
                      {credit ? "Assigned" : "Unassigned"}
                    </Badge>
                  </div>
                </div>
                <CreditCard className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
              </CardContent>
            </Card>

            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardContent className="flex items-center justify-between p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
                    Credit Amount
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-[#F2F4F7]">
                    {credit ? Number(credit.amount).toFixed(2) : "—"}
                  </p>
                </div>
                <CircleDollarSign className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-[#344054]">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <InfoRow label="Registration UUID" value={registration.uuid} />
                <InfoRow
                  label="Registration Status"
                  value={registration.registration_status}
                />
                <InfoRow
                  label="Payment Status"
                  value={registration.payment_status ?? "—"}
                />
                <InfoRow
                  label="User ID"
                  value={
                    registration.user_id != null ? registration.user_id : "—"
                  }
                />
                <InfoRow
                  label="Event ID"
                  value={
                    registration.event_id != null ? registration.event_id : "—"
                  }
                />
              </CardContent>
            </Card>

            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-[#344054]">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Member
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <InfoRow
                  label="Username"
                  value={registration.user?.username ?? "—"}
                />
                <InfoRow
                  label="Email"
                  value={registration.user?.email ?? "—"}
                />
                <div className="mt-5 flex items-center gap-2 border border-zinc-200 p-4 dark:border-[#344054] dark:bg-[#1D2939]">
                  <UserRound className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
                  <span className="text-sm text-zinc-700 dark:text-[#98A2B3]">
                    This registration is tied to the selected user record.
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
              <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-[#344054]">
                <CardTitle className="text-base font-semibold tracking-tight">
                  Event & Credit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <InfoRow
                  label="Event UUID"
                  value={registration.event?.uuid ?? "—"}
                />
                <InfoRow
                  label="Event Name"
                  value={registration.event?.name ?? "—"}
                />
                <InfoRow label="Credit UUID" value={credit?.uuid ?? "—"} />
                <InfoRow
                  label="Assigned By"
                  value={assignerName(credit)}
                />
                <InfoRow
                  label="Updated At"
                  value={
                    credit?.updated_at ? formatDate(credit.updated_at) : "—"
                  }
                />

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    disabled={creditBlocked || (credit ? !canManageCredit(credit) : false)}
                    title={
                      creditBlocked
                        ? "Not eligible for credits"
                        : credit && !canManageCredit(credit)
                          ? "Only the manager who assigned this credit (or an admin) can edit it"
                          : "Assign or edit credit"
                    }
                    className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                  >
                    {credit ? (
                      <>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Credit
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Assign Credit
                      </>
                    )}
                  </Button>

                  {registration.event?.uuid ? (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(
                          `/${username}/credit_manager/events/${registration.event.uuid}/registrations`,
                        )
                      }
                      className="rounded-none border-zinc-300 dark:border-[#344054]"
                    >
                      <CalendarRange className="mr-2 h-4 w-4" />
                      Event View
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      <CreditFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={credit ? "edit" : "create"}
        username={registration?.user?.username ?? "Unknown User"}
        eventName={registration?.event?.name ?? "Unknown Event"}
        initialAmount={credit?.amount ?? ""}
        onSubmit={handleCreditSubmit}
      />
    </motion.div>
  );
}
