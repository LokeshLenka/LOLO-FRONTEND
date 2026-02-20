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

  // Updated Helper Styles
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
          Music Information
        </h3>
      </div>

      <FormField
        control={form.control}
        name="sub_role"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-bold uppercase text-neutral-500 tracking-wider ml-1">
              Music Role *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl className="h-14">
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
            <FormMessage className="text-red-400 text-xs ml-1" />
          </FormItem>
        )}
      />

      <div className="mt-12 text-center text-xs text-neutral-500 relative z-10 font-medium leading-relaxed">
        By continuing, you agree to our <br className="hidden sm:block" />
        <a
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-lolo-pink transition-colors"
        >
          Terms of Service{" "}
        </a>
        and{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-lolo-pink transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
};
