"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, X, Plus, Minus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCartStore, getOptionsKey } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckout = () => {
    router.push("/shop/checkout");
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          <p className="text-sm text-zinc-600 font-light">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-zinc-200">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
                장바구니
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart className="w-10 h-10 text-zinc-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-zinc-900">
                장바구니가 비어있습니다
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                원하는 상품을 장바구니에 담아보세요
              </p>
            </div>
            <Link href="/shop/products">
              <Button 
                size="lg"
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98]"
              >
                상품 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100" : "opacity-0"
    )}>
      {/* 페이지 헤더 */}
      <div className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
                장바구니
              </h1>
              <p className="text-sm text-zinc-600 font-light">
                총 <span className="font-medium text-zinc-900">{items.length}</span>개의 상품
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 장바구니 아이템 목록 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 전체 삭제 버튼 */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <h2 className="text-lg font-medium text-zinc-900">상품 목록</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-sm text-zinc-500 hover:text-zinc-900"
                >
                  전체 삭제
                </Button>
              </div>

              {/* 아이템 리스트 */}
              <div className="space-y-4">
                {items.map((item, index) => {
                  const optKey = getOptionsKey(item.selectedOptions);
                  const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
                  const itemTotal = (item.product.price + optionsPrice) * item.quantity;

                  return (
                    <div
                      key={`${item.product.id}-${index}-${optKey}`}
                      className="bg-white border-2 border-zinc-200 p-6 space-y-4"
                    >
                      <div className="flex gap-4">
                        {/* 상품 이미지 */}
                        <Link
                          href={`/shop/products/${item.product.id}`}
                          className="flex-shrink-0"
                        >
                          <div
                            className="w-24 h-24 bg-zinc-100 bg-cover bg-center border border-zinc-200"
                            style={{ backgroundImage: `url(${item.product.image})` }}
                          />
                        </Link>

                        {/* 상품 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <Link
                              href={`/shop/products/${item.product.id}`}
                              className="flex-1"
                            >
                              <p className="text-xs text-zinc-500 font-light mb-1">
                                {item.product.categoryLabel}
                              </p>
                              <h3 className="font-medium text-zinc-900 hover:text-zinc-700 transition-colors">
                                {item.product.shortName}
                              </h3>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.product.id, optKey)}
                              className="flex-shrink-0 hover:bg-zinc-100"
                            >
                              <X className="w-4 h-4 text-zinc-500" />
                            </Button>
                          </div>

                          {/* 선택된 옵션 */}
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.selectedOptions.map((opt) => (
                                <Badge
                                  key={opt.id}
                                  variant="outline"
                                  className="text-xs font-light border-zinc-300"
                                >
                                  {opt.name} (+{opt.price.toLocaleString()}원)
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            {/* 수량 조절 */}
                            <div className="flex items-center border border-zinc-200">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    Math.max(1, item.quantity - 1),
                                    optKey
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 hover:bg-zinc-100"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const newQty = Math.max(1, parseInt(e.target.value) || 1);
                                  updateQuantity(item.product.id, newQty, optKey);
                                }}
                                className="w-12 h-8 text-center border-0 focus-visible:ring-0 font-light text-sm"
                                min="1"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1, optKey)
                                }
                                className="h-8 w-8 hover:bg-zinc-100"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* 가격 */}
                            <div className="text-right">
                              <div className="text-lg font-medium text-zinc-900">
                                {itemTotal.toLocaleString()}원
                              </div>
                              <div className="text-xs text-zinc-500 font-light mt-1">
                                개당 {(item.product.price + optionsPrice).toLocaleString()}원
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-6">
                  <h2 className="text-lg font-medium text-zinc-900">주문 요약</h2>
                  
                  <div className="space-y-3 py-4 border-y border-zinc-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600 font-light">상품 금액</span>
                      <span className="font-medium text-zinc-900">
                        {getTotalPrice().toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600 font-light">배송비</span>
                      <span className="font-medium text-zinc-900">무료</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-medium text-zinc-900">총 결제 금액</span>
                    <span className="text-2xl font-light text-zinc-900">
                      {getTotalPrice().toLocaleString()}원
                    </span>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    className="w-full h-14 text-base font-normal bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
                  >
                    주문하기
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>

                  <Link href="/shop/products">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-14 text-base font-normal border-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300"
                    >
                      쇼핑 계속하기
                    </Button>
                  </Link>
                </div>

                {/* 안내 사항 */}
                <div className="bg-white border border-zinc-200 p-5 space-y-3">
                  <h3 className="text-sm font-medium text-zinc-900">구매 안내</h3>
                  <ul className="space-y-2 text-xs text-zinc-600 font-light leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>모든 상품은 VAT 포함 가격입니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>배송비는 무료입니다</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-zinc-400">•</span>
                      <span>결제 후 영업일 기준 1-2일 내 연락드립니다</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
