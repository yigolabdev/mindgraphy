"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("장바구니가 비어있습니다");
      return;
    }
    window.location.href = "/tosspay/checkout";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-gray-600 mb-6">상품을 담아보세요!</p>
            <Link href="/tosspay/products">
              <Button>상품 둘러보기</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">장바구니</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 장바구니 상품 목록 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>상품 ({items.length}개)</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    전체 삭제
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const finalPrice = item.product.discountPrice || item.product.price;
                  return (
                    <div key={item.product.id} className="flex gap-4 p-4 border rounded-lg">
                      <div
                        className="w-24 h-24 bg-gray-100 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${item.product.image})` }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Link
                              href={`/tosspay/products/${item.product.id}`}
                              className="font-semibold hover:text-blue-600"
                            >
                              {item.product.name}
                            </Link>
                            <p className="text-sm text-gray-600">{item.product.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">
                              {(finalPrice * item.quantity).toLocaleString()}원
                            </div>
                            {item.product.discountPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                {(item.product.price * item.quantity).toLocaleString()}원
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>결제 금액</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상품 금액</span>
                    <span className="font-medium">{getTotalPrice().toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">배송비</span>
                    <span className="font-medium text-green-600">무료</span>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총 결제 금액</span>
                    <span className="text-blue-600">{getTotalPrice().toLocaleString()}원</span>
                  </div>
                </div>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  주문하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  토스페이먼츠 안전 결제 시스템을 이용합니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
