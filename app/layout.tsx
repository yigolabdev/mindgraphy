import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { MockDataProvider } from "@/lib/providers/mock-data-provider";
import { PasswordProtection } from "@/components/auth/password-protection";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "마인드그라피 업무 시스템",
  description: "마인드그라피 웨딩 스냅 촬영 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PasswordProtection>
          <MockDataProvider>
            {children}
            <Toaster />
          </MockDataProvider>
        </PasswordProtection>
      </body>
    </html>
  );
}
