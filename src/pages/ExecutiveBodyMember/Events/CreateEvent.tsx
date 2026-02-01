import React, { useState, useEffect } from "react";
import { useForm, type SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
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
} from "lucide-react";
import clsx from "clsx";
import dayjs from "dayjs";

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

// IMPORT NEW DATE PICKER
import { DateTimePicker } from "@/components/ui/MUIDatePicker";

// --- TYPES ---
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
  .superRefine(
    ({ coordinator1: c1, coordinator2: c2, coordinator3: c3 }, ctx) => {
      if (c1 && c2 && c1 === c2) {
        ctx.addIssue({
          code: "custom",
          message: "Must be distinct",
          path: ["coordinator2"],
        });
      }
      if (c1 && c3 && c1 === c3) {
        ctx.addIssue({
          code: "custom",
          message: "Must be distinct",
          path: ["coordinator3"],
        });
      }
      if (c2 && c3 && c2 === c3) {
        ctx.addIssue({
          code: "custom",
          message: "Must be distinct",
          path: ["coordinator3"],
        });
      }
    },
  );

type EventFormSchema = z.infer<typeof eventSchema>;

// --- MAIN COMPONENT ---
export default function CreateEvent() {
  const [images, setImages] = useState<
    { file: File; preview: string; id: string }[]
  >([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [ebmMembers, setEbmMembers] = useState<EbmMember[]>([]);

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventSchema) as any,
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
      type: "",
      start_date: "",
      end_date: "",
      registration_deadline: "",
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
                                  className={clsx(
                                    "cursor-pointer transition-colors py-2.5 px-3 text-sm font-medium",
                                    // Hover
                                    "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                                    // Focus
                                    "focus:bg-zinc-50 dark:focus:bg-zinc-900",
                                    // Selected
                                    "data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:bg-zinc-800",
                                    "data-[state=checked]:text-cyan-600 dark:data-[state=checked]:text-cyan-400",
                                    "data-[state=checked]:font-semibold",
                                  )}
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
                                  className={clsx(
                                    "cursor-pointer transition-colors py-2.5 px-3 text-sm font-medium",
                                    // Hover
                                    "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                                    // Focus
                                    // "focus:bg-zinc-50 dark:focus:bg-zinc-900",
                                    // Selected
                                    "data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:bg-zinc-800",
                                    "data-[state=checked]:text-cyan-600 dark:data-[state=checked]:text-cyan-400",
                                    "data-[state=checked]:font-semibold",
                                  )}
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
                  <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 sm:p-8 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors text-center cursor-pointer relative min-h-[120px] flex items-center justify-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-zinc-500">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <UploadCloud className="h-6 w-6 text-cyan-500" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">
                          Click or drag images
                        </p>
                        <p className="text-xs text-zinc-400">Max 5 images</p>
                      </div>
                    </div>
                  </div>

                  {/* RESPONSIVE IMAGE LIST */}
                  {images.length > 0 && (
                    <div className="space-y-2 mt-4 bg-zinc-50 dark:bg-white/5 p-2 sm:p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-cyan-500 flex items-center gap-2 mb-2">
                        <Star size={12} fill="currentColor" /> First one is
                        cover
                      </p>
                      {/* GRID LAYOUT: 1 column mobile, 2 columns tablet+ */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {images.map((img, index) => (
                          <div
                            key={img.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={clsx(
                              "flex items-center gap-2 p-2 bg-white dark:bg-zinc-900 rounded-lg border shadow-sm cursor-move group transition-all select-none z-30 relative",
                              draggedIndex === index
                                ? "opacity-50 border-cyan-500 border-dashed"
                                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                              index === 0
                                ? "border-l-4 border-l-cyan-500 dark:border-l-cyan-500"
                                : "",
                            )}
                          >
                            <GripVertical
                              size={14}
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
                              <p className="text-xs sm:text-sm font-medium truncate text-zinc-700 dark:text-zinc-300 max-w-[120px]">
                                {img.file.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-1.5 hover:bg-red-500/10 hover:text-red-500 rounded-md text-zinc-400 transition-colors flex-shrink-0"
                            >
                              <X size={14} />
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
                  {/* --- START DATE FIELD --- */}
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <DateTimePicker
                          value={field.value}
                          onChange={(dateStr) => {
                            field.onChange(dateStr || "");
                            // Reset End Date if invalid
                            const endDate = form.getValues("end_date");
                            if (
                              dateStr &&
                              endDate &&
                              dayjs(endDate).isBefore(dayjs(dateStr))
                            ) {
                              form.setValue("end_date", "");
                            }
                          }}
                          label="Pick start date"
                          minDate={new Date()} // Block past dates globally
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/*  2. UPDATE END DATE FIELD */}
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => {
                      const startDateVal = form.watch("start_date");
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <DateTimePicker
                            value={field.value}
                            onChange={(dateStr) =>
                              field.onChange(dateStr || "")
                            }
                            label="Pick end date"
                            minDate={
                              startDateVal ? new Date(startDateVal) : new Date()
                            }
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  {/* 3. UPDATE DEADLINE FIELD */}
                  <FormField
                    control={form.control}
                    name="registration_deadline"
                    render={({ field }) => {
                      const startDateVal = form.watch("start_date");
                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-red-500/80">
                            Reg. Deadline
                          </FormLabel>
                          <DateTimePicker
                            value={field.value}
                            onChange={(dateStr) =>
                              field.onChange(dateStr || "")
                            }
                            label="Pick deadline"
                            minDate={new Date()}
                            maxDate={
                              startDateVal ? new Date(startDateVal) : undefined
                            }
                            error={
                              !!form.formState.errors.registration_deadline
                            }
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
                                  className={clsx(
                                    "cursor-pointer transition-colors py-2.5 px-3 text-sm font-medium",
                                    // Hover State
                                    "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                                    // Focus State
                                    "focus:bg-zinc-50 dark:focus:bg-zinc-900",
                                    // SELECTED STATE (Updated)
                                    // Background: Subtle Gray (Zinc-100/800)
                                    // Text: Cyan-600
                                    "data-[state=checked]:bg-zinc-100 dark:data-[state=checked]:bg-zinc-800",
                                    "data-[state=checked]:text-cyan-600 dark:data-[state=checked]:text-cyan-400",
                                    "data-[state=checked]:font-semibold",
                                  )}
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
