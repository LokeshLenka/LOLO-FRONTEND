import React from "react";
import { PasswordInput } from "@/components/PasswordInput"; // Keep your custom component
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
}> = ({ form, registrationType }) => (
  <div className="space-y-6">
    <div className="text-center space-y-2 mb-8">
      <h2 className="text-2xl font-bold text-white">{registrationType}</h2>
      <div className="h-0.5 w-20 bg-[#03a1b0] mx-auto rounded-full" />
      <h3 className="text-lg font-medium text-gray-300 pt-4">
        Basic Information
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              First Name *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Last Name *
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="phone_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Phone Number *
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Email *
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
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
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Password *
            </FormLabel>
            <FormControl>
              {/* Assuming PasswordInput accepts className */}
              <PasswordInput
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-gray-500">
              Confirm Password *
            </FormLabel>
            <FormControl>
              <PasswordInput
                {...field}
                className="bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 h-12 placeholder:text-gray-600"
                required
              />
            </FormControl>
            <FormMessage className="text-red-400 text-xs" />
          </FormItem>
        )}
      />
    </div>
  </div>
);
