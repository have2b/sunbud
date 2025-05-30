import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { adminSidebarItems } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blossomy Admin",
  description: "Flower online store",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar items={adminSidebarItems} />
      <main className="h-screen w-full p-4">{children}</main>
    </SidebarProvider>
  );
}
