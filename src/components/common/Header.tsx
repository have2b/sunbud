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
import { useAuthStore } from "@/hooks/useAuthStore";
import { LogOutIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";

const mainNavItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/shop" },
  { label: "Giới thiệu", href: "/about" },
  { label: "Liên hệ", href: "/contact" },
];

const avatarDropdownItems = [
  { label: "Thông tin cá nhân", href: "/account", icon: <UserIcon /> },
  { label: "Đơn hàng", href: "/orders", icon: <ShoppingCartIcon /> },
  {
    label: "Đăng xuất",
    href: "/sign-out",
    icon: <LogOutIcon className="text-red-500" />,
  },
];

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    if (expiresAt && expiresAt < Date.now()) {
      clearAuth();
    }
  }, [expiresAt, clearAuth]);

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
          <div className="flex flex-1">
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
            className="flex flex-1 justify-center max-sm:hidden"
            aria-label="Main navigation"
          >
            <ul className="m-0 flex list-none gap-8">
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
          <div className="flex flex-1 justify-end">
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
                  {avatarDropdownItems.map(({ label, href, icon }) => (
                    <DropdownMenuItem key={label}>
                      <Link href={href}>
                        <div className="flex items-center gap-2">
                          {icon}
                          {label}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
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
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
