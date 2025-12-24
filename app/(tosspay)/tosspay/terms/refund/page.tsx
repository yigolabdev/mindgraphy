import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">환불 및 교환 정책</CardTitle>
            <p className="text-sm text-gray-600">최종 업데이트: 2024년 1월 1일</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <h2>1. 청약철회 및 환불 가능 기간</h2>
            <p>
              「전자상거래 등에서의 소비자보호에 관한 법률」 제17조에 따라, 구매자는 상품을 배송 받은 날로부터 <strong>7일 이내</strong>에 청약을 철회하고 환불을 요청할 수 있습니다.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="text-sm text-blue-800 font-medium mb-2">📌 중요 안내</p>
              <p className="text-sm text-blue-700">
                촬영 서비스의 특성상, <strong>촬영이 진행된 이후에는 환불이 불가능</strong>합니다. 
                촬영 예약 후 일정 변경 요청은 촬영 7일 전까지 가능하며, 최대 2회까지 변경 가능합니다.
              </p>
            </div>

            <h2>2. 환불 가능한 경우</h2>
            <ul>
              <li>상품 또는 서비스에 하자가 있는 경우</li>
              <li>상품이 광고 내용과 다르거나 계약 내용과 다르게 이행된 경우</li>
              <li>배송된 상품이 파손되거나 손상된 경우</li>
              <li>서비스 제공이 불가능한 경우</li>
              <li>촬영 일정이 기상 악화 등 불가항력적 사유로 취소된 경우</li>
            </ul>

            <h2>3. 환불 불가능한 경우</h2>
            <p>다음의 경우에는 청약철회 및 환불이 제한될 수 있습니다:</p>
            <ul>
              <li>촬영 서비스가 이미 제공된 경우</li>
              <li>디지털 콘텐츠가 다운로드된 경우</li>
              <li>고객의 요청에 따라 개별적으로 주문 제작되는 상품의 경우</li>
              <li>시간의 경과에 의하여 재판매가 곤란할 정도로 상품의 가치가 현저히 감소한 경우</li>
              <li>복제가 가능한 상품의 포장을 훼손한 경우</li>
            </ul>

            <h2>4. 환불 절차</h2>
            <h3>4-1. 환불 신청</h3>
            <ol>
              <li>고객센터(1588-0000) 또는 이메일(support@mindgraphy.com)로 환불 신청</li>
              <li>환불 사유 및 주문번호 제공</li>
              <li>회사의 환불 승인 후 처리 진행</li>
            </ol>

            <h3>4-2. 환불 처리 기간</h3>
            <ul>
              <li><strong>신용카드 결제:</strong> 승인 취소 후 2-7영업일 내 환불 (카드사 정책에 따라 상이)</li>
              <li><strong>계좌이체/가상계좌:</strong> 환불 승인 후 3영업일 이내 입금</li>
              <li><strong>휴대폰 결제:</strong> 승인 취소 후 익월 청구 시 차감</li>
            </ul>

            <h3>4-3. 배송비 및 수수료</h3>
            <ul>
              <li>회사의 귀책사유로 인한 환불: 배송비 전액 회사 부담</li>
              <li>고객의 단순 변심에 의한 환불: 왕복 배송비 고객 부담</li>
              <li>환불 시 결제 수수료는 고객 부담</li>
            </ul>

            <h2>5. 교환 정책</h2>
            <h3>5-1. 교환 가능 기간</h3>
            <p>상품 수령 후 <strong>7일 이내</strong> 교환 신청이 가능합니다.</p>

            <h3>5-2. 교환 불가능한 경우</h3>
            <ul>
              <li>교환 가능 기간이 경과한 경우</li>
              <li>고객의 책임 있는 사유로 상품이 멸실 또는 훼손된 경우</li>
              <li>포장을 개봉하였거나 포장이 훼손되어 상품가치가 현저히 상실된 경우</li>
              <li>사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한 경우</li>
            </ul>

            <h3>5-3. 교환 절차</h3>
            <ol>
              <li>고객센터로 교환 신청</li>
              <li>상품 반송</li>
              <li>회사의 검수 완료 후 새 상품 발송</li>
            </ol>

            <h2>6. 촬영 서비스 특별 규정</h2>
            <h3>6-1. 일정 변경</h3>
            <ul>
              <li>촬영 7일 전까지: 무료 변경 (최대 2회)</li>
              <li>촬영 3-7일 전: 변경 수수료 50% 부과</li>
              <li>촬영 3일 이내: 변경 불가</li>
            </ul>

            <h3>6-2. 촬영 취소 및 환불</h3>
            <ul>
              <li>촬영 14일 전: 100% 환불</li>
              <li>촬영 7-14일 전: 50% 환불</li>
              <li>촬영 7일 이내: 환불 불가</li>
              <li>촬영 진행 후: 환불 불가</li>
            </ul>

            <h3>6-3. 불가항력 사유</h3>
            <p>다음의 경우에는 전액 환불 또는 일정 재조정이 가능합니다:</p>
            <ul>
              <li>태풍, 폭우 등 기상 악화로 촬영이 불가능한 경우</li>
              <li>천재지변, 재난 등의 사유</li>
              <li>회사의 귀책사유로 서비스 제공이 불가능한 경우</li>
            </ul>

            <h2>7. 디지털 상품 환불 정책</h2>
            <ul>
              <li>디지털 파일 다운로드 전: 100% 환불</li>
              <li>디지털 파일 다운로드 후: 환불 불가</li>
              <li>파일 오류 시: 정상 파일로 재전송 또는 전액 환불</li>
            </ul>

            <h2>8. 부분 환불</h2>
            <p>패키지 상품의 경우, 일부 서비스만 제공받은 경우 다음과 같이 부분 환불이 가능합니다:</p>
            <ul>
              <li>제공받은 서비스에 대한 금액을 차감</li>
              <li>계약서에 명시된 개별 서비스 가격 기준으로 계산</li>
              <li>할인 혜택은 제공받은 서비스에 비례하여 적용</li>
            </ul>

            <h2>9. 환불 금액 계산</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">환불 금액 = (결제 금액) - (제공받은 서비스 금액) - (위약금) - (배송비)</p>
              
              <div className="text-sm text-gray-600 mt-3">
                <p><strong>예시:</strong></p>
                <ul className="mt-2">
                  <li>결제 금액: 1,000,000원</li>
                  <li>제공받은 서비스: 0원 (촬영 전)</li>
                  <li>취소 시점: 촬영 10일 전</li>
                  <li>위약금: 0원 (14일 전 이내)</li>
                  <li><strong>환불 금액: 1,000,000원 (100%)</strong></li>
                </ul>
              </div>
            </div>

            <h2>10. 분쟁 해결</h2>
            <p>
              환불 및 교환과 관련하여 분쟁이 발생한 경우, 다음의 기관을 통해 분쟁 조정을 신청하실 수 있습니다:
            </p>
            <ul>
              <li><strong>한국소비자원:</strong> 1372 (www.kca.go.kr)</li>
              <li><strong>공정거래위원회:</strong> 1588-1919</li>
              <li><strong>전자거래분쟁조정위원회:</strong> 02-2122-2500</li>
            </ul>

            <h2>11. 고객센터</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>(주)마인드그래피 고객센터</strong></p>
              <ul>
                <li>전화: 1588-0000</li>
                <li>이메일: support@mindgraphy.com</li>
                <li>운영시간: 평일 09:00 - 18:00 (주말 및 공휴일 휴무)</li>
              </ul>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-gray-600">
                본 환불 및 교환 정책은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「소비자기본법」 등 관련 법령에 따라 작성되었습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
