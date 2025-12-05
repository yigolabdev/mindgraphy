'use client'

/**
 * 추가 옵션 선택 페이지 (리팩토링)
 * 
 * 개선사항:
 * - ClientPageLayout 적용
 * - useClientPageAnimation 훅 사용
 * - 컴포넌트 분리 및 메모이제이션
 * - 접근성 개선
 */

import React, { useState, useRef, useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { optionProducts } from '@/lib/mock/settings'
import { ClientPageLayout, ClientPageHeader, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'
import { formatCurrency } from '@/lib/utils'
import { Users, UserCheck, ChevronDown, Check } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

interface Option {
  id: string
  name: string
  title: string
  description: string[]
  basePrice: number
  isActive: boolean
}

// ============================================================================
// Sub Components
// ============================================================================

const InfoCard = memo(({ 
  title, 
  icon: Icon, 
  isOpen, 
  onToggle, 
  children 
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <Card
    className={cn(
      'overflow-hidden transition-all duration-300 cursor-pointer border-2',
      isOpen 
        ? 'border-zinc-900 shadow-md' 
        : 'border-zinc-200 hover:border-zinc-300'
    )}
    onClick={onToggle}
  >
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
            isOpen 
              ? 'bg-zinc-900 text-white' 
              : 'bg-zinc-100 text-zinc-600'
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-medium text-zinc-900">
            {title}
          </h3>
        </div>
        <ChevronDown className={cn(
          'h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0',
          isOpen && 'rotate-180'
        )} />
      </div>

      <div className={cn(
        'grid transition-all duration-300 ease-in-out',
        isOpen 
          ? 'grid-rows-[1fr] opacity-100 mt-4' 
          : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="pt-4 border-t border-zinc-200">
            {children}
          </div>
        </div>
      </div>
    </div>
  </Card>
))
InfoCard.displayName = 'InfoCard'

const OptionCard = memo(({ 
  option, 
  selected, 
  onToggle,
  optionRef
}: {
  option: Option
  selected: boolean
  onToggle: () => void
  optionRef: React.RefObject<HTMLButtonElement>
}) => (
  <button
    ref={optionRef}
    onClick={onToggle}
    className={cn(
      'w-full p-6 text-left border-2 transition-all duration-300',
      'hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2',
      'active:scale-[0.99]',
      selected
        ? 'border-zinc-900 bg-zinc-50 shadow-sm'
        : 'border-zinc-200 bg-white'
    )}
  >
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-zinc-900">
              {option.title}
            </h3>
            {selected && (
              <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-lg font-bold text-zinc-900">
            {formatCurrency(option.basePrice)}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-zinc-600 leading-relaxed">
        {option.description.map((desc, idx) => (
          <p key={idx}>{desc}</p>
        ))}
      </div>
    </div>
  </button>
))
OptionCard.displayName = 'OptionCard'

// ============================================================================
// Main Component
// ============================================================================

export default function OptionsPage() {
  const router = useRouter()
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isPhotographerInfoOpen, setIsPhotographerInfoOpen] = useState(false)
  const [isAssignmentInfoOpen, setIsAssignmentInfoOpen] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  
  const { animationClasses, startAnimation } = useClientPageAnimation()

  // Computed values
  const activeOptions = useMemo(() => 
    optionProducts.filter(opt => opt.isActive),
    []
  )

  const selectedOptionDetails = useMemo(() => 
    selectedOptions.map(id => activeOptions.find(opt => opt.id === id)).filter(Boolean) as Option[],
    [selectedOptions, activeOptions]
  )

  const totalPrice = useMemo(() => 
    selectedOptionDetails.reduce((sum, opt) => sum + opt.basePrice, 0),
    [selectedOptionDetails]
  )

  // Handlers
  const toggleOption = useCallback((optionId: string) => {
    setSelectedOptions(prev => {
      const newSelection = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
      
      setTimeout(() => {
        optionRefs.current[optionId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
      
      return newSelection
    })
  }, [])

  const handlePortfolio = useCallback(() => {
    router.push('/c/portfolio')
  }, [router])

  const handleNext = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_options', JSON.stringify(selectedOptions))
    }
    
    startAnimation(() => {
      router.push('/c/venue-info')
    })
  }, [selectedOptions, router, startAnimation])

  const handleSkip = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_options', JSON.stringify([]))
    }
    
    startAnimation(() => {
      router.push('/c/venue-info')
    })
  }, [router, startAnimation])

  const handleBack = useCallback(() => {
    startAnimation(() => {
      router.push('/c/packages')
    })
  }, [router, startAnimation])

  return (
    <ClientPageLayout variant="minimal" showFooter={false} animate={false}>
      <div className={animationClasses}>
        {/* Header */}
        <ClientPageHeader
          title="추가 옵션을"
          subtitle="선택해 주세요"
          description="필요한 옵션을 자유롭게 선택하실 수 있습니다"
        />

        <ClientPageDivider />

        {/* Info Cards */}
        <div className="space-y-4">
          <InfoCard
            title="1인 촬영과 2인 촬영"
            icon={Users}
            isOpen={isPhotographerInfoOpen}
            onToggle={() => setIsPhotographerInfoOpen(!isPhotographerInfoOpen)}
          >
            <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
              <div className="bg-zinc-50 border-l-4 border-zinc-900 p-4 rounded">
                <p className="font-semibold text-zinc-900 mb-2">추천 상품</p>
                <p className="text-zinc-700">
                  결혼식 촬영은 행사 촬영의 특성상, 동시에 여러 중요한 순간이 발생합니다.
                  따라서 포토그래퍼로서 <strong>2인 촬영을 추천</strong>드립니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">
                  공통 촬영 내용 (1인/2인 모두 동일)
                </h4>
                <ul className="space-y-2 ml-4">
                  {['기념사진 (선원판)', '예식 전체 과정 (입장 ~ 행진)', '원판사진 (가족 단체사진)', '연회장 인사 사진'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">
                  1인 촬영 특징
                </h4>
                <p className="text-zinc-600 mb-3">
                  한 명의 작가가 주요 장면을 중심으로 촬영합니다.
                </p>
                <ul className="space-y-2 ml-4">
                  {['메인 이벤트 중심', '컴팩트한 구성', '효율적인 비용'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">
                  2인 촬영 특징
                </h4>
                <p className="text-zinc-600 mb-3">
                  두 명의 작가가 동시에 다른 앵글과 순간을 포착합니다.
                </p>
                <ul className="space-y-2 ml-4">
                  {['동시 다발적 순간 포착', '다양한 앵글과 구도', '풍부한 스토리텔링', '더 많은 사진 선택권'].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            title="대표작가 지정 촬영"
            icon={UserCheck}
            isOpen={isAssignmentInfoOpen}
            onToggle={() => setIsAssignmentInfoOpen(!isAssignmentInfoOpen)}
          >
            <div className="space-y-6 text-sm text-zinc-700 leading-relaxed">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                <p className="font-semibold text-zinc-900 mb-2">프리미엄 옵션</p>
                <p className="text-zinc-700">
                  대표작가가 직접 현장에서 촬영을 진행합니다.
                  최고 수준의 촬영 퀄리티를 원하시는 분들께 추천드립니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-zinc-900 mb-3 border-b border-zinc-200 pb-2">
                  대표작가 지정 촬영의 장점
                </h4>
                <ul className="space-y-2 ml-4">
                  {[
                    '10년 이상의 경력과 노하우',
                    '예술적 감각과 기술력',
                    '완벽한 순간 포착 능력',
                    '사전 미팅부터 후반작업까지 일관된 품질'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-50 p-4 rounded">
                <p className="text-xs text-zinc-600">
                  * 대표작가 지정 옵션은 사전 미팅, 촬영, 후반작업 모두 대표작가가 직접 진행합니다.
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        <ClientPageDivider />

        {/* Option Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-zinc-900 text-center">
            옵션 선택
          </h3>
          
          {activeOptions.map(option => (
            <OptionCard
              key={option.id}
              option={option}
              selected={selectedOptions.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
              optionRef={(el) => {
                optionRefs.current[option.id] = el
                return undefined
              }}
            />
          ))}
        </div>

        {/* Selected Options Summary */}
        {selectedOptions.length > 0 && (
          <>
            <ClientPageDivider />
            
            <div ref={summaryRef} className="p-5 bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-600">선택한 옵션</span>
                <Badge variant="default" className="bg-zinc-900">
                  {selectedOptions.length}개
                </Badge>
              </div>
              
              <div className="space-y-2">
                {selectedOptionDetails.map(opt => (
                  <div key={opt.id} className="flex items-center justify-between text-sm">
                    <span className="text-zinc-700">{opt.title}</span>
                    <span className="font-medium text-zinc-900">
                      {formatCurrency(opt.basePrice)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
                <span className="text-base font-semibold text-zinc-900">총 추가 금액</span>
                <span className="text-lg font-bold text-zinc-900">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </>
        )}

        <ClientPageDivider />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handlePortfolio}
            variant="outline"
            className="w-full h-11 border-zinc-300 text-zinc-900 hover:bg-zinc-50"
          >
            포트폴리오 보기
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12 border-zinc-300"
            >
              이전
            </Button>
            
            <Button
              onClick={selectedOptions.length > 0 ? handleNext : handleSkip}
              className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 transition-all"
            >
              {selectedOptions.length > 0 ? '다음' : '선택 안함'}
            </Button>
          </div>

          <p className="text-xs text-center text-zinc-400 leading-relaxed">
            옵션은 선택하지 않으셔도 됩니다
          </p>
        </div>
      </div>
    </ClientPageLayout>
  )
}

