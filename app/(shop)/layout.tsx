import type { Metadata } from "next";
import "@/app/globals.css";
import { ShopHeader } from "@/components/shop/shop-header";
import { ShopFooter } from "@/components/shop/shop-footer";

export const metadata: Metadata = {
  title: "MindGraphy - 웨딩 촬영 전문",
  description: "당신의 특별한 순간을 아름답게 기록합니다. 웨딩촬영, 스냅촬영, 영상촬영 전문",
  keywords: "웨딩촬영, 스냅촬영, 웨딩사진, 본식촬영, 영상촬영, 웨딩앨범",
  robots: "noindex, nofollow", // 검색 엔진 노출 방지 (심사용)
  openGraph: {
    title: "MindGraphy - 웨딩 촬영 전문",
    description: "당신의 특별한 순간을 아름답게 기록합니다",
    type: "website",
  },
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ShopHeader />
        <main className="flex-1">{children}</main>
        <ShopFooter />
      </body>
    </html>
  );
}
