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
    { value: "csg", label: "CSG" },
    { value: "csit", label: "CSIT" },
    { value: "ece", label: "ECE" },
    { value: "eee", label: "EEE" },
    { value: "it", label: "IT" },
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

  const [lateralStudentHidden, setlateralStudentHidden] = useState(true);

  React.useEffect(() => {
    const value = form.watch("year");
    if (value === "second" || value === "third" || value === "fourth") {
      setlateralStudentHidden(false);
    } else {
      setlateralStudentHidden(true);
      form.setValue("lateral_status", false);
    }
  }, [form.watch("year")]);

  const [hostelStudentHidden, setHostelStudentHidden] = useState(true);

  React.useEffect(() => {
    const value = form.watch("hostel_status");
    if (value === true) {
      setHostelStudentHidden(false);
    } else {
      setHostelStudentHidden(true);
      form.setValue("hostel_status", false);
    }
  }, [form.watch("hostel_status")]);

  // Updated Styles
  const inputStyle =
    "bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-14 rounded-2xl placeholder:text-neutral-600 transition-colors";

  const selectTriggerStyle =
    "bg-white/5 border border-white/10 text-white focus:ring-0 focus:ring-offset-0 focus:border-lolo-pink h-14 rounded-2xl data-[placeholder]:text-neutral-600 transition-all font-medium";

  const selectContentStyle =
    "bg-[#09090b] border-white/10 text-white rounded-xl";

  const selectItemStyle =
    "focus:bg-white/10 focus:text-lolo-pink cursor-pointer font-medium";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight">
          {registrationType}
        </h2>
        <div className="h-1 w-24 bg-lolo-pink mx-auto rounded-full" />
        <h3 className="text-lg font-bold text-neutral-400">
          Academic Information
        </h3>
      </div>

      {/* Registration Number */}
      <FormField
        control={form.control}
        name="reg_num"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
              Registration Number *
            </FormLabel>
            <FormControl>
              <Input {...field} className={inputStyle} required />
            </FormControl>
            <FormMessage className="text-red-400 text-xs ml-1" />
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
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Branch *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="h-14">
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
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        {/* Gender */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Gender *
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                required
              >
                <FormControl className="h-14">
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
              <FormMessage className="text-red-400 text-xs ml-1" />
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
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Year Of Study *
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="h-14">
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
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        {/* Lateral Status */}
        <FormField
          control={form.control}
          name="lateral_status"
          render={({ field }) => (
            <FormItem className={lateralStudentHidden ? "hidden" : "block"}>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Are You A Lateral Student *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2 h-14">
                  {lateralStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      disabled={lateralStudentHidden}
                      className={`flex-1 h-full rounded-2xl font-bold transition-all border ${
                        field.value === value
                          ? "bg-lolo-pink border-lolo-pink text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                          : "bg-transparent border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
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
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Are You A Hostel Student *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2 h-14">
                  {hostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 h-full rounded-2xl font-bold transition-all border ${
                        field.value === value
                          ? "bg-lolo-pink border-lolo-pink text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                          : "bg-transparent border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        {/* College Hostel Status */}
        <FormField
          control={form.control}
          name="college_hostel_status"
          render={({ field }) => (
            <FormItem className={hostelStudentHidden ? "hidden" : "block"}>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Residing In College Hostel? *
              </FormLabel>
              <FormControl>
                <div className="flex gap-3 mt-2 h-14">
                  {collegeHostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={Number(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 h-full rounded-2xl font-bold transition-all border ${
                        field.value === value
                          ? "bg-lolo-pink border-lolo-pink text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                          : "bg-transparent border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
