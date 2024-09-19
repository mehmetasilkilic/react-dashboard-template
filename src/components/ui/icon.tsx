import React from "react";
import * as RadixIcons from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof RadixIcons;

export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  name: IconName;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    const IconComponent = RadixIcons[name] as React.FC<
      React.ComponentProps<"svg">
    >;

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found in Radix UI Icons`);
      return null;
    }

    return (
      <IconComponent
        ref={ref}
        className={cn("h-4 w-4", className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";

export { Icon };
