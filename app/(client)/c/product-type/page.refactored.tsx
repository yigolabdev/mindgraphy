'use client'

/**
 * 상품 타입 선택 페이지 (리팩토링)
 * 
 * 개선사항:
 * - ClientPageLayout 적용
 * - useClientPageAnimation 훅 사용
 * - 컴포넌트 분리
 * - 타입 안전성 강화
 */

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PRODUCT_TYPES } from '@/lib/constants'
import { setSessionItem } from '@/lib/utils/session-storage'
import { ClientPageLayout, ClientPageHeader, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'
import type { ProjectType } from '@/lib/types'

// ============================================================================
// Sub Components
// ============================================================================

interface ProductTypeOptionProps {
  type: ProjectType
  title: string
  description: string
  selected: boolean
  onSelect: () => void
  primary?: boolean
}

function ProductTypeOption({ 
  type, 
  title, 
  description, 
  selected, 
  onSelect,
  primary = false
}: ProductTypeOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left border-2 transition-all duration-300',
        'hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2',
        'active:scale-[0.99]',
        primary ? 'p-6' : 'p-4',
        selected
          ? 'border-zinc-900 bg-zinc-50 shadow-sm'
          : 'border-zinc-200 bg-white'
      )}
    >
      <div className={cn('space-y-2', !primary && 'space-y-1')}>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className={cn(
              'font-medium text-zinc-900',
              primary ? 'text-base' : 'text-sm'
            )}>
              {title}
            </p>
            <p className={cn(
              'text-zinc-500 leading-relaxed',
              primary ? 'text-xs' : 'text-xs'
            )}>
              {description}
            </p>
          </div>
          <div className={cn(
            'ml-4 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300',
            selected
              ? 'border-zinc-900 bg-zinc-900 scale-110'
              : 'border-zinc-300'
          )}>
            {selected && (
              <div className="h-1.5 w-1.5 bg-white rounded-full animate-in fade-in zoom-in duration-200" />
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function ProductTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null)
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  
  const { animationClasses, startAnimation } = useClientPageAnimation()

  const handleSelect = (type: ProjectType) => {
    setSelectedType(type)
    
    // Auto scroll to next button
    setTimeout(() => {
      nextButtonRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
      setTimeout(() => {
        nextButtonRef.current?.focus()
      }, 500)
    }, 100)
  }

  const handleNext = () => {
    if (!selectedType) return
    
    setSessionItem('PRODUCT_TYPE', selectedType)
    startAnimation(() => {
      router.push('/c/wedding-date')
    })
  }

  const handleExistingCustomer = () => {
    startAnimation(() => {
      router.push('/c/login')
    })
  }

  return (
    <ClientPageLayout variant="minimal" showFooter={false}>
      <div className={animationClasses}>
        {/* Header */}
        <ClientPageHeader
          title="마인드그라피에"
          subtitle="오신 것을 환영합니다"
          description="원하시는 촬영 타입을 선택해 주세요"
        />

        <ClientPageDivider />

        {/* Product Type Selection */}
        <div className="space-y-4">
          <ProductTypeOption
            type="wedding"
            title="웨딩 촬영"
            description="본식 스냅 촬영 (BASIC / DATA 패키지)"
            selected={selectedType === 'wedding'}
            onSelect={() => handleSelect('wedding')}
            primary
          />

          <ProductTypeOption
            type="hanbok"
            title="HANBOK & CASUAL"
            description="한복 또는 캐주얼 야외 촬영 · 평일 (화·수·목) 진행"
            selected={selectedType === 'hanbok'}
            onSelect={() => handleSelect('hanbok')}
          />

          <ProductTypeOption
            type="dress_shop"
            title="가봉 스냅"
            description="드레스샵 가봉 촬영 · 평일 (화·수·목) 진행"
            selected={selectedType === 'dress_shop'}
            onSelect={() => handleSelect('dress_shop')}
          />

          <ProductTypeOption
            type="baby"
            title="돌잔치 스냅"
            description="돌잔치 본행사 현장 스냅 촬영"
            selected={selectedType === 'baby'}
            onSelect={() => handleSelect('baby')}
          />
        </div>

        <ClientPageDivider />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            disabled={!selectedType}
            className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 disabled:opacity-40"
          >
            다음
          </Button>

          <Button
            onClick={handleExistingCustomer}
            variant="ghost"
            className="w-full text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            이미 문의하신 고객이신가요?
          </Button>
        </div>
      </div>
    </ClientPageLayout>
  )
}

