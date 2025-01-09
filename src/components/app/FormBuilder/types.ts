import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "select"
  | "checkbox"
  | "textarea"
  | "switch"
  | "multiselect";

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseField {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
}

export interface TextFieldProps extends BaseField {
  type: "text" | "email" | "number" | "password";
  validation?: z.ZodString | z.ZodNumber;
}
""
export interface SelectFieldProps extends BaseField {
  type: "select";
  options: SelectOption[];
  validation?: z.ZodString;
}

export interface MultiSelectFieldProps extends BaseField {
  type: "multiselect";
  options: SelectOption[];
  validation?: z.ZodArray<z.ZodString>;
}

export interface CheckboxFieldProps extends BaseField {
  type: "checkbox";
  validation?: z.ZodBoolean;
}

export interface TextareaFieldProps extends BaseField {
  type: "textarea";
  validation?: z.ZodString;
}

export interface SwitchFieldProps extends BaseField {
  type: "switch";
  validation?: z.ZodBoolean;
}

export type FormField =
  | TextFieldProps
  | SelectFieldProps
  | MultiSelectFieldProps
  | CheckboxFieldProps
  | TextareaFieldProps
  | SwitchFieldProps;

export type FieldComponentProps<T extends FormField> = {
  field: T;
  form: UseFormReturn<any>;
};

export type FormSchema = z.ZodObject<Record<string, z.ZodTypeAny>>;
