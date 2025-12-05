'use client'

/**
 * Motto 페이지 (리팩토링)
 * 
 * 개선사항:
 * - ClientPageLayout 적용
 * - useClientPageAnimation 훅 사용
 * - 가독성 개선
 */

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClientPageLayout, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'

// ============================================================================
// Main Component
// ============================================================================

export default function MottoPage() {
  const router = useRouter()
  const { animationClasses, startAnimation } = useClientPageAnimation()

  const handlePortfolio = () => {
    router.push('/c/portfolio')
  }

  const handleNext = () => {
    startAnimation(() => {
      router.push('/c/process')
    })
  }

  const handleBack = () => {
    startAnimation(() => {
      router.back()
    })
  }

  return (
    <ClientPageLayout variant="minimal" showFooter={false}>
      <div className={animationClasses}>
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-light text-zinc-900 tracking-[0.3em] leading-relaxed">
            motto
          </h1>
        </div>

        <ClientPageDivider />

        {/* Content */}
        <div className="space-y-8 text-center">
          <p className="text-sm text-zinc-600 leading-relaxed">
            우리는
          </p>

          <p className="text-sm text-zinc-600 leading-relaxed">
            앞에 계신 분들을 위해서<br />
            한번 더 무릎을 써서 좋은 각도를 잡고<br />
            한번 더 몸이 부서져라 뛰겠습니다
          </p>

          <p className="text-sm text-zinc-600 leading-relaxed">
            행복하기 위해 사진을 찍습니다
          </p>

          <p className="text-sm text-zinc-600 leading-relaxed">
            이 사진들이 비추고 있는 풍경들은<br />
            어쩌면 마음이 바라는 이상향 일지도 모르겠습니다
          </p>

          <p className="text-sm text-zinc-600 leading-relaxed">
            카메라를 내려놓기 전에<br />
            여러분을 향해<br />
            다시 한번 카메라를 들겠습니다.
          </p>

          <div className="pt-4 space-y-2">
            <p className="text-sm text-zinc-600 leading-relaxed">
              마인드그라피는 여러분이<br />
              늘 마음속에 그리던 이상향을 향합니다.
            </p>
            <p className="text-sm text-zinc-500 leading-relaxed">
              마인드그라피 올림
            </p>
          </div>
        </div>

        <ClientPageDivider />

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 text-white transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
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
            소중한 순간을 함께하게 되어 영광입니다
          </p>
        </div>

        <ClientPageDivider />
      </div>
    </ClientPageLayout>
  )
}

