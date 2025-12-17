'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { optionProducts } from '@/lib/mock/settings'
import { Users, UserCheck, ChevronDown } from 'lucide-react'
import { ProgressIndicator, PROGRESS_STEPS } from '@/components/client/progress-indicator'

export default function OptionsPage() {
  const router = useRouter()
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isPhotographerInfoOpen, setIsPhotographerInfoOpen] = useState(false)
  const [isAssignmentInfoOpen, setIsAssignmentInfoOpen] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
  }, [])

  const handlePortfolio = () => {
    router.push('/c/portfolio')
  }

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
      
      // Scroll to the clicked option to bring it to the top
      setTimeout(() => {
        optionRefs.current[optionId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
      
      return newSelection
    })
  }

  // Only show active options
  const activeOptions = optionProducts.filter(opt => opt.isActive)

  const calculateTotal = () => {
    return selectedOptions.reduce((total, optionId) => {
      const option = activeOptions.find(opt => opt.id === optionId)
      return total + (option?.basePrice || 0)
    }, 0)
  }
  
  // Get selected option details
  const selectedOptionDetails = selectedOptions.map(id => 
    activeOptions.find(opt => opt.id === id)
  ).filter(Boolean)

  const handleNext = () => {
    setIsAnimating(true)
    
    // Store the selections
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_options', JSON.stringify(selectedOptions))
    }
    
    // Navigate to venue info input
    setTimeout(() => {
      router.push('/c/venue-info')
    }, 200)
  }

  const handleSkip = () => {
    setIsAnimating(true)
    
    // Clear any previously selected options
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_options', JSON.stringify([]))
    }
    
    // Navigate to venue info input
    setTimeout(() => {
      router.push('/c/venue-info')
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/packages')
    }, 200)
  }

  const formatPrice = (price: number) => {
    return '+' + price.toLocaleString('ko-KR') + '원'
  }

  return (
    <div className="min-h-screen bg-white flex items-start justify-center p-4 py-8">
      <div 
        className={cn(
          "max-w-md w-full space-y-8 transition-all duration-700 ease-out",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8",
          isAnimating && "opacity-0 -translate-y-8"
        )}
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            추가 옵션을
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            선택해 주세요
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed pt-2">
            필요한 옵션을 자유롭게 선택하실 수 있습니다<br />
            선택하지 않으셔도 됩니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Info Cards - 1인/2인 촬영 */}
        <div className="space-y-4">
          <Card
            className={cn(
              "overflow-hidden transition-all duration-300 cursor-pointer border-2",
              isPhotographerInfoOpen 
                ? "border-zinc-900 shadow-md" 
                : "border-zinc-200 hover:border-zinc-300"
            )}
            onClick={() => setIsPhotographerInfoOpen(!isPhotographerInfoOpen)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isPhotographerInfoOpen 
                      ? "bg-zinc-900 text-white" 
                      : "bg-zinc-100 text-zinc-600"
                  )}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-zinc-900">
                      1인 촬영과 2인 촬영
                    </h3>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0",
                  isPhotographerInfoOpen && "rotate-180"
                )} />
              </div>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isPhotographerInfoOpen 
                  ? "grid-rows-[1fr] opacity-100 mt-4" 
                  : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="pt-4 border-t border-zinc-200">
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
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 작가 배정 정보 */}
          <Card
            className={cn(
              "overflow-hidden transition-all duration-300 cursor-pointer border-2",
              isAssignmentInfoOpen 
                ? "border-zinc-900 shadow-md" 
                : "border-zinc-200 hover:border-zinc-300"
            )}
            onClick={() => setIsAssignmentInfoOpen(!isAssignmentInfoOpen)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                    isAssignmentInfoOpen 
                      ? "bg-zinc-900 text-white" 
                      : "bg-zinc-100 text-zinc-600"
                  )}>
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-zinc-900">
                      작가 배정 안내
                    </h3>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0",
                  isAssignmentInfoOpen && "rotate-180"
                )} />
              </div>

              <div className={cn(
                "grid transition-all duration-300 ease-in-out",
                isAssignmentInfoOpen 
                  ? "grid-rows-[1fr] opacity-100 mt-4" 
                  : "grid-rows-[0fr] opacity-0"
              )}>
                <div className="overflow-hidden">
                  <div className="pt-4 border-t border-zinc-200">
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
                          체계적인 프로세스입니다.
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

        {/* Options Selection */}
        <div className="space-y-3">
          {activeOptions.map((option) => (
            <button
              key={option.id}
              ref={(el) => { optionRefs.current[option.id] = el }}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "w-full p-5 text-left border-2 transition-all duration-300",
                "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                "active:scale-[0.99]",
                selectedOptions.includes(option.id)
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-200 bg-white"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <h3 className="text-base font-medium text-zinc-900">
                    {option.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {option.description.join(' • ')}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900 pt-1">
                    {formatPrice(option.basePrice)}
                  </p>
                </div>
                <div className={cn(
                  "h-5 w-5 border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selectedOptions.includes(option.id)
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-300"
                )}>
                  {selectedOptions.includes(option.id) && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-zinc-400 leading-relaxed">
            옵션을 선택하지 않고 다음으로 진행하실 수도 있습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Selected Options Summary */}
        <div ref={summaryRef}>
          {selectedOptionDetails.length > 0 && (
            <div className="p-6 bg-zinc-50 border border-zinc-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                <p className="text-sm font-medium text-zinc-900">
                  선택한 옵션
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedOptionDetails.length}개
                </p>
              </div>
              
              <div className="space-y-2">
                {selectedOptionDetails.map((option: any) => (
                  <div key={option.id} className="flex items-center justify-between py-1.5">
                    <p className="text-xs text-zinc-700">
                      {option.title}
                    </p>
                    <p className="text-xs font-semibold text-zinc-900">
                      {formatPrice(option.basePrice)}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-900">
                  옵션 총액
                </p>
                <p className="text-lg font-bold text-zinc-900">
                  {formatPrice(calculateTotal())}
                </p>
              </div>
              
              <p className="text-xs text-zinc-500 text-center pt-2">
                패키지 금액에 추가되는 비용입니다
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={selectedOptions.length > 0 ? handleNext : handleSkip}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "active:scale-[0.98]",
              "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            )}
          >
            {selectedOptions.length > 0 ? '다음' : '옵션 없이 진행'}
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
            옵션은 나중에 추가하거나 변경하실 수 있습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

      </div>
    </div>
  )
}
