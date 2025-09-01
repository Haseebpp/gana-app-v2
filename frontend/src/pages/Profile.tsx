import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchMe, updateProfile, deleteAccount } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { token, user, status, error } = useAppSelector((s) => s.auth);

  const [editing, setEditing] = useState(false);
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
      .then(() => setEditing(false))
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

  const onDelete = async () => {
    await dispatch(deleteAccount()).unwrap()
      .then(() => navigate("/", { replace: true }))
      .catch(() => {});
  };

  // Derive structured validation errors (align with orders)
  const errData = (error && typeof error === "object" ? (error as any) : null) as
    | { message?: string; errors?: Record<string, string> }
    | Record<string, string>
    | null;
  const fieldErrors: Record<string, string> | undefined = errData && ("errors" in errData ? (errData as any).errors : (errData as any));
  const topMessage = typeof error === "string" ? error : (errData as any)?.message;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
          {!editing ? (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="text-base font-medium">{user?.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone Number</div>
                <div className="text-base font-medium">{user?.number}</div>
              </div>
              {topMessage && (
                <div className="text-sm text-red-600">{topMessage}</div>
              )}
            </div>
          ) : (
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
                <Button type="button" variant="outline" onClick={() => setEditing(false)} disabled={disabled}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)} disabled={disabled}>Edit Profile</Button>
            )}
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={disabled}>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action permanently deletes your account. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}

