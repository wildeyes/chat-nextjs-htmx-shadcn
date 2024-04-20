import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Chat App",
  description: "htmx nextjs shadcn tailwindcss",
};

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  );
}
