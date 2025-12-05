/**
 * Client Page Layout (특성 유지형)
 * 
 * Client 페이지의 고유한 미니멀 디자인 특성을 유지하면서
 * 내부 일관성을 개선한 레이아웃입니다.
 */

'use client'

import { ReactNode, useState, useEffect } from 'react'
import { ClientFooter } from '@/components/client/client-footer'
import { cn } from '@/lib/utils'

export type ClientPageVariant = 
  | 'minimal'      // 기본: 센터 정렬, max-w-md (상품선택, 패키지 등)
  | 'form'         // 폼: 센터 정렬, max-w-lg (문의하기 등)
  | 'portal'       // 포털: 왼쪽 정렬, max-w-6xl (고객 포털)
  | 'fullscreen'   // 풀스크린: 갤러리 등

interface ClientPageLayoutProps {
  children: ReactNode
  variant?: ClientPageVariant
  showFooter?: boolean
  animate?: boolean
  className?: string
}

/**
 * Client Page Layout
 * 
 * Client 페이지의 미니멀한 특성을 유지하는 레이아웃
 */
export function ClientPageLayout({ 
  children,
  variant = 'minimal',
  showFooter = true,
  animate = true,
  className
}: ClientPageLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (animate) {
      setIsMounted(true)
    }
  }, [animate])

  // variant별 스타일
  const containerClasses = {
    minimal: 'max-w-md w-full space-y-8',      // 기본 상품 선택 페이지
    form: 'max-w-lg w-full space-y-8',         // 폼 페이지
    portal: 'max-w-6xl w-full',                // 포털 대시보드
    fullscreen: 'w-full h-full',               // 갤러리 등
  }

  const wrapperClasses = {
    minimal: 'min-h-screen bg-white flex items-center justify-center p-4',
    form: 'min-h-screen bg-white flex items-center justify-center p-4',
    portal: 'min-h-screen bg-zinc-50 p-4 md:p-6 lg:p-8',
    fullscreen: 'min-h-screen bg-black',
  }

  return (
    <>
      <div className={cn(
        wrapperClasses[variant],
        'overflow-hidden',
        className
      )}>
        <div 
          className={cn(
            containerClasses[variant],
            animate && 'transition-all duration-700 ease-out',
            animate && (isMounted 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8')
          )}
        >
          {children}
        </div>
      </div>
      
      {showFooter && variant !== 'fullscreen' && <ClientFooter />}
    </>
  )
}

/**
 * Client Page Header (미니멀 스타일)
 * 
 * Client 페이지의 고유한 타이포그래피를 유지합니다.
 */
export function ClientPageHeader({
  title,
  subtitle,
  description,
  className
}: {
  title: string
  subtitle?: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('space-y-4 text-center', className)}>
      <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
        {title}
      </h1>
      {subtitle && (
        <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
          {subtitle}
        </h2>
      )}
      {description && (
        <p className="text-sm text-zinc-500 leading-relaxed pt-2">
          {description}
        </p>
      )}
    </div>
  )
}

/**
 * Client Page Divider
 */
export function ClientPageDivider({ className }: { className?: string }) {
  return <div className={cn('border-t border-zinc-200', className)} />
}

/**
 * Client Page Animator (페이지 전환 애니메이션)
 */
export function useClientPageAnimation() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const startAnimation = (callback: () => void, delay = 400) => {
    setIsAnimating(true)
    setTimeout(callback, delay)
  }

  return {
    isMounted,
    isAnimating,
    startAnimation,
    animationClasses: cn(
      'transition-all duration-700 ease-out',
      isMounted 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-8',
      isAnimating && 'opacity-0 -translate-y-8'
    )
  }
}

