import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

// Icons
import { ReloadIcon } from "@radix-ui/react-icons";

// Types
import { FieldComponentProps, FieldType, FormField, FormSchema } from "./types";

// Global Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Local Components
import {
  CheckboxField,
  MultiSelectField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
} from "./components";

const fieldComponents: Record<FieldType, React.FC<FieldComponentProps<any>>> = {
  text: TextField,
  email: TextField,
  number: TextField,
  password: TextField,
  select: SelectField,
  multiselect: MultiSelectField,
  checkbox: CheckboxField,
  textarea: TextareaField,
  switch: SwitchField,
};

interface FormBuilderProps<TSchema extends FormSchema> {
  fields: FormField[];
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  onChange?: (data: z.infer<TSchema>) => void;
  title?: string;
  buttonLabel?: string;
  description?: string;
  isLoading?: boolean;
  defaultValues?: DefaultValues<any>;
}

export function FormBuilder<TSchema extends FormSchema>({
  fields,
  onSubmit,
  onChange,
  buttonLabel = "Kaydet",
  isLoading = false,
  defaultValues,
}: FormBuilderProps<TSchema>) {
  const schema = z.object(
    fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.validation || z.any(),
      }),
      {} as Record<string, z.ZodTypeAny>
    )
  ) as TSchema;

  type FormValues = z.infer<TSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      defaultValues ||
      fields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.type === "multiselect" ? [] : "",
        }),
        {} as DefaultValues<FormValues>
      ),
  });

  // Watch all fields and trigger onChange when any field changes
  useEffect(() => {
    if (onChange) {
      const subscription = form.watch((data) => {
        const validationResult = schema.safeParse(data);
        if (validationResult.success) {
          onChange(validationResult.data);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [form, onChange, schema]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => {
            const Component = fieldComponents[field.type];
            return <Component key={field.name} field={field} form={form} />;
          })}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              buttonLabel
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
