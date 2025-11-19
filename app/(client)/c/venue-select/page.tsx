'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock wedding venue data
const WEDDING_VENUES = [
  '더 컨벤션',
  '그랜드 웨딩홀',
  '엘리시안 컨벤션',
  '파라다이스 웨딩',
  '라비두스 웨딩홀',
  '르메르디앙 웨딩',
  '반얀트리 클럽 앤 스파',
  '쉐라톤 그랜드 웨딩홀',
  '기타',
]

export default function VenueSelectPage() {
  const router = useRouter()
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null)
  const [customVenue, setCustomVenue] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const customVenueInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load saved data if exists
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mindgraphy_venue')
      if (saved) {
        if (WEDDING_VENUES.includes(saved)) {
          setSelectedVenue(saved)
        } else {
          setSelectedVenue('기타')
          setCustomVenue(saved)
        }
      }
    }
  }, [])

  // Focus and scroll to input when "기타" is selected
  useEffect(() => {
    if (selectedVenue === '기타' && customVenueInputRef.current) {
      setTimeout(() => {
        customVenueInputRef.current?.focus()
        customVenueInputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }, [selectedVenue])

  const handleSubmit = async () => {
    if (!isValid) return
    
    setIsSubmitting(true)
    setIsAnimating(true)
    
    // Get final venue name
    const finalVenue = selectedVenue === '기타' ? customVenue : selectedVenue
    
    // Store the data
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_venue', finalVenue || '')
    }
    
    // Navigate to next step (additional requests)
    setTimeout(() => {
      router.push('/c/venue-date')
    }, 400)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/venue-contact')
    }, 400)
  }

  const isValid = selectedVenue && (selectedVenue !== '기타' || customVenue.trim().length > 0)

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
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            예식장을
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            선택해 주세요
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Venue Selection */}
        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
          {WEDDING_VENUES.map((venue) => (
            <button
              key={venue}
              onClick={() => setSelectedVenue(venue)}
              className={cn(
                "w-full p-5 text-left border-2 transition-all duration-200",
                "hover:border-zinc-900 hover:bg-zinc-50",
                "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                "active:scale-[0.99]",
                selectedVenue === venue
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-base text-zinc-900">{venue}</span>
                <div className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  selectedVenue === venue
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-300"
                )}>
                  {selectedVenue === venue && (
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Venue Input (if "기타" selected) */}
        {selectedVenue === '기타' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <label 
              htmlFor="custom-venue" 
              className="block text-sm font-medium text-zinc-700"
            >
              예식장 이름을 직접 입력해 주세요
            </label>
            <input
              ref={customVenueInputRef}
              id="custom-venue"
              type="text"
              value={customVenue}
              onChange={(e) => setCustomVenue(e.target.value)}
              placeholder="예) 아름다운 웨딩홀"
              className={cn(
                "w-full h-14 px-4 text-base transition-all duration-200",
                "border-2 border-zinc-200 rounded-md",
                "focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900",
                "placeholder:text-zinc-400"
              )}
            />
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              isValid && !isSubmitting && "shadow-md hover:shadow-lg"
            )}
          >
            {isSubmitting ? '제출 중...' : '완료'}
          </Button>

          <button
            onClick={handleBack}
            disabled={isSubmitting}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-200",
              "text-zinc-600 hover:text-zinc-900",
              "active:scale-[0.98]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
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

