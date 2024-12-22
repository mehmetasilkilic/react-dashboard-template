// Types
import { CheckboxFieldProps, FieldComponentProps } from "../types";

// Global Components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export const CheckboxField = ({
  field,
  form,
}: FieldComponentProps<CheckboxFieldProps>) => {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{field.label}</FormLabel>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
          </div>
        </FormItem>
      )}
    />
  );
};
