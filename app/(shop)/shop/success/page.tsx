"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((state) => state.clearCart);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // 결제 성공 시 장바구니 비우기
    clearCart();
  }, [clearCart]);

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* 성공 아이콘 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-white" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-4">
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
              주문이 완료되었습니다
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              결제가 성공적으로 처리되었습니다<br />
              주문 내역은 이메일로 발송되었습니다
            </p>
          </div>

          {/* 주문번호 */}
          {orderId && (
            <div className="bg-zinc-50 border-2 border-zinc-200 p-8">
              <p className="text-sm text-zinc-600 font-light mb-3">주문번호</p>
              <p className="text-2xl font-mono font-light text-zinc-900">{orderId}</p>
            </div>
          )}

          {/* 진행 단계 */}
          <div className="grid md:grid-cols-3 gap-8 py-8">
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-7 h-7 text-zinc-700" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">주문 확인</h3>
                <p className="text-sm text-zinc-600 font-light">1-2일 이내</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-7 h-7 text-zinc-700" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">촬영 진행</h3>
                <p className="text-sm text-zinc-600 font-light">예약일</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-zinc-700" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">결과물 전달</h3>
                <p className="text-sm text-zinc-600 font-light">2-3주 후</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 border-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300"
              >
                홈으로
              </Button>
            </Link>
            <Link href="/shop/products">
              <Button 
                size="lg"
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300"
              >
                쇼핑 계속하기
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 안내 */}
          <div className="bg-zinc-50 border border-zinc-200 p-6">
            <p className="text-sm text-zinc-600 leading-relaxed font-light">
              문의사항이 있으시면 고객센터 <span className="font-medium text-zinc-900">1588-0000</span>으로 연락주세요<br />
              영업일 기준 1-2일 내에 담당자가 연락드립니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
