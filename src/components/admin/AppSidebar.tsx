"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarDropdownItems } from "@/constants";
import { useAuthStore } from "@/hooks/useAuthStore";
import { SidebarMenuItem as SidebarMenuItemType } from "@/types/common";
import axios from "axios";
import { LogOut, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchForm from "../common/SearchForm";
import { Button } from "../ui/button";

function AppAvatarDropdown() {
  const { state } = useSidebar();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  if (!user) return null;

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex w-full justify-center">
        <Button
          variant="ghost"
          className={`flex items-center gap-2 rounded-full hover:bg-rose-200 hover:text-black focus:outline-none ${
            state === "collapsed"
              ? "w-full justify-center px-0 py-2"
              : "w-full justify-start px-3 py-2"
          }`}
        >
          <Avatar className={state === "collapsed" ? "size-8" : "size-10"}>
            {user.avatarUrl ? (
              <AvatarImage
                src={user.avatarUrl || "/placeholder.svg"}
                alt={user.fullName}
              />
            ) : (
              <AvatarFallback
                className={state === "collapsed" ? "text-sm" : "text-base"}
              >
                {user.fullName?.[0] || user.username?.[0] || "A"}
              </AvatarFallback>
            )}
          </Avatar>
          {state === "collapsed" ? null : (
            <div className="flex flex-col items-start justify-center">
              <span className="text-xs font-bold uppercase">{user.role}</span>
              <span className="hidden max-w-[100px] truncate text-sm font-medium md:inline">
                {user.fullName || user.username}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {sidebarDropdownItems.map((item) => (
          <DropdownMenuItem
            asChild
            key={item.label}
            className={item.label === "Đăng xuất" ? "text-red-500" : undefined}
          >
            <Link href={item.href} className="flex w-full items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem asChild key="Đăng xuất" className="text-red-500">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2"
          >
            <LogOut className="size-4 text-red-500" />
            <span>Đăng xuất</span>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppSidebar({ items }: { items: SidebarMenuItemType[] }) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const isRouteActive = (url: string) => {
    if (pathname === url) return true;

    if (url !== "/" && pathname.startsWith(url)) return true;

    return false;
  };

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-rose-400">
      <SidebarHeader className="border-b-[1px] border-rose-400 bg-rose-100">
        <SidebarMenuButton asChild className="hover:bg-rose-100">
          <Link
            href="/"
            className="flex items-center gap-3 group-data-[collapsible=icon]/sidebar-wrapper:justify-center"
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-3xl font-bold text-rose-600 group-data-[collapsible=icon]/sidebar-wrapper:hidden">
              Blossomy
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className="bg-rose-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-rose-100">
                  <div className="flex w-full items-center">
                    {state !== "collapsed" ? <SearchForm /> : <SearchIcon />}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">
            Menu chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = isRouteActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`hover:bg-rose-200 ${isActive ? "bg-rose-300 font-medium text-rose-800" : ""}`}
                    >
                      <Link href={item.url}>
                        {item.icon}
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex w-full flex-col border-t-[1px] border-rose-400 bg-rose-100 py-2">
        <div className="mb-2 flex w-full justify-center">
          <AppAvatarDropdown />
        </div>
        <SidebarTrigger className="self-center rounded-full p-2 transition-colors duration-200 hover:bg-rose-200 hover:text-rose-600" />
      </SidebarFooter>
    </Sidebar>
  );
}
