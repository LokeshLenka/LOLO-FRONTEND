import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";
import axios from "axios";
import { MusicStep } from "./steps/MusicStep";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// --- 1. FIXED Schema Logic ---
// Make all required fields explicitly required and optional fields explicitly optional
const formSchema = z
  .object({
    // Required fields (explicitly)
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    phone_no: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must not be greater than 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(6, "Confirm password is required"),
    reg_num: z
      .string()
      .min(10, "Registration number must be at least 10 digits")
      .max(10, "Registration number must not be greater than 10 digits"),
    branch: z.string().min(1, "Branch is required"),
    year: z.string().min(1, "Year of study is required"),
    gender: z.string().min(1, "Gender is required"),
    sub_role: z.string().min(1, "Sub role is required"), // Make it required for step 3

    other_fields_of_interest: z.string(),
    experience: z.string(),
    passion: z.string(),
    instrument_avail: z.boolean(),

    // Optional fields (explicitly)
    lateral_status: z.boolean(),
    hostel_status: z.boolean(),
    college_hostel_status: z.boolean(),

    // Hidden system fields (with default values)
    role: z.string(),
    registration_type: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof formSchema>;

// --- 2. Custom Hook Logic Preserved ---
interface StepField {
  name: keyof FormData;
}

interface StepConfig {
  fields: StepField[];
  additionalFields?: StepField[];
}

const useMultiStepForm = (totalSteps: number, form: any) => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepConfigs: Record<number, StepConfig> = {
    1: {
      fields: [
        { name: "first_name" },
        { name: "last_name" },
        { name: "phone_no" },
        { name: "email" },
        { name: "password" },
        { name: "password_confirmation" },
      ],
    },
    2: {
      fields: [
        { name: "reg_num" },
        { name: "branch" },
        { name: "year" },
        { name: "gender" },
        { name: "lateral_status" },
        { name: "hostel_status" },
        { name: "college_hostel_status" },
      ],
    },
    3: {
      fields: [{ name: "sub_role" }],
    },
  };

  const additionalFields: Record<number, StepField[]> = {
    4: [
      { name: "role" },
      { name: "registration_type" },
      { name: "other_fields_of_interest" },
      { name: "experience" },
      { name: "passion" },
      { name: "instrument_avail" },
    ], // these values are fixed
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

// --- 3. Aesthetic Wrapper Component ---
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
    1: (
      <BasicInformationStep form={form} registrationType="Music Registration" />
    ),
    2: (
      <AcademicInformationStep
        form={form}
        registrationType="Music Registration"
      />
    ),
    3: <MusicStep form={form} registrationType="Music Registration" />,
  };

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your registration...");

    try {
      const submitData = {
        ...data,
        // 1. Convert Booleans to integers (0/1)
        lateral_status: data.lateral_status ? 1 : 0,
        hostel_status: data.hostel_status ? 1 : 0,
        college_hostel_status: data.college_hostel_status ? 1 : 0,
        instrument_avail: data.instrument_avail ? 1 : 0,

        // 2. FIX: Send "N/A" instead of "" or "default".
        // Laravel converts "" to null, which causes the crash.
        other_fields_of_interest:
          data.other_fields_of_interest === "default" ||
          !data.other_fields_of_interest
            ? "N/A"
            : data.other_fields_of_interest,

        experience:
          data.experience === "default" || !data.experience
            ? "N/A"
            : data.experience,

        passion:
          data.passion === "default" || !data.passion ? "N/A" : data.passion,
      };

      const response = await axios.post(
        `${API_BASE_URL}/register`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Registration Successful!", {
          id: toastId,
          description: "Redirecting to confirmation page...",
          duration: 2000,
        });

        form.reset();

        setTimeout(() => {
          navigate("/success", {
            state: {
              email: response.data.data.user,
              status: response.data.data.status,
              data: response.data.data,
            },
          });
        }, 1000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      if (error.response) {
        // If 500 error persists, allow the user to see it might be a duplicate data issue
        if (error.response.status === 500) {
          errorMessage =
            "Server Error: Please check if this Registration Number is already registered.";
        } else {
          errorMessage = error.response.data.message || "Registration failed.";
          if (error.response.data.errors) {
            const firstError = Object.values(error.response.data.errors)[0];
            if (Array.isArray(firstError)) errorMessage = String(firstError[0]);
          }
        }
      } else if (error.request) {
        errorMessage = "Server not reachable. Check your connection.";
      }

      toast.error("Registration Failed", {
        id: toastId,
        description: errorMessage,
        duration: 10000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Aesthetic Progress Stepper */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center overflow-hidden">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${
                currentStep >= step
                  ? "bg-[#03a1b0] border-[#03a1b0] text-white"
                  : "bg-transparent border-white/20 text-gray-500"
              }`}
            >
              {currentStep > step ? <Check size={12} /> : step}
            </div>
            {step === 1 && (
              <div
                className={`ml-2 w-10 sm:w-16 h-0.5 transition-all ${
                  currentStep > 1 ? "bg-[#03a1b0]" : "bg-white/10"
                }`}
              />
            )}
            {step === 2 && (
              <div
                className={`ml-2 w-10 sm:w-16 h-0.5 transition-all ${
                  currentStep > 2 ? "bg-[#03a1b0]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {stepComponents[currentStep as 1 | 2 | 3]}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          {form.formState.isDirty && (
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                goToFirstStep();
                form.reset();
              }}
              className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white bg-transparent"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-0 sm:gap-2">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={goToPrevious}
              type="button"
              disabled={isSubmitting}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:block"> Previous </span>
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={isSubmitting}
              className={`bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold shadow-lg shadow-[#03a1b0]/20 min-w-[80px] ${
                isSubmitting ? "cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting
                </>
              ) : (
                "Submit"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNext}
              disabled={isSubmitting}
              className="bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold"
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

export const MusicSignUp: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Required fields - empty strings
      first_name: "",
      last_name: "",
      phone_no: "",
      email: "",
      password: "",
      password_confirmation: "",
      reg_num: "",
      branch: "",
      year: "",
      gender: "",
      sub_role: "",

      other_fields_of_interest: "default",
      experience: "default",
      passion: "default",
      instrument_avail: false,

      // Optional boolean fields - use false instead of empty string
      lateral_status: false,
      hostel_status: false,
      college_hostel_status: false,

      // Hidden system fields - provide the default values here
      role: "music",
      registration_type: "music",
    },
  });

  return (
    <Form {...form}>
      <form className="w-full">
        <MultiStepForm form={form} />
      </form>
    </Form>
  );
};
