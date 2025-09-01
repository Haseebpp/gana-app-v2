import { useEffect } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "@/state/store";
import { fetchMe } from "@/state/slices/authSlice";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileCard() {
  const dispatch = useAppDispatch();
  const { token, user, error, status } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [token]);

  const errData = (error && typeof error === "object" ? (error as any) : null) as
    | { message?: string; errors?: Record<string, string> }
    | Record<string, string>
    | null;
  const topMessage = typeof error === "string" ? error : (errData as any)?.message;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>View and manage your account details</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2" />
          <Link to="/profile/edit">
            <Button variant="outline" disabled={status === "loading"}>Edit Profile</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

