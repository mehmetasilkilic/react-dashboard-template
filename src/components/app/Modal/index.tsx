import { useState, ReactNode } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import AutoForm from "@/components/ui/auto-form";
import { FieldConfig, Dependency } from "@/components/ui/auto-form/types";

interface SteppedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  steps: {
    title: string;
    content: {
      form?: {
        schema: z.ZodObject<any>;
        onSubmit?: (values: any) => void;
        fieldConfig?: FieldConfig<any>;
        dependencies?: Dependency<any>[];
      };
      content?: ReactNode;
    };
  }[];
  onSave: (data: any) => void;
}

export const SteppedModal = ({
  isOpen,
  onClose,
  title,
  steps,
  onSave,
}: SteppedModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const [formData, setFormData] = useState<any[]>(
    new Array(steps.length).fill({})
  );

  const handleStepComplete = (data: any) => {
    const newFormData = [...formData];
    newFormData[currentStep] = data;
    setFormData(newFormData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });
    } else {
      const allData = newFormData.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      onSave(allData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setCompletedSteps(new Array(steps.length).fill(false));
    setFormData(new Array(steps.length).fill({}));
    onClose();
  };

  const renderStepContent = (step: SteppedModalProps["steps"][number]) => {
    if (step.content.form) {
      return (
        <AutoForm
          formSchema={step.content.form.schema}
          onSubmit={(data) => {
            step.content.form?.onSubmit?.(data);
            handleStepComplete(data);
          }}
          fieldConfig={step.content.form.fieldConfig}
          dependencies={step.content.form.dependencies}
        >
          <div className="flex justify-end mt-4">
            {currentStep > 0 && (
              <Button
                type="button"
                onClick={handlePrevious}
                className="mr-auto"
              >
                Previous
              </Button>
            )}
            <Button type="submit">
              {currentStep === steps.length - 1 ? "Save" : "Next"}
            </Button>
          </div>
        </AutoForm>
      );
    } else if (step.content.content) {
      return (
        <>
          {step.content.content}
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            <Button onClick={() => handleStepComplete({})}>
              {currentStep === steps.length - 1 ? "Save" : "Next"}
            </Button>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]" aria-describedby="A">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Register a new user</DialogDescription>
        </DialogHeader>
        {steps.length > 1 ? (
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-blue-500 text-white"
                      : completedSteps[index]
                        ? "bg-green-500 text-white"
                        : "bg-gray-200"
                  }`}
                >
                  {completedSteps[index] ? (
                    <Icon name="CheckCircledIcon" className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        ) : null}
        <div className="grid gap-4">
          {renderStepContent(steps[currentStep])}
        </div>
      </DialogContent>
    </Dialog>
  );
};
