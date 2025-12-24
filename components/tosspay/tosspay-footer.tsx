import Link from "next/link";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function TossPayFooter() {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* 상단 섹션 */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 회사 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <h3 className="font-bold text-gray-900">MindGraphy</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              당신의 특별한 순간을 아름답게 기록합니다
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>안전한 결제 보장</span>
            </div>
          </div>

          {/* 고객지원 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/tosspay/about" className="hover:text-blue-600">
                  회사소개
                </Link>
              </li>
              <li>
                <Link href="/tosspay/guide" className="hover:text-blue-600">
                  이용안내
                </Link>
              </li>
              <li>
                <Link href="/tosspay/faq" className="hover:text-blue-600">
                  자주묻는질문
                </Link>
              </li>
              <li>
                <Link href="/tosspay/contact" className="hover:text-blue-600">
                  1:1 문의
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">정책</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/tosspay/terms/service"
                  className="hover:text-blue-600"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  href="/tosspay/terms/privacy"
                  className="hover:text-blue-600 font-semibold"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/tosspay/terms/refund"
                  className="hover:text-blue-600"
                >
                  환불정책
                </Link>
              </li>
              <li>
                <Link
                  href="/tosspay/terms/delivery"
                  className="hover:text-blue-600"
                >
                  배송정책
                </Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">연락처</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">고객센터</p>
                  <p>1588-0000</p>
                  <p className="text-xs">평일 09:00 - 18:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>support@mindgraphy.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t pt-8">
          {/* 사업자 정보 */}
          <div className="text-sm text-gray-600 space-y-1 mb-6">
            <p>
              <strong className="text-gray-900">상호:</strong> 주식회사 마인드그래피
              {" | "}
              <strong className="text-gray-900">대표:</strong> 신영민
              {" | "}
              <strong className="text-gray-900">사업자등록번호:</strong>{" "}
              817-88-03363
            </p>
            <p>
              <strong className="text-gray-900">법인등록번호:</strong>{" "}
              110111-0937598
              {" | "}
              <strong className="text-gray-900">개인정보보호책임자:</strong>{" "}
              신영민
            </p>
            <p>
              <strong className="text-gray-900">통신판매업 신고번호:</strong>{" "}
              제 2023-서울성동-1563 호
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-gray-900">주소:</strong> 서울특별시 성동구 마조로15길 6, 1층 (마장동)
              </span>
            </p>
            <p>
              <strong className="text-gray-900">호스팅 서비스:</strong> Amazon
              Web Services (AWS)
            </p>
          </div>

          {/* 에스크로 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>구매안전 서비스:</strong> 고객님의 안전거래를 위해
              전자결제 에스크로 서비스를 이용하고 있습니다.
            </p>
          </div>

          {/* 하단 카피라이트 */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t">
            <p className="text-sm text-gray-500">
              © 2026 MindGraphy Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/tosspay/business-info"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                사업자정보확인
              </Link>
              <a
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                통신판매업신고확인
              </a>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>※ 주의사항:</strong> (주)마인드그래피는
              통신판매중개자로서 통신판매의 당사자가 아니며, 입점 판매자가
              등록한 상품정보 및 거래에 대해 (주)마인드그래피는 일체 책임을 지지
              않습니다. 단, (주)마인드그래피가 직접 판매하는 상품에 대한
              책임은 (주)마인드그래피에 있습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
