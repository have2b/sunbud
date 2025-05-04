"use client";

import { ProfileForm } from "@/components/admin/user/UpdateProfileForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { ProfileFormValues } from "@/validations/user.validation";
import axios from "axios";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  UserIcon,
  XCircle,
} from "lucide-react";
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
    <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
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
  <div className="space-y-8">
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.avatarUrl || ""} />
          <AvatarFallback>
            {user?.firstName[0]}
            {user?.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 flex items-center gap-2">
          {user?.isVerified ? (
            <Badge
              className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100"
              variant="outline"
            >
              <CheckCircle className="h-3 w-3" /> Verified
            </Badge>
          ) : (
            <Badge className="flex items-center gap-1" variant="secondary">
              <XCircle className="h-3 w-3" /> Unverified
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 text-center sm:text-left">
        <div>
          <h2 className="text-2xl font-semibold">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-muted-foreground">{user?.username}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {user?.role}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            Member since {formatDate(user?.createdAt || new Date())}
          </Badge>
        </div>
      </div>
    </div>

    <Separator />

    <div className="space-y-6">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email
          </span>
          <span className="font-medium">{user?.email}</span>
        </div>
        <div className="bg-muted flex items-center justify-between rounded-lg p-4">
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 opacity-70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Phone
          </span>
          <span className="font-medium">{user?.phone}</span>
        </div>
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
