"use client";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CircleUser, Phone, Mail } from "lucide-react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

export default function SignUpForm() {
  const formSchema = z
  .object({
    "text-input-0": z.string().min(1, { message: "This field is required" }),
    "text-input-1": z.string().min(1, { message: "This field is required" }),
    "tel-input-0": z
      .string()
      .min(1, { message: "This field is required" })
      .min(10, { message: "Must be at least 10 characters" })
      .max(10, { message: "Must be at most 10 characters" }),
    "email-input-0": z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "This field is required" }),
    "password-input-0": z
      .string()
      .min(1, { message: "This field is required" })
      .min(8, { message: "Must be at least 8 characters" }),
    "confirm-password-input-1": z
      .string()
      .min(1, { message: "This field is required" })
      .min(8, { message: "Must be at least 8 characters" }),
  })
  .refine(
    (data) => data["password-input-0"] === data["confirm-password-input-1"],
    {
      message: "Passwords do not match",
      path: ["confirm-password-input-1"],
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "text-input-0": "",
      "text-input-1": "",
      "tel-input-0": "",
      "email-input-0": "",
      "password-input-0": "",
      "confirm-password-input-1": "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8 @container lg:max-w-[50%] md:max-w-[50%] sm:max-w-[80%] mx-auto"
      >
        <div className="grid grid-cols-12 gap-4 m-4 p-6 border rounded-md bg-card text-card-foreground space-y-4">
          <FormField
            control={form.control}
            name="text-input-0"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">First Name</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder=""
                        type="text"
                        id="text-input-0"
                        className="h-12"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text-input-1"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Last Name</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-1"
                        placeholder=""
                        type="text"
                        id="text-input-1"
                        className="h-12"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tel-input-0"
            render={({ field }) => (
              <FormItem className="col-span-12 @5xl:col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Phone Number</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="tel-input-0"
                        placeholder=""
                        type="tel"
                        id="tel-input-0"
                        className="h-12 pl-10" // add left padding
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Phone className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email-input-0"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Email</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="email-input-0"
                        placeholder=""
                        type="email"
                        id="email-input-0"
                        className="h-12 pl-10" // add left padding
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Mail className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password-input-0"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Password</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="password-input-0"
                        placeholder=""
                        type="password"
                        id="password-input-0"
                        className="h-12"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirm-password-input-1"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Confirm Password
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="password-input-1"
                        placeholder=""
                        type="password"
                        id="confirm-password-input-1"
                        className="h-12"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
            <div className="w-full">
              <Button
                key="submit-button-0"
                id="submit-button-0"
                className="w-full py-6 bg-white border-2 border-lolo-pink hover:bg-lolo-pink hover:text-white text-lolo-pink transition-colors text-center cursor-pointer flex items-center justify-center"
                type="submit"
                variant="default"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-lolo-pink"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </Form>
  );
}
