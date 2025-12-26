"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function FailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "결제 중 오류가 발생했습니다";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-12">
          {/* 실패 아이콘 */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-14 h-14 text-red-600" />
            </div>
          </div>

          {/* 메시지 */}
          <div className="space-y-4">
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
              결제에 실패했습니다
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              {message}<br />
              다시 시도해주세요
            </p>
          </div>

          {/* 실패 원인 */}
          <div className="bg-zinc-50 border-2 border-zinc-200 p-8 text-left">
            <h3 className="font-medium text-zinc-900 mb-6 text-center">결제 실패 주요 원인</h3>
            <ul className="space-y-3 text-sm text-zinc-600 font-light leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-zinc-400">•</span>
                <span>한도 초과 또는 잔액 부족</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-400">•</span>
                <span>카드 정보 입력 오류</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-400">•</span>
                <span>결제 시간 초과</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-400">•</span>
                <span>보안 인증 실패</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zinc-400">•</span>
                <span>일시적인 네트워크 오류</span>
              </li>
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop/cart">
              <Button 
                size="lg"
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                장바구니로 돌아가기
              </Button>
            </Link>
            <Link href="/shop/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 border-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300 flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                문의하기
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 안내 */}
          <div className="bg-zinc-50 border border-zinc-200 p-6">
            <p className="text-sm text-zinc-600 leading-relaxed font-light">
              문제가 계속되면 고객센터 <span className="font-medium text-zinc-900">02-2202-9966</span>으로 연락주세요<br />
              친절하게 도와드리겠습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
