import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  disabled,
  error,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  disabled?: boolean;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
          <Lock className="h-5 w-5" />
        </span>
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 rounded-lg transition-shadow focus:shadow-sm"
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error || undefined}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShow((s) => !s)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          aria-label={show ? "Hide password" : "Show password"}
          >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </Button>
      </div>
      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}
