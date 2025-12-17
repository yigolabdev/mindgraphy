'use client'

import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

/**
 * 고객 신청 플로우용 Progress Indicator
 * 
 * 8단계:
 * 1. 상품 선택
 * 2. 예식일 선택
 * 3. 패키지 선택
 * 4. 옵션 선택
 * 5. 예식장 정보
 * 6. 연락처 입력
 * 7. 예식 상세
 * 8. 예식일 선택
 */
export function ProgressIndicator({ 
  currentStep, 
  totalSteps = 8,
  className 
}: ProgressIndicatorProps) {
  return (
    <div className={cn("flex justify-center items-center gap-2", className)}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            step === currentStep ? "w-16 bg-zinc-900" :
            step < currentStep ? "w-12 bg-zinc-900" :
            "w-8 bg-zinc-200"
          )}
          aria-label={`Step ${step} of ${totalSteps}`}
        />
      ))}
    </div>
  )
}

/**
 * 8단계 레이블
 */
export const PROGRESS_STEPS = {
  PRODUCT_TYPE: 1,      // 상품 선택
  WEDDING_DATE: 2,      // 예식일 선택  
  PACKAGES: 3,          // 패키지 선택
  OPTIONS: 4,           // 옵션 선택
  VENUE_INFO: 5,        // 예식장 정보
  CONTACT: 6,           // 연락처 입력
  VENUE_DETAILS: 7,     // 예식 상세
  VENUE_DATE: 8,        // 예식일 최종 확인
} as const

export const PROGRESS_LABELS = [
  '상품 선택',
  '예식일 선택',
  '패키지 선택',
  '옵션 선택',
  '예식장 정보',
  '연락처 입력',
  '예식 상세',
  '예식일 확인'
]
