import { ManagementSignUp } from "@/components/forms/ManagementSignUp";
import { MusicSignUp } from "@/components/forms/MusicSignUp";
import {
  Form,
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
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const categoryOptions = [
  { label: "Music", value: "music" },
  { label: "Management", value: "management" },
];

export default function SignUp() {
  const form = useForm({
    defaultValues: { category: "music" },
  });
  const [category, setCategory] = useState("music");

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.12),transparent_70%)] blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button
        className="z-50 absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        onClick={() => history.back()}
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline font-medium text-sm">Back to Home</span>
      </button>

      {/* Main Container */}
      <div className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Selection */}
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-8 text-center">
              Join the <span className="text-[#03a1b0]">Community</span>
            </h1>

            <Form {...form}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    <FormLabel className="text-gray-400 text-xs font-bold uppercase tracking-wider text-center block mb-2">
                      Select Role
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setCategory(val);
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:ring-[#03a1b0]/50 focus:ring-offset-0">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#0F111A] border-white/10 text-white">
                        {categoryOptions.map(({ label, value }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="focus:bg-white/10 focus:text-[#03a1b0]"
                          >
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>

          {/* Dynamic Form Render */}
          <div className="bg-[#09090b]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl shadow-[#03a1b0]/5">
            {category === "music" ? <MusicSignUp /> : <ManagementSignUp />}
          </div>
        </div>
      </div>
    </div>
  );
}
