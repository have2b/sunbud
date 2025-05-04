"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      action();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Truy cập bị từ chối
        </h1>
        <p className="mb-6 text-gray-600">
          Bạn không có quyền truy cập trang này. Khu vực này được hạn chế dựa
          trên vai trò người dùng của bạn.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleGoBack}
            onKeyDown={(e) => handleKeyDown(e, handleGoBack)}
            tabIndex={0}
            aria-label="Go back to previous page"
            className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Go Back
          </Button>

          <Button
            onClick={handleGoHome}
            onKeyDown={(e) => handleKeyDown(e, handleGoHome)}
            tabIndex={0}
            aria-label="Go to homepage"
            className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Trở về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
