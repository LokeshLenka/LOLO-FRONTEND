import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";
import { ManagementStep } from "./steps/ManagementStep";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// --- 1. Preserve EXACT Schema Logic ---
const formSchema = z
  .object({
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
    sub_role: z.string().min(1, "Sub role is required"),

    experience: z.string().optional(),
    interest_towards_lolo: z.string().optional(),
    any_club: z.string().optional(),

    lateral_status: z.boolean(),
    hostel_status: z.boolean(),
    college_hostel_status: z.boolean(),

    role: z.string(),
    registration_type: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof formSchema>;

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
      <BasicInformationStep
        form={form}
        registrationType="Management Registration"
      />
    ),
    2: (
      <AcademicInformationStep
        form={form}
        registrationType="Management Registration"
      />
    ),
    3: (
      <ManagementStep form={form} registrationType="Management Registration" />
    ),
  };

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your registration...");

    try {
      const { ...submitData } = data;

      const response = await axios.post(
        `${API_BASE_URL}/register`,
        submitData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
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
        errorMessage = error.response.data.message || "Registration failed.";

        if (error.response.data.errors) {
          const firstError = Object.values(error.response.data.errors)[0];
          if (Array.isArray(firstError)) errorMessage = String(firstError[0]);
        }
      } else if (error.request) {
        errorMessage = "Server not reachable. Check your connection.";
      }

      toast.error("Registration Failed", {
        id: toastId,
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Aesthetic Progress Stepper */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center overflow-hidden">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                currentStep >= step
                  ? "bg-lolo-pink border-lolo-pink text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]"
                  : "bg-transparent border-white/10 text-neutral-500"
              }`}
            >
              {currentStep > step ? <Check size={14} strokeWidth={3} /> : step}
            </div>
            {step < 3 && (
              <div
                className={`ml-2 w-12 sm:w-20 h-0.5 rounded-full transition-all duration-500 ${
                  currentStep > step ? "bg-lolo-pink" : "bg-white/10"
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
      <div className="flex items-center justify-between pt-8 border-t border-white/5">
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
              className="border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white bg-transparent rounded-xl h-12"
            >
              Reset
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={goToPrevious}
              type="button"
              disabled={isSubmitting}
              className="text-neutral-300 hover:bg-white/5 hover:text-white rounded-xl h-12"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:block">Previous</span>
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={isSubmitting}
              className={`bg-white text-black hover:bg-lolo-pink hover:text-white font-bold h-12 px-8 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all ${
                isSubmitting ? "cursor-not-allowed opacity-80" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting
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
              className="bg-white text-black hover:bg-lolo-pink hover:text-white font-bold h-12 px-6 rounded-xl transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ManagementSignUp: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

      experience: "default",
      interest_towards_lolo: "default",
      any_club: "default",

      lateral_status: false,
      hostel_status: false,
      college_hostel_status: false,

      role: "management",
      registration_type: "management",
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
