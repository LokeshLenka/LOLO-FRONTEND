import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";

export const AcademicInformationStep: React.FC<{
  form: any;
  registrationType: string;
}> = ({ form, registrationType }) => {
  const branches = [
    { value: "aids", label: "AIDS" },
    { value: "aiml", label: "AIML" },
    { value: "cic", label: "CIC" },
    { value: "civil", label: "CIVIL" },
    { value: "csbs", label: "CSBS" },
    { value: "csd", label: "CSD" },
    { value: "cse", label: "CSE" },
    { value: "csg", label: "CSG" }, // added
    { value: "csit", label: "CSIT" }, // already there but placed correctly
    { value: "ece", label: "ECE" },
    { value: "eee", label: "EEE" },
    { value: "it", label: "IT" }, // added
    { value: "mech", label: "MECH" },
  ];

  const branchOptions = branches.sort((a, b) => a.label.localeCompare(b.label));

  const yearOptions = [
    { value: "first", label: "First Year" },
    { value: "second", label: "Second Year" },
    { value: "third", label: "Third Year" },
    { value: "fourth", label: "Fourth Year" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const lateralStudentOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const hostelStudentOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const collegeHostelStudentOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // --- Preserved Logic: State for disabling lateral status ---
  const [lateralStudentHidden, setlateralStudentHidden] = useState(true);

  // --- Preserved Logic: Watch year field ---
  React.useEffect(() => {
    const value = form.watch("year");
    if (value === "second" || value === "third" || value === "fourth") {
      setlateralStudentHidden(false);
    } else {
      setlateralStudentHidden(true);
      form.setValue("lateral_status", false);
    }
  }, [form.watch("year")]);

  // --- Preserved Logic: State for disabling college_hostel_status ---
  const [hostelStudentHidden, setHostelStudentHidden] = useState(true);

  // --- Preserved Logic: Watch hostel_student field ---
  React.useEffect(() => {
    const value = form.watch("hostel_status");
    if (value === true) {
      setHostelStudentHidden(false);
    } else {
      setHostelStudentHidden(true);
      form.setValue("hostel_status", false);
    }
  }, [form.watch("hostel_status")]);

  // --- Helper Styles ---
  const selectTriggerStyle =
    "bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 data-[placeholder]:text-gray-400";
  const selectContentStyle = "bg-[#0F111A] border-white/10 text-white";
  const selectItemStyle = "focus:bg-white/10 focus:text-[#03a1b0]";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">{registrationType}</h2>
        <div className="h-0.5 w-20 bg-[#03a1b0] mx-auto rounded-full" />
        <h3 className="text-lg font-medium text-gray-300 pt-4">
          Academic Information
        </h3>
      </div>

      {/* Registration Number */}
      <FormField
        control={form.control}
        name="reg_num"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Registration Number *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Branch */}
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Branch *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="h-12">
                  <SelectTrigger className={selectTriggerStyle}>
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentStyle}>
                  {branchOptions.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={selectItemStyle}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Gender *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                required
              >
                <FormControl className="h-12">
                  <SelectTrigger className={`w-full ${selectTriggerStyle}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentStyle}>
                  {genderOptions.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={selectItemStyle}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Year Of Study */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Year Of Study *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="h-12">
                  <SelectTrigger className={selectTriggerStyle}>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={selectContentStyle}>
                  {yearOptions.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className={selectItemStyle}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Lateral Status (Conditional) */}
        <FormField
          control={form.control}
          name="lateral_status"
          render={({ field }) => (
            <FormItem
              className={lateralStudentHidden ? "hidden" : "block"} // Preserve visibility logic
            >
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Are You A Lateral Student *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2">
                  {lateralStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      disabled={lateralStudentHidden}
                      className={`flex-1 h-10 border font-bold transition-all ${
                        field.value === value
                          ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                          : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hostel Status */}
        <FormField
          control={form.control}
          name="hostel_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Are You A Hostel Student *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2">
                  {hostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 h-10 border font-bold transition-all ${
                        field.value === value
                          ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                          : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* College Hostel Status (Conditional) */}
        <FormField
          control={form.control}
          name="college_hostel_status"
          render={({ field }) => (
            <FormItem className={hostelStudentHidden ? "hidden" : "block"}>
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Residing In College Hostel? *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2">
                  {collegeHostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 h-10 border font-bold transition-all ${
                        field.value === value
                          ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                          : "bg-transparent border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
