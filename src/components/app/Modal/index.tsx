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
  description: string;
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

export const SteppedModal: React.FC<SteppedModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onSave,
}) => {
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

  const handleStepClick = (index: number) => {
    if (index < currentStep || completedSteps[index - 1]) {
      setCurrentStep(index);
    }
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
          <div className="flex justify-end mt-6">
            {currentStep > 0 && (
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
            <Button type="submit">
              {currentStep === steps.length - 1 ? (
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
        </AutoForm>
      );
    } else if (step.content.content) {
      return (
        <>
          {step.content.content}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
            >
              <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={() => handleStepComplete({})}>
              {currentStep === steps.length - 1 ? (
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
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        {steps.length > 1 && (
          <div className="flex items-center">
            {steps.map((step, index) => (
              <Button
                key={index}
                onClick={() => handleStepClick(index)}
                disabled={index > currentStep && !completedSteps[index - 1]}
                variant="ghost"
                className={`flex-1 flex items-center justify-start p-2 space-x-2 ${
                  index === currentStep
                    ? "bg-blue-50 text-blue-700"
                    : completedSteps[index]
                      ? "text-green-700"
                      : "text-gray-500"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium mr-2 ${
                    index === currentStep
                      ? "bg-blue-500 text-white ring-2 ring-blue-200"
                      : completedSteps[index]
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {completedSteps[index] ? (
                    <Icon name="CheckIcon" className="h-3 w-3" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </Button>
            ))}
          </div>
        )}
        <div className="bg-gray-50 p-6 rounded-lg">
          {renderStepContent(steps[currentStep])}
        </div>
      </DialogContent>
    </Dialog>
  );
};
