'use client'

/**
 * 패키지 선택 페이지 (리팩토링)
 * 
 * 개선사항:
 * - ClientPageLayout 적용
 * - useClientPageAnimation 훅 사용
 * - 컴포넌트 분리 및 메모이제이션
 * - 타입 안전성 강화
 */

import React, { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { baseProducts, hanbokProducts } from '@/lib/mock/settings'
import { ClientPageLayout, ClientPageHeader, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'
import { formatCurrency } from '@/lib/utils'
import { Check } from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

interface Product {
  id: string
  name: string
  title: string
  description: string[]
  photoCount: number
  albumIncluded: boolean
  albumPages?: number
  miniAlbums?: number
  basePrice: number
  delivery: {
    includesWebGallery: boolean
    includesRawDownload: boolean
  }
  isActive: boolean
}

// ============================================================================
// Sub Components
// ============================================================================

const PackageCard = memo(({ 
  pkg, 
  selected, 
  onSelect 
}: {
  pkg: Product
  selected: boolean
  onSelect: () => void
}) => (
  <Card
    onClick={onSelect}
    className={cn(
      'cursor-pointer transition-all duration-300 hover:shadow-lg',
      selected 
        ? 'border-2 border-zinc-900 shadow-md' 
        : 'border border-zinc-200 hover:border-zinc-400'
    )}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between mb-2">
        <CardTitle className="text-lg font-semibold text-zinc-900">
          {pkg.name}
        </CardTitle>
        {selected && (
          <div className="h-6 w-6 rounded-full bg-zinc-900 flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <CardDescription className="text-base font-semibold text-zinc-900">
        {formatCurrency(pkg.basePrice)}
      </CardDescription>
    </CardHeader>
    
    <CardContent className="space-y-4">
      {/* Description */}
      <div className="space-y-2">
        {pkg.description.map((desc, idx) => (
          <p key={idx} className="text-sm text-zinc-600 leading-relaxed">
            {desc}
          </p>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-2 pt-2 border-t border-zinc-100">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">사진 매수</span>
          <span className="font-medium text-zinc-900">{pkg.photoCount}장</span>
        </div>
        
        {pkg.albumIncluded && (
          <>
            {pkg.albumPages && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">앨범</span>
                <span className="font-medium text-zinc-900">{pkg.albumPages}p 포함</span>
              </div>
            )}
            {pkg.miniAlbums && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">미니앨범</span>
                <span className="font-medium text-zinc-900">{pkg.miniAlbums}권 포함</span>
              </div>
            )}
          </>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">웹 갤러리</span>
          <span className="font-medium text-zinc-900">
            {pkg.delivery.includesWebGallery ? '포함' : '미포함'}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">원본 다운로드</span>
          <span className="font-medium text-zinc-900">
            {pkg.delivery.includesRawDownload ? '포함' : '미포함'}
          </span>
        </div>
      </div>
    </CardContent>
  </Card>
))
PackageCard.displayName = 'PackageCard'

// ============================================================================
// Main Component
// ============================================================================

export default function PackagesPage() {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [productType, setProductType] = useState<string>('wedding')
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  
  const { animationClasses, startAnimation } = useClientPageAnimation()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const type = sessionStorage.getItem('mindgraphy_product_type') || 'wedding'
      setProductType(type)
    }
  }, [])

  // Computed values
  const allPackages = useMemo(() => 
    productType === 'hanbok' ? hanbokProducts : baseProducts,
    [productType]
  )

  const activePackages = useMemo(() => 
    allPackages.filter(pkg => pkg.isActive),
    [allPackages]
  )

  const selectedPackageDetails = useMemo(() => 
    activePackages.find(pkg => pkg.id === selectedPackage),
    [activePackages, selectedPackage]
  )

  // Handlers
  const handleSelect = useCallback((packageId: string) => {
    setSelectedPackage(packageId)
    
    setTimeout(() => {
      nextButtonRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
      setTimeout(() => {
        nextButtonRef.current?.focus()
      }, 500)
    }, 100)
  }, [])

  const handlePortfolio = useCallback(() => {
    router.push('/c/portfolio')
  }, [router])

  const handleNext = useCallback(() => {
    if (!selectedPackage) return
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_package', selectedPackage)
    }
    
    const nextPage = productType === 'hanbok' ? '/c/venue-contact' : '/c/options'
    startAnimation(() => {
      router.push(nextPage)
    })
  }, [selectedPackage, productType, router, startAnimation])

  const handleBack = useCallback(() => {
    const prevPage = productType === 'hanbok' ? '/c/wedding-date' : '/c/process'
    startAnimation(() => {
      router.push(prevPage)
    })
  }, [productType, router, startAnimation])

  return (
    <ClientPageLayout variant="minimal" showFooter={false}>
      <div className={animationClasses}>
        {/* Header */}
        <ClientPageHeader
          title={productType === 'hanbok' ? 'HANBOK & CASUAL 패키지를' : '촬영 패키지를'}
          subtitle="소개합니다"
          description={
            productType === 'hanbok' 
              ? '평일 (화·수·목)에만 촬영이 진행됩니다'
              : '촬영에 대한 사전 준비 과정과 촬영 후 후반작업은 대표작가가 직접 주관하여 진행합니다'
          }
        />

        <ClientPageDivider />

        {/* Hanbok Info */}
        {productType === 'hanbok' && (
          <>
            <div className="space-y-4 px-5 py-5 border-2 border-zinc-300 bg-zinc-50">
              <h3 className="text-sm font-semibold text-zinc-900">
                드벨레사(dbelleza) 한복 제휴
              </h3>
              <div className="space-y-2 text-xs text-zinc-600 leading-relaxed">
                <p>마인드그라피에서 한복촬영 진행하시는 경우</p>
                <p className="font-medium text-zinc-900">
                  신랑님 한 벌 + 신부님 한 벌<br />
                  (원단 디자인 상관없이)
                </p>
                <p>
                  <span className="font-semibold text-zinc-900">20만원</span>에 대여 가능하십니다
                </p>
                <p className="text-[11px] text-zinc-500 pt-2">
                  * 한복 대여는 선택사항이며, 별도로 마인드그라피에서 진행합니다
                </p>
              </div>
            </div>
            <ClientPageDivider />
          </>
        )}

        {/* Package Selection */}
        <div className="space-y-6">
          {activePackages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              selected={selectedPackage === pkg.id}
              onSelect={() => handleSelect(pkg.id)}
            />
          ))}
        </div>

        {/* Selected Package Summary */}
        {selectedPackageDetails && (
          <>
            <ClientPageDivider />
            
            <div className="p-5 bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">선택하신 패키지</span>
                <Badge variant="default" className="bg-zinc-900">
                  {selectedPackageDetails.name}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-zinc-900">총 금액</span>
                <span className="text-lg font-bold text-zinc-900">
                  {formatCurrency(selectedPackageDetails.basePrice)}
                </span>
              </div>
            </div>
          </>
        )}

        <ClientPageDivider />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handlePortfolio}
            variant="outline"
            className="w-full h-11 border-zinc-300 text-zinc-900 hover:bg-zinc-50 transition-all"
          >
            포트폴리오 보기
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-12 border-zinc-300"
            >
              이전
            </Button>
            
            <Button
              ref={nextButtonRef}
              onClick={handleNext}
              disabled={!selectedPackage}
              className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 transition-all duration-300"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </ClientPageLayout>
  )
}

