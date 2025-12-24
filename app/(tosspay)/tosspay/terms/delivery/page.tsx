import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Clock, MapPin } from "lucide-react";

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">배송 정책</CardTitle>
            <p className="text-sm text-gray-600">최종 업데이트: 2026년 1월 1일</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. 배송 방법</h2>
            
            <h3>1-1. 디지털 상품</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="text-sm text-blue-800 mb-0">
                <strong>온라인 다운로드:</strong> 결과물 완성 후 이메일로 다운로드 링크를 보내드립니다.
                링크는 6개월간 유효하며, 무제한 다운로드가 가능합니다.
              </p>
            </div>

            <h3>1-2. 실물 상품 (앨범, 인화물 등)</h3>
            <ul>
              <li><strong>배송 업체:</strong> CJ대한통운, 롯데택배, 한진택배 등</li>
              <li><strong>배송 방법:</strong> 택배 배송 (안전 포장)</li>
              <li><strong>배송 추적:</strong> 송장번호로 실시간 추적 가능</li>
            </ul>

            <h2>2. 배송 기간</h2>
            <div className="grid md:grid-cols-2 gap-4 my-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold m-0">디지털 파일</h4>
                </div>
                <p className="text-sm mb-0">
                  촬영 후 <strong>2-3주 이내</strong> 이메일 발송
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold m-0">앨범 제작</h4>
                </div>
                <p className="text-sm mb-0">
                  제작 완료 후 <strong>2-3주 이내</strong> 배송
                </p>
              </div>
            </div>

            <h2>3. 배송비</h2>
            <ul>
              <li><strong>기본 배송비:</strong> 무료 배송</li>
              <li><strong>제주/도서산간:</strong> 추가 배송비 없음</li>
              <li><strong>해외 배송:</strong> 별도 문의 필요</li>
            </ul>

            <h2>4. 배송지 정보</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
              <p className="text-sm text-yellow-900 mb-2">
                <strong>⚠️ 중요:</strong> 배송지 정보는 반드시 정확하게 입력해주세요.
              </p>
              <ul className="text-sm text-yellow-800 mb-0">
                <li>• 배송 전 배송지 변경 가능 (고객센터 문의)</li>
                <li>• 배송 후에는 변경 불가</li>
                <li>• 잘못된 주소로 인한 반송 시 재배송비 고객 부담</li>
              </ul>
            </div>

            <h2>5. 배송 조회</h2>
            <div className="flex items-start gap-3 my-4">
              <Truck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p>배송이 시작되면 <strong>송장번호를 이메일과 문자</strong>로 안내해드립니다.</p>
                <p className="text-sm text-gray-600">
                  택배사 홈페이지나 앱에서 송장번호로 실시간 배송 조회가 가능합니다.
                </p>
              </div>
            </div>

            <h2>6. 배송 불가 지역</h2>
            <p>현재 국내 전 지역 배송이 가능합니다. 다만, 다음의 경우 배송이 어려울 수 있습니다:</p>
            <ul>
              <li>군부대 내부 (우체국 택배만 가능)</li>
              <li>사서함 주소</li>
              <li>해외 주소</li>
            </ul>

            <h2>7. 배송 중 파손 및 분실</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p className="text-sm text-red-900 mb-2">
                <strong>상품 수령 시 반드시 확인해주세요!</strong>
              </p>
              <ul className="text-sm text-red-800 mb-0">
                <li>• 포장 상태가 훼손된 경우 수령 거부 가능</li>
                <li>• 배송 중 파손 발견 시 즉시 고객센터 연락</li>
                <li>• 사진 촬영 후 교환/재배송 처리</li>
                <li>• 배송 중 분실 시 재발송 (무료)</li>
              </ul>
            </div>

            <h2>8. 수령 방법</h2>
            <ul>
              <li><strong>직접 수령:</strong> 본인 또는 동거인 수령 가능</li>
              <li><strong>부재 시:</strong> 경비실, 택배함, 무인택배함 배송</li>
              <li><strong>재배송:</strong> 부재로 인한 보관 기간 경과 시 재배송 신청 (무료)</li>
            </ul>

            <h2>9. 반품 배송</h2>
            <p>환불/교환을 위한 반품 배송은 다음과 같이 진행됩니다:</p>
            <ul>
              <li><strong>회사 귀책:</strong> 무료 반품 (착불)</li>
              <li><strong>고객 귀책:</strong> 왕복 배송비 고객 부담</li>
              <li><strong>반품 주소:</strong> 서울특별시 성동구 마조로15길 6, 1층 (주)마인드그래피</li>
            </ul>

            <h2>10. 고객센터</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>배송 관련 문의</strong>
              </p>
              <div className="text-sm text-blue-700">
                <p><strong>전화:</strong> 1588-0000 (평일 09:00 - 18:00)</p>
                <p className="mb-0"><strong>이메일:</strong> support@mindgraphy.com</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-xs text-gray-500">
                본 배송 정책은 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 작성되었으며,
                2026년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
