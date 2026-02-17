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
  prefix: string; // ✨ NEW: Allows dynamic path mapping
}

export const PublicUserStep: React.FC<PublicUserStepProps> = ({
  form,
  prefix,
}) => {
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

  const inputStyle =
    "bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-12 rounded-xl placeholder:text-neutral-600 transition-colors text-sm";
  const labelStyle =
    "text-[10px] font-bold uppercase text-neutral-500 tracking-wider ml-1 mb-1.5 block";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <FormField
          control={form.control}
          name={`${prefix}.full_name`} // ✨ Dynamic Name
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Full Name *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={inputStyle}
                  placeholder="Full Name"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Reg Number */}
        <FormField
          control={form.control}
          name={`${prefix}.reg_num`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Registration No *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={inputStyle}
                  placeholder="Reg Number"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name={`${prefix}.email`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Email *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  className={inputStyle}
                  placeholder="Email Address"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name={`${prefix}.phone_no`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Phone *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={inputStyle}
                  placeholder="Phone Number"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Branch */}
        <FormField
          control={form.control}
          name={`${prefix}.branch`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Branch *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                  {branches.map((b) => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Year */}
        <FormField
          control={form.control}
          name={`${prefix}.year`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Year *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                  {yearOptions.map((y) => (
                    <SelectItem key={y.value} value={y.value}>
                      {y.label}
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
          name={`${prefix}.gender`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Gender *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={inputStyle}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                  {genderOptions.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Hostel Status */}
        <FormField
          control={form.control}
          name={`${prefix}.college_hostel_status`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelStyle}>Hosteller? *</FormLabel>
              <FormControl>
                <div className="flex gap-2 h-12">
                  {collegeHostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={String(value)}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`flex-1 h-full rounded-xl font-bold text-xs transition-all border ${
                        field.value === value
                          ? "bg-lolo-pink border-lolo-pink text-white"
                          : "bg-transparent border-white/10 text-neutral-400 hover:text-white"
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
