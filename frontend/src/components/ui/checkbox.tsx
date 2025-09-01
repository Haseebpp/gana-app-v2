import * as React from "react";
import { cn } from "@/lib/utils";

// Minimal checkbox styled in the spirit of shadcn/ui.
// Using native <input type="checkbox"> keeps deps light for this outline.
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-black focus:ring-2 focus:ring-black focus:ring-offset-2",
        className
      )}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export default Checkbox;

