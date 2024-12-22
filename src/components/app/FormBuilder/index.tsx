import { DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  CheckboxField,
  MultiSelectField,
  SelectField,
  SwitchField,
  TextareaField,
  TextField,
} from "./components";
import { FieldComponentProps, FieldType, FormField, FormSchema } from "./types";

const fieldComponents: Record<FieldType, React.FC<FieldComponentProps<any>>> = {
  text: TextField,
  email: TextField,
  number: TextField,
  select: SelectField,
  multiselect: MultiSelectField,
  checkbox: CheckboxField,
  textarea: TextareaField,
  switch: SwitchField,
};

interface FormBuilderProps<TSchema extends FormSchema> {
  fields: FormField[];
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  title?: string;
  description?: string;
}

export function FormBuilder<TSchema extends FormSchema>({
  fields,
  onSubmit,
  title,
  description,
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
    defaultValues: fields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.type === "multiselect" ? [] : "",
      }),
      {} as DefaultValues<FormValues>
    ),
  });
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => {
              const Component = fieldComponents[field.type];
              return <Component key={field.name} field={field} form={form} />;
            })}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
