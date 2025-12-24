import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, MapPin, Phone, Mail, Globe, CreditCard } from "lucide-react";

export default function BusinessInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">사업자 정보</CardTitle>
            <p className="text-sm text-gray-600">통신판매업 신고 필수 정보</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 회사 기본 정보 */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-blue-600" />
                회사 정보
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">상호명</p>
                    <p className="font-semibold text-gray-900">주식회사 마인드그래피</p>
                    <p className="text-xs text-gray-500 mt-1">MindGraphy Inc.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">대표자명</p>
                    <p className="font-semibold text-gray-900">신영민</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">사업자등록번호</p>
                    <p className="font-semibold text-gray-900">817-88-03363</p>
                    <a 
                      href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=8178803363" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      사업자정보 확인 →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">법인등록번호</p>
                    <p className="font-semibold text-gray-900">110111-0937598</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">통신판매업 신고번호</p>
                    <p className="font-semibold text-gray-900">제 2023-서울성동-1563 호</p>
                    <p className="text-xs text-gray-500 mt-1">신고일자: 2023년 08월 07일</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 연락처 정보 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-blue-600" />
                연락처
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">사업장 소재지</p>
                    <p className="font-medium text-gray-900">
                      서울특별시 성동구 마조로15길 6, 1층 (마장동)
                    </p>
                    <p className="text-sm text-gray-500 mt-1">우편번호: 04780</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">고객센터</p>
                    <p className="font-semibold text-gray-900">1588-0000</p>
                    <p className="text-sm text-gray-500 mt-1">평일 09:00 - 18:00</p>
                    <p className="text-sm text-gray-500">(주말 및 공휴일 휴무)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">이메일</p>
                    <p className="font-medium text-gray-900">support@mindgraphy.com</p>
                    <p className="text-sm text-gray-500 mt-1">24시간 이내 답변</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">웹사이트</p>
                    <p className="font-medium text-gray-900">www.mindgraphy.com</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 개인정보 관리 책임자 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">개인정보 관리 책임자</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-800 mb-1">성명</p>
                    <p className="font-semibold text-blue-900">김철수</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 mb-1">직책</p>
                    <p className="font-semibold text-blue-900">개인정보보호책임자</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 mb-1">연락처</p>
                    <p className="font-semibold text-blue-900">1588-0000</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 mb-1">이메일</p>
                    <p className="font-semibold text-blue-900">privacy@mindgraphy.com</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 호스팅 서비스 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">호스팅 서비스 제공자</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">Amazon Web Services (AWS)</p>
                    <p className="text-sm text-gray-600">클라우드 호스팅 및 인프라 제공</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 결제 대행 업체 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">결제 대행 업체</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900">안전결제 서비스</p>
                    <p className="text-sm text-gray-600">전자결제 서비스 제공 (PG사)</p>
                    <p className="text-xs text-gray-500 mt-1">에스크로 안전거래 서비스 제공</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 소비자 피해 보상 보험 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">소비자 피해 보상</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-sm text-green-800 mb-3">
                  <strong>구매안전서비스:</strong> 고객님의 안전거래를 위해 전자결제 에스크로 서비스를 이용하고 있습니다.
                </p>
                <p className="text-sm text-green-700">
                  에스크로 서비스를 통해 결제하신 경우, 상품 미배송 또는 서비스 미제공 시 구매대금을 환불받으실 수 있습니다.
                </p>
              </div>
            </section>

            {/* 분쟁 처리 기관 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">분쟁 처리 기관</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">한국소비자원</p>
                    <p className="text-sm text-gray-600">전화: 1372 | 웹사이트: www.kca.go.kr</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">공정거래위원회</p>
                    <p className="text-sm text-gray-600">전화: 1588-1919 | 웹사이트: www.ftc.go.kr</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">전자거래분쟁조정위원회</p>
                    <p className="text-sm text-gray-600">전화: 02-2122-2500 | 웹사이트: www.ecmc.or.kr</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 법적 고지 */}
            <section className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">법적 고지</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-sm text-yellow-900 leading-relaxed">
                  (주)마인드그래피는 통신판매중개자로서, 통신판매의 당사자가 아닙니다. 
                  따라서 (주)마인드그래피는 상품의 주문, 배송 및 환불 등과 관련한 의무와 책임은 
                  각 판매자에게 있습니다. 단, (주)마인드그래피가 직접 판매하는 상품에 대한 
                  책임은 (주)마인드그래피에 있습니다.
                </p>
              </div>
            </section>

            {/* 면책 조항 */}
            <section className="border-t pt-8">
              <p className="text-xs text-gray-500 leading-relaxed">
                본 페이지에 기재된 모든 정보는 「전자상거래 등에서의 소비자보호에 관한 법률」 제13조(통신판매업자 등의 신원 등 고지) 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 고지되었습니다. 
                정보의 정확성과 최신성을 유지하기 위해 노력하고 있으며, 사업자정보 변경 시 즉시 업데이트됩니다.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
