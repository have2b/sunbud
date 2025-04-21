"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { avatarDropdownItems, mainNavItems } from "@/constants";
import { useAuthStore } from "@/hooks/useAuthStore";
import axios from "axios";
import { Menu, UserIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navigation = () => {
  const user = useAuthStore((state) => state.user);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  useEffect(() => {
    if (expiresAt && expiresAt < Date.now()) {
      clearAuth();
    }
  }, [expiresAt, clearAuth]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error(error);
    }
    clearAuth();
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white px-5 py-5 shadow-md max-sm:px-5 max-sm:py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex w-full items-center justify-between">
          {/* Logo */}
          <div className="flex flex-1/12">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative size-8">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="m-0 text-3xl font-bold text-rose-400">Blossomy</h1>
            </Link>
          </div>

          {/* Nav */}
          <nav
            className="flex flex-5/6 justify-center max-sm:hidden"
            aria-label="Main navigation"
          >
            <ul className="m-0 flex list-none justify-start gap-8">
              {mainNavItems.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="hover:text-secondary text-lg font-semibold uppercase transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Avatar dropdown */}
          <div className="flex flex-1/12 justify-end">
            <div className="hidden sm:flex">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer rounded-full p-0"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            user?.avatarUrl ||
                            "https://images.pexels.com/photos/479356/pexels-photo-479356.jpeg"
                          }
                          alt="User profile"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent sideOffset={4} align="end">
                    {avatarDropdownItems.map(({ label, href, icon }) =>
                      href === "/logout" ? (
                        <DropdownMenuItem key={label} onClick={handleLogout}>
                          <div className="flex items-center gap-2">
                            {icon}
                            {label}
                          </div>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem key={label}>
                          <Link href={href}>
                            <div className="flex items-center gap-2">
                              {icon}
                              {label}
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  variant="ghost"
                  size="default"
                  className="hover:bg-secondary/10 rounded-full hover:text-rose-500"
                >
                  <Link href="/login">
                    Đăng nhập
                    <UserIcon />
                  </Link>
                </Button>
              )}
            </div>
            <div className="flex sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer rounded-full p-0"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={4} align="end">
                  {mainNavItems.map(({ label, href }) => (
                    <DropdownMenuItem
                      key={label}
                      className="border-b-2 border-zinc-200 text-end"
                    >
                      <Link href={href} className="text-sm">
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {user ? (
                    <>
                      {avatarDropdownItems.map(({ label, href, icon }) =>
                        href === "/logout" ? (
                          <DropdownMenuItem
                            key={label}
                            onClick={handleLogout}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {icon}
                              {label}
                            </div>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem key={label}>
                            <Link href={href}>
                              <div className="flex items-center gap-2">
                                {icon}
                                {label}
                              </div>
                            </Link>
                          </DropdownMenuItem>
                        ),
                      )}
                    </>
                  ) : (
                    <DropdownMenuItem>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm text-rose-500"
                      >
                        <UserIcon className="h-4 w-4" />
                        Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navigation;
