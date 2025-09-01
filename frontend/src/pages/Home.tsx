import { useAppDispatch, useAppSelector } from "@/state/store";
import { logout, fetchMe } from "@/state/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Link } from "react-router";

export default function Home() {
  const { user, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  if (!token) {
    return (
      <div className="grid place-items-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please sign in to continue.</p>
            <div className="flex gap-2">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid place-items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">You are logged in as:</p>
          <div className="rounded-md border p-4">
            <p className="font-medium">{user?.name}</p>
            <p className="text-gray-600">{user?.number}</p>
          </div>
          <Button onClick={() => dispatch(logout())}>Logout</Button>
        </CardContent>
      </Card>
    </div>
  );
}

