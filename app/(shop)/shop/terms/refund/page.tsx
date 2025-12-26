import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">환불 정책</CardTitle>
            <p className="text-sm text-gray-600">최종 업데이트: 2025년 7월 1일</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-8">
            
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">📌 중요 안내</h3>
              <p className="text-amber-800 leading-relaxed">
                촬영 예약은 <strong>입금과 동시에 확정</strong>되며, 
                아래 약관 내용에 동의하신 것으로 간주합니다.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">첫번째. 목적</h2>
              <p className="text-gray-700 leading-relaxed">
                마인드그라피와 촬영 및 사진, 영상물 제작을 의뢰한 고객과의 
                권리와 의무를 명확히 규정함에 그 목적이 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">두번째. 환불에 관련한 내용</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">A. 상호 협의</h3>
                  <p className="text-gray-700">
                    마인드그라피와 의뢰인의 상호 협의하에 청약 철회 및 환불이 가능합니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">B. 사전 준비 비용</h3>
                  <p className="text-gray-700">
                    섭외, 대여, 답사 미팅 등 사전 준비 도중 청약 철회 시, 
                    해당 비용을 공제한 금액이 환불 가능합니다.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">C. 촬영 착수 후</h3>
                  <p className="text-red-800">
                    <strong>촬영 또는 편집 작업 착수 이후 청약 철회시, 환불이 불가능합니다.</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">환불 가이드라인</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">1. 고객 요청으로 촬영 취소 시 위약금</h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>촬영일로부터 1개월 이내: <strong>50만원</strong></li>
                      <li>촬영일로부터 1개월~2개월 사이: <strong>30만원</strong></li>
                      <li>촬영일로부터 2개월~3개월 사이: <strong>15만원</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">2. 상품 구성 감소 시 위약금</h4>
                    <p className="text-blue-800 mb-2">
                      계약 이후 상품 구성이 줄어드는 경우 감소폭에 대한 위약금 발생:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-blue-800">
                      <li>촬영일로부터 1개월 이내: 감소폭의 <strong>50%</strong></li>
                      <li>촬영일로부터 1개월~2개월 사이: 감소폭의 <strong>40%</strong></li>
                      <li>촬영일로부터 2개월~3개월 사이: 감소폭의 <strong>30%</strong></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">3. 계약금 환불 불가</h4>
                    <p className="text-blue-800">
                      계약금은 계약일로부터 <strong>14일 경과 후</strong>에는 
                      고객 요청으로 촬영이 이루어지지 않더라도, 
                      청약철회와 같기 때문에 <strong>환불되지 않습니다</strong>.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">4. 계약금 환불 가능 경우</h4>
                    <p className="text-blue-800">
                      계약금 환불은 (세번째 기타 내용의 F, G 항목)에 해당하는 경우에만 가능합니다.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">5. 예외 조항</h4>
                    <p className="text-green-800">
                      <strong>계약일로부터 14일 이내</strong>인 경우만, 
                      계약금 환불이 <strong>100% 가능</strong>합니다.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border border-blue-300">
                  <h4 className="font-semibold text-gray-900 mb-2">환불 계산 예시</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>계약금 30만원 납입 후 촬영일로부터 1개월 이내 취소 시:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>계약금: 환불 불가 (30만원)</li>
                      <li>위약금: 50만원</li>
                      <li><strong className="text-red-600">총 납부 금액: 80만원</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">세번째. 기타 내용</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">A. 계약 효력 발생</h3>
                  <p className="text-gray-700">
                    마인드그라피의 계약은 <strong>계약금 입금과 함께</strong> 모든 규정의 효력이 발생합니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">B. 계약금 기준</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>본식 상품: <strong>30만원</strong></li>
                    <li>그 외 촬영 (세미웨딩 등): <strong>15만원</strong></li>
                    <li>계약금이 상품가보다 높은 경우: 전액 입금이 계약금</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">C. 잔금 결제</h3>
                  <p className="text-gray-700">
                    잔금은 계약금을 제외한 나머지 촬영비이며, 
                    <strong> 촬영 7일 전</strong>에 결제해주시면 됩니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">D. 원본 보관 기간</h3>
                  <p className="text-gray-700">
                    원본의 보관 기간은 촬영 상품이 모두 전달된 후 <strong>30일</strong>입니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">E. 콘텐츠 업로드</h3>
                  <p className="text-gray-700">
                    촬영된 콘텐츠는 마인드그라피의 인스타그램, 블로그, 또는 홈페이지에 업로드될 수 있습니다. 
                    이 내용은 마인드그라피와 상의 및 조율할 수 있습니다.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">F. 회사 귀책사유</h3>
                  <p className="text-red-800">
                    마인드그라피가 <strong>고의 또는 단순 이유로 촬영을 전혀 이행하지 못한 경우</strong>, 
                    마인드그라피는 고객으로부터 수령한 금액을 기준으로 <strong>2배의 금액을 배상</strong>합니다.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">G. 불가항력 사유</h3>
                  <p className="text-blue-800">
                    전쟁, 지진, 폭동과 같은 <strong>불가항력적인 사유</strong>로 인해 
                    마인드그라피가 촬영을 이행하지 못한 경우에는 
                    고객으로부터 수령한 <strong>금액 전액을 환불</strong>해드립니다.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">촬영 및 결과물 제작 순서</h2>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1.</strong> 촬영 예약 - 금액 결제</li>
                <li><strong>2.</strong> 사전 미팅 (촬영 2-3주 전, 전화/직접미팅/서면)</li>
                <li><strong>3.</strong> 잔금 결제 (촬영 7일 전)</li>
                <li><strong>4.</strong> 촬영 진행</li>
                <li><strong>5.</strong> 전체 원본 전달 (본식: 35일, 평일촬영: 7일)</li>
                <li><strong>6.</strong> 고객 셀렉 (전달일로부터 1년 이내)</li>
                <li><strong>7.</strong> 세부 보정 및 앨범 시안 (셀렉일로부터 50일)</li>
                <li><strong>8.</strong> 시안 컨펌</li>
                <li><strong>9.</strong> 앨범 제작 (35일)</li>
                <li><strong>10.</strong> 상품 수령 (택배 무료배송)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">셀렉 기한 및 추가 비용</h2>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 leading-relaxed">
                  <strong>셀렉 기한:</strong> 전체 원본 전달 날짜로부터 <strong>1년</strong><br/>
                  원본 발송된 날짜로부터 1년이 지난 뒤에 앨범 및 보정 작업을 원하실 경우 
                  <strong>금액이 추가 발생</strong>됩니다.
                </p>
              </div>
            </section>

            <section className="pt-6 border-t-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">고객센터</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>전화:</strong> 02-2202-9966</p>
                <p><strong>이메일:</strong> mindgraphy@daum.net</p>
                <p><strong>카카오 채널:</strong> <a href="http://pf.kakao.com/_xfxcxfxaK" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">http://pf.kakao.com/_xfxcxfxaK</a></p>
                <p><strong>1상담팀:</strong> 카카오ID: mind.channel</p>
                <p><strong>2진행팀:</strong> 카카오ID: mind.system</p>
              </div>
            </section>

            <div className="mt-8 pt-8 border-t-2">
              <p className="text-sm text-gray-600 leading-relaxed">
                촬영을 준비하시는 과정에서 궁금하신 부분이나 변동사항이 있으실 경우 
                언제든 연락 부탁드립니다. 감사합니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
