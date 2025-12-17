'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { baseProducts, hanbokProducts } from '@/lib/mock/settings'
import { ProgressIndicator, PROGRESS_STEPS } from '@/components/client/progress-indicator'

type PackageType = string | null

export default function PackagesPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [productType, setProductType] = useState<string>('wedding')
  const nextButtonRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
    
    // Load product type from session
    if (typeof window !== 'undefined') {
      const type = sessionStorage.getItem('mindgraphy_product_type') || 'wedding'
      setProductType(type)
    }
  }, [])

  const handlePortfolio = () => {
    router.push('/c/portfolio')
  }

  const handleSelect = (packageId: PackageType) => {
    setSelectedPackage(packageId)
    
    // Scroll to next button after a short delay
    setTimeout(() => {
      nextButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
      // Focus the button after scrolling
      setTimeout(() => {
        nextButtonRef.current?.focus()
      }, 500)
    }, 100)
  }

  const handleNext = () => {
    if (!selectedPackage) return
    
    setIsAnimating(true)
    
    // Store the selection
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_package', selectedPackage)
    }
    
    // Navigate based on product type
    // Hanbok has no options, so skip to venue contact page
    const nextPage = productType === 'hanbok' ? '/c/venue-contact' : '/c/options'
    setTimeout(() => {
      router.push(nextPage)
    }, 200)
  }

  const handleBack = () => {
    setIsAnimating(true)
    // Navigate based on product type
    const prevPage = productType === 'hanbok' ? '/c/wedding-date' : '/c/process'
    setTimeout(() => {
      router.push(prevPage)
    }, 200)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  // Select packages based on product type
  const allPackages = productType === 'hanbok' ? hanbokProducts : baseProducts
  const activePackages = allPackages.filter(pkg => pkg.isActive)
  
  // Get selected package details
  const selectedPackageDetails = activePackages.find(pkg => pkg.id === selectedPackage)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "max-w-md w-full space-y-12 transition-all duration-700 ease-out py-8",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8",
          isAnimating && "opacity-0 -translate-y-8"
        )}
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            {productType === 'hanbok' ? 'HANBOK & CASUAL 패키지를' : '촬영 패키지를'}
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            소개합니다
          </h2>
          <div className="pt-2 space-y-3">
            {productType === 'hanbok' ? (
              <>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  평일 (화·수·목)에만<br />
                  촬영이 진행됩니다
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  원하시는 촬영 패키지를 선택하세요
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  촬영에 대한 사전 준비 과정과<br />
                  촬영 후 후반작업은<br />
                  대표작가가 직접 주관하여 진행합니다
                </p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  두 분에게 가장 적합한 패키지를 선택하세요
                </p>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Hanbok Info - Only for hanbok type */}
        {productType === 'hanbok' && (
          <>
            <div className="space-y-4 px-5 py-5 border-2 border-zinc-300 bg-zinc-50">
              <h3 className="text-sm font-semibold text-zinc-900">
                드벨레사(dbelleza) 한복 제휴
              </h3>
              <div className="space-y-2 text-xs text-zinc-600 leading-relaxed">
                <p>
                  마인드그라피에서 한복촬영 진행하시는 경우
                </p>
                <p className="font-medium text-zinc-900">
                  신랑님 한 벌 + 신부님 한 벌<br />
                  (원단 디자인 상관없이)
                </p>
                <p className="font-semibold text-zinc-900">
                  제휴금액으로 진행됩니다
                </p>
                <p className="text-xs text-zinc-500 pt-2">
                  자세한 문의는 하단 카카오톡 채널로 부탁드립니다
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Package Selection */}
        <div className="space-y-4">
          {activePackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handleSelect(pkg.id)}
              className={cn(
                "w-full p-6 text-left border-2 transition-all duration-300",
                "hover:border-zinc-900 hover:bg-zinc-50 hover:shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
                "active:scale-[0.99]",
                selectedPackage === pkg.id
                  ? "border-zinc-900 bg-zinc-50 shadow-sm"
                  : "border-zinc-200 bg-white"
              )}
            >
              <div className="space-y-4">
                {/* Package Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-zinc-900">
                        {pkg.name}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-500">
                      {pkg.title}
                    </p>
                  </div>
                  <div className={cn(
                    "ml-4 h-6 w-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300",
                    selectedPackage === pkg.id
                      ? "border-zinc-900 bg-zinc-900 scale-110"
                      : "border-zinc-300"
                  )}>
                    {selectedPackage === pkg.id && (
                      <div className="h-2 w-2 bg-white rounded-full animate-in fade-in zoom-in duration-200"></div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-2">
                  <p className="text-2xl font-semibold text-zinc-900">
                    {formatPrice(pkg.basePrice)}
                  </p>
                </div>

                {/* Features */}
                <div className="pt-2 space-y-1.5 text-xs text-zinc-600">
                  {pkg.description.map((feature, index) => (
                    <p key={index}>· {feature}</p>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Info */}
        <div className="space-y-3 text-center">
          <p className="text-xs text-zinc-500 leading-relaxed">
            모든 패키지에는 전체원본이 제공됩니다<br />
            선택하신 패키지는 다음 단계에서 옵션을 추가하실 수 있습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Selected Package Summary */}
        {selectedPackageDetails && (
          <div className="p-5 bg-zinc-50 border border-zinc-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900">
                  선택한 패키지
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {selectedPackageDetails.name}
                </p>
              </div>
              <p className="text-lg font-semibold text-zinc-900">
                {formatPrice(selectedPackageDetails.basePrice)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-zinc-200"></div>
              <p className="text-xs text-zinc-400">최종본 {selectedPackageDetails.photoCount}장</p>
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            ref={nextButtonRef}
            onClick={handleNext}
            disabled={!selectedPackage}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              selectedPackage && "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
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
            부가세(VAT)는 별도로 발생하지 않습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

      </div>
    </div>
  )
}
