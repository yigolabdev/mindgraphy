"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FailPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "결제 중 오류가 발생했습니다";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">결제에 실패했습니다</h1>
            <p className="text-gray-600 mb-8">
              {message}<br />
              다시 시도해주세요.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold mb-4">결제 실패 주요 원인</h3>
              <ul className="text-sm text-gray-600 text-left space-y-2">
                <li>• 한도 초과 또는 잔액 부족</li>
                <li>• 카드 정보 입력 오류</li>
                <li>• 결제 시간 초과</li>
                <li>• 보안 인증 실패</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-center mb-8">
              <Link href="/tosspay/cart">
                <Button size="lg">
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  장바구니로 돌아가기
                </Button>
              </Link>
              <Link href="/tosspay/contact">
                <Button size="lg" variant="outline">
                  <Mail className="mr-2 w-5 h-5" />
                  문의하기
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-gray-600">
                문제가 계속되면 고객센터(1588-0000)로 연락주세요
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
