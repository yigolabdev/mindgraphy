'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function InquiryPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Fade in on mount
    setIsMounted(true)
  }, [])

  const handleBack = () => {
    router.push('/c/product-type')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "max-w-md w-full space-y-12 transition-all duration-700 ease-out",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
      >
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            상품 문의
          </h1>
          <h2 className="text-base font-light text-zinc-600 tracking-tight leading-relaxed">
            서비스 준비 중입니다
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Content */}
        <div className="space-y-6 text-sm text-zinc-600 leading-relaxed">
          <p>
            직접 상담 및 계약 기능은<br />
            현재 준비 중입니다
          </p>
          
          <div className="p-6 bg-zinc-50 border border-zinc-200 space-y-3">
            <p className="font-medium text-zinc-900">
              문의 방법
            </p>
            <div className="space-y-2">
              <p>
                전화: 02-2202-9966
              </p>
              <p>
                주소: 서울 성동구 마조로15길 6 1층
              </p>
              <p>
                카카오톡: 카카오톡 채널 문의
              </p>
            </div>
          </div>

          <p>
            위 연락처로 문의주시면<br />
            친절하게 안내해 드리겠습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Back Button */}
        <div className="space-y-4">
          <Button
            onClick={handleBack}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "active:scale-[0.98]",
              "shadow-md hover:shadow-lg"
            )}
          >
            이전으로
          </Button>

          <p className="text-xs text-center text-zinc-400 leading-relaxed">
            빠른 시일 내에 서비스를 준비하겠습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

      </div>
    </div>
  )
}
