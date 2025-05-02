import { AppSidebar } from "@/components/admin/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { shipperSidebarItems } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blossomy Shipper",
  description: "Flower online store",
};

export default function ShipperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar items={shipperSidebarItems} />
      <main className="h-screen w-full p-4">{children}</main>
    </SidebarProvider>
  );
}
