// src/components/membership-head/EditUserSheet.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type User } from "@/hooks/useUsers";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Strict Zod schema matching the editable profile fields
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().optional(),
  phone_no: z
    .string()
    .min(10, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  reg_num: z.string().min(2, "Registration number is required"),
  branch: z.string().min(2, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  gender: z.string().min(1, "Gender is required"),
  sub_role: z.string().optional(),
  lateral_status: z.boolean().default(false),
  hostel_status: z.boolean().default(false),
  college_hostel_status: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserSheetProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (uuid: string, data: any) => Promise<boolean>;
  onDelete: (uuid: string) => Promise<boolean>;
  onApprove: (uuid: string, remarks: string) => Promise<boolean>;
  onReject: (uuid: string, remarks: string) => Promise<boolean>;
}

export function EditUserSheet({
  user,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: EditUserSheetProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_no: "",
      reg_num: "",
      branch: "",
      year: "",
      gender: "",
      sub_role: "",
      lateral_status: false,
      hostel_status: false,
      college_hostel_status: false,
    },
  });

  // Reset form when a new user is selected, mapping from user.profile
  useEffect(() => {
    if (user && user.profile) {
      form.reset({
        first_name: user.profile.first_name || "",
        last_name: user.profile.last_name || "",
        phone_no: user.profile.phone_no || "",
        reg_num: user.profile.reg_num || "",
        branch: user.profile.branch || "",
        year: user.profile.year || "",
        gender: user.profile.gender || "",
        sub_role: user.profile.sub_role || "",
        // Convert 1/0 from DB to true/false for React hook form
        lateral_status: Boolean(user.profile.lateral_status),
        hostel_status: Boolean(user.profile.hostel_status),
        college_hostel_status: Boolean(user.profile.college_hostel_status),
      });
    }
  }, [user, form]);

  // Explicitly type the submit handler payload as FormValues
  const onSubmit = async (data: FormValues) => {
    if (!user || !user.profile) return;

    // Build the payload by comparing submitted data with the original user.profile data
    const payload: Partial<FormValues & { role: string }> = {};

    // Helper to check if a value actually changed
    const hasChanged = (newValue: any, originalValue: any) => {
      // Treat undefined/null/empty string as equivalent for text fields
      const cleanNew = newValue ?? "";
      const cleanOriginal = originalValue ?? "";
      return cleanNew !== cleanOriginal;
    };

    // Text fields
    if (hasChanged(data.first_name, user.profile.first_name))
      payload.first_name = data.first_name;
    if (hasChanged(data.last_name, user.profile.last_name))
      payload.last_name = data.last_name;
    if (hasChanged(data.phone_no, user.profile.phone_no))
      payload.phone_no = data.phone_no;
    if (hasChanged(data.reg_num, user.profile.reg_num))
      payload.reg_num = data.reg_num;
    if (hasChanged(data.branch, user.profile.branch))
      payload.branch = data.branch;
    if (hasChanged(data.year, user.profile.year)) payload.year = data.year;
    if (hasChanged(data.gender, user.profile.gender))
      payload.gender = data.gender;
    if (hasChanged(data.sub_role, user.profile.sub_role))
      payload.sub_role = data.sub_role;

    // Boolean fields (comparing strictly boolean values)
    if (data.lateral_status !== Boolean(user.profile.lateral_status)) {
      payload.lateral_status = data.lateral_status;
    }
    if (data.hostel_status !== Boolean(user.profile.hostel_status)) {
      payload.hostel_status = data.hostel_status;
    }
    if (
      data.college_hostel_status !== Boolean(user.profile.college_hostel_status)
    ) {
      payload.college_hostel_status = data.college_hostel_status;
    }

    // If no fields were actually changed, just close the sheet
    if (Object.keys(payload).length === 0) {
      toast.info("No changes detected.");
      onClose();
      return;
    }

    // The backend needs the role to know which profile (music/management) to update
    payload.role = user.role;

    const success = await onUpdate(user.uuid, payload);
    if (success) {
      onClose();
    }
  };

  if (!user) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl w-full overflow-y-auto border-zinc-200 dark:border-zinc-800 bg-background p-0 rounded-none border-l shadow-2xl flex flex-col h-full">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <SheetHeader>
            <div className="flex justify-between items-start">
              <div>
                <SheetTitle className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                  Edit Profile
                </SheetTitle>
                <SheetDescription className="text-zinc-500">
                  Updating <span className="capitalize">{user.role}</span>{" "}
                  Profile
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Form {...form}>
            <form
              id="edit-user-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Account Data (Read-only email) */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                  Account Identifier
                </h3>
                <div className="space-y-1">
                  <FormLabel className="text-zinc-700 dark:text-zinc-300">
                    Email Address (Read-Only)
                  </FormLabel>
                  <Input
                    value={user.email}
                    disabled
                    className="rounded-none border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Email cannot be modified after registration.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
                <h3 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                  Personal Details
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus-visible:ring-0 focus-visible:border-zinc-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus-visible:ring-0 focus-visible:border-zinc-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Phone No.
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus-visible:ring-0 focus-visible:border-zinc-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Gender
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-0 focus:border-zinc-900">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800">
                            <SelectItem
                              value="male"
                              className="rounded-none cursor-pointer"
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="rounded-none cursor-pointer"
                            >
                              Female
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="rounded-none cursor-pointer"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 space-y-4">
                <h3 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
                  Academic Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reg_num"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Reg. Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus-visible:ring-0 focus-visible:border-zinc-900"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Branch
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-0 focus:border-zinc-900">
                              <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800 h-64 overflow-y-auto">
                            {[
                              { value: "aids", label: "AIDS" },
                              { value: "aiml", label: "AIML" },
                              { value: "cic", label: "CIC" },
                              { value: "civil", label: "CIVIL" },
                              { value: "csbs", label: "CSBS" },
                              { value: "csd", label: "CSD" },
                              { value: "cse", label: "CSE" },
                              { value: "csg", label: "CSG" },
                              { value: "csit", label: "CSIT" },
                              { value: "ece", label: "ECE" },
                              { value: "eee", label: "EEE" },
                              { value: "it", label: "IT" },
                              { value: "mech", label: "MECH" },
                            ].map((branch) => (
                              <SelectItem
                                key={branch.value}
                                value={branch.value}
                                className="rounded-none cursor-pointer uppercase"
                              >
                                {branch.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-700 dark:text-zinc-300">
                          Year
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-0 focus:border-zinc-900">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800">
                            {[
                              { value: "first", label: "1st Year" },
                              { value: "second", label: "2nd Year" },
                              { value: "third", label: "3rd Year" },
                              { value: "fourth", label: "4th Year" },
                            ].map((year) => (
                              <SelectItem
                                key={year.value}
                                value={year.value}
                                className="rounded-none cursor-pointer"
                              >
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sub_role"
                    render={({ field }) => {
                      // Determine which categories to show based on the user's base role
                      const isMusic = user?.role === "music";

                      const musicRoles = [
                        { value: "drummer", label: "Drummer" },
                        { value: "flutist", label: "Flutist" },
                        { value: "guitarist", label: "Guitarist" },
                        { value: "pianist", label: "Pianist" },
                        { value: "violinist", label: "Violinist" },
                        { value: "vocalist", label: "Vocalist" },
                      ];

                      const managementRoles = [
                        { value: "event_organizer", label: "Event Organizer" },
                        { value: "event_planner", label: "Event Planner" },
                        {
                          value: "marketing_coordinator",
                          label: "Marketing Coordinator",
                        },
                        {
                          value: "social_media_handler",
                          label: "Social Media Handler",
                        },
                        { value: "video_editor", label: "Video Editor" },
                      ];

                      const activeRoles = isMusic
                        ? musicRoles
                        : managementRoles;

                      return (
                        <FormItem>
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">
                            Sub Role ({isMusic ? "Music" : "Management"})
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-none border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-0 focus:border-zinc-900 capitalize">
                                <SelectValue placeholder="Select Sub Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-none border-zinc-200 dark:border-zinc-800">
                              {activeRoles.map((role) => (
                                <SelectItem
                                  key={role.value}
                                  value={role.value}
                                  className="rounded-none cursor-pointer capitalize"
                                >
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs text-red-500" />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <FormField
                    control={form.control}
                    name="lateral_status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-zinc-200 dark:border-zinc-800 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-none"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">
                            Lateral Entry Student
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hostel_status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-zinc-200 dark:border-zinc-800 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);

                              // If unchecking "Staying in Hostel", they cannot be in the College Hostel
                              if (!checked) {
                                form.setValue("college_hostel_status", false, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }
                            }}
                            className="rounded-none"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">
                            Staying in Hostel
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="college_hostel_status"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-none border border-zinc-200 dark:border-zinc-800 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              // Update this field
                              field.onChange(checked);

                              // If this is checked, automatically check the parent "Staying in Hostel"
                              if (checked) {
                                form.setValue("hostel_status", true, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                });
                              }
                            }}
                            className="rounded-none"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-zinc-700 dark:text-zinc-300">
                            College Hostel (Inside Campus)
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>

          {/* Workflow Actions Section */}
          <div className="pt-8 space-y-4">
            {/* <h3 className="text-xs font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
              Workflow & Access
            </h3>
            {!user.is_approved && (
              <div className="flex flex-col gap-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  This user is waiting for Membership Head approval.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    onClick={handleApprove}
                    className="flex-1 rounded-none bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReject}
                    className="flex-1 rounded-none border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </div>
            )} */}
            {/* Replaced window.confirm with Shadcn AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-none border-zinc-200 dark:border-zinc-800 bg-background">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-zinc-950 dark:text-zinc-50">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500">
                    This will permanently delete the account for{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {user.username}
                    </span>
                    . This action cannot be undone and will remove all
                    associated profile data and history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-none border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      const success = await onDelete(user.uuid);
                      if (success) onClose();
                    }}
                    className="rounded-none bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 mt-auto shrink-0 bg-background">
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-user-form"
              disabled={form.formState.isSubmitting}
              className="rounded-none bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
