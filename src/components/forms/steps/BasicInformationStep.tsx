import React from "react";
import { PasswordInput } from "@/components/PasswordInput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const BasicInformationStep: React.FC<{
  form: any;
  registrationType: string;
}> = ({ form, registrationType }) => {
  // Common Input Style
  const inputStyle =
    "bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-14 rounded-2xl placeholder:text-neutral-600 transition-colors";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-3 mb-10">
        <h2 className="text-3xl font-black text-white tracking-tight">
          {registrationType}
        </h2>
        <div className="h-1 w-24 bg-lolo-pink mx-auto rounded-full" />
        <h3 className="text-lg font-bold text-neutral-400">
          Basic Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                First Name *
              </FormLabel>
              <FormControl>
                <Input {...field} className={inputStyle} required />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Last Name *
              </FormLabel>
              <FormControl>
                <Input {...field} className={inputStyle} required />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="phone_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Phone Number *
              </FormLabel>
              <FormControl>
                <Input type="tel" {...field} className={inputStyle} required />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Email *
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  className={inputStyle}
                  required
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Password *
              </FormLabel>
              <FormControl>
                {/* Ensure PasswordInput accepts the same class or style appropriately */}
                <PasswordInput
                  {...field}
                  className={`${inputStyle} pr-12`} // Keep padding right for eye icon
                  required
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
                Confirm Password *
              </FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  className={`${inputStyle} pr-12`}
                  required
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs ml-1" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
