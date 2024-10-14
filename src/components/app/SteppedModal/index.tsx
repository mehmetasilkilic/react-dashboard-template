import { useState, ReactNode, useCallback } from "react";
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
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { FieldConfig, Dependency } from "@/components/ui/auto-form/types";

interface StepContent {
  form?: {
    schema: z.ZodObject<any>;
    onSubmit?: (values: any) => void;
    fieldConfig?: FieldConfig<any>;
    dependencies?: Dependency<any>[];
  };
  content?: ReactNode;
}

interface Step {
  title: string;
  content: StepContent;
}

interface SteppedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: Step[];
  onSave: (data: any) => void;
}

export const SteppedModal = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onSave,
}: SteppedModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([]);
  const [formData, setFormData] = useState<any[]>([]);

  const resetModal = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Array(steps.length).fill(false));
    setFormData(new Array(steps.length).fill({}));
  }, [steps.length]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleXButtonClick = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  const handleStepComplete = useCallback(
    (data: any) => {
      setFormData((prev) => {
        const newFormData = [...prev];
        newFormData[currentStep] = data;
        return newFormData;
      });

      setCompletedSteps((prev) => {
        const newCompleted = [...prev];
        newCompleted[currentStep] = true;
        return newCompleted;
      });

      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        const allData = formData.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        onSave(allData);
      }
    },
    [currentStep, steps.length, formData, onSave]
  );

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback(
    (index: number) => {
      if (index <= currentStep || completedSteps[index - 1]) {
        setCurrentStep(index);
      }
    },
    [currentStep, completedSteps]
  );

  const renderStepContent = (step: Step, stepIndex: number) => {
    if (step.content.form) {
      return (
        <AutoForm
          formSchema={step.content.form.schema}
          onSubmit={handleStepComplete}
          fieldConfig={step.content.form.fieldConfig}
          dependencies={step.content.form.dependencies}
          values={formData[stepIndex]}
          onValuesChange={(values) => {
            setFormData((prev) => {
              const newFormData = [...prev];
              newFormData[stepIndex] = values;
              return newFormData;
            });
          }}
        >
          <div className="flex justify-end mt-6">
            {stepIndex > 0 && (
              <Button
                type="button"
                onClick={handlePrevious}
                variant="outline"
                className="mr-auto"
              >
                <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <AutoFormSubmit>
              {stepIndex === steps.length - 1 ? (
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
            </AutoFormSubmit>
          </div>
        </AutoForm>
      );
    } else if (step.content.content) {
      return (
        <>
          {step.content.content}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={stepIndex === 0}
              variant="outline"
            >
              <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={() => handleStepComplete(formData[stepIndex])}>
              {stepIndex === steps.length - 1 ? (
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
        </>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <Button
          variant="ghost"
          onClick={handleXButtonClick}
          className="absolute right-4 top-4"
          aria-label="Close dialog"
        >
          <Icon name="Cross1Icon" className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        {steps.length > 1 && (
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className={`flex-1 ${index !== steps.length - 1 ? "pr-8 sm:pr-20" : ""}`}
                >
                  <Button
                    onClick={() => handleStepClick(index)}
                    disabled={index > currentStep && !completedSteps[index - 1]}
                    variant="ghost"
                    className={`flex items-center justify-start w-full ${
                      index === currentStep
                        ? "text-blue-600"
                        : completedSteps[index]
                          ? "text-green-600"
                          : "text-gray-500"
                    }`}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
                      {completedSteps[index] ? (
                        <Icon
                          name="CheckIcon"
                          className="w-5 h-5 text-green-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </span>
                    <span className="ml-4 text-sm font-medium">
                      {step.title}
                    </span>
                  </Button>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="bg-gray-50 p-6 rounded-lg mt-6">
          {renderStepContent(steps[currentStep], currentStep)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
