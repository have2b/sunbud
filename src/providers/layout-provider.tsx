"use client";

import Header from "@/components/common/Header";
import Navigation from "@/components/common/Navigation";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const pathname = usePathname();

  // Check if the current path is admin or auth path
  const isAdminPath = pathname.startsWith("/admin");
  // Check if we're in any of the auth routes (login, register, forgot-password, otp)
  const isAuthPath =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/otp" ||
    pathname.startsWith("/login/") ||
    pathname.startsWith("/register/") ||
    pathname.startsWith("/forgot-password/") ||
    pathname.startsWith("/otp/");

  // Only show Header and Navigation if not in admin or auth paths
  const showHeaderAndNav = !isAdminPath && !isAuthPath;

  return (
    <>
      {showHeaderAndNav && <Header />}
      {showHeaderAndNav && <Navigation />}
      {children}
    </>
  );
};
