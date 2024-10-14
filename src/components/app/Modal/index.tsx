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
                variant={index === currentStep ? "default" : "outline"}
                className={`flex-1 mx-1 ${
                  completedSteps[index] ? "bg-green-500 text-white" : ""
                }`}
              >
                {step.title}
                {completedSteps[index] && (
                  <Icon name="CheckIcon" className="ml-2 h-4 w-4" />
                )}
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
