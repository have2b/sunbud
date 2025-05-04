"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CheckCircle, UserIcon, XCircle, CalendarIcon } from "lucide-react";

interface ProfileHeaderProps {
  avatarUrl?: string | null;
  firstName: string;
  lastName: string;
  username?: string;
  isVerified?: boolean;
  role?: string;
  createdAt?: Date;
}

const ProfileHeader = ({
  avatarUrl,
  firstName,
  lastName,
  username,
  isVerified = false,
  role = "User",
  createdAt,
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || ""} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>
            {firstName[0]}
            {lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="mt-4 flex items-center gap-2">
          {isVerified ? (
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
            {firstName} {lastName}
          </h2>
          {username && <p className="text-muted-foreground">{username}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            {role}
          </Badge>
          {createdAt && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              Member since {formatDate(createdAt)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
