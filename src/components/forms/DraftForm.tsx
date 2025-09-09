import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Form Schema
const formSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Confirm password is required"),
    reg_num: z.string().min(1, "Registration number is required"),
    branch: z.string().min(1, "Branch is required"),
    year: z.string().min(1, "Year of study is required"),
    gender: z.string().min(1, "Gender is required"),
    category_of_interest: z.string().min(1, "Category of interest is required"),
    instrument_avail: z.string().min(1, "Instrument availability is required"),
    instrument_details: z.string().optional(),
    passion: z
      .string()
      .min(10, "Please describe your passion (at least 10 characters)"),
    experience_level: z.number().min(0).max(10),
    experience: z
      .string()
      .min(10, "Please describe your experience (at least 10 characters)"),
    other_fields_of_interest: z
      .string()
      .min(5, "Please mention other interests (at least 5 characters)"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof formSchema>;

// use state

// const [Disabled, setDisabled] = useState(false);

// Custom Hook for Multi-Step Form
interface StepField {
  name: keyof FormData;
}

interface StepConfig {
  fields: StepField[];
}

const useMultiStepForm = (totalSteps: number, form: any) => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepConfigs: Record<number, StepConfig> = {
    1: {
      fields: [
        { name: "first_name" },
        { name: "last_name" },
        { name: "phone_number" },
        { name: "email" },
        { name: "password" },
        { name: "confirm_password" },
      ],
    },
    2: {
      fields: [
        { name: "reg_num" },
        { name: "branch" },
        { name: "year" },
        { name: "gender" },
      ],
    },
    3: {
      fields: [
        { name: "category_of_interest" },
        { name: "instrument_avail" },
        { name: "instrument_details" },
        { name: "passion" },
        { name: "experience_level" },
        { name: "experience" },
        { name: "other_fields_of_interest" },
      ],
    },
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const goToNext = async () => {
    if (!isLastStep) {
      const currentStepFields =
        stepConfigs[currentStep]?.fields.map((f) => f.name) || [];
      const isValid = await form.trigger(currentStepFields);
      if (isValid) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const goToPrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToFirstStep = () => {
    setCurrentStep(1);
  };

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToFirstStep,
  };
};

// Password Input Component
const PasswordInput: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}> = ({ value, onChange, required }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? "Hide" : "Show"}
      </Button>
    </div>
  );
};

// Toggle Group Component (simplified)
const ToggleGroup: React.FC<{
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}> = ({ value, onValueChange, children, className = "" }) => {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
};

const ToggleGroupItem: React.FC<{
  value: string;
  children: React.ReactNode;
  className?: string;
}> = ({ value: itemValue, children, className = "" }) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => {
        // This would be handled by parent context in real implementation
      }}
    >
      {children}
    </Button>
  );
};

// // Slider Component
// const Slider: React.FC<{
//   min: number;
//   max: number;
//   step: number;
//   value: number;
//   onValueChange: (value: number) => void;
// }> = ({ min, max, step, value, onValueChange }) => {
//   return (
//     <div className="w-full">
//       <input
//         type="range"
//         min={min}
//         max={max}
//         step={step}
//         value={value}
//         onChange={(e) => onValueChange(Number(e.target.value))}
//         className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//       />
//     </div>
//   );
// };

// Step Components
const BasicInformationStep: React.FC<{ form: any }> = ({ form }) => (
  <div className="space-y-4">
    <h1 className="mt-6 font-extrabold text-3xl tracking-tight">
      Basic Information
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name *</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    <FormField
      control={form.control}
      name="phone_number"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number *</FormLabel>
          <FormControl>
            <Input type="tel" {...field} required />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email *</FormLabel>
          <FormControl>
            <Input type="email" {...field} required />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password *</FormLabel>
            <FormControl>
              <PasswordInput {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirm_password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password *</FormLabel>
            <FormControl>
              <PasswordInput {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </div>
);

const AcademicInformationStep: React.FC<{ form: any }> = ({ form }) => {
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

  return (
    <div className="space-y-4">
      <h1 className="mt-6 font-extrabold text-3xl tracking-tight">
        Academic Information
      </h1>

      <FormField
        control={form.control}
        name="reg_num"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number *</FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormDescription>
              Enter your college registration number
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectContent>
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
                <SelectContent>
                  {yearOptions.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Please specify current studying year
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
                <SelectContent>
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
  );
};

const MusicInformationStep: React.FC<{ form: any }> = ({ form }) => {

  const categoryOptions = [
    { value: "vocalist", label: "Vocalist" },
    { value: "drummer", label: "Drummer" },
    { value: "pianist", label: "Pianist" },
    { value: "guitarist", label: "Guitarist" },
  ];

  const instrumentAvailOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  // State for disabling instrument_details
  const [instrumentDetailsDisabled, setInstrumentDetailsDisabled] = useState(true);

  // Watch instrument_avail field
  React.useEffect(() => {
    const value = form.watch("instrument_avail");
    if (value === "yes") {
      setInstrumentDetailsDisabled(false);
    } else {
      setInstrumentDetailsDisabled(true);
      form.setValue("instrument_details", "");
    }
  }, [form.watch("instrument_avail")]);

  return (
    <div className="space-y-4">
      <h1 className="mt-6 font-extrabold text-3xl tracking-tight">
        Music Information
      </h1>

      <FormField
        control={form.control}
        name="category_of_interest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category Of Interest *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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

      <FormField
        control={form.control}
        name="instrument_avail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instrument Availability *</FormLabel>
            <FormControl>
              <div className="flex gap-4">
                {instrumentAvailOptions.map(({ label, value }) => (
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

      <FormField
        control={form.control}
        name="instrument_details"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter the name of the instrument you have</FormLabel>
            <FormControl>
              <Input
                {...field}
                name="instrument_details"
                disabled={instrumentDetailsDisabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="passion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Passion *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe your passion for music"
                className="resize-y"
                rows={5}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience_level"
        render={({ field }) => (
          <FormItem className="py-3">
            <FormLabel className="flex justify-between items-center">
              Experience Level
              <span>{field.value ?? 0}/10</span>
            </FormLabel>
            <FormControl>
              <Slider
                value={[field.value ?? 0]}
                max={10}
                step={1}
                onValueChange={([val]) => field.onChange(val)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe about your experience in specified field (your achievements, participations etc)."
                className="resize-y"
                rows={5}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="other_fields_of_interest"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other fields of interest *</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Mention other fields you're interested in"
                className="resize-y"
                rows={5}
                required
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

// Main Multi-Step Form Component
const MultiStepForm: React.FC<{ form: any }> = ({ form }) => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToFirstStep,
  } = useMultiStepForm(3, form);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepComponents = {
    1: <BasicInformationStep form={form} />,
    2: <AcademicInformationStep form={form} />,
    3: <MusicInformationStep form={form} />,
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      form.reset();
      goToFirstStep();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 pt-3">
      {/* Progress Indicator */}
      <div className="flex flex-col items-center justify-start gap-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of 3
        </span>
        <Progress value={(currentStep / 3) * 100} className="w-full" />
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {stepComponents[currentStep as keyof typeof stepComponents]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2">
          {form.formState.isDirty && (
            <Button
              variant="outline"
              type="button"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                goToFirstStep();
                form.reset();
              }}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <Button
              size="sm"
              variant="ghost"
              onClick={goToPrevious}
              type="button"
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          )}

          {isLastStep ? (
            <Button
              size="sm"
              type="button"
              onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          ) : (
            <Button
              size="sm"
              type="button"
              variant="secondary"
              onClick={goToNext}
              disabled={isSubmitting}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Form Component
export const DraftForm: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirm_password: "",
      reg_num: "",
      branch: "",
      year: "",
      gender: "",
      category_of_interest: "",
      instrument_avail: "",
      instrument_details: "",
      passion: "",
      experience_level: 0,
      experience: "",
      other_fields_of_interest: "",
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Form {...form}>
        <form className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <MultiStepForm form={form} />
          </div>
        </form>
      </Form>
    </div>
  );
};
