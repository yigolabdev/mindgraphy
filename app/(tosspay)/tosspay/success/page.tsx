"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Mail } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // 결제 성공 시 장바구니 비우기
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 mb-8">
              결제가 성공적으로 처리되었습니다.<br />
              주문 내역은 이메일로 발송되었습니다.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-sm text-gray-600 mb-2">주문번호</p>
                <p className="text-xl font-mono font-bold">{orderId}</p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">주문 확인</h3>
                <p className="text-sm text-gray-600">1-2일 이내</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">촬영 진행</h3>
                <p className="text-sm text-gray-600">예약일</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold mb-1">결과물 전달</h3>
                <p className="text-sm text-gray-600">2-3주 후</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href="/tosspay">
                <Button size="lg" variant="outline">홈으로</Button>
              </Link>
              <Link href="/tosspay/products">
                <Button size="lg">쇼핑 계속하기</Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                문의사항이 있으시면 고객센터(1588-0000)로 연락주세요
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
