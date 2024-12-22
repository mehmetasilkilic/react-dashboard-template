import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FieldComponentProps, MultiSelectFieldProps } from "../types";
import { CheckIcon, ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";

export const MultiSelectField: React.FC<
  FieldComponentProps<MultiSelectFieldProps>
> = ({
  field: { name, label, placeholder, description, options, required },
  form,
}) => {
  const [open, setOpen] = useState(false);
  const values = form.watch(name) || [];

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between min-h-10"
                >
                  <div className="flex flex-wrap gap-1">
                    {values.length === 0 && (
                      <span className="text-muted-foreground">
                        {placeholder || "Select options..."}
                      </span>
                    )}
                    {values.map((value: string) => (
                      <Badge key={value} variant="secondary" className="mr-1">
                        {
                          options.find((option) => option.value === value)
                            ?.label
                        }
                        <button
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const newValues = values.filter(
                                (v: string) => v !== value
                              );
                              form.setValue(name, newValues);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const newValues = values.filter(
                              (v: string) => v !== value
                            );
                            form.setValue(name, newValues);
                          }}
                        >
                          <Cross1Icon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                  />
                  <CommandEmpty>No options found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const currentValues = form.getValues(name) || [];
                          const newValues = currentValues.includes(option.value)
                            ? currentValues.filter(
                                (v: string) => v !== option.value
                              )
                            : [...currentValues, option.value];
                          form.setValue(name, newValues);
                        }}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            values.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
