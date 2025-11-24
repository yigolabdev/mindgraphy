'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronDown, ArrowLeft, Users, Image, UserCheck, HelpCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FAQItem {
  id: string
  question: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function FAQPage() {
  const router = useRouter()
  const [openId, setOpenId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useState(() => {
    setTimeout(() => setIsMounted(true), 100)
  })

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      question: '1인 촬영과 2인 촬영, 어떤 차이가 있나요?',
      icon: <Users className="h-5 w-5" />,
      content: (
        <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
          <div className="bg-zinc-50 border-l-4 border-zinc-900 p-4 rounded">
            <p className="font-semibold text-zinc-900 mb-2">추천 상품</p>
            <p className="text-zinc-700">
              결혼식 촬영은 행사 촬영의 특성상, 동시에 여러 중요한 순간이 발생합니다.
              따라서 포토그래퍼로서 <strong>2인 촬영을 추천</strong>드립니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">공통 촬영 내용 (1인/2인 모두 동일)</h4>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>기념사진 (선원판)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>예식 전체 과정 (입장 ~ 행진)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>원판사진 (가족 단체사진)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>연회장 인사 사진</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>연출 사진 (신랑·신부 기념사진)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">2인 촬영만의 장점</h4>
            <div className="space-y-4">
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <p className="font-medium text-zinc-900 mb-2">1. 동시 다발적 촬영</p>
                <p className="text-zinc-600 text-sm">
                  하객맞이 시간에 한 분은 신부 대기실에서, 다른 한 분은 로비 접수대 주변에서
                  신랑님과 혼주님 하객맞이를 동시에 촬영합니다.
                </p>
              </div>
              
              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <p className="font-medium text-zinc-900 mb-2">2. 다양한 각도와 시각</p>
                <p className="text-zinc-600 text-sm">
                  입장, 행진, 연출 등 중요한 순간을 같은 곳을 다른 각도와 시각으로 담아
                  더욱 풍성한 앨범을 만들 수 있습니다.
                </p>
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
                <p className="font-medium text-zinc-900 mb-2">3. 놓치지 않는 순간들</p>
                <p className="text-zinc-600 text-sm">
                  여러 장소에서 동시에 일어나는 소중한 순간들을 빠짐없이 담을 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq-2',
      question: '웹 갤러리가 무엇인가요?',
      icon: <Image className="h-5 w-5" />,
      content: (
        <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
          <div className="bg-zinc-50 border-l-4 border-zinc-900 p-4 rounded">
            <p className="font-semibold text-zinc-900 mb-2">웹 갤러리란?</p>
            <p className="text-zinc-700">
              몇천 장이 넘는 전체 원본 사진에서 마인드그라피 작가들이 
              <strong> 50장 내외로 사진을 선택</strong>해서 
              이야기를 재구성한 <strong>그림책 같은 컬렉션</strong>입니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">주요 특징</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-zinc-900 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">언제 어디서나 접속 가능</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    웹으로 PC, 태블릿, 스마트폰 등 어디서든 접속해서 감상할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-zinc-900 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">간편한 공유</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    가족, 친구들에게 링크만 공유하면 함께 사진을 감상할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-zinc-900 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">사진 선택 가이드</p>
                  <p className="text-zinc-600 text-sm mt-1">
                    직접 사진을 선택하실 때 작가가 추천하는 사진들을 미리 확인하고
                    가이드라인으로 활용하실 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-200">
            <p className="text-sm text-zinc-900">
              <strong>웹 갤러리는 작가의 시선으로 선별한 하이라이트</strong>입니다.
              전체 원본 중에서 이야기의 흐름과 감성을 가장 잘 담아낸 사진들로 구성됩니다.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'faq-3',
      question: '작가 배정은 어떻게 이루어지나요?',
      icon: <UserCheck className="h-5 w-5" />,
      content: (
        <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
          <div className="bg-zinc-50 border-l-4 border-zinc-900 p-4 rounded">
            <p className="font-semibold text-zinc-900 mb-2">맞춤형 배정 시스템</p>
            <p className="text-zinc-700">
              마인드그라피는 <strong>무작위 랜덤 배정이 아닌</strong>,
              여러 상황을 종합적으로 고려한 <strong>맞춤형 배정 시스템</strong>을 운영하고 있습니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">배정 프로세스</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 mb-1">사전 미팅</p>
                  <p className="text-zinc-600 text-sm">
                    두 분의 선호 스타일, 촬영 분위기, 특별한 요청사항 등을 
                    자세히 파악합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 mb-1">작가 매칭</p>
                  <p className="text-zinc-600 text-sm">
                    사전 미팅 내용을 바탕으로 두 분께 가장 적합한 작가님을 
                    신중하게 선정합니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium text-zinc-900 mb-1">대표 직접 관리</p>
                  <p className="text-zinc-600 text-sm">
                    모든 작가 배정 과정은 마인드그라피 대표님께서 
                    직접 진행하고 관리합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">고려 사항</h4>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>두 분의 선호 촬영 스타일</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>예식 일정 및 장소</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>작가의 전문 분야 및 강점</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 mt-1">•</span>
                <span>특별 요청사항 및 예식 특성</span>
              </li>
            </ul>
          </div>

          <div className="bg-zinc-900 text-white p-4 rounded-lg">
            <p className="text-sm">
              고객님 시각에서 랜덤처럼 보일 수 있지만,
              실제로는 <strong>두 분께 최적화된 작가님을 매칭</strong>하기 위한
              세심한 과정을 거치고 있습니다.
            </p>
          </div>
        </div>
      )
    }
  ]

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className={cn(
        "max-w-3xl mx-auto px-4 py-12 space-y-8 transition-all duration-700 ease-out",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Header */}
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-2 text-zinc-600 hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
          
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-light text-zinc-900 tracking-tight">
              자주 묻는 질문
            </h1>
            <p className="text-sm text-zinc-600 max-w-md mx-auto">
              고객님들께서 자주 궁금해하시는 내용을 정리했습니다
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-200"></div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card
              key={faq.id}
              className={cn(
                "overflow-hidden transition-all duration-300 border",
                openId === faq.id 
                  ? "shadow-md border-zinc-900" 
                  : "border-zinc-200 hover:border-zinc-300"
              )}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors",
                    openId === faq.id 
                      ? "bg-zinc-900 text-white" 
                      : "bg-zinc-100 text-zinc-600"
                  )}>
                    {faq.icon}
                  </div>
                  <h3 className="text-base font-medium text-zinc-900">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0",
                  openId === faq.id && "rotate-180"
                )} />
              </button>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                openId === faq.id 
                  ? "grid-rows-[1fr] opacity-100" 
                  : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2">
                    <div className="border-t border-zinc-200 pt-6">
                      {faq.content}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="border-t border-zinc-200 pt-8">
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 text-center space-y-3">
            <p className="text-sm font-medium text-zinc-900">
              더 궁금하신 내용이 있으신가요?
            </p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              언제든지 전화 또는 카카오톡으로 문의해 주시면<br />
              친절하게 안내해 드리겠습니다
            </p>
          </div>
        </div>

        {/* Bottom Back Button */}
        <div className="pt-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>
        </div>
      </div>
    </div>
  )
}

