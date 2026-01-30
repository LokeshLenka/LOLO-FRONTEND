import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  CalendarPlus,
  X,
  UploadCloud,
  Loader2,
  GripVertical,
  Star,
  MapPin,
  Clock,
  Users,
  Banknote,
  LayoutTemplate,
  Image as ImageIcon,
  Calendar as CalendarIcon,
} from "lucide-react";
import clsx from "clsx";

// Shadcn UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- TYPES ---
interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  label?: string;
  error?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

interface EbmMember {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- UTILS & HELPERS ---
const fetchCoordinators = async (): Promise<EbmMember[] | undefined> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ebm/getebmlist`);
    if (response.data.status === "success") {
      return response.data.data;
    }
  } catch (error) {
    console.error("Error fetching executive body members:", error);
    toast.error("Failed to load coordinator list");
    return [];
  }
};

function DateTimePicker({
  date,
  setDate,
  label,
  error,
  minDate,
  maxDate,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(date);

  useEffect(() => {
    if (open) setTempDate(date || undefined);
  }, [open, date]);

  const getSmartDefaultTime = (targetDate: Date) => {
    const now = new Date();
    const isToday = targetDate.toDateString() === now.toDateString();
    if (isToday) {
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      return nextHour;
    } else {
      const businessStart = new Date(targetDate);
      businessStart.setHours(9, 0, 0, 0);
      return businessStart;
    }
  };

  const handleDateSelect = (d: Date | undefined) => {
    if (d) {
      const newDate = new Date(d);
      if (tempDate) {
        newDate.setHours(tempDate.getHours());
        newDate.setMinutes(tempDate.getMinutes());
      } else {
        const smartTime = getSmartDefaultTime(d);
        newDate.setHours(smartTime.getHours());
        newDate.setMinutes(smartTime.getMinutes());
      }
      setTempDate(newDate);
    }
  };

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!tempDate) return;
    const newDate = new Date(tempDate);
    if (type === "hour") newDate.setHours(parseInt(value));
    else newDate.setMinutes(parseInt(value));
    setTempDate(newDate);
  };

  const handleConfirm = () => {
    if (tempDate) setDate(tempDate);
    setOpen(false);
  };

  const isDateDisabled = (d: Date) => {
    const dTime = d.setHours(0, 0, 0, 0);
    if (dTime < new Date().setHours(0, 0, 0, 0)) return true;
    if (minDate && dTime < minDate.setHours(0, 0, 0, 0)) return true;
    if (maxDate && dTime > maxDate.setHours(0, 0, 0, 0)) return true;
    return false;
  };

  const isTimeDisabled = (val: number, type: "hour" | "minute") => {
    if (!tempDate) return false;
    const checkDate = new Date(tempDate);
    if (type === "hour") checkDate.setHours(val);
    if (type === "minute") checkDate.setMinutes(val);
    const now = new Date();
    if (checkDate < now && tempDate.toDateString() === now.toDateString())
      return true;
    if (minDate && checkDate < minDate) return true;
    if (maxDate && checkDate > maxDate) return true;
    return false;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={clsx(
            "w-full justify-start text-left font-normal h-11 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all",
            !date && "text-muted-foreground",
            error && "border-red-500 ring-1 ring-red-500/20 bg-red-500/5",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-cyan-500" />
          {date ? (
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">
              {format(date, "PPP")}
              <span className="text-zinc-400 mx-2">|</span>
              {format(date, "p")}
            </span>
          ) : (
            <span>{label || "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[300px] sm:w-auto p-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl overflow-hidden ring-1 ring-white/10 z-[60]"
        align="start"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-100 dark:divide-zinc-800">
          <div className="p-4 bg-white dark:bg-zinc-950">
            <Calendar
              mode="single"
              selected={tempDate}
              onSelect={handleDateSelect}
              disabled={isDateDisabled}
              initialFocus
              classNames={{
                month: "space-y-4",
                caption:
                  "flex justify-center pt-1 relative items-center mb-2 h-10",
                caption_label:
                  "text-sm font-bold text-zinc-900 dark:text-zinc-50",
                nav: "space-x-1 flex items-center absolute inset-x-0 justify-between px-1",
                nav_button:
                  "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 transition-opacity border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center z-10 text-zinc-800 dark:text-zinc-200",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell:
                  "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal text-zinc-900 dark:text-zinc-100 aria-selected:opacity-100 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                day_selected:
                  "!bg-cyan-600 !text-white hover:!bg-cyan-700 hover:!text-white focus:!bg-cyan-700 focus:!text-white shadow-md shadow-cyan-500/20",
                day_today:
                  "bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold border border-zinc-200 dark:border-zinc-700",
                day_outside: "text-muted-foreground opacity-30",
                day_disabled:
                  "text-zinc-300 dark:text-zinc-700 opacity-50 cursor-not-allowed decoration-zinc-400 line-through decoration-1",
                day_hidden: "invisible",
              }}
            />
          </div>

          <div className="flex flex-col p-4 w-full sm:w-[220px] bg-zinc-50/50 dark:bg-zinc-900/30">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Time
              </span>
              <Clock className="w-4 h-4 text-cyan-500" />
            </div>

            <div className="flex gap-3 h-[180px] sm:h-[260px]">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] text-center font-medium text-zinc-400 uppercase tracking-wider">
                  Hrs
                </span>
                <ScrollArea className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-inner">
                  <div className="p-1 space-y-1">
                    {hours.map((hour) => {
                      const disabled = isTimeDisabled(hour, "hour");
                      return (
                        <Button
                          key={hour}
                          disabled={disabled}
                          variant="ghost"
                          size="sm"
                          className={clsx(
                            "w-full justify-center h-8 font-normal text-xs transition-all",
                            tempDate?.getHours() === hour
                              ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                              : "text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                            disabled &&
                              "opacity-30 cursor-not-allowed hover:bg-transparent text-zinc-300 dark:text-zinc-600",
                          )}
                          onClick={() =>
                            !disabled &&
                            handleTimeChange("hour", hour.toString())
                          }
                        >
                          {hour.toString().padStart(2, "0")}
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="h-full pt-8 flex justify-center">
                <div className="w-px h-[80%] bg-zinc-200 dark:bg-zinc-700" />
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[10px] text-center font-medium text-zinc-400 uppercase tracking-wider">
                  Min
                </span>
                <ScrollArea className="flex-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-inner">
                  <div className="p-1 space-y-1">
                    {minutes.map((minute) => {
                      const disabled = isTimeDisabled(minute, "minute");
                      return (
                        <Button
                          key={minute}
                          disabled={disabled}
                          variant="ghost"
                          size="sm"
                          className={clsx(
                            "w-full justify-center h-8 font-normal text-xs transition-all",
                            tempDate?.getMinutes() === minute
                              ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                              : "text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
                            disabled &&
                              "opacity-30 cursor-not-allowed hover:bg-transparent text-zinc-300 dark:text-zinc-600",
                          )}
                          onClick={() =>
                            !disabled &&
                            handleTimeChange("minute", minute.toString())
                          }
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 flex justify-end gap-2 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            className="bg-black dark:bg-white text-white dark:text-black px-6 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// --- CONSTANTS ---
const EVENT_TYPES = [
  { key: "music", label: "Music" },
  { key: "club", label: "Management" },
  { key: "public", label: "Public" },
];
const REGISTRATION_MODES = [
  { key: "online", label: "Online" },
  { key: "offline", label: "Offline" },
  // { key: "hybrid", label: "Hybrid" },
];
const COORDINATOR_FIELDS = [
  "coordinator1",
  "coordinator2",
  "coordinator3",
] as const;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
];

// --- ZOD SCHEMA ---
const eventSchema = z
  .object({
    name: z.string().min(1, "Event name is required").max(255),
    description: z.string().min(1, "Description is required").max(2000),
    type: z.string().min(1, "Event type is required"),
    start_date: z
      .string()
      .min(1, "Start date is required")
      .refine((date) => new Date(date) > new Date(), "Date must be in future"),
    end_date: z.string().min(1, "End date is required"),
    venue: z.string().min(1, "Venue is required").max(255),
    credits_awarded: z.coerce.number().min(0).max(99.99),
    fee: z.coerce.number().min(0),
    registration_deadline: z
      .string()
      .min(1, "Deadline is required")
      .refine(
        (date) => new Date(date) > new Date(),
        "Deadline must be in future",
      ),
    max_participants: z.coerce.number().int().min(0).optional().nullable(),
    registration_mode: z.string().min(1, "Registration mode is required"),
    registration_place: z.string().max(150).optional().nullable(),
    coordinator1: z.string().optional().nullable(),
    coordinator2: z.string().optional().nullable(),
    coordinator3: z.string().optional().nullable(),
    alt_txt: z.string().max(255).optional(),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine(
    (data) => new Date(data.registration_deadline) < new Date(data.start_date),
    {
      message: "Deadline must be before event starts",
      path: ["registration_deadline"],
    },
  )
  .superRefine((data, ctx) => {
    // Check for duplicate coordinators
    if (
      data.coordinator1 &&
      data.coordinator2 &&
      data.coordinator1 === data.coordinator2
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate coordinator",
        path: ["coordinator2"],
      });
    }
    if (
      data.coordinator1 &&
      data.coordinator3 &&
      data.coordinator1 === data.coordinator3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate coordinator",
        path: ["coordinator3"],
      });
    }
    if (
      data.coordinator2 &&
      data.coordinator3 &&
      data.coordinator2 === data.coordinator3
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Duplicate coordinator",
        path: ["coordinator3"],
      });
    }
  });

type EventFormSchema = z.infer<typeof eventSchema>;

// --- MAIN COMPONENT ---
export default function CreateEvent() {
  const [images, setImages] = useState<
    { file: File; preview: string; id: string }[]
  >([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ebmMembers, setEbmMembers] = useState<EbmMember[]>([]);

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      credits_awarded: 0,
      fee: 0,
      registration_mode: "online",
      max_participants: null,
      name: "",
      description: "",
      venue: "",
      registration_place: "",
      coordinator1: "",
      coordinator2: "",
      coordinator3: "",
      alt_txt: "",
    },
  });

  const { setError, reset, formState, control, setValue } = form;
  const isSubmitting = formState.isSubmitting;
  const registrationMode = useWatch({ control, name: "registration_mode" });
  const showRegistrationPlace =
    registrationMode === "offline" || registrationMode === "hybrid";

  // Effect: Cleanup Image Previews
  useEffect(
    () => () => images.forEach((img) => URL.revokeObjectURL(img.preview)),
    [images],
  );

  // Effect: Fetch Coordinators on mount
  useEffect(() => {
    const loadCoordinators = async () => {
      const members = await fetchCoordinators();
      if (members) setEbmMembers(members);
    };
    loadCoordinators();
  }, []);

  // Effect: Clear registration place if online
  useEffect(() => {
    if (registrationMode === "online") setValue("registration_place", "");
  }, [registrationMode, setValue]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5)
        return toast.error("Maximum 5 images allowed");
      const validFiles: { file: File; preview: string; id: string }[] = [];
      newFiles.forEach((file) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type))
          return toast.error(`${file.name} is not a valid image`);
        if (file.size > MAX_FILE_SIZE)
          return toast.error(`${file.name} exceeds 10MB`);
        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
        });
      });
      setImages((prev) => [...prev, ...validFiles]);
      if (validFiles.length > 0)
        toast.success(`${validFiles.length} image(s) added`);
    }
  };

  const removeImage = (index: number) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDraggedIndex(i);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === i) return;
    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(i, 0, draggedItem);
    setImages(newImages);
    setDraggedIndex(i);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const onSubmit: SubmitHandler<EventFormSchema> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "")
        formData.append(key, String(value));
    });
    formData.append("status", "upcoming");
    images.forEach((imgObj) => formData.append("images[]", imgObj.file));

    try {
      const response = await axios.post(`${API_BASE_URL}/ebm/event`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201 || response.status === 200) {
        toast.success("Event created!");
        reset();
        setImages([]);
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        toast.error("Validation failed");
        Object.keys(error.response.data.errors).forEach((key) =>
          setError(key as any, {
            type: "server",
            message: error.response.data.errors[key][0],
          }),
        );
      } else toast.error("Failed to create event");
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent pb-20 relative text-zinc-900 dark:text-zinc-100 selection:bg-cyan-500/30">
      {/* --- HEADER --- */}
      <div className="w-full bg-white dark:bg-transparent py-5">
        <div className="mx-auto px-0 sm:px-6 lg:px-8 flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-600/90 shadow-none">
              <CalendarPlus className="text-white h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold tracking-tight text-xl sm:text-2xl truncate">
                Create Event
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="default"
              type="button"
              onClick={() => reset()}
              className="text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400"
            >
              <X className="h-4 w-4 sm:hidden" />{" "}
              <span className="hidden sm:inline">Discard</span>
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              size="default"
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Publish Event"
              )}
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto px-0 sm:px-6 pt-8 pb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* --- COLUMN 1 (MAIN INFO) --- */}
            <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <LayoutTemplate className="w-5 h-5 text-cyan-500" />{" "}
                    Essential Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 !px-2 sm:!px-6 ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Q4 Engineering Summit"
                            className="h-11 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 focus:ring-cyan-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Event description..."
                            className="min-h-[140px] bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 focus:ring-cyan-500/20 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 transition-colors">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg overflow-hidden">
                              {EVENT_TYPES.map((type) => (
                                <SelectItem
                                  key={type.key}
                                  value={type.key}
                                  className="cursor-pointer hover:bg-cyan-600 dark:hover:bg-cyan-950/30 focus:bg-cyan-100 dark:focus:bg-cyan-900/40 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-cyan-600 transition-colors py-2.5 px-3 text-sm font-medium"
                                >
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registration_mode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mode</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 transition-colors">
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg overflow-hidden">
                              {REGISTRATION_MODES.map((mode) => (
                                <SelectItem
                                  key={mode.key}
                                  value={mode.key}
                                  className="cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-950/30 focus:bg-cyan-100 dark:focus:bg-cyan-900/40 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-cyan-600 transition-colors py-2.5 px-3 text-sm font-medium"
                                >
                                  {mode.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {showRegistrationPlace && (
                    <FormField
                      control={form.control}
                      name="registration_place"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2">
                          <FormLabel>Desk Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lobby"
                              className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </CardContent>
              </Card>

              {/* --- VISUAL ASSETS --- */}
              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="!px-2 sm:!px-6">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-cyan-500" /> Visual
                    Assets
                  </CardTitle>
                  <CardDescription>
                    Drag to reorder. First image is cover.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 !px-2 sm:!px-6">
                  <FormField
                    control={form.control}
                    name="alt_txt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Alt Text (Optional)"
                            className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-center cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="flex flex-col items-center justify-center gap-3 text-zinc-500">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <UploadCloud className="h-6 w-6 text-cyan-500" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          Click or drag images
                        </p>
                        <p className="text-xs text-zinc-400">Max 5 images</p>
                      </div>
                    </div>
                  </div>
                  {images.length > 0 && (
                    <div className="space-y-2 mt-4 bg-zinc-50 dark:bg-white/1 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-cyan-500 flex items-center gap-2 mb-2">
                        <Star size={12} fill="currentColor" /> First one is the
                        cover image
                      </p>
                      <div className="grid gap-2">
                        {images.map((img, index) => (
                          <div
                            key={img.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={clsx(
                              "flex items-center gap-3 p-2 bg-white dark:bg-white/1 rounded-lg border shadow-sm cursor-move group transition-all select-none z-30 relative",
                              draggedIndex === index
                                ? "opacity-50 border-cyan-500 border-dashed"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                              index === 0
                                ? "border-l-4 border-l-cyan-500 dark:border-l-cyan-500"
                                : "",
                            )}
                          >
                            <GripVertical
                              size={16}
                              className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 cursor-grab active:cursor-grabbing flex-shrink-0"
                            />
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-100 dark:border-zinc-700">
                              <img
                                src={img.preview}
                                alt="preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate text-zinc-700 dark:text-zinc-300">
                                {img.file.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-zinc-400 transition-colors flex-shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* --- COLUMN 2 (SCHEDULE & DETAILS) --- */}
            <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm ">
                <CardHeader className="!px-2 sm:!px-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-4 h-4 text-cyan-500" /> Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 !px-2 sm:!px-6">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-xs text-muted-foreground">
                          Start Date
                        </FormLabel>
                        <DateTimePicker
                          date={field.value ? new Date(field.value) : undefined}
                          setDate={(date) => field.onChange(date.toISOString())}
                          label="Pick start date"
                          minDate={new Date()}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => {
                      const startDateVal = form.getValues("start_date");
                      const minEndDate = startDateVal
                        ? new Date(startDateVal)
                        : new Date();
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-xs text-muted-foreground">
                            End Date
                          </FormLabel>
                          <DateTimePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={(date) =>
                              field.onChange(date.toISOString())
                            }
                            label="Pick end date"
                            minDate={minEndDate}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
                  <FormField
                    control={form.control}
                    name="registration_deadline"
                    render={({ field }) => {
                      const startDateVal = form.getValues("start_date");
                      const maxDeadline = startDateVal
                        ? new Date(startDateVal)
                        : undefined;
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-xs text-red-500/80">
                            Reg. Deadline
                          </FormLabel>
                          <DateTimePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={(date) =>
                              field.onChange(date.toISOString())
                            }
                            label="Pick deadline"
                            error={!!formState.errors.registration_deadline}
                            minDate={new Date()}
                            maxDate={maxDeadline}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="!px-2 sm:!px-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="w-4 h-4 text-cyan-500" /> Venue
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 !px-2 sm:!px-6">
                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Venue</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Room 204"
                            className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="!px-2 sm:!px-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Banknote className="w-4 h-4 text-cyan-500" /> Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 !px-2 sm:!px-6">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fee (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="credits_awarded"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credits</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="max_participants"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Unlimited"
                            className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || null)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* --- COORDINATORS SECTION (UPDATED) --- */}
              <Card className="bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 shadow-sm">
                <CardHeader className="!px-2 sm:!px-6">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4 text-cyan-500" /> Coordinators
                  </CardTitle>
                  <CardDescription>
                    Select EBM members from the list
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 !px-2 sm:!px-6">
                  {COORDINATOR_FIELDS.map((fieldName, i) => (
                    <FormField
                      key={fieldName}
                      control={form.control}
                      name={fieldName}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-muted-foreground">
                            Coordinator {i + 1}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 bg-white dark:bg-white/1 border-zinc-200 dark:border-zinc-800 transition-colors">
                                <SelectValue
                                  placeholder={`Select Coordinator ${i + 1}`}
                                />
                              </SelectTrigger>
                            </FormControl>
                            {/* UPDATED: Added rich styling from Registration Mode */}
                            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-lg overflow-hidden max-h-60">
                              <SelectItem
                                value=" "
                                className="cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors py-2.5 px-3 text-sm font-medium"
                              >
                                <span className="text-muted-foreground italic">
                                  None
                                </span>
                              </SelectItem>
                              {ebmMembers.map((member) => (
                                <SelectItem
                                  key={member.id}
                                  value={String(member.id)}
                                  className="cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-950/30 focus:bg-cyan-100 dark:focus:bg-cyan-900/40 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:data-[state=checked]:bg-cyan-600 transition-colors py-2.5 px-3 text-sm font-medium"
                                >
                                  {member.full_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
