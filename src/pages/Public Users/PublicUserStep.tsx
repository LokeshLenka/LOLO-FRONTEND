import React from //, { useState }
"react";
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

  const selectTriggerStyle =
    "bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 data-[placeholder]:text-gray-400";
  const selectContentStyle = "bg-[#0F111A] border-white/10 text-white";
  const selectItemStyle = "focus:bg-white/10 focus:text-[#03a1b0]";

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-300">
          Personal Information
        </h3>

        {/* Full Name */}
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-gray-500">
                Full Name *
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12"
                  placeholder="Enter your full name"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
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
                <FormLabel className="text-xs font-bold uppercase text-gray-500">
                  Email Address *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12"
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-gray-500">
                  Phone Number *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12"
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
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
                <FormLabel className="text-xs font-bold uppercase text-gray-500">
                  Gender *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="h-12">
                    <SelectTrigger className={selectTriggerStyle}>
                      <SelectValue
                        placeholder="Select gender"
                        className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12"
                      />
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

          {/* College Hostel Status (Conditional) */}
          <FormField
            control={form.control}
            name="college_hostel_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase text-gray-500">
                  Are you staying in the college hostel? *
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

      {/* Academic Information Section */}
      <div className="space-y-6 pt-6">
        <h3 className="text-lg font-medium text-gray-300">
          Academic Information
        </h3>

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
                  placeholder="10-digit registration number"
                  maxLength={10}
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
        </div>
      </div>
    </div>
  );
};
