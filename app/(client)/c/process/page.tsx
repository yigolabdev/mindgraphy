'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronDown, Image, FileText } from 'lucide-react'

export default function ProcessPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isWebGalleryOpen, setIsWebGalleryOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handlePortfolio = () => {
    router.push('/c/portfolio')
  }

  const handleNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/packages')
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.back()
    }, 200)
  }

  const processSteps = [
    {
      title: '사전미팅',
      description: '모든 촬영에 대해서 사전미팅을 진행해드리고 있습니다'
    },
    {
      title: '촬영',
      description: '한 순간도 놓치지 않으려 최선을 다합니다'
    },
    {
      title: '백업',
      description: '물리적인 공간과 클라우드 공간에 세번 같은 데이터를 보관하여, 데이터의 안정성을 추구합니다'
    },
    {
      title: '고객셀렉',
      description: '고객님께서 쉽게 셀렉하실 수 있도록. 전체원본과 웹갤러리를 제공합니다.'
    },
    {
      title: '리터칭',
      description: '색감과 세부수정은 대표작가 주관하에 진행됩니다'
    },
    {
      title: '컨펌',
      description: '모든 과정에서 고객님의 동의를 받아 진행합니다'
    },
    {
      title: '배송',
      description: '촬영과 사전미팅을 제외한 모든 과정은 비대면으로 진행합니다'
    }
  ]

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "max-w-md w-full space-y-12 transition-all duration-700 ease-out",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8",
          isAnimating && "opacity-0 -translate-y-8"
        )}
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-zinc-900 tracking-[0.3em] leading-relaxed">
            process
          </h1>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Content */}
        <div className="space-y-8">
          {processSteps.map((step, index) => (
            <div key={index} className="space-y-3 text-center">
              <h3 className="text-base font-medium text-zinc-900">
                {step.title}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Web Gallery Section */}
        <div className="space-y-4">
          <Card
            className={cn(
              "overflow-hidden transition-all duration-300 cursor-pointer border-2",
              isWebGalleryOpen 
                ? "border-zinc-900 shadow-md" 
                : "border-zinc-200 hover:border-zinc-300"
            )}
            onClick={() => setIsWebGalleryOpen(!isWebGalleryOpen)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isWebGalleryOpen 
                      ? "bg-zinc-900 text-white" 
                      : "bg-zinc-100 text-zinc-600"
                  )}>
                    <Image className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-zinc-900">
                      우리는 웹갤러리를 제공합니다
                    </h3>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0",
                  isWebGalleryOpen && "rotate-180"
                )} />
              </div>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isWebGalleryOpen 
                  ? "grid-rows-[1fr] opacity-100 mt-4" 
                  : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="pt-4 border-t border-zinc-200">
                    <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
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
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* 촬영 약관 및 안내 버튼 */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/c/notification')}
            className="h-12 px-5 gap-2.5 text-sm font-medium border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 active:scale-[0.98] transition-all"
          >
            <FileText className="h-5 w-5" />
            촬영 약관 및 안내
          </Button>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "active:scale-[0.98]",
              "shadow-md hover:shadow-lg"
            )}
          >
            다음
          </Button>

          <button
            onClick={handleBack}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-200",
              "text-zinc-600 hover:text-zinc-900",
              "active:scale-[0.98]"
            )}
          >
            이전
          </button>

          <p className="text-xs text-center text-zinc-400 leading-relaxed">
            체계적인 프로세스로 완벽한 결과를 만듭니다
          </p>
        </div>
      </div>
    </div>
  )
}
