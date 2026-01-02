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
import { Button } from "@/components/ui/button";

export const MusicStep: React.FC<{ form: any; registrationType: string }> = ({
  form,
  registrationType,
}) => {
  const musicCategories = [
    { value: "vocalist", label: "Vocalist" },
    { value: "drummer", label: "Drummer" },
    { value: "flutist", label: "Flutist" },
    { value: "guitarist", label: "Guitarist" },
    { value: "violinist", label: "Violinist" },
  ];

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
          Music Information
        </h3>
      </div>

      {/* Year Of Study */}
      <FormField
        control={form.control}
        name="sub_role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Music Role
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl className="h-12">
                <SelectTrigger className={selectTriggerStyle}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={selectContentStyle}>
                {musicCategories.map(({ label, value }) => (
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
  );
};
