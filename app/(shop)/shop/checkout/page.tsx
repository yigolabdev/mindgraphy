"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/lib/store/cart-store";
import { ChevronLeft, CreditCard, User, MapPin, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      window.location.href = "/shop/success?orderId=ORDER_" + Date.now();
    }, 1500);
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
                주문하기
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-24">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
              <CreditCard className="w-10 h-10 text-zinc-400" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-light text-zinc-900">
                주문할 상품이 없습니다
              </h2>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">
                장바구니에 상품을 담아주세요
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
            <Link 
              href="/shop/cart" 
              className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors font-light mb-6"
            >
              <ChevronLeft className="w-4 h-4" />
              장바구니로 돌아가기
            </Link>
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">주문하기</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 주문 정보 입력 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 주문자 정보 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-zinc-600" />
                  <h2 className="text-xl font-medium text-zinc-900">주문자 정보</h2>
                </div>
                <div className="border-2 border-zinc-200 p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-zinc-700">
                      이름 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="홍길동"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-zinc-700">
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-zinc-700">
                      연락처 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 배송 정보 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-zinc-600" />
                  <h2 className="text-xl font-medium text-zinc-900">배송 정보</h2>
                </div>
                <div className="border-2 border-zinc-200 p-6 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="zipcode" className="text-sm font-medium text-zinc-700">
                      우편번호
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        placeholder="12345"
                        className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                        readOnly
                      />
                      <Button 
                        variant="outline"
                        className="h-12 px-6 border-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 whitespace-nowrap"
                      >
                        주소 검색
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-zinc-700">
                      주소
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="서울특별시 강남구 테헤란로 123"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="addressDetail" className="text-sm font-medium text-zinc-700">
                      상세주소
                    </Label>
                    <Input
                      id="addressDetail"
                      name="addressDetail"
                      value={formData.addressDetail}
                      onChange={handleInputChange}
                      placeholder="4층 401호"
                      className="h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memo" className="text-sm font-medium text-zinc-700">
                      배송 메모
                    </Label>
                    <Textarea
                      id="memo"
                      name="memo"
                      value={formData.memo}
                      onChange={handleInputChange}
                      placeholder="배송 시 요청사항을 입력해주세요"
                      className="resize-none border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-zinc-600" />
                  <h2 className="text-xl font-medium text-zinc-900">약관 동의</h2>
                </div>
                <div className="border-2 border-zinc-200 p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreedTerms}
                      onCheckedChange={(checked) => setAgreedTerms(checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="cursor-pointer text-sm font-light leading-relaxed">
                      <Link href="/shop/terms/service" target="_blank" className="text-zinc-900 hover:underline font-medium">
                        이용약관
                      </Link>
                      에 동의합니다 <span className="text-red-500">(필수)</span>
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacy"
                      checked={agreedPrivacy}
                      onCheckedChange={(checked) => setAgreedPrivacy(checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="privacy" className="cursor-pointer text-sm font-light leading-relaxed">
                      <Link href="/shop/terms/privacy" target="_blank" className="text-zinc-900 hover:underline font-medium">
                        개인정보 처리방침
                      </Link>
                      에 동의합니다 <span className="text-red-500">(필수)</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* 주문 요약 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-6">
                  <h2 className="text-lg font-medium text-zinc-900">주문 상품</h2>
                  
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {items.map((item, index) => {
                      const optionsPrice = item.selectedOptions?.reduce((sum, opt) => sum + opt.price, 0) || 0;
                      const itemPrice = item.product.price + optionsPrice;
                      return (
                        <div key={`${item.product.id}-${index}`} className="flex gap-3 pb-3 border-b border-zinc-200 last:border-0">
                          <div
                            className="w-16 h-16 bg-zinc-100 flex-shrink-0 bg-cover bg-center border border-zinc-200"
                            style={{ backgroundImage: `url(${item.product.image})` }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 truncate mb-1">
                              {item.product.shortName}
                            </p>
                            <p className="text-xs text-zinc-600 font-light mb-2">
                              {itemPrice.toLocaleString()}원 × {item.quantity}개
                            </p>
                            {item.selectedOptions && item.selectedOptions.length > 0 && (
                              <p className="text-xs text-zinc-500 truncate font-light">
                                옵션: {item.selectedOptions.map(opt => opt.name).slice(0, 2).join(', ')}
                                {item.selectedOptions.length > 2 && '...'}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3 pt-4 border-t-2 border-zinc-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 font-light">상품 금액</span>
                      <span className="font-medium text-zinc-900">{getTotalPrice().toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600 font-light">배송비</span>
                      <span className="font-medium text-zinc-900">무료</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t-2 border-zinc-200">
                    <span className="text-base font-medium text-zinc-900">최종 결제 금액</span>
                    <span className="text-2xl font-light text-zinc-900">
                      {getTotalPrice().toLocaleString()}원
                    </span>
                  </div>

                  <Button 
                    size="lg" 
                    onClick={handlePayment}
                    className="w-full h-14 text-base font-normal bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
                  >
                    <CreditCard className="mr-2 w-5 h-5" />
                    결제하기
                  </Button>

                  <div className="bg-white border border-zinc-200 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-zinc-700">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">안전한 결제</span>
                    </div>
                    <p className="text-xs text-zinc-600 font-light leading-relaxed">
                      본 사이트는 안전한 전자결제 시스템을 이용하며,
                      구매안전 서비스를 통해 고객님의 거래를 보호합니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
