import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { register, fetchMe } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import IconInput from "@/components/form/IconInput";
import PasswordInput from "@/components/form/PasswordInput";
import { User, Phone } from "lucide-react";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(fetchMe());
      navigate("/", { replace: true });
    }
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register({ name, number, password }));
  };

  const errData = (error && typeof error === "object" ? (error as any) : null) as
    | { message?: string; errors?: Record<string, string> }
    | Record<string, string>
    | null;
  const fieldErrors: Record<string, string> | undefined = errData && ("errors" in errData ? (errData as any).errors : (errData as any));
  const topMessage = typeof error === "string" ? error : (errData as any)?.message;

  return (
    <AuthCard active="register">
      <form className="space-y-4" onSubmit={onSubmit}>
        <IconInput
          id="name"
          label="Full name"
          icon={User}
          value={name}
          onChange={setName}
          placeholder="e.g. Haseeb P P"
          autoComplete="name"
          error={fieldErrors?.nameError}
        />

        <IconInput
          id="number"
          label="Mobile number"
          type="tel"
          icon={Phone}
          value={number}
          onChange={setNumber}
          placeholder="05XXXXXXXX"
          autoComplete="tel"
          error={fieldErrors?.numberError}
        />

        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Create a strong password"
          autoComplete="new-password"
          error={fieldErrors?.passwordError}
        />

        <p className="pt-1 text-xs text-muted-foreground">
          By creating an account, you agree to our Terms & Privacy. We’ll only use your number for booking updates.
        </p>

        <Button type="submit" disabled={status === "loading"} className="w-full h-11 rounded-lg">
          {status === "loading" ? "Creating..." : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
