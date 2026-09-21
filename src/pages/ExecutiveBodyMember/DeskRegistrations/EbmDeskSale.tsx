import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Smartphone,
  Banknote,
  ArrowLeft,
  User,
  CreditCard,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PublicUserStep } from "@/pages/PublicUsers/PublicUserStep";

// ── Schema ───────────────────────────────────────────────────────────────────
const baseFields = {
  full_name: z.string().min(1, "Required"),
  phone_no: z.string().min(10, "Min 10 digits").max(15, "Max 15 digits"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  reg_num: z
    .string()
    .trim()
    .min(10, "Must be 10 chars")
    .max(10, "Must be 10 chars"),
  branch: z.string().min(1, "Required"),
  year: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  college_hostel_status: z.boolean(),
  event_id: z.string().min(1, "Select an event"),
  amount: z.coerce.number().min(0, "Amount must be valid"),
};

const schema = z.discriminatedUnion("method", [
  z.object({
    ...baseFields,
    method: z.literal("UPI_QR"),
    utr: z.string().trim().min(12, "Valid UTR Number required (min 12 digits)"),
  }),
  z.object({
    ...baseFields,
    method: z.literal("CASH"),
    utr: z.string().optional(),
  }),
]);

type FormData = z.infer<typeof schema>;

type EventOption = {
  id: string | number;
  uuid: string;
  name: string;
  fee?: number | string | null;
  qr_code_url?: string | null;
};

// ── Styles ───────────────────────────────────────────────────────────────────
const inputStyle =
  "bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-12 rounded-xl placeholder:text-neutral-600 transition-colors text-sm w-full";
const labelStyle =
  "text-[10px] font-bold uppercase text-neutral-500 tracking-wider ml-1 mb-1.5 block";
const sectionClass =
  "p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5 relative overflow-hidden";
const sectionTitleClass =
  "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1 relative z-10";

// ── Helpers ──────────────────────────────────────────────────────────────────
function unwrap<T>(res: any): T {
  return (res?.data?.data ?? res?.data) as T;
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ icon: Icon, title, children, delay = 0 }: { icon: React.ElementType; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={sectionClass}
    >
      <p className={sectionTitleClass}>
        <Icon size={14} className="text-lolo-pink" />
        {title}
      </p>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Confirm row helper ────────────────────────────────────────────────────────
function ConfirmRow({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider shrink-0">{label}</span>
      <span className={`text-sm font-semibold text-right ${highlight ? "text-lolo-pink" : "text-white"}`}>{value}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function EbmDeskSale() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const { user, token } = useAuth();

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
      }),
    [API_BASE_URL, token],
  );

  const [events, setEvents] = useState<EventOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"UPI_QR" | "CASH">("UPI_QR");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      method: "UPI_QR",
      full_name: "",
      phone_no: "",
      email: "",
      reg_num: "",
      branch: "",
      year: "",
      gender: "",
      college_hostel_status: false,
      event_id: "",
      amount: 0,
      utr: "",
    },
  });

  const watchedEventId = form.watch("event_id");
  const watchedAmount = form.watch("amount");
  const selectedEvent = events.find((e) => e.uuid === watchedEventId);

  // Auto-fill amount from event fee
  useEffect(() => {
    if (selectedEvent?.fee) {
      const fee = Number(selectedEvent.fee);
      if (!isNaN(fee) && fee >= 0) form.setValue("amount", fee);
    }
  }, [watchedEventId, form, selectedEvent]);

  // Fetch events
  useEffect(() => {
    api
      .get("/events?per_page=50")
      .then((r) => {
        const list = r?.data?.data?.data ?? r?.data?.data ?? [];
        setEvents(list);
      })
      .catch(() => toast.error("Failed to load events"));
  }, [api]);

  const handleFormSubmit = (data: FormData) => {
    setPendingData(data);
    setDialogOpen(true);
  };

  const resolvePublicUserId = async (normalizedRegNum: string, data: FormData) => {
    try {
      const checkRes = await api.get(`/public-user/reg-num/${normalizedRegNum}`);
      const userData = unwrap<{ id?: number }>(checkRes);
      if (userData?.id) return userData.id;
    } catch (err: any) {
      if (err?.response?.status !== 404) throw err;
    }

    const userPayload = {
      reg_num: normalizedRegNum,
      name: data.full_name,
      email: data.email || undefined,
      gender: data.gender,
      year: data.year,
      branch: data.branch,
      phone_no: data.phone_no,
      college_hostel_status: data.college_hostel_status ? 1 : 0,
    };
    await api.post(`/public-user`, userPayload);

    const refetchRes = await api.get(`/public-user/reg-num/${normalizedRegNum}`);
    const userData = unwrap<{ id?: number }>(refetchRes);
    if (!userData?.id) {
      throw new Error("Could not resolve Public User ID. Please try again.");
    }
    return userData.id;
  };

  const handleConfirmed = async () => {
    if (!pendingData) return;
    const data = pendingData;

    setDialogOpen(false);
    setIsSubmitting(true);
    const toastId = toast.loading("Processing registration...");

    try {
      const normalizedRegNum = data.reg_num.toUpperCase().trim();

      const event = events.find((e) => e.uuid === data.event_id);
      if (!event?.uuid) {
        toast.error("Invalid event selected. Please refresh and try again.", { id: toastId });
        return;
      }
      const eventUuid = event.uuid;

      // 1) Resolve or create public user
      const publicUserId = await resolvePublicUserId(normalizedRegNum, data);

      // 2) Create event registration using exact UtrPublicRegistration flow
      const regPayload: any = {
        public_user_id: publicUserId,
        reg_num: normalizedRegNum,
      };

      if (data.method === "UPI_QR" && data.utr) {
        regPayload.utr = data.utr;
      }

      const regRes = await api.post(`/public/event/${eventUuid}/registration`, regPayload);

      // Robust unwrapping specific to the UtrPublicRegistration implementation
      const regData = unwrap<{ uuid?: string; ticket_code?: string; data?: { ticket_code?: string } }>(regRes);
      const regUuid = regData?.uuid;
      const ticketCode = regData?.ticket_code ?? regData?.data?.ticket_code;

      // 3) Create payment collection
      const collectionRes = await api.post("/ebm/payment-collections", {
        payer_type: "public",
        payer_id: publicUserId,
        payer_name: data.full_name,
        payer_identifier: normalizedRegNum,
        payer_phone: data.phone_no,
        payer_email: data.email || null,
        payable_type: "public_event",
        payable_id: eventUuid,
        amount: data.amount * 100,
        status: "PAID",
        currency: "INR",
        method: data.method,
        utr: data.method === "UPI_QR" ? data.utr : null,
        paid_at: new Date().toISOString(),
        created_by_user_id: user?.uuid,
        meta: { collected_by: user?.name ?? user?.email },
      });

      const collection = unwrap<{ id?: number }>(collectionRes);

      // 4) Update registration status explicitly for EBM overrides
      await api.put(`/ebm/event/${eventUuid}/registration/${regUuid}`, {
        registration_status: "confirmed"
      });

      toast.success("Registration recorded!", { id: toastId });

      navigate(`/${user?.username}/executive_body_member/ticket-success`, {
        state: {
          attendeeName: data.full_name,
          regNum: normalizedRegNum,
          phone: data.phone_no,
          ticketCode: ticketCode,
          eventName: event.name,
          method: data.method,
          amount: data.amount,
          utr: data.utr,
          collectionId: collection?.id,
        },
      });
    } catch (error: any) {
      console.error("Registration Error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const firstField = Object.keys(error.response.data.errors)[0];
        errorMessage = error.response.data.errors[firstField]?.[0] || errorMessage;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId, duration: 6000 });
    } finally {
      setIsSubmitting(false);
      setPendingData(null);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-transparent pb-16">
      {/* ── Confirmation Dialog ───────────────────────────────────────────── */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="bg-white/1 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg max-w-md w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg font-bold">
              Confirm Registration
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-500 text-sm">
              Please verify all details before confirming. This will register
              the attendee and record the payment.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingData && (
            <div className="my-1 space-y-0 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-1">
              <ConfirmRow label="Attendee" value={pendingData.full_name} />
              <ConfirmRow label="Reg No" value={pendingData.reg_num.toUpperCase()} />
              <ConfirmRow label="Phone" value={pendingData.phone_no} />
              {pendingData.email && <ConfirmRow label="Email" value={pendingData.email} />}
              <ConfirmRow label="Branch / Year" value={`${pendingData.branch.toUpperCase()} · ${pendingData.year}`} />
              <ConfirmRow label="Event" value={events.find((e) => e.uuid === pendingData.event_id)?.name ?? "—"} />
              <ConfirmRow
                label="Method"
                value={
                  <span className="flex items-center justify-end gap-1.5">
                    {pendingData.method === "UPI_QR" ? <><Smartphone size={13} /> UPI / QR</> : <><Banknote size={13} /> Cash</>}
                  </span>
                }
              />
              {pendingData.method === "UPI_QR" && pendingData.utr && <ConfirmRow label="UTR" value={pendingData.utr} />}
              <ConfirmRow label="Amount" value={`₹${pendingData.amount}`} highlight />
            </div>
          )}

          <AlertDialogFooter className="gap-2 mt-4">
            <AlertDialogCancel
              className="h-11 flex-1 rounded-xl font-semibold text-sm text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-colors m-0"
              onClick={() => setPendingData(null)}
            >
              Go Back & Edit
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-11 flex-1 rounded-xl font-semibold text-sm bg-lolo-pink text-white hover:bg-lolo-pink/80 transition-colors m-0"
              onClick={handleConfirmed}
            >
              Confirm & Register
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Page header ── */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
          >
            <ArrowLeft size={16} className="text-neutral-400" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Desk Sale
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm mt-0.5">
              Register attendee and collect payment manually
            </p>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col lg:flex-row gap-6 items-start"
          >
            {/* ── Left: form sections ── */}
            <div className="flex-1 w-full space-y-5">

              {/* EVENT */}
              <Section icon={CalendarDays} title="Event" delay={0}>
                <FormField
                  control={form.control}
                  name="event_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelStyle}>Select Event *</FormLabel>
                      <FormControl>
                        <select {...field} className={`${inputStyle} px-3 appearance-none cursor-pointer`}>
                          <option value="" className="bg-neutral-900 text-neutral-400">— Choose event —</option>
                          {events.map((e) => (
                            <option key={e.uuid} value={e.uuid} className="bg-neutral-900 text-white">
                              {e.name}
                              {e.fee ? ` (₹${e.fee})` : ""}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Section>

              {/* ATTENDEE DETAILS */}
              <Section icon={User} title="Attendee Details" delay={0.05}>
                <PublicUserStep form={form as any} prefix="" />
              </Section>

              {/* PAYMENT */}
              <Section icon={CreditCard} title="Payment" delay={0.1}>
                <div className="flex gap-3 mb-6">
                  {(["UPI_QR", "CASH"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(m);
                        form.setValue("method", m);
                      }}
                      className={`flex-1 h-12 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 ${selectedMethod === m
                        ? "bg-lolo-pink border-lolo-pink text-white shadow-lg shadow-lolo-pink/20"
                        : "bg-transparent border-white/10 text-neutral-400 hover:text-white hover:border-white/20"
                        }`}
                    >
                      {m === "UPI_QR" ? <Smartphone size={15} /> : <Banknote size={15} />}
                      <span>{m === "UPI_QR" ? "UPI / QR" : "Cash"}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Amount (₹) *</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min={0} className={inputStyle} placeholder="e.g. 150" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <AnimatePresence mode="wait">
                    {selectedMethod === "UPI_QR" && (
                      <motion.div
                        key="utr"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <FormField
                          control={form.control}
                          name="utr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelStyle}>UTR NUMBER (12 DIGITS) *</FormLabel>
                              <FormControl>
                                <Input {...field} className={inputStyle} placeholder="Enter 12-digit UTR" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Section>
            </div>

            {/* ── Right: sticky summary + submit ── */}
            <div className="w-full lg:w-80 lg:sticky lg:top-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
              >
                <p className={sectionTitleClass}>
                  <CheckCircle2 size={14} className="text-lolo-pink" />
                  Summary
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-neutral-500 shrink-0">Event</span>
                    <span className="text-white font-medium text-right truncate max-w-[160px]">
                      {selectedEvent?.name ?? <span className="text-neutral-600 italic">Not selected</span>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500">Method</span>
                    <span className="flex items-center gap-1.5 text-white font-medium">
                      {selectedMethod === "UPI_QR" ? <><Smartphone size={13} className="text-lolo-pink" /> UPI / QR</> : <><Banknote size={13} className="text-lolo-pink" /> Cash</>}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <span className="text-neutral-400 font-bold">Total</span>
                    <span className="text-lolo-pink font-bold text-lg">
                      {watchedAmount > 0 ? `₹${watchedAmount}` : "—"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-white text-black font-bold rounded-full hover:bg-lolo-pink hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Review & Confirm"
                  )}
                </Button>
                <p className="text-center text-[11px] text-neutral-600 mt-2">
                  You'll review all details before confirming.
                </p>
              </motion.div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
