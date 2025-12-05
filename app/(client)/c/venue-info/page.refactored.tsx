'use client'

/**
 * 예식장 정보 입력 페이지 (리팩토링)
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ClientPageLayout, ClientPageHeader, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'

export default function VenueInfoPage() {
  const router = useRouter()
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const { animationClasses, startAnimation } = useClientPageAnimation()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrideName(sessionStorage.getItem('mindgraphy_bride_name') || '')
      setGroomName(sessionStorage.getItem('mindgraphy_groom_name') || '')
    }
  }, [])

  const handleNext = () => {
    if (!brideName.trim() || !groomName.trim()) return
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mindgraphy_bride_name', brideName.trim())
      sessionStorage.setItem('mindgraphy_groom_name', groomName.trim())
    }
    
    startAnimation(() => router.push('/c/venue-contact'))
  }

  const isValid = brideName.trim().length > 0 && groomName.trim().length > 0

  return (
    <ClientPageLayout variant="form" showFooter={false}>
      <div className={animationClasses}>
        {/* Progress */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-1 w-12 rounded-full ${i === 0 ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
          ))}
        </div>

        <ClientPageHeader
          title="예비 신랑 신부님의"
          subtitle="성함을 알려주세요"
        />

        <ClientPageDivider />

        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="bride-name" className="block text-sm font-medium text-zinc-700">
              신부 성함
            </label>
            <Input
              id="bride-name"
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              placeholder="예) 김민지"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="groom-name" className="block text-sm font-medium text-zinc-700">
              신랑 성함
            </label>
            <Input
              id="groom-name"
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              placeholder="예) 이준호"
              className="h-12 text-base"
            />
          </div>
        </div>

        <ClientPageDivider />

        <div className="space-y-4">
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="w-full h-14 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40"
          >
            다음
          </Button>

          <button
            onClick={() => startAnimation(() => router.push('/c/product-type'))}
            className="w-full h-14 text-base text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            이전
          </button>
        </div>
      </div>
    </ClientPageLayout>
  )
}

