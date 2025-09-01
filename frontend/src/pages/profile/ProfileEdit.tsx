import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchMe, updateProfile, deleteAccount } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, user, status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState(user?.name ?? "");
  const [number, setNumber] = useState(user?.number ?? "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setNumber(user.number);
    }
  }, [user]);

  const disabled = useMemo(() => status === "loading", [status]);

  const errData = (error && typeof error === "object" ? (error as any) : null) as
    | { message?: string; errors?: Record<string, string> }
    | Record<string, string>
    | null;
  const fieldErrors: Record<string, string> | undefined = errData && ("errors" in errData ? (errData as any).errors : (errData as any));
  const topMessage = typeof error === "string" ? error : (errData as any)?.message;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updateProfile({
        name,
        number,
        password: password || undefined,
        repeatPassword: repeatPassword || undefined,
      })
    )
      .unwrap()
      .then(() => navigate("/profile", { replace: true }))
      .catch((err: any) => {
        // Show structured errors similar to order flow
        let message = "Update failed";
        const data = err && typeof err === "object" ? err : null;
        const errorsObj = (data as any)?.errors as Record<string, string> | undefined;
        if (errorsObj && typeof errorsObj === "object") {
          const lines = Object.entries(errorsObj)
            .filter(([, v]) => typeof v === "string" && v.trim())
            .map(([, v]) => `• ${v}`);
          if (lines.length) message = `Please fix the following:\n\n${lines.join("\n")}`;
        } else if ((data as any)?.message) {
          message = String((data as any).message);
        } else if (typeof err === "string") {
          message = err;
        }
        alert(message);
      });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
              {fieldErrors?.nameError && (
                <div className="text-xs text-red-600">{fieldErrors.nameError}</div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Phone Number</Label>
              <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="+1234567890" required />
              {fieldErrors?.numberError && (
                <div className="text-xs text-red-600">{fieldErrors.numberError}</div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">New Password (optional)</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="• • • • • • • •" />
              {fieldErrors?.passwordError && (
                <div className="text-xs text-red-600">{fieldErrors.passwordError}</div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repeatPassword">Repeat Password</Label>
              <Input id="repeatPassword" type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="• • • • • • • •" />
              {fieldErrors?.repeatPasswordError && (
                <div className="text-xs text-red-600">{fieldErrors.repeatPasswordError}</div>
              )}
            </div>
            {(topMessage || (!topMessage && fieldErrors)) && (
              <div className="text-sm text-red-600">{topMessage || "Please fix the highlighted fields"}</div>
            )}
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={disabled}>Save Changes</Button>
              <Link to="/profile">
                <Button type="button" variant="outline" disabled={disabled}>Cancel</Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

