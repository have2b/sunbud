"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

interface ProfileLayoutProps {
  children: ReactNode;
  title?: string;
  isLoading?: boolean;
  error?: string | null;
  actionButton?: ReactNode;
}

const ProfileLayout = ({
  children,
  title = "Profile",
  isLoading = false,
  error = null,
  actionButton,
}: ProfileLayoutProps) => {
  const router = useRouter();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
      <Card className="p-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            {actionButton}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileLayout;
