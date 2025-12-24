import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, CreditCard, Package, Phone } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">이용안내</CardTitle>
            <p className="text-sm text-gray-600">처음 이용하시나요? 쉽고 간편한 주문 방법을 안내합니다</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 주문 방법 */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">주문 방법</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">상품 선택</h3>
                    <p className="text-sm text-gray-600">
                      상품 목록에서 원하시는 촬영 패키지를 선택하세요. 
                      상세 페이지에서 포함 내역과 가격을 확인하실 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">장바구니 담기</h3>
                    <p className="text-sm text-gray-600">
                      '장바구니 추가' 버튼을 클릭하여 상품을 담으세요. 
                      여러 상품을 함께 주문하실 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">주문 정보 입력</h3>
                    <p className="text-sm text-gray-600">
                      이름, 연락처, 이메일 등 주문에 필요한 정보를 입력해주세요.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">결제하기</h3>
                    <p className="text-sm text-gray-600">
                      원하시는 결제 수단을 선택하여 안전하게 결제를 완료하세요.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 결제 방법 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">결제 방법</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">신용카드</h3>
                  <p className="text-sm text-gray-600">
                    국내 모든 신용카드 사용 가능<br />
                    무이자 할부 가능 (카드사별 상이)
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">계좌이체</h3>
                  <p className="text-sm text-gray-600">
                    실시간 계좌이체<br />
                    주문 즉시 확인 가능
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">가상계좌</h3>
                  <p className="text-sm text-gray-600">
                    발급된 계좌로 입금<br />
                    입금 확인 후 주문 확정
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">휴대폰 결제</h3>
                  <p className="text-sm text-gray-600">
                    간편한 휴대폰 결제<br />
                    다음 달 통신비에 합산
                  </p>
                </div>
              </div>
            </section>

            {/* 배송 안내 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-6">
                <Package className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">배송 안내</h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                <ul className="space-y-2">
                  <li><strong>디지털 상품:</strong> 온라인 다운로드 링크 제공 (즉시)</li>
                  <li><strong>앨범/인화물:</strong> 제작 완료 후 택배 배송 (2-3주)</li>
                  <li><strong>배송비:</strong> 무료 배송</li>
                  <li><strong>배송 추적:</strong> 송장번호로 실시간 추적 가능</li>
                </ul>
              </div>
            </section>

            {/* 고객센터 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-6 h-6 text-pink-600" />
                <h2 className="text-2xl font-bold">고객센터</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-800 font-semibold mb-1">전화 문의</p>
                    <p className="text-lg font-bold text-blue-900">1588-0000</p>
                    <p className="text-xs text-blue-700">평일 09:00 - 18:00</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-800 font-semibold mb-1">이메일 문의</p>
                    <p className="text-lg font-bold text-blue-900">support@mindgraphy.com</p>
                    <p className="text-xs text-blue-700">24시간 이내 답변</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 주의사항 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">주의사항</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                <ul className="text-sm text-yellow-900 space-y-2">
                  <li>• 주문 전 상품 정보와 가격을 반드시 확인해주세요</li>
                  <li>• 촬영 일정은 예약 후 변경이 제한될 수 있습니다</li>
                  <li>• 환불 정책은 상품별로 다를 수 있으니 사전에 확인하세요</li>
                  <li>• 문의사항은 고객센터로 연락 주시기 바랍니다</li>
                </ul>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
