import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BasicInformationStep } from "./steps/BasicInformationStep";
import { AcademicInformationStep } from "./steps/AcademicInformationStep";

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
    lateral_status: z.string().optional(),
    hostel_status: z.string().optional(),
    college_hostel_status: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof formSchema>;

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

// Main Multi-Step Form Component
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
          Step {currentStep} of 2
        </span>
        <Progress value={(currentStep / 2) * 100} className="w-full" />
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
