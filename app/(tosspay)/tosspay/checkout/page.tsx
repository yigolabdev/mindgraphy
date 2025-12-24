"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/lib/store/cart-store";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipcode: "",
    memo: "",
  });
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("필수 정보를 모두 입력해주세요");
      return;
    }
    if (!agreedTerms || !agreedPrivacy) {
      toast.error("이용약관 및 개인정보 처리방침에 동의해주세요");
      return;
    }

    // 토스페이먼츠 결제 창 호출 (여기서는 성공 페이지로 리다이렉트)
    toast.success("결제 진행 중...");
    setTimeout(() => {
      window.location.href = "/tosspay/success?orderId=ORDER_" + Date.now();
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">주문할 상품이 없습니다</h2>
          <Link href="/tosspay/products">
            <Button>상품 둘러보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/tosspay/cart" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          장바구니로 돌아가기
        </Link>

        <h1 className="text-3xl font-bold mb-8">주문/결제</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 주문 정보 입력 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>주문자 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">이메일 *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="010-0000-0000"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* 배송 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>배송 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zipcode">우편번호</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      readOnly
                    />
                    <Button variant="outline">주소 검색</Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="서울특별시 강남구 테헤란로 123"
                  />
                </div>
                <div>
                  <Label htmlFor="addressDetail">상세주소</Label>
                  <Input
                    id="addressDetail"
                    name="addressDetail"
                    value={formData.addressDetail}
                    onChange={handleInputChange}
                    placeholder="4층 401호"
                  />
                </div>
                <div>
                  <Label htmlFor="memo">배송 메모</Label>
                  <Input
                    id="memo"
                    name="memo"
                    value={formData.memo}
                    onChange={handleInputChange}
                    placeholder="배송 시 요청사항을 입력해주세요"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 약관 동의 */}
            <Card>
              <CardHeader>
                <CardTitle>약관 동의</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms"
                    checked={agreedTerms}
                    onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="cursor-pointer">
                    <Link href="/tosspay/terms/service" target="_blank" className="text-blue-600 hover:underline">
                      이용약관
                    </Link>에 동의합니다 (필수)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="privacy"
                    checked={agreedPrivacy}
                    onCheckedChange={(checked) => setAgreedPrivacy(checked as boolean)}
                  />
                  <Label htmlFor="privacy" className="cursor-pointer">
                    <Link href="/tosspay/terms/privacy" target="_blank" className="text-blue-600 hover:underline">
                      개인정보 처리방침
                    </Link>에 동의합니다 (필수)
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>주문 상품</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {items.map((item) => {
                    const finalPrice = item.product.discountPrice || item.product.price;
                    return (
                      <div key={item.product.id} className="flex gap-3 text-sm">
                        <div
                          className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.product.image})` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.product.name}</p>
                          <p className="text-gray-600">
                            {finalPrice.toLocaleString()}원 × {item.quantity}개
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">상품 금액</span>
                    <span>{getTotalPrice().toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">배송비</span>
                    <span className="text-green-600">무료</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>최종 결제 금액</span>
                    <span className="text-blue-600">{getTotalPrice().toLocaleString()}원</span>
                  </div>
                </div>
                <Button size="lg" className="w-full" onClick={handlePayment}>
                  <CreditCard className="mr-2 w-5 h-5" />
                  결제하기
                </Button>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>안전한 결제:</strong> 본 사이트는 안전한 전자결제 시스템을 이용합니다
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
