'use client'

/**
 * 문의 페이지 (리팩토링)
 * 
 * 개선사항:
 * - ClientPageLayout 적용
 * - useClientPageAnimation 훅 사용
 * - 컴포넌트 분리
 */

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ClientPageLayout, ClientPageHeader, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'
import { Phone, MapPin, MessageCircle } from 'lucide-react'

// ============================================================================
// Sub Components
// ============================================================================

function ContactInfoCard() {
  return (
    <div className="p-6 bg-zinc-50 border border-zinc-200 space-y-4">
      <p className="font-medium text-zinc-900 mb-3">
        문의 방법
      </p>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-zinc-600">전화</p>
            <a 
              href="tel:02-2202-9966" 
              className="text-sm font-medium text-zinc-900 hover:text-zinc-700 transition-colors"
            >
              02-2202-9966
            </a>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-zinc-600">주소</p>
            <p className="text-sm font-medium text-zinc-900">
              서울 성동구 마조로15길 6 1층
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MessageCircle className="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-zinc-600">카카오톡</p>
            <p className="text-sm font-medium text-zinc-900">
              카카오톡 채널 문의
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function InquiryPage() {
  const router = useRouter()
  const { animationClasses } = useClientPageAnimation()

  const handleBack = () => {
    router.push('/c/product-type')
  }

  return (
    <ClientPageLayout variant="minimal" showFooter={false}>
      <div className={animationClasses}>
        {/* Header */}
        <ClientPageHeader
          title="상품 문의"
          subtitle="서비스 준비 중입니다"
        />

        <ClientPageDivider />

        {/* Content */}
        <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
          <p>
            직접 상담 및 계약 기능은<br />
            현재 준비 중입니다
          </p>
          
          <ContactInfoCard />

          <p>
            위 연락처로 문의주시면<br />
            친절하게 안내해 드리겠습니다
          </p>
        </div>

        <ClientPageDivider />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleBack}
            className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            이전으로
          </Button>

          <p className="text-xs text-center text-zinc-400 leading-relaxed">
            빠른 시일 내에 서비스를 준비하겠습니다
          </p>
        </div>

        <ClientPageDivider />
      </div>
    </ClientPageLayout>
  )
}

