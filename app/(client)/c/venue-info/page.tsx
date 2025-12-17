'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function VenueInfoPage() {
  const router = useRouter()
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load saved data if exists
    if (typeof window !== 'undefined') {
      const savedBride = sessionStorage.getItem('mindgraphy_bride_name')
      const savedGroom = sessionStorage.getItem('mindgraphy_groom_name')
      if (savedBride) setBrideName(savedBride)
      if (savedGroom) setGroomName(savedGroom)
    }
  }, [])

  const handleNext = () => {
    if (!brideName.trim() || !groomName.trim()) return
    
    setIsAnimating(true)
    
    // Store the data
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_bride_name', brideName.trim())
      sessionStorage.setItem('mindgraphy_groom_name', groomName.trim())
    }
    
    // Navigate to next step
    setTimeout(() => {
      router.push('/c/venue-contact')
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/product-type')
    }, 200)
  }

  const isValid = brideName.trim().length > 0 && groomName.trim().length > 0

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
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            예비 신랑 신부님의
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            성함을 알려주세요
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Bride Name */}
          <div className="space-y-3">
            <label 
              htmlFor="bride-name" 
              className="block text-sm font-medium text-zinc-700"
            >
              신부 성함
            </label>
            <Input
              id="bride-name"
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="예) 김민지"
              className={cn(
                "h-14 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
              autoFocus
              autoComplete="off"
            />
          </div>

          {/* Groom Name */}
          <div className="space-y-3">
            <label 
              htmlFor="groom-name" 
              className="block text-sm font-medium text-zinc-700"
            >
              신랑 성함
            </label>
            <Input
              id="groom-name"
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="예) 박지훈"
              className={cn(
                "h-14 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
              autoComplete="off"
            />
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
            1 / 4 단계
          </p>
        </div>
      </div>
    </div>
  )
}

