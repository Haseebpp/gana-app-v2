import React from "react";
import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthCard({
  active,
  children,
  showSkeletons = true,
}: {
  active: "login" | "register";
  children: React.ReactNode;
  showSkeletons?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {showSkeletons && (
        <div className="container mx-auto max-w-3xl px-4 pt-10 text-center">
          <Skeleton className="mx-auto mb-2 h-8 w-64" />
          <Skeleton className="mx-auto h-8 w-72" />
        </div>
      )}

      <main className="container mx-auto max-w-md px-4 py-8">
        <Card className="rounded-2xl shadow-md transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="sr-only">GANA Auth</CardTitle>
            <Tabs
              value={active}
              onValueChange={(v) => navigate(v === "login" ? "/login" : "/register")}
              className="w-full"
            >
              <TabsList className="mx-auto grid w-max grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>{children}</CardContent>
          <CardFooter />
        </Card>

        {showSkeletons && <Skeleton className="mx-auto mt-6 h-8 w-24 rounded-full" />}
      </main>
    </div>
  );
}
