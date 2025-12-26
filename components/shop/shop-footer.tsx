import Link from "next/link";
import { MapPin } from "lucide-react";

export function ShopFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-24">
      <div className="container mx-auto px-4 py-12">
        {/* 상단 섹션 */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* 회사 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h3 className="font-medium text-zinc-900">MindGraphy</h3>
            </div>
            <p className="text-sm text-zinc-600 leading-relaxed font-light">
              당신의 특별한 순간을<br />아름답게 기록합니다
            </p>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-medium text-zinc-900 mb-4">고객지원</h4>
            <ul className="space-y-3 text-sm text-zinc-600 font-light">
              <li>
                <Link href="/shop/about" className="hover:text-zinc-900 transition-colors">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/shop/guide" className="hover:text-zinc-900 transition-colors">
                  이용안내
                </Link>
              </li>
              <li>
                <Link href="/shop/faq" className="hover:text-zinc-900 transition-colors">
                  자주묻는질문
                </Link>
              </li>
              <li>
                <Link href="/shop/contact" className="hover:text-zinc-900 transition-colors">
                  1:1 문의
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="font-medium text-zinc-900 mb-4">정책</h4>
            <ul className="space-y-3 text-sm text-zinc-600 font-light">
              <li>
                <Link
                  href="/shop/terms/service"
                  className="hover:text-zinc-900 transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/terms/privacy"
                  className="hover:text-zinc-900 transition-colors font-medium"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/terms/refund"
                  className="hover:text-zinc-900 transition-colors"
                >
                  환불정책
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/terms/delivery"
                  className="hover:text-zinc-900 transition-colors"
                >
                  배송정책
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="font-medium text-zinc-900 mb-4">연락처</h4>
            <div className="space-y-3 text-sm text-zinc-600 font-light">
              <div>
                <p className="text-xs text-zinc-500 mb-1">고객센터</p>
                <p className="font-medium text-zinc-900">02-2202-9966</p>
                <p className="text-xs text-zinc-500">평일 09:00 - 18:00</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">이메일</p>
                <p className="font-medium text-zinc-900">mindgraphy@daum.net</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">카카오 채널</p>
                <a 
                  href="http://pf.kakao.com/_xfxcxfxaK" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-900 hover:underline"
                >
                  상담 문의하기 →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-zinc-200 pt-8">
          {/* 사업자 정보 */}
          <div className="text-xs text-zinc-500 space-y-2 mb-8 font-light leading-relaxed">
            <p>
              <span className="text-zinc-700">상호:</span> 주식회사 마인드그래피
              {" | "}
              <span className="text-zinc-700">대표:</span> 신영민
              {" | "}
              <span className="text-zinc-700">사업자등록번호:</span>{" "}
              817-88-03363
            </p>
            <p>
              <span className="text-zinc-700">법인등록번호:</span>{" "}
              110111-0937598
              {" | "}
              <span className="text-zinc-700">개인정보보호책임자:</span>{" "}
              신영민
            </p>
            <p>
              <span className="text-zinc-700">통신판매업 신고번호:</span>{" "}
              제 2023-서울성동-1563 호
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-zinc-400" />
              <span>
                <span className="text-zinc-700">주소:</span> 서울특별시 성동구 마조로15길 6, 1층 (마장동)
              </span>
            </p>
          </div>

          {/* 에스크로 안내 */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 mb-8">
            <p className="text-xs text-zinc-600 leading-relaxed font-light">
              <span className="font-medium text-zinc-700">구매안전 서비스:</span> 고객님의 안전거래를 위해
              전자결제 에스크로 서비스를 이용하고 있습니다.
            </p>
          </div>

          {/* 하단 카피라이트 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-500 font-light">
              © 2026 MindGraphy Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/shop/business-info"
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-light"
              >
                사업자정보확인
              </Link>
              <a
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8178803363"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-light"
              >
                통신판매업신고확인
              </a>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              (주)마인드그래피는 통신판매중개자로서 통신판매의 당사자가 아니며, 
              입점 판매자가 등록한 상품정보 및 거래에 대해 일체 책임을 지지 않습니다. 
              단, (주)마인드그래피가 직접 판매하는 상품에 대한 책임은 (주)마인드그래피에 있습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
