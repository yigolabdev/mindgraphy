'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function ClientLoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
  }, [])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as 010-0000-0000
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    if (error) setError('')
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) setError('')
  }

  const handleLogin = async () => {
    if (!isValid) return
    
    setError('')
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Implement actual authentication logic here
    // For now, just store the phone number and navigate
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_client_phone', phoneNumber)
      sessionStorage.setItem('mindgraphy_client_logged_in', 'true')
    }
    
    setIsAnimating(true)
    setIsLoading(false)
    
    // Navigate to client portal
    setTimeout(() => {
      router.push('/c/portal')
    }, 400)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/product-type/')
    }, 400)
  }

  // 테스트용 빠른 로그인
  const handleQuickLogin = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_client_phone', '010-1234-5678')
      sessionStorage.setItem('mindgraphy_client_logged_in', 'true')
    }
    
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/portal')
    }, 400)
  }

  // Validate phone number and password
  const isValid = /^010-\d{4}-\d{4}$/.test(phoneNumber) && password.length >= 4

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
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            로그인
          </h1>
          <h2 className="text-base font-light text-zinc-600 tracking-tight leading-relaxed">
            전화번호와 임시 비밀번호를 입력해 주세요
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Phone Number */}
          <div className="space-y-3">
            <label 
              htmlFor="phone" 
              className="block text-sm font-medium text-zinc-700"
            >
              전화번호
            </label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="010-0000-0000"
              maxLength={13}
              className={cn(
                "h-14 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400",
                error && "border-red-300 focus:border-red-500"
              )}
              autoFocus
              autoComplete="tel"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-zinc-700"
            >
              임시 비밀번호
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="임시 비밀번호 입력"
              className={cn(
                "h-14 text-base transition-all duration-200",
                "border-2 border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400",
                error && "border-red-300 focus:border-red-500"
              )}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <p className="text-xs text-zinc-500 leading-relaxed">
              계약 시 안내받은 임시 비밀번호를 입력해 주세요
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-red-600 text-center">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Help Text */}
        <div className="space-y-3 text-center">
          <p className="text-xs text-zinc-500 leading-relaxed">
            임시 비밀번호를 잊으셨나요?<br />
            아래 연락처로 문의해 주세요
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleLogin}
            disabled={!isValid || isLoading}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              isValid && !isLoading && "shadow-md hover:shadow-lg"
            )}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          <button
            onClick={handleBack}
            disabled={isLoading}
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
            로그인 후 다양한 정보를 확인할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}
