// Types
import { FieldComponentProps, SwitchFieldProps } from "../types";

// Global Components
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

export const SwitchField = ({
  field,
  form,
}: FieldComponentProps<SwitchFieldProps>) => {
  return (
    <FormField
      control={form.control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>{field.label}</FormLabel>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={formField.value}
              onCheckedChange={formField.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
