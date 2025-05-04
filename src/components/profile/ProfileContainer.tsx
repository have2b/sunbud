"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/generated/prisma";
import { ProfileFormValues } from "@/validations/user.validation";
import axios from "axios";
import { useState, useEffect } from "react";
import ProfileLayout from "./ProfileLayout";
import ProfileView from "./ProfileView";
import { ProfileForm } from "@/components/admin/user/UpdateProfileForm";

interface ProfileContainerProps {
  role?: "user" | "admin" | "shipper";
  userId?: string;
  apiEndpoint?: string;
  title?: string;
}

const ProfileContainer = ({
  role = "user",
  userId,
  apiEndpoint,
  title = "Profile",
}: ProfileContainerProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine the API endpoint based on role and userId
  const endpoint = apiEndpoint || 
    (userId ? `/api/${role}/profile/${userId}` : `/api/user/profile`);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(endpoint);
        setUserData(response.data.data);
      } catch (err) {
        const error = err as Error & { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [endpoint]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const response = await axios.patch(endpoint, values);
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

  const actionButton = !isEditing && userData ? (
    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
  ) : null;

  return (
    <ProfileLayout
      title={title}
      isLoading={isLoading}
      error={error}
      actionButton={actionButton}
    >
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
    </ProfileLayout>
  );
};

export default ProfileContainer;
