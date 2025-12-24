import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">자주 묻는 질문</CardTitle>
            <p className="text-sm text-gray-600">고객님들이 자주 문의하시는 내용을 모았습니다</p>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* 주문/결제 */}
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  결제는 어떤 방법으로 할 수 있나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    신용카드, 계좌이체, 가상계좌, 휴대폰 결제 등 다양한 결제 수단을 지원합니다.
                    모든 결제는 안전한 전자결제 시스템을 통해 처리되며, 에스크로 서비스로 보호됩니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  무이자 할부가 가능한가요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    카드사별로 무이자 할부 혜택이 제공됩니다. 결제 시 선택하신 카드의 무이자 할부 
                    개월 수를 확인하실 수 있으며, 카드사 정책에 따라 상이할 수 있습니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  주문 후 언제 확인 연락이 오나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    결제 완료 후 1-2영업일 이내에 담당자가 연락드립니다. 
                    촬영 일정 조율 및 세부 사항을 논의하게 됩니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 촬영 관련 */}
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  촬영 일정을 변경할 수 있나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    촬영 7일 전까지는 무료로 변경 가능합니다 (최대 2회).
                    3-7일 전 변경 시 수수료 50%가 부과되며, 3일 이내는 변경이 불가능합니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  비 오는 날에도 촬영이 가능한가요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    야외 촬영의 경우 기상 악화 시 일정을 조정할 수 있습니다. 
                    태풍, 폭우 등 불가항력적인 경우 전액 환불 또는 일정 재조정이 가능합니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  촬영 시간은 얼마나 걸리나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    패키지에 따라 다르지만, 일반적으로 본식 촬영은 3-4시간, 
                    스냅 촬영은 2시간 정도 소요됩니다. 자세한 시간은 상품 상세 페이지를 참고해주세요.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 결과물 */}
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left">
                  사진은 언제 받을 수 있나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    촬영 후 2-3주 이내에 보정된 사진을 온라인으로 전달해드립니다.
                    앨범 제작이 포함된 경우 추가로 2-3주가 소요될 수 있습니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger className="text-left">
                  원본 사진도 받을 수 있나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    네, 대부분의 패키지에 원본 파일이 포함되어 있습니다. 
                    보정된 사진과 함께 전체 원본 파일을 다운로드 링크로 제공해드립니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-left">
                  사진을 추가로 구매할 수 있나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    네, 추가 보정 사진이 필요하신 경우 10장 단위로 구매하실 수 있습니다.
                    '디지털 파일 추가 구매' 상품을 이용해주세요.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 환불/취소 */}
              <AccordionItem value="item-10">
                <AccordionTrigger className="text-left">
                  환불은 어떻게 하나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    촬영 14일 전까지는 100% 환불 가능합니다.
                    7-14일 전 50%, 7일 이내는 환불이 불가능합니다.
                    촬영이 진행된 후에는 환불이 불가능합니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger className="text-left">
                  부분 환불도 가능한가요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    패키지 상품의 경우 일부 서비스만 제공받은 경우 부분 환불이 가능합니다.
                    제공받은 서비스 금액을 차감하고 환불해드립니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              {/* 기타 */}
              <AccordionItem value="item-12">
                <AccordionTrigger className="text-left">
                  주차는 어떻게 하나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    스튜디오 촬영의 경우 무료 주차가 가능합니다.
                    야외 촬영은 장소에 따라 다르며, 사전 안내를 드립니다.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-13">
                <AccordionTrigger className="text-left">
                  헤어/메이크업도 포함되나요?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    기본 촬영 패키지에는 헤어/메이크업이 포함되어 있지 않습니다.
                    필요하신 경우 별도 옵션으로 추가하실 수 있습니다.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-8 pt-8 border-t">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">추가 문의가 있으신가요?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  위 내용으로 해결되지 않은 궁금한 점이 있으시다면 고객센터로 문의해주세요.
                </p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-blue-700">전화</p>
                    <p className="font-bold text-blue-900">1588-0000</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700">이메일</p>
                    <p className="font-bold text-blue-900">support@mindgraphy.com</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
