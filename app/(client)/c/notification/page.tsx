'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Phone, Mail, MessageSquare, Copy, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function NotificationPage() {
  const router = useRouter()
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(label)
    toast.success(`${label} 복사되었습니다`)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로가기
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-zinc-900">
              공지사항 및 촬영 약관
            </h1>
            <p className="text-zinc-600">
              항상 확인하실 수 있도록, 알리는 내용입니다.
            </p>
            <Badge variant="outline" className="text-xs">
              update. 2025.07.01
            </Badge>
          </div>
        </div>

        {/* Contact Section */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="text-center text-xl">촬영 예약 및 문의</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2 text-sm text-zinc-700">
              <p>• 1:1 채팅으로 부탁드립니다</p>
              <p>• 시간기준 순차적으로 상담이 진행됩니다</p>
              <p>• 카카오 채널로 연결됩니다</p>
            </div>

            <Button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-zinc-900 font-semibold"
              onClick={() => window.open('http://pf.kakao.com/_xfxcxfxaK', '_blank', 'noopener,noreferrer')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              카카오톡 상담하기
            </Button>

            <div className="grid grid-cols-1 gap-3 pt-4 border-t">
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-zinc-600" />
                  <span className="text-sm font-medium">전화</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">02-2202-9966</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy('02-2202-9966', '전화번호가')}
                  >
                    {copiedItem === '전화번호가' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-zinc-600" />
                  <span className="text-sm font-medium">이메일</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">mindgraphy@daum.net</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy('mindgraphy@daum.net', '이메일이')}
                  >
                    {copiedItem === '이메일이' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-zinc-600" />
                  <span className="text-sm font-medium">상담팀</span>
                </div>
                <span className="text-sm font-mono">mind.channel</span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-zinc-600" />
                  <span className="text-sm font-medium">진행팀</span>
                </div>
                <span className="text-sm font-mono">mind.system</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-6 border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-semibold text-red-900">
                촬영 예약은 입금과 동시에 확정되며
              </p>
              <p className="text-sm font-semibold text-red-900">
                아래 약관 내용에 동의하신 것으로 간주합니다.
              </p>
              <p className="text-xs text-zinc-600 pt-2 border-t">
                서면 계약서의 형식이 필요하신 고객님들께서는 상담시 말씀 부탁드립니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Terms Accordion */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>촬영 약관</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="purpose">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">첫번째. 목적</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-700 leading-relaxed">
                  마인드그라피와 촬영 및 사진, 영상물 제작을 의뢰한 고객과의 권리와 의무를 명확히 규정함에 그 목적이 있습니다.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">두번째. 환불에 관련한 내용</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2 text-sm text-zinc-700">
                    <p><strong>A.</strong> 마인드그라피와 의뢰인의 상호 협의하에 청약 철회 및 환불이 가능합니다.</p>
                    <p><strong>B.</strong> 섭외, 대여, 답사 미팅 등 사전 준비 도중 청약 철회 시, 해당 비용을 공제한 금액이 환불 가능합니다.</p>
                    <p><strong>C.</strong> 촬영 또는 편집 작업 착수 이후 청약 철회시, 환불이 불가능합니다.</p>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-lg border space-y-3">
                    <p className="font-semibold text-sm text-zinc-900">환불 가이드라인</p>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold text-zinc-800">1. 촬영 취소 시 위약금</p>
                        <ul className="ml-4 mt-1 space-y-1 text-zinc-700">
                          <li>• 촬영일로부터 1개월 이내: <strong>50만원</strong></li>
                          <li>• 촬영일로부터 1~2개월: <strong>30만원</strong></li>
                          <li>• 촬영일로부터 2~3개월: <strong>15만원</strong></li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-800">2. 상품구성 축소 시 위약금</p>
                        <ul className="ml-4 mt-1 space-y-1 text-zinc-700">
                          <li>• 촬영일로부터 1개월 이내: 감소폭의 <strong>50%</strong></li>
                          <li>• 촬영일로부터 1~2개월: 감소폭의 <strong>40%</strong></li>
                          <li>• 촬영일로부터 2~3개월: 감소폭의 <strong>30%</strong></li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-800">3. 계약금 환불 불가 기준</p>
                        <p className="ml-4 mt-1 text-zinc-700">
                          계약일로부터 14일 경과 후에는 고객의 요청으로 촬영이 이루어지지 않더라도 환불되지 않습니다.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-800">4. 계약금 환불 가능 조건</p>
                        <p className="ml-4 mt-1 text-zinc-700">
                          기타 내용의 F, G 항목에 해당하는 경우에만 환불이 진행됩니다.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-zinc-800">5. 예외 조항</p>
                        <p className="ml-4 mt-1 text-zinc-700">
                          계약일로부터 14일 이내인 경우만 계약금 100% 환불이 가능합니다.
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mt-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">예시</p>
                      <p className="text-xs text-yellow-800">
                        계약금 30만원 납입 후 촬영일자로부터 1개월 이내 취소 시, 계약금은 환불되지 않으며 위약금 50만원이 발생하기 때문에 총 80만원이 납부됩니다.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="other">
                <AccordionTrigger className="text-left">
                  <span className="font-semibold">세번째. 기타 내용</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm text-zinc-700">
                  <p><strong>A.</strong> 마인드그라피의 계약은 계약금 입금과 함께 모든 규정의 효력이 발생합니다.</p>
                  
                  <p><strong>B.</strong> 계약금은 본식 상품의 경우 30만원, 그 외 촬영(세미웨딩 등)은 15만원으로 합니다. 정해진 계약금이 상품가보다 높은 경우 전액 입금이 계약금이 됩니다.</p>
                  
                  <p><strong>C.</strong> 잔금은 계약금을 제외한 나머지 촬영비이며, 촬영이 진행되기 7일 전에 결제해주시면 됩니다.</p>
                  
                  <p><strong>D.</strong> 원본의 보관 기간은 촬영 상품이 모두 전달된 후 30일입니다.</p>
                  
                  <p><strong>E.</strong> 촬영된 컨텐츠는 마인드그라피의 인스타그램, 블로그, 또는 홈페이지에 업로드될 수 있습니다. 또한, 이 내용에 관련해서 마인드그라피와 상의 및 조율할 수 있습니다.</p>
                  
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <p><strong>F.</strong> 마인드그라피가 고의 또는 단순 이유로 촬영을 전혀 이행하지 못한 경우 마인드그라피는 고객으로부터 수령한 금액을 기준으로 <strong className="text-blue-900">2배의 금액을 배상</strong>합니다.</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <p><strong>G.</strong> 전쟁, 지진, 폭동과 같은 불가항력적인 사유로 인해 마인드그라피가 촬영을 이행하지 못한 경우에는 마인드그라피는 고객으로부터 수령한 금액 <strong className="text-blue-900">전액을 환불</strong>해드립니다.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Process Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>계약 후 촬영 및 결과물 제작 순서</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger>
                  <span className="font-semibold">1. 촬영 예약</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 금액 결제와 동시에 촬영 예약이 확정됩니다.</p>
                  <p>• 계약금 입금과 동시에 촬영 약관에 동의해주시는 내용으로 간주됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step2">
                <AccordionTrigger>
                  <span className="font-semibold">2. 사전미팅 및 잔금결제</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 촬영 진행 2~3주일 전 즈음 사전미팅을 진행합니다.</p>
                  <p>• 미팅 방법: <strong>전화통화, 직접미팅, 서면으로 진행</strong> 중 선택</p>
                  <p>• 촬영 진행 7일 전까지 잔금을 결제해주시면 촬영이 진행됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step3">
                <AccordionTrigger>
                  <span className="font-semibold">3. 촬영 당일</span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-700">
                  <p>편안한 마음으로 촬영 일정을 따라가시면 됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step4">
                <AccordionTrigger>
                  <span className="font-semibold">4. 전체 원본 전달</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 text-sm">
                  <div className="bg-zinc-50 p-3 rounded border space-y-2">
                    <p className="font-semibold text-zinc-900">전달 기간</p>
                    <ul className="space-y-1 text-zinc-700">
                      <li>• 본식 스냅: 촬영일로부터 <strong>35일 (5주)</strong> 내외</li>
                      <li>• 평일 촬영 (한복, 캐주얼): 촬영일로부터 <strong>7일 (1주)</strong> 내외</li>
                      <li>• 가봉 스냅: 촬영일로부터 <strong>7일 (1주)</strong> 내외</li>
                      <li>• 돌잔치 행사: 촬영일로부터 <strong>21일 (3주)</strong> 내외</li>
                    </ul>
                  </div>
                  <p className="text-zinc-700">• 전체 원본 제공</p>
                  <p className="text-zinc-700">• 본식 촬영의 경우: 전체 원본 + 셀렉이 수월하도록 추려진 셀렉 원본 제공</p>
                  <p className="text-zinc-700">• 세미웨딩 촬영의 경우: 전체 원본 + 안내문만 제공</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step5">
                <AccordionTrigger>
                  <span className="font-semibold">5. 고객셀렉</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 셀렉 기한: <strong className="text-red-600">전체 원본 전달 날짜로부터 1년</strong></p>
                  <p>• 고객님께서 직접 사진을 선택해주시는 방법으로 진행합니다.</p>
                  <p>• 셀렉 방법은 전체 원본 메일 안에 상세히 설명된 안내문이 첨부됩니다.</p>
                  <p className="text-red-600 font-semibold">• 원본 발송 날짜로부터 1년 경과 후 앨범 및 보정 작업 진행 시 금액이 추가 발생합니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step6">
                <AccordionTrigger>
                  <span className="font-semibold">6. 세부보정작업 및 앨범 시안 작업</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 작업 기간: 셀렉일로부터 <strong>50일 (약 7주)</strong> 내외</p>
                  <p>• 선택된 사진을 세부 수정하여 링크 형태로 전달</p>
                  <p>• 본식 촬영의 경우: 앨범 형태로 된 사진파일 (앨범시안) 제공</p>
                  <p>• 셀렉 날짜를 기준으로 작업 기간이 결정됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step7">
                <AccordionTrigger>
                  <span className="font-semibold">7. 시안 컨펌</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 세부 수정이 완료된 시안으로 고객님께 컨펌 과정을 거칩니다.</p>
                  <p>• 예식 촬영: 앨범 레이아웃과 최종본의 리터칭 확인</p>
                  <p>• 사진의 세부 수정 재작업 또는 앨범 레이아웃이 확정되면 앨범 제작 공정으로 진행됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step8">
                <AccordionTrigger>
                  <span className="font-semibold">8. 앨범 제작 공정</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 제작 기간: <strong>35일 (약 5주)</strong> 내외</p>
                  <p>• 앨범 레이아웃 확정 후 제작 공정 진행</p>
                  <p>• 앨범 제작 완료 후 택배 (배송비 무료)로 배송됩니다.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step9">
                <AccordionTrigger>
                  <span className="font-semibold">9. 상품 수령</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm text-zinc-700">
                  <p>• 국내: 택배 <strong>(배송비 무료)</strong></p>
                  <p>• 해외: EMS <strong>(배송비 유료)</strong></p>
                  <p>• 배송 기간은 택배사의 사정에 따라 변동될 수 있습니다.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
          <CardHeader>
            <CardTitle className="text-white text-center">촬영과 상품 제작 순서 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              {[
                '촬영 예약',
                '금액 결제',
                '사전 미팅',
                '촬영 진행',
                '전체원본 수령',
                '고객셀렉',
                '셀렉파일 회신',
                '세부수정 진행',
                '고객컨펌',
                '앨범제작',
                '앨범수령'
              ].map((step, index, array) => (
                <div key={step} className="flex items-center">
                  <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
                    {step}
                  </Badge>
                  {index < array.length - 1 && (
                    <span className="mx-1 text-white/50">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center text-sm text-zinc-600 space-y-2 pb-8">
          <p>준비하시는 과정에서,</p>
          <p>궁금하신 부분이나 변동사항이 있으실 경우</p>
          <p>언제든 연락 부탁드립니다.</p>
          <p className="font-semibold text-zinc-900 pt-2">감사합니다.</p>
        </div>
      </div>
    </div>
  )
}

