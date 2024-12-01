import React, {
  useState,
  ReactNode,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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

// Types
type StepContent = {
  form?: {
    schema: z.ZodObject<any>;
    onSubmit?: (values: any) => void;
    fieldConfig?: FieldConfig<any>;
    dependencies?: Dependency<any>[];
    defaultValues?: Record<string, any>;
  };
  content?: ReactNode;
};

type Step = {
  title: string;
  content: StepContent;
};

type SteppedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  steps: Step[];
  onSave: (data: any) => Promise<void>;
  defaultValues?: Record<string, any>[];
};

// Animation variants
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const contentVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { type: "spring", stiffness: 500, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { type: "spring", stiffness: 500, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
};

// Hooks
const useSteppedModal = (
  steps: Step[],
  defaultValues: Record<string, any>[],
  onSave: (data: any) => Promise<void>
) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState<any[]>([]);
  const [validSteps, setValidSteps] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setFormData((prevFormData) => {
      return steps.map((step, index) => ({
        ...defaultValues[index],
        ...(step.content.form?.defaultValues || {}),
        ...(prevFormData[index] || {}),
      }));
    });

    setValidSteps((prevValidSteps) => {
      if (prevValidSteps.length !== steps.length) {
        return new Array(steps.length).fill(false);
      }
      return prevValidSteps;
    });
  }, [steps, defaultValues]);

  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, steps.length);
  }, [steps]);

  const resetModal = useCallback(() => {
    setCurrentStep(0);
    setDirection(0);
    setFormData([]);
    setValidSteps(new Array(steps.length).fill(false));
    setIsLoading(false);
  }, [steps]);

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

  const handleStepComplete = useCallback(
    async (data: any) => {
      setFormData((prev) => {
        const newFormData = [...prev];
        newFormData[currentStep] = { ...newFormData[currentStep], ...data };
        return newFormData;
      });

      setValidSteps((prev) => {
        const newValidSteps = [...prev];
        newValidSteps[currentStep] = true;
        return newValidSteps;
      });

      if (currentStep < steps.length - 1) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsLoading(true);
        try {
          const allData = formData.reduce(
            (acc, curr) => ({ ...acc, ...curr }),
            {}
          );
          await onSave({ ...allData, ...data });
          resetModal();
        } catch (error) {
          console.error("Error saving data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [currentStep, steps.length, formData, onSave]
  );

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const handleStepClick = useCallback(
    (index: number) => {
      if (index === 0 || validSteps.slice(0, index).every(Boolean)) {
        setDirection(index > currentStep ? 1 : -1);
        setCurrentStep(index);
      }
    },
    [validSteps, currentStep]
  );

  return {
    currentStep,
    direction,
    formData,
    validSteps,
    isLoading,
    stepRefs,
    resetModal,
    validateStep,
    handleStepComplete,
    handlePrevious,
    handleStepClick,
    setFormData,
    setValidSteps,
  };
};

// Components
const StepButtons: React.FC<{
  stepIndex: number;
  totalSteps: number;
  isLoading: boolean;
  handlePrevious: () => void;
  handleNext?: () => void;
}> = ({ stepIndex, totalSteps, isLoading, handlePrevious, handleNext }) => (
  <div className="flex justify-end mt-6">
    {stepIndex > 0 && (
      <Button
        type="button"
        onClick={handlePrevious}
        variant="outline"
        className="mr-auto"
        disabled={isLoading}
      >
        <Icon name="ArrowLeftIcon" className="w-4 h-4 mr-2" />
        Geri
      </Button>
    )}
    {handleNext ? (
      <Button onClick={handleNext} disabled={isLoading}>
        {isLoading ? (
          <>
            <Icon name="UpdateIcon" className="w-4 h-4 mr-2 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          <>
            İleri
            <Icon name="CheckCircledIcon" className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    ) : (
      <AutoFormSubmit disabled={isLoading}>
        {stepIndex === totalSteps - 1 ? (
          <>
            {isLoading ? (
              <>
                <Icon name="UpdateIcon" className="w-4 h-4 mr-2 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                Kaydet
                <Icon name="CheckCircledIcon" className="w-4 h-4 ml-2" />
              </>
            )}
          </>
        ) : (
          <>
            İleri
            <Icon name="ArrowRightIcon" className="w-4 h-4 ml-2" />
          </>
        )}
      </AutoFormSubmit>
    )}
  </div>
);

const StepContent: React.FC<{
  step: Step;
  stepIndex: number;
  totalSteps: number;
  modalHook: ReturnType<typeof useSteppedModal>;
}> = ({ step, stepIndex, totalSteps, modalHook }) => {
  const {
    handleStepComplete,
    handlePrevious,
    formData,
    isLoading,
    setFormData,
    setValidSteps,
    validateStep,
  } = modalHook;

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
            newFormData[stepIndex] = { ...newFormData[stepIndex], ...values };
            return newFormData;
          });
          setValidSteps((prev) => {
            const newValidSteps = [...prev];
            newValidSteps[stepIndex] = validateStep(stepIndex, values);
            return newValidSteps;
          });
        }}
      >
        <StepButtons
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          isLoading={isLoading}
          handlePrevious={handlePrevious}
        />
      </AutoForm>
    );
  }

  if (step.content.content) {
    return (
      <>
        {step.content.content}
        <StepButtons
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          isLoading={isLoading}
          handlePrevious={handlePrevious}
          handleNext={() => handleStepComplete(formData[stepIndex])}
        />
      </>
    );
  }

  return null;
};

// Main component
export const SteppedModal: React.FC<SteppedModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onSave,
  defaultValues = [],
}) => {
  const modalHook = useSteppedModal(steps, defaultValues, onSave);
  const {
    currentStep,
    direction,
    validSteps,
    isLoading,
    stepRefs,
    resetModal,
    handleStepClick,
  } = modalHook;

  const handleClose = useCallback(() => {
    onClose();
    resetModal();
  }, [onClose, resetModal]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <Button
          variant="ghost"
          onClick={handleClose}
          className="absolute right-4 top-4"
          aria-label="Close dialog"
          disabled={isLoading}
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
                  className={`flex-1 ${
                    index !== steps.length - 1 ? "pr-8 sm:pr-20" : ""
                  }`}
                >
                  <Button
                    onClick={() => handleStepClick(index)}
                    disabled={
                      isLoading ||
                      (index > 0 && !validSteps.slice(0, index).every(Boolean))
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
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-300">
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
                    <span className="ml-4 text-sm font-medium">
                      {step.title}
                    </span>
                  </Button>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-gray-50 rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <motion.div
                ref={(el) => (stepRefs.current[currentStep] = el)}
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
              >
                <StepContent
                  step={steps[currentStep]}
                  stepIndex={currentStep}
                  totalSteps={steps.length}
                  modalHook={modalHook}
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
