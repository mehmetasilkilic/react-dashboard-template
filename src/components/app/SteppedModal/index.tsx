import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FormBuilder } from "../FormBuilder";
import { FormField, FormSchema } from "../FormBuilder/types";

type StepContent = {
  form?: {
    fields: FormField[];
    schema?: FormSchema;
    defaultValues?: Record<string, any>;
  };
  content?: React.ReactNode;
};

type Step = {
  title: string;
  content: StepContent;
};

interface SteppedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: Step[];
  onSave: (data: any) => Promise<void>;
  defaultValues?: Record<string, any>[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export function SteppedModal({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onSave,
  defaultValues = [],
}: SteppedModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState(defaultValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validSteps, setValidSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const validateStep = useCallback(
    (stepIndex: number, data: any) => {
      const step = steps[stepIndex];
      if (step.content.form?.schema) {
        return step.content.form.schema.safeParse(data).success;
      }
      return true;
    },
    [steps]
  );

  const handleFormChange = (stepData: any) => {
    const newFormData = [...formData];
    newFormData[currentStep] = stepData;
    setFormData(newFormData);

    // Update validation state for current step
    const newValidSteps = [...validSteps];
    newValidSteps[currentStep] = validateStep(currentStep, stepData);
    setValidSteps(newValidSteps);
  };

  const handleNext = async (stepData: any) => {
    const newFormData = [...formData];
    newFormData[currentStep] = stepData;
    setFormData(newFormData);

    // Update validation state
    const newValidSteps = [...validSteps];
    newValidSteps[currentStep] = true;
    setValidSteps(newValidSteps);

    if (currentStep === steps.length - 1) {
      setIsSubmitting(true);
      try {
        const mergedData = newFormData.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        await onSave(mergedData);
        handleClose();
      } catch (error) {
        console.error("Error saving form:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
    setCurrentStep(0);
    setDirection(0);
    setFormData(defaultValues);
    setIsSubmitting(false);
    setValidSteps(new Array(steps.length).fill(false));
  }, [onClose, defaultValues, steps.length]);

  const renderStepContent = (step: Step) => {
    if (step.content.form) {
      return (
        <FormBuilder
          fields={step.content.form.fields}
          onSubmit={handleNext}
          onChange={handleFormChange}
          defaultValues={formData[currentStep]}
          isLoading={isSubmitting}
        />
      );
    }

    if (step.content.content) {
      return (
        <div className="space-y-6">
          {step.content.content}
          <div className="flex justify-end gap-4">
            {currentStep > 0 && (
              <Button onClick={handlePrevious} variant="outline">
                <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={() => handleNext(formData[currentStep])}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon
                    name="UpdateIcon"
                    className="w-4 h-4 mr-2 animate-spin"
                  />
                  Saving...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  Save
                  <Icon name="CheckCircledIcon" className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <Icon name="ArrowRightIcon" className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {steps.length > 1 && (
          <nav aria-label="Progress" className="mt-4 overflow-x-auto pb-4">
            <ol role="list" className="flex min-w-full items-center">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className={`flex-1 ${
                    index !== steps.length - 1 ? "pr-4 sm:pr-8" : ""
                  }`}
                >
                  <Button
                    onClick={() => {
                      if (index < currentStep || validSteps[currentStep]) {
                        setDirection(index > currentStep ? 1 : -1);
                        setCurrentStep(index);
                      }
                    }}
                    disabled={
                      isSubmitting ||
                      (index > currentStep && !validSteps[currentStep])
                    }
                    variant="ghost"
                    className={`flex items-center justify-start w-full space-x-2 ${
                      index === currentStep
                        ? "bg-blue-50 text-blue-700"
                        : validSteps[index]
                          ? "text-green-700"
                          : "text-gray-500"
                    }`}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300 shrink-0">
                      {validSteps[index] ? (
                        <Icon
                          name="CheckIcon"
                          className="w-5 h-5 text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {step.title}
                    </span>
                  </Button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            {renderStepContent(steps[currentStep])}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
