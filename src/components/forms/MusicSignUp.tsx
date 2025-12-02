import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";

// --- 1. Preserve EXACT Schema Logic ---
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
    lateral_status: z.string().optional(),
    hostel_status: z.string().optional(),
    college_hostel_status: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof formSchema>;

// --- 2. Custom Hook Logic Preserved ---
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
        { name: "lateral_status" },
        { name: "hostel_status" },
        { name: "college_hostel_status" },
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

// --- 3. Aesthetic Wrapper Component ---
const MultiStepForm: React.FC<{ form: any }> = ({ form }) => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNext,
    goToPrevious,
    goToFirstStep,
  } = useMultiStepForm(2, form);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepComponents = {
    1: (
      <BasicInformationStep form={form} registrationType="Music Registration" />
    ),
    2: <AcademicInformationStep form={form} />,
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API
      form.reset();
      goToFirstStep();
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Aesthetic Progress Stepper */}
      <div className="flex items-center justify-center gap-4 mb-2">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border transition-all ${
                currentStep >= step
                  ? "bg-[#03a1b0] border-[#03a1b0] text-white"
                  : "bg-transparent border-white/20 text-gray-500"
              }`}
            >
              {currentStep > step ? <Check size={14} /> : step}
            </div>
            {step === 1 && (
              <div
                className={`w-16 h-0.5 mx-2 transition-all ${
                  currentStep > 1 ? "bg-[#03a1b0]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {stepComponents[currentStep as 1 | 2]}
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

        <div className="flex items-center gap-3">
          {!isFirstStep && (
            <Button
              variant="ghost"
              onClick={goToPrevious}
              type="button"
              disabled={isSubmitting}
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          {isLastStep ? (
            <Button
              type="button"
              onClick={() => form.handleSubmit(handleSubmit)()}
              disabled={isSubmitting}
              className="bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold shadow-lg shadow-[#03a1b0]/20 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNext}
              disabled={isSubmitting}
              className="bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold min-w-[100px]"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
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
      lateral_status: "",
      hostel_status: "",
      college_hostel_status: "",
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
