'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PRODUCT_TYPES } from '@/lib/constants'
import { setSessionItem } from '@/lib/utils/session-storage'
import type { ProjectType } from '@/lib/types'

type ProductType = ProjectType | null

export default function ProductTypePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ProductType>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const nextButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSelect = (type: ProductType) => {
    setSelectedType(type)
    
    // Auto scroll to next button after selection
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
    
    setIsAnimating(true)
    
    // Store the selection using utility function
    setSessionItem('PRODUCT_TYPE', selectedType)
    
    // Navigate based on product type
    setTimeout(() => {
      if (selectedType === PRODUCT_TYPES.WEDDING) {
        // For wedding, go to client type selection page
        router.push('/c/')
      } else {
        // For other types (hanbok, dress_shop, baby), go to wedding date directly
        router.push('/c/wedding-date')
      }
    }, 400)
  }

  const handleExistingCustomer = () => {
    setIsAnimating(true)
    
    // Navigate to login page (mind portal)
    setTimeout(() => {
      router.push('/c/login')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
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
            마인드그라피에
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            오신 것을 환영합니다
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed pt-2">
            원하시는 촬영 타입을 선택해 주세요
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Product Type Selection */}
        <div className="space-y-4">
          {/* Option 1: Wedding */}
          <button
            onClick={() => handleSelect(PRODUCT_TYPES.WEDDING as ProjectType)}
            className={cn(
              "w-full p-6 text-left border-2 transition-all duration-300",
              "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
              "active:scale-[0.99]",
              selectedType === 'wedding'
                ? "border-zinc-900 bg-zinc-50 shadow-sm"
                : "border-zinc-200 bg-white"
            )}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <p className="text-base font-medium text-zinc-900">
                    웨딩 촬영
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    본식 스냅 촬영 (BASIC / DATA 패키지)
                  </p>
                </div>
                <div className={cn(
                  "ml-4 h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selectedType === 'wedding'
                    ? "border-zinc-900 bg-zinc-900 scale-110"
                    : "border-zinc-300"
                )}>
                  {selectedType === 'wedding' && (
                    <div className="h-1.5 w-1.5 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Option 2: Hanbok & Casual */}
          <button
            onClick={() => handleSelect('hanbok')}
            className={cn(
              "w-full p-4 text-left border transition-all duration-300",
              "hover:border-zinc-900 hover:bg-zinc-50",
              "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
              "active:scale-[0.99]",
              selectedType === 'hanbok' 
                ? "border-zinc-900 bg-zinc-50" 
                : "border-zinc-200 bg-white"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-medium text-zinc-900">
                    HANBOK & CASUAL
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    한복 또는 캐주얼 야외 촬영 · 평일 (화·수·목) 진행
                  </p>
                </div>
                <div className={cn(
                  "ml-3 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selectedType === 'hanbok'
                    ? "border-zinc-900 bg-zinc-900 scale-110"
                    : "border-zinc-300"
                )}>
                  {selectedType === 'hanbok' && (
                    <div className="h-1 w-1 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Option 3: Dress Shop */}
          <button
            onClick={() => handleSelect('dress_shop')}
            className={cn(
              "w-full p-4 text-left border transition-all duration-300",
              "hover:border-zinc-900 hover:bg-zinc-50",
              "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
              "active:scale-[0.99]",
              selectedType === 'dress_shop'
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-medium text-zinc-900">
                    DRESS SHOP — 가봉 스냅
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    드레스샵 가봉 촬영
                  </p>
                </div>
                <div className={cn(
                  "ml-3 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selectedType === 'dress_shop'
                    ? "border-zinc-900 bg-zinc-900 scale-110"
                    : "border-zinc-300"
                )}>
                  {selectedType === 'dress_shop' && (
                    <div className="h-1 w-1 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Option 4: Baby */}
          <button
            onClick={() => handleSelect('baby')}
            className={cn(
              "w-full p-4 text-left border transition-all duration-300",
              "hover:border-zinc-900 hover:bg-zinc-50",
              "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
              "active:scale-[0.99]",
              selectedType === 'baby'
                ? "border-zinc-900 bg-zinc-50"
                : "border-zinc-200 bg-white"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-medium text-zinc-900">
                    BABY — 돌스냅 행사 촬영
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    돌잔치 행사 촬영
                  </p>
                </div>
                <div className={cn(
                  "ml-3 h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selectedType === 'baby'
                    ? "border-zinc-900 bg-zinc-900 scale-110"
                    : "border-zinc-300"
                )}>
                  {selectedType === 'baby' && (
                    <div className="h-1 w-1 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Existing Customer Button */}
          <div className="pt-2">
            <Button
              onClick={handleExistingCustomer}
              variant="outline"
              className={cn(
                "w-full h-12 text-sm font-normal transition-all duration-300",
                "border-2 border-zinc-400 bg-white text-zinc-700",
                "hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
                "active:scale-[0.99]",
                "shadow-sm hover:shadow-md"
              )}
            >
              기존 고객을 위한 마인드 포털로 이동
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Info - Dynamic based on selection */}
        {selectedType && (
          <div className="text-center space-y-3">
            {selectedType === 'wedding' && (
              <>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  예식 당일 본식 스냅 촬영을 진행합니다
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  주말 및 공휴일 촬영 가능
                </p>
              </>
            )}
            {selectedType === 'hanbok' && (
              <>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  HANBOK & CASUAL은 평일에만 촬영이 진행됩니다
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  화요일 · 수요일 · 목요일 중 선택 가능
                </p>
              </>
            )}
            {selectedType === 'dress_shop' && (
              <>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1인 대표작가 촬영 진행
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  최종본 10장 · 20x16 아크릴 액자 1개 제공
                </p>
              </>
            )}
            {selectedType === 'baby' && (
              <>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  2인 작가 진행 (작가 + 작가)
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  13x10인치 화보앨범 · 14x14인치 액자 제공
                </p>
              </>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            disabled={!selectedType}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              selectedType && "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            )}
          >
            다음
          </Button>
        </div>

      </div>
    </div>
  )
}

