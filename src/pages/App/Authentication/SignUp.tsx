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
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        className="z-50 absolute sm:fixed top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        onClick={() => history.back()}
      >
        <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline font-bold text-sm">Back to Home</span>
      </button>

      {/* Main Container */}
      <div className="relative z-10 pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Selection */}
          <div className="flex flex-col items-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-8 text-center tracking-tight">
              Join the <span className="text-lolo-pink">Community</span>
            </h1>

            <Form {...form}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full max-w-xs">
                    <FormLabel className="text-neutral-500 text-xs font-bold uppercase tracking-wider text-center block mb-2">
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
                        <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white focus:ring-lolo-pink/50 focus:ring-offset-0 rounded-2xl font-bold">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#09090b] border-white/10 text-white rounded-xl">
                        {categoryOptions.map(({ label, value }) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="focus:bg-white/10 focus:text-lolo-pink font-medium cursor-pointer"
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
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Subtle internal glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              {category === "music" ? <MusicSignUp /> : <ManagementSignUp />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
