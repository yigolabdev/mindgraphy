'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export default function VenueRequestPage() {
  const router = useRouter()
  const [request, setRequest] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load saved data if exists
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mindgraphy_venue_request')
      if (saved) setRequest(saved)
    }
  }, [])

  const handleNext = () => {
    setIsAnimating(true)
    
    // Store the data (optional field)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_venue_request', request)
    }
    
    // Navigate to completion page
    setTimeout(() => {
      router.push('/c/venue-complete')
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/venue-details')
    }, 200)
  }

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
        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          <div className="h-1 w-12 bg-zinc-900 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-900 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-900 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-900 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            추가로 전달하실
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            내용이 있으신가요?
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed pt-2">
            자유롭게 작성해 주세요 (선택사항)
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Textarea Field */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label 
              htmlFor="request" 
              className="block text-sm font-medium text-zinc-700"
            >
              요청사항
            </label>
            <Textarea
              id="request"
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="특별히 요청하실 내용이나 궁금하신 점을 자유롭게 작성해 주세요.&#10;&#10;예시:&#10;- 촬영 시간 관련 문의&#10;- 특정 장소나 소품 요청&#10;- 사전미팅 일정 조율&#10;- 기타 궁금하신 사항"
              rows={10}
              className={cn(
                "text-base transition-all duration-200 resize-none",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400 placeholder:text-sm"
              )}
              autoFocus
            />
            <p className="text-xs text-zinc-500 leading-relaxed">
              입력하지 않으셔도 다음 단계로 진행 가능합니다
            </p>
          </div>
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
              "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            )}
          >
            {request ? '다음' : '건너뛰기'}
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
            4 / 4 단계
          </p>
        </div>
      </div>
    </div>
  )
}

