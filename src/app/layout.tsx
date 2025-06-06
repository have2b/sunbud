import { Toaster } from "@/components/ui/sonner";

import { LayoutProvider } from "@/providers/layout-provider";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blossomy",
  description: "Flower online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <QueryProvider>
          <LayoutProvider>
            {children}
            <Toaster position="top-right" richColors={true} />
          </LayoutProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
