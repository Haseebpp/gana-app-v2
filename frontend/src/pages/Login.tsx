import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { login, fetchMe } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import IconInput from "@/components/form/IconInput";
import PasswordInput from "@/components/form/PasswordInput";
import { Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, status, error } = useAppSelector((s) => s.auth);

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
    await dispatch(login({ number, password }));
  };

  const errData = (error && typeof error === "object" ? (error as any) : null) as
    | { message?: string; errors?: Record<string, string> }
    | Record<string, string>
    | null;
  const fieldErrors: Record<string, string> | undefined = errData && ("errors" in errData ? (errData as any).errors : (errData as any));
  const topMessage = typeof error === "string" ? error : (errData as any)?.message;

  return (
    <AuthCard active="login">
      <form className="space-y-4" onSubmit={onSubmit}>
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
          placeholder="Your password"
          autoComplete="current-password"
          error={fieldErrors?.passwordError}
        />

        <Button type="submit" disabled={status === "loading"} className="w-full h-11 rounded-lg">
          {status === "loading" ? "Booking..." : "Book a wash"}
        </Button>

        <div className="flex items-center justify-between pt-1 text-sm">
          <label className="inline-flex items-center gap-2 text-foreground">
            <Checkbox id="remember" />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-primary hover:underline">Forgot password?</a>
        </div>
      </form>
    </AuthCard>
  );
}
