"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Building, User, MapPin, Phone, Mail } from "lucide-react";

export default function BusinessInfoPage() {
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
              사업자 정보
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              주식회사 마인드그라피의 사업자 정보입니다
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* 기본 정보 */}
          <div className="border-2 border-zinc-200 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-200">
              <Building className="w-6 h-6 text-zinc-600" />
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
                기본 정보
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  상호명
                </div>
                <div className="font-medium text-zinc-900">
                  주식회사 마인드그라피
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  대표자
                </div>
                <div className="font-medium text-zinc-900">
                  신영민
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  사업자등록번호
                </div>
                <div className="font-medium text-zinc-900">
                  817-88-03363
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  법인등록번호
                </div>
                <div className="font-medium text-zinc-900">
                  110111-0937598
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-start">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  통신판매업 신고번호
                </div>
                <div className="space-y-1">
                  <div className="font-medium text-zinc-900">
                    제 2023-서울성동-1563 호
                  </div>
                  <div className="text-sm text-zinc-500 font-light">
                    신고일자: 2023년 08월 07일
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="border-2 border-zinc-200 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-200">
              <Phone className="w-6 h-6 text-zinc-600" />
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
                연락처
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  고객센터
                </div>
                <div className="font-medium text-zinc-900">
                  02-2202-9966
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  이메일
                </div>
                <div className="font-medium text-zinc-900">
                  mindgraphy@daum.net
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-start">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  카카오 채널
                </div>
                <div>
                  <a 
                    href="http://pf.kakao.com/_xfxcxfxaK" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 hover:underline"
                  >
                    상담 문의하기 →
                  </a>
                  <p className="text-xs text-zinc-500 mt-1">
                    1상담팀: mind.channel | 2진행팀: mind.system
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-start">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  주소
                </div>
                <div className="font-medium text-zinc-900 leading-relaxed">
                  서울특별시 성동구 마조로15길 6, 1층 (마장동)
                </div>
              </div>
            </div>
          </div>

          {/* 개인정보 보호 책임자 */}
          <div className="border-2 border-zinc-200 p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-zinc-200">
              <User className="w-6 h-6 text-zinc-600" />
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
                개인정보보호책임자
              </h2>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  책임자
                </div>
                <div className="font-medium text-zinc-900">
                  신영민
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-5"></div>

              <div className="flex flex-col md:flex-row md:items-center">
                <div className="md:w-40 text-sm text-zinc-600 font-light mb-1 md:mb-0">
                  이메일
                </div>
                <div className="font-medium text-zinc-900">
                  privacy@mindgraphy.com
                </div>
              </div>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-zinc-50 border-2 border-zinc-200 p-8 space-y-4">
            <h3 className="text-lg font-medium text-zinc-900">구매안전 서비스</h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-light">
              고객님의 안전거래를 위해 전자결제 에스크로 서비스를 이용하고 있습니다.
              서비스 가입 사실 확인은 
              <a 
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8178803363" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-900 font-medium hover:underline mx-1"
              >
                공정거래위원회 사업자정보조회
              </a>
              에서 하실 수 있습니다.
            </p>
          </div>

          <div className="bg-white border border-zinc-200 p-6">
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              (주)마인드그라피는 통신판매중개자로서 통신판매의 당사자가 아니며, 
              입점 판매자가 등록한 상품정보 및 거래에 대해 일체 책임을 지지 않습니다. 
              단, (주)마인드그라피가 직접 판매하는 상품에 대한 책임은 (주)마인드그라피에 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
