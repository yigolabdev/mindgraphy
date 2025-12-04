'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type MainContact = 'bride' | 'groom' | null

export default function VenueContactPage() {
  const router = useRouter()
  const [brideName, setBrideName] = useState('')
  const [bridePhone, setBridePhone] = useState('')
  const [groomName, setGroomName] = useState('')
  const [groomPhone, setGroomPhone] = useState('')
  const [email, setEmail] = useState('')
  const [mainContact, setMainContact] = useState<MainContact>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load saved data if exists
    if (typeof window !== 'undefined') {
      const savedBrideName = sessionStorage.getItem('mindgraphy_bride_name')
      const savedBridePhone = sessionStorage.getItem('mindgraphy_bride_phone')
      const savedGroomName = sessionStorage.getItem('mindgraphy_groom_name')
      const savedGroomPhone = sessionStorage.getItem('mindgraphy_groom_phone')
      const savedEmail = sessionStorage.getItem('mindgraphy_email')
      const savedMainContact = sessionStorage.getItem('mindgraphy_main_contact') as MainContact
      
      if (savedBrideName) setBrideName(savedBrideName)
      if (savedBridePhone) setBridePhone(savedBridePhone)
      if (savedGroomName) setGroomName(savedGroomName)
      if (savedGroomPhone) setGroomPhone(savedGroomPhone)
      if (savedEmail) setEmail(savedEmail)
      if (savedMainContact) setMainContact(savedMainContact)
    }
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

  const handleBridePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setBridePhone(formatted)
  }

  const handleGroomPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setGroomPhone(formatted)
  }

  const handleNext = () => {
    if (!isValid) return
    
    setIsAnimating(true)
    
    // Store the data
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_bride_name', brideName)
      sessionStorage.setItem('mindgraphy_bride_phone', bridePhone)
      sessionStorage.setItem('mindgraphy_groom_name', groomName)
      sessionStorage.setItem('mindgraphy_groom_phone', groomPhone)
      sessionStorage.setItem('mindgraphy_email', email)
      sessionStorage.setItem('mindgraphy_main_contact', mainContact || '')
    }
    
    // Navigate to next step
    setTimeout(() => {
      router.push('/c/venue-details')
    }, 400)
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.push('/c/venue-info')
    }, 400)
  }

  // Validation
  const isBrideNameValid = brideName.trim().length >= 2
  const isGroomNameValid = groomName.trim().length >= 2
  const isBridePhoneValid = !bridePhone || /^010-\d{4}-\d{4}$/.test(bridePhone)
  const isGroomPhoneValid = !groomPhone || /^010-\d{4}-\d{4}$/.test(groomPhone)
  const isEmailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const hasAtLeastOneContact = bridePhone || groomPhone
  const hasMainContactSelected = mainContact !== null
  const isValid = isBrideNameValid && isGroomNameValid && isBridePhoneValid && isGroomPhoneValid && isEmailValid && hasAtLeastOneContact && hasMainContactSelected

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
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
          <div className="h-1 w-12 bg-zinc-200 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            신랑 신부
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            연락처를 알려주세요
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Bride Information */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium text-zinc-900">
              신부 정보
            </h3>
            
            {/* 신부 이름 */}
            <div className="space-y-3">
              <label 
                htmlFor="bride-name" 
                className="block text-sm font-medium text-zinc-700"
              >
                성함 <span className="text-red-500">*</span>
              </label>
              <Input
                id="bride-name"
                type="text"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                placeholder="신부 성함"
                className={cn(
                  "h-12 text-base transition-all duration-200",
                  "border-2",
                  brideName && !isBrideNameValid ? "border-red-500" : "border-zinc-200",
                  "focus:border-zinc-900 focus:ring-0",
                  "placeholder:text-zinc-400"
                )}
                autoComplete="name"
                required
              />
              {brideName && !isBrideNameValid && (
                <p className="text-xs text-red-500">
                  최소 2글자 이상 입력해주세요
                </p>
              )}
            </div>
            
            {/* 신부 전화번호 */}
            <div className="space-y-3">
              <label 
                htmlFor="bride-phone" 
                className="block text-sm font-medium text-zinc-700"
              >
                휴대폰 번호 <span className="text-zinc-400 font-normal">(선택)</span>
              </label>
              <Input
                id="bride-phone"
                type="tel"
                value={bridePhone}
                onChange={handleBridePhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                className={cn(
                  "h-12 text-base transition-all duration-200",
                  "border-2",
                  bridePhone && !isBridePhoneValid ? "border-red-500" : "border-zinc-200",
                  "focus:border-zinc-900 focus:ring-0",
                  "placeholder:text-zinc-400"
                )}
                autoComplete="tel"
              />
              {bridePhone && !isBridePhoneValid && (
                <p className="text-xs text-red-500">
                  올바른 휴대폰 번호 형식이 아닙니다
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Groom Information */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-medium text-zinc-900">
              신랑 정보
            </h3>
            
            {/* 신랑 이름 */}
            <div className="space-y-3">
              <label 
                htmlFor="groom-name" 
                className="block text-sm font-medium text-zinc-700"
              >
                성함 <span className="text-red-500">*</span>
              </label>
              <Input
                id="groom-name"
                type="text"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                placeholder="신랑 성함"
                className={cn(
                  "h-12 text-base transition-all duration-200",
                  "border-2",
                  groomName && !isGroomNameValid ? "border-red-500" : "border-zinc-200",
                  "focus:border-zinc-900 focus:ring-0",
                  "placeholder:text-zinc-400"
                )}
                autoComplete="name"
                required
              />
              {groomName && !isGroomNameValid && (
                <p className="text-xs text-red-500">
                  최소 2글자 이상 입력해주세요
                </p>
              )}
            </div>
            
            {/* 신랑 전화번호 */}
            <div className="space-y-3">
              <label 
                htmlFor="groom-phone" 
                className="block text-sm font-medium text-zinc-700"
              >
                휴대폰 번호 <span className="text-zinc-400 font-normal">(선택)</span>
              </label>
              <Input
                id="groom-phone"
                type="tel"
                value={groomPhone}
                onChange={handleGroomPhoneChange}
                placeholder="010-0000-0000"
                maxLength={13}
                className={cn(
                  "h-12 text-base transition-all duration-200",
                  "border-2",
                  groomPhone && !isGroomPhoneValid ? "border-red-500" : "border-zinc-200",
                  "focus:border-zinc-900 focus:ring-0",
                  "placeholder:text-zinc-400"
                )}
                autoComplete="tel"
              />
              {groomPhone && !isGroomPhoneValid && (
                <p className="text-xs text-red-500">
                  올바른 휴대폰 번호 형식이 아닙니다
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Email */}
        <div className="space-y-4">
          <h3 className="text-base font-medium text-zinc-900">
            대표 이메일 주소
          </h3>
          
          <div className="space-y-3">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-zinc-700"
            >
              이메일 <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={cn(
                "h-12 text-base transition-all duration-200",
                "border-2",
                email && !isEmailValid ? "border-red-500" : "border-zinc-200",
                !email && "border-zinc-200",
                "focus:border-zinc-900 focus:ring-0",
                "placeholder:text-zinc-400"
              )}
              autoComplete="email"
              required
            />
            {email && !isEmailValid && (
              <p className="text-xs text-red-500">
                올바른 이메일 형식이 아닙니다
              </p>
            )}
            <p className="text-xs text-zinc-500 leading-relaxed">
              촬영 관련 자료 및 웹갤러리 링크를 받으실 이메일 주소입니다
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Main Contact Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            메인 연락처 선택 <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-zinc-500 leading-relaxed">
            주로 연락받으실 분을 선택해 주세요
          </p>
          
          <div className="space-y-3">
            {bridePhone && (
              <label
                className={cn(
                  "flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300",
                  "hover:border-zinc-900 hover:bg-zinc-50",
                  "active:scale-[0.99]",
                  mainContact === 'bride'
                    ? "border-zinc-900 bg-zinc-50 shadow-sm"
                    : "border-zinc-200 bg-white"
                )}
              >
                <input
                  type="radio"
                  name="main-contact"
                  value="bride"
                  checked={mainContact === 'bride'}
                  onChange={() => setMainContact('bride')}
                  className="sr-only"
                />
                <div className={cn(
                  "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  mainContact === 'bride'
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-300"
                )}>
                  {mainContact === 'bride' && (
                    <div className="h-2 w-2 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-zinc-900">
                    {brideName || '신부'} 연락처
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {bridePhone}
                  </p>
                </div>
              </label>
            )}
            
            {groomPhone && (
              <label
                className={cn(
                  "flex items-center gap-4 p-4 border-2 cursor-pointer transition-all duration-300",
                  "hover:border-zinc-900 hover:bg-zinc-50",
                  "active:scale-[0.99]",
                  mainContact === 'groom'
                    ? "border-zinc-900 bg-zinc-50 shadow-sm"
                    : "border-zinc-200 bg-white"
                )}
              >
                <input
                  type="radio"
                  name="main-contact"
                  value="groom"
                  checked={mainContact === 'groom'}
                  onChange={() => setMainContact('groom')}
                  className="sr-only"
                />
                <div className={cn(
                  "flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  mainContact === 'groom'
                    ? "border-zinc-900 bg-zinc-900"
                    : "border-zinc-300"
                )}>
                  {mainContact === 'groom' && (
                    <div className="h-2 w-2 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-zinc-900">
                    {groomName || '신랑'} 연락처
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {groomPhone}
                  </p>
                </div>
              </label>
            )}
          </div>
          
          {!bridePhone && !groomPhone && (
            <p className="text-xs text-amber-600 text-center pt-2">
              최소 한 분의 연락처를 입력해 주세요
            </p>
          )}
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
            2 / 4 단계
          </p>
        </div>
      </div>
    </div>
  )
}

