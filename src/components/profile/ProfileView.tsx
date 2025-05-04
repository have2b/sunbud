"use client";

import { User } from "@/generated/prisma";
import { Separator } from "@/components/ui/separator";
import ProfileHeader from "./ProfileHeader";
import ContactInfo from "./ContactInfo";

interface ProfileViewProps {
  user: User | null;
}

const ProfileView = ({ user }: ProfileViewProps) => {
  if (!user) return null;
  
  return (
    <div className="space-y-8">
      <ProfileHeader
        avatarUrl={user.avatarUrl}
        firstName={user.firstName}
        lastName={user.lastName}
        username={user.username}
        isVerified={user.isVerified}
        role={user.role}
        createdAt={user.createdAt}
      />

      <Separator />

      <ContactInfo 
        email={user.email} 
        phone={user.phone} 
      />
    </div>
  );
};

export default ProfileView;
