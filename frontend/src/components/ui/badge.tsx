import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-gray-900 text-white",
    secondary: "bg-gray-100 text-gray-900",
    outline: "border border-gray-300 text-gray-900",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-500 text-black",
    destructive: "bg-red-600 text-white",
  };
  return (
    <span
      ref={ref}
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", variants[variant], className)}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export default Badge;

