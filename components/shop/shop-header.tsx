"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useState, useEffect } from "react";

export function ShopHeader() {
  const [mounted, setMounted] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const totalItems = mounted ? getTotalItems() : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/shop" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-light text-zinc-900 tracking-tight">MindGraphy</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/shop/products" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
          >
            전체상품
          </Link>
          <Link 
            href="/shop/products?category=wedding" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
          >
            웨딩촬영
          </Link>
          <Link 
            href="/shop/products?category=snap" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
          >
            스냅촬영
          </Link>
          <Link 
            href="/shop/products?category=special" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
          >
            특수촬영
          </Link>
          <Link 
            href="/shop/about" 
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light"
          >
            회사소개
          </Link>
        </nav>

        {/* Cart */}
        <Link href="/shop/cart">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-zinc-100 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-zinc-600" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
