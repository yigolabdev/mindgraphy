"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";

export function TossPayHeader() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* 상단 알림 바 */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        <p>
          🎉 <strong>신규 고객 특별 할인!</strong> 첫 구매 시 최대 20% 할인 혜택
        </p>
      </div>

      {/* 메인 헤더 */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/tosspay" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MindGraphy</h1>
              <p className="text-xs text-gray-500">웨딩 촬영 전문</p>
            </div>
          </Link>

          {/* 우측 액션 */}
          <div className="flex items-center gap-2">
            {/* 장바구니 */}
            <Link href="/tosspay/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6 py-3 border-t">
          <Link
            href="/tosspay/products"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            전체상품
          </Link>
          <Link
            href="/tosspay/products?category=웨딩촬영"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            웨딩촬영
          </Link>
          <Link
            href="/tosspay/products?category=스냅촬영"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            스냅촬영
          </Link>
          <Link
            href="/tosspay/products?category=영상촬영"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            영상촬영
          </Link>
          <Link
            href="/tosspay/products?category=앨범"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            앨범
          </Link>
          <div className="flex-1" />
          <Link
            href="/tosspay/about"
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            회사소개
          </Link>
        </nav>
      </div>
    </header>
  );
}
