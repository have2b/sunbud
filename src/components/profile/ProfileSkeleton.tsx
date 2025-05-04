"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-8">
      <Card className="p-4">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-28" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="mt-4 h-6 w-24" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="mt-2 h-5 w-32" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>
            </div>
            <Skeleton className="h-[1px] w-full" />
            <div className="space-y-6">
              <Skeleton className="h-7 w-48" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSkeleton;
