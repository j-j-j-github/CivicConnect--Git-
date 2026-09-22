import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionTimeout from "@/components/SessionTimeout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CivicConnect | Unified Civic Intelligence",
  description: "AI-powered unified civic intelligence platform for citizens, officers, and administrators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 text-gray-900 antialiased`}>
        <SessionTimeout />
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
