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
import { Button } from "@heroui/button";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const categoryOptions = [
  { label: "Music", value: "music" },
  { label: "Management", value: "management" },
];

export default function SignUp() {
  // React Hook Form
  const form = useForm({
    defaultValues: {
      category: "music",
    },
  });

  // Local state (sync with form if you want conditional rendering)
  const [category, setCategory] = useState("music");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Back Button */}
      <Button
        className="z-10 absolute top-4 left-0 flex items-center bg-transparent h-12 rounded-md mx-auto"
        onClick={() => history.back()}
      >
        <ArrowLeft className="mr-2" />
        <span className="hidden sm:inline ">Back</span>
      </Button>

      {/* Category Select Form */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-14 px-4 w-full mx-auto">
        <Form {...form}>
          <FormField
            control={form.control} // ✅ required
            name="category"
            render={({ field }) => (
              <FormItem className="-space-y-2 w-[300px] flex flex-col justify-center mx-auto">
                <FormLabel className="text-xl text-center">
                  Registration Type *
                </FormLabel>
                <br />
                <Select
                  onValueChange={(val) => {
                    field.onChange(val);
                    setCategory(val); // sync local state
                  }}
                  value={field.value}
                >
                  <FormControl className="h-12">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="overflow-y-auto max-h-52">
                    {categoryOptions.map(({ label, value }) => (
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
        </Form>
      </div>

      {/* Conditional Form Section */}
      <div className="mt-4 flex justify-center">
        {category === "music" ? <MusicSignUp /> : <ManagementSignUp />}
      </div>
    </div>
  );
}
