import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type IconType = React.ComponentType<{ className?: string }>;

export function IconInput({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  autoComplete,
  disabled,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: IconType;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
          <Icon className="h-5 w-5" />
        </span>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 rounded-lg transition-shadow focus:shadow-sm"
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error || undefined}
        />
      </div>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}

export default IconInput;
