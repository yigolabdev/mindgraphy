"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart, CreditCard, Truck, HeadphonesIcon, AlertTriangle } from "lucide-react";

export default function GuidePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* 페이지 헤더 */}
      <div className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-light text-zinc-900 tracking-tight">
              이용 안내
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              MindGraphy 서비스 이용 방법을 안내해 드립니다
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* 주문 방법 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-zinc-600" />
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                주문 방법
              </h2>
            </div>
            
            <div className="space-y-6">
              <div className="border-2 border-zinc-200 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 mb-2">상품 선택</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed font-light">
                      원하시는 촬영 패키지를 선택하고 필요한 옵션을 추가합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 mb-2">장바구니 담기</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed font-light">
                      선택한 상품을 장바구니에 담고 주문 정보를 확인합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 mb-2">주문 정보 입력</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed font-light">
                      주문자 정보와 배송지 정보를 정확히 입력합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-zinc-900 mb-2">결제 완료</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed font-light">
                      원하시는 결제 방법을 선택하여 결제를 진행합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 결제 방법 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-zinc-600" />
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                결제 방법
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">신용카드 / 체크카드</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  국내 모든 카드사의 신용카드와 체크카드를 사용하실 수 있습니다.
                  실시간 승인 처리됩니다.
                </p>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">계좌이체</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  실시간 계좌이체로 즉시 결제가 가능합니다.
                  안전하고 빠른 결제 방법입니다.
                </p>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">무통장 입금</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  가상계좌로 입금하실 수 있습니다.
                  입금 확인은 영업일 기준 1-2일 소요됩니다.
                </p>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">간편결제</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  카카오페이, 네이버페이 등 간편결제 서비스를 지원합니다.
                  빠르고 편리하게 결제하세요.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 배송 안내 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-zinc-600" />
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                배송 안내
              </h2>
            </div>

            <div className="border-2 border-zinc-200 p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-zinc-900">배송 방법</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  촬영 결과물은 디지털 파일과 앨범으로 제공됩니다.
                  디지털 파일은 온라인으로 다운로드하실 수 있으며,
                  앨범은 등록하신 주소로 배송됩니다.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-6 space-y-3">
                <h3 className="font-medium text-zinc-900">배송 기간</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  촬영 완료 후 약 2-3주 내에 전체 사진을 확인하실 수 있으며,
                  선택 및 보정 완료 후 약 1-2주 내에 최종 결과물이 배송됩니다.
                </p>
              </div>

              <div className="border-t border-zinc-200 pt-6 space-y-3">
                <h3 className="font-medium text-zinc-900">배송비</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  모든 상품의 배송비는 무료입니다.
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 고객 서비스 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <HeadphonesIcon className="w-6 h-6 text-zinc-600" />
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                고객 서비스
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">전화 상담</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  <span className="font-medium text-zinc-900">02-2202-9966</span><br />
                  평일 09:00 - 18:00<br />
                  (주말 및 공휴일 휴무)
                </p>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">이메일 문의</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  <span className="font-medium text-zinc-900">mindgraphy@daum.net</span><br />
                  24시간 접수 가능<br />
                  영업일 기준 1-2일 내 답변
                </p>
              </div>

              <div className="border-2 border-zinc-200 p-6 space-y-3">
                <h3 className="font-medium text-zinc-900">카카오 채널</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  <a 
                    href="http://pf.kakao.com/_xfxcxfxaK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    상담하기 →
                  </a><br />
                  1:1 채팅 상담<br />
                  시간 기준 순차 상담
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 주의사항 */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-zinc-600" />
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                주의사항
              </h2>
            </div>

            <div className="bg-zinc-50 border-2 border-zinc-200 p-6">
              <ul className="space-y-3 text-sm text-zinc-600 font-light leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 flex-shrink-0">•</span>
                  <span>주문 후 영업일 기준 1-2일 내에 담당자가 연락드려 상세 일정을 조율합니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 flex-shrink-0">•</span>
                  <span>주말과 공휴일은 예약이 많으므로 최소 2-3개월 전에 예약하시는 것을 권장합니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 flex-shrink-0">•</span>
                  <span>촬영 7일 전까지는 100% 환불이 가능하며, 그 이후는 부분 환불 또는 환불 불가합니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 flex-shrink-0">•</span>
                  <span>기상 악화 등 불가항력적인 상황에서는 일정 조정이 가능합니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zinc-400 flex-shrink-0">•</span>
                  <span>저작권은 촬영사에 있으며, 고객님은 개인적 용도로만 사용하실 수 있습니다.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
