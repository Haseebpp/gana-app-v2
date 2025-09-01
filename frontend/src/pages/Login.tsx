import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { login, fetchMe } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  return (
    <div className="grid place-items-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="number">Phone number</Label>
              <Input
                id="number"
                placeholder="e.g. +15551234567"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={status === "loading"} className="w-full">
              {status === "loading" ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between text-sm">
          <span className="text-gray-500">No account?</span>
          <Link to="/register" className="text-blue-600 underline">
            Create one
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

