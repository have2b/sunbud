"use client";

import { ProfileForm } from "@/components/admin/user/UpdateProfileForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/generated/prisma";
import { ProfileFormValues } from "@/validations/user.validation";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/profile");
        setUserData(response.data.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const response = await axios.patch("/api/user/profile", values);
      setUserData(response.data.data);
      setIsEditing(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update profile");
      } else {
        setError("Failed to update profile");
      }
    }
  };

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
    <div className="w-full p-8">
      <Card className="p-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Profile</CardTitle>
            {!isEditing && userData && (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isEditing && userData ? (
            <ProfileForm
              user={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                avatarUrl: userData.avatarUrl || "",
              }}
              onSuccess={handleUpdateProfile}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <ProfileView user={userData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileView = ({ user }: { user: User | null }) => (
  <div className="space-y-6">
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user?.avatarUrl || ""} />
        <AvatarFallback>
          {user?.firstName[0]}
          {user?.lastName[0]}
        </AvatarFallback>
      </Avatar>
      <h2 className="mt-4 text-2xl font-semibold">
        {user?.firstName} {user?.lastName}
      </h2>
      <p className="text-muted-foreground">{user?.username}</p>
    </div>

    <div className="space-y-4">
      <div className="bg-muted flex items-center justify-between rounded-lg p-4">
        <span>Email</span>
        <span className="font-medium">{user?.email}</span>
      </div>
      <div className="bg-muted flex items-center justify-between rounded-lg p-4">
        <span>Phone</span>
        <span className="font-medium">{user?.phone}</span>
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Card className="w-full max-w-2xl">
      <CardContent className="space-y-8 pt-8">
        <Skeleton className="mx-auto h-8 w-1/2" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ProfilePage;
