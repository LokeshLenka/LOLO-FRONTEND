import React from "react";
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
import { type UseFormReturn } from "react-hook-form";

interface PublicUserStepProps {
  form: UseFormReturn<any>;
}

export const PublicUserStep: React.FC<PublicUserStepProps> = ({ form }) => {
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

  const collegeHostelStudentOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  // Updated styles: Removed focus:ring and rely on border-color for clean focus state
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
      {/* Personal Information Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-lolo-pink rounded-full"></span>
          Personal Information
        </h3>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Full Name *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={inputStyle}
                  placeholder="Enter your full name"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className={inputStyle}
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs ml-1" />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                  Phone Number *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={inputStyle}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs ml-1" />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                  Gender *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="h-14">
                    <SelectTrigger className={selectTriggerStyle}>
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

          {/* College Hostel Status */}
          <FormField
            control={form.control}
            name="college_hostel_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                  Staying in college hostel? *
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

      {/* Academic Information Section */}
      <div className="space-y-6 pt-8 border-t border-white/5">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
          Academic Information
        </h3>

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
                <Input
                  {...field}
                  className={inputStyle}
                  placeholder="10-digit registration number"
                  maxLength={10}
                />
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
        </div>
      </div>
    </div>
  );
};
