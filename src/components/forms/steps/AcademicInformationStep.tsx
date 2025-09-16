import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const AcademicInformationStep: React.FC<{ form: any }> = ({ form }) => {
  const branchOptions = [
    { value: "csbs", label: "CSBS" },
    { value: "aids", label: "AIDS" },
    { value: "aiml", label: "AIML" },
    { value: "cse", label: "CSE" },
    { value: "csd", label: "CSD" },
    { value: "cic", label: "CIC" },
    { value: "civil", label: "CIVIL" },
    { value: "mech", label: "MECH" },
    { value: "ece", label: "ECE" },
    { value: "eee", label: "EEE" },
    { value: "csit", label: "CSIT" },
  ];

  const yearOptions = [
    { value: "first_year", label: "First Year" },
    { value: "second_year", label: "Second Year" },
    { value: "third_year", label: "Third Year" },
    { value: "fourth_year", label: "Fourth Year" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "others", label: "Others" },
  ];

  const lateralStudentOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const hostelStudentOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  // State for disabling lateral status field
  const [lateralStudentHidden, setlateralStudentHidden] = useState(true);

  // Watch year field
  React.useEffect(() => {
    const value = form.watch("year");
    if (
      value === "second_year" ||
      value === "third_year" ||
      value === "fourth_year"
    ) {
      setlateralStudentHidden(false);
    } else {
      setlateralStudentHidden(true);
      form.setValue("lateral_status", "no");
    }
  }, [form.watch("year")]);

  // State for disabling college_hostel_status field
  const [hostelStudentHidden, setHostelStudentHidden] = useState(true);

  // Watch hostel_student field
  React.useEffect(() => {
    const value = form.watch("hostel_status");
    if (value === "yes") {
      setHostelStudentHidden(false);
    } else {
      setHostelStudentHidden(true);
      form.setValue("hostel_status", "no");
    }
  }, [form.watch("hostel_status")]);

  return (
    <div className="space-y-4">
      <h1 className="mt-6 font-extrabold text-2xl tracking-tight text-center">
        Music Registration
      </h1>
      <hr />
      <h1 className="mt-6 font-extrabold text-lg tracking-tight">
        Academic Information
      </h1>
      {/* {Registration Number} */}
      <FormField
        control={form.control}
        name="reg_num"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number *</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* { Branch } */}
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-52">
                  {branchOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* { Gender } */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormLabel>Gender</FormLabel> *
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  required
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="overflow-y-auto max-h-52">
                    {genderOptions.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* { Year Of Study } */}
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Of Study *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="overflow-y-auto max-h-52">
                  {yearOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* {Lateral Status} */}
        <FormField
          control={form.control}
          name="lateral_status"
          render={({ field }) => (
            <FormItem hidden={lateralStudentHidden}>
              <FormLabel>Are You A Lateral Student *</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {lateralStudentOptions.map(({ label, value }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={field.value === value ? "default" : "outline"}
                      onClick={() => field.onChange(value)}
                      disabled={lateralStudentHidden}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* {Hostel Status} */}
        <FormField
          control={form.control}
          name="hostel_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are You A Hostel Student *</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {hostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={field.value === value ? "default" : "outline"}
                      onClick={() => field.onChange(value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        {/* {College Hostel Status} */}
        <FormField
          control={form.control}
          name="college_hostel_status"
          render={({ field }) => (
            <FormItem hidden={hostelStudentHidden}>
              <FormLabel>Are You Residing In College Hostel *</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  {hostelStudentOptions.map(({ label, value }) => (
                    <Button
                      key={value}
                      type="button"
                      variant={field.value === value ? "default" : "outline"}
                      onClick={() => field.onChange(value)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
