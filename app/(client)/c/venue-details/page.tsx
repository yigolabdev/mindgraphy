'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ProgressIndicator, PROGRESS_STEPS } from '@/components/client/progress-indicator'

export default function VenueDetailsPage() {
  const router = useRouter()
  const [venueName, setVenueName] = useState('')
  const [venueHall, setVenueHall] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load saved data if exists
    if (typeof window !== 'undefined') {
      const savedVenueName = sessionStorage.getItem('mindgraphy_venue_name')
      const savedVenueHall = sessionStorage.getItem('mindgraphy_venue_hall')
      const savedGuestCount = sessionStorage.getItem('mindgraphy_guest_count')
      
      if (savedVenueName) setVenueName(savedVenueName)
      if (savedVenueHall) setVenueHall(savedVenueHall)
      if (savedGuestCount) setGuestCount(savedGuestCount)
    }
  }, [])

  const handleNext = () => {
    if (!isValid) return
    
    setIsAnimating(true)
    
    // Store the data
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_venue_name', venueName.trim())
      sessionStorage.setItem('mindgraphy_venue_hall', venueHall.trim())
      sessionStorage.setItem('mindgraphy_guest_count', guestCount)
    }
    
    // Navigate to next step
    setTimeout(() => {
      router.push('/c/venue-date')
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/venue-contact')
    }, 200)
  }

  // Validation - 예식장 이름만 필수
  const isValid = venueName.trim().length > 0

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
        <ProgressIndicator currentStep={PROGRESS_STEPS.VENUE_DETAILS} totalSteps={8} />

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            예식장 정보를
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            알려주세요
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Venue Name */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label 
              htmlFor="venue-name" 
              className="block text-sm font-medium text-zinc-700"
            >
              예식장 이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="venue-name"
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="예) 더컨벤션 대치, 엘타워 강남"
              className={cn(
                "h-12 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
              required
              autoFocus
            />
            <p className="text-xs text-zinc-500 leading-relaxed">
              예식이 진행될 예식장 이름을 입력해 주세요
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Venue Hall */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label 
              htmlFor="venue-hall" 
              className="block text-sm font-medium text-zinc-700"
            >
              예식 홀 이름 <span className="text-zinc-400 font-normal">(선택)</span>
            </label>
            <Input
              id="venue-hall"
              type="text"
              value={venueHall}
              onChange={(e) => setVenueHall(e.target.value)}
              placeholder="예) 그랜드홀, 로얄홀, 3층 그레이스홀"
              className={cn(
                "h-12 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
            />
            <p className="text-xs text-zinc-500 leading-relaxed">
              예식홀 이름이 있다면 입력해 주세요
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Guest Count */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label 
              htmlFor="guest-count" 
              className="block text-sm font-medium text-zinc-700"
            >
              예상 하객 수 <span className="text-zinc-400 font-normal">(선택)</span>
            </label>
            <Input
              id="guest-count"
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="예) 200"
              min="0"
              className={cn(
                "h-12 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
            />
            <p className="text-xs text-zinc-500 leading-relaxed">
              대략적인 인원수를 입력해 주세요
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              isValid && "shadow-md hover:shadow-lg"
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
            3 / 4 단계
          </p>
        </div>
      </div>
    </div>
  )
}

