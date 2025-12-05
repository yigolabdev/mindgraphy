/**
 * Client Layout Component
 * 
 * 고객용 페이지를 위한 통일된 레이아웃
 */

'use client'

import { ReactNode } from 'react'
import { ClientFooter } from '@/components/client/client-footer'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export type ClientLayoutVariant = 'default' | 'portal' | 'minimal' | 'fullwidth'

interface ClientLayoutProps {
  children: ReactNode
  variant?: ClientLayoutVariant
  showProgress?: boolean
  currentStep?: number
  totalSteps?: number
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

/**
 * Client Layout Component
 * 
 * 고객용 페이지의 통일된 레이아웃을 제공합니다.
 */
export function ClientLayout({ 
  children,
  variant = 'default',
  showProgress = false,
  currentStep = 0,
  totalSteps = 7,
  maxWidth = 'lg'
}: ClientLayoutProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* Header (선택적) */}
      {variant !== 'minimal' && (
        <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-sm">
                  M
                </div>
                <span className="text-lg font-semibold">MindGraphy</span>
              </div>
              
              {/* Progress (선택적) */}
              {showProgress && (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    진행률: {Math.round(progress)}%
                  </span>
                  <div className="w-32">
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Progress Bar (모바일 전용, 선택적) */}
      {showProgress && variant !== 'minimal' && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {currentStep}/{totalSteps}
            </span>
            <Progress value={progress} className="flex-1 h-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1",
        variant === 'portal' && "bg-white",
        variant === 'fullwidth' && "w-full"
      )}>
        <div className={cn(
          variant !== 'fullwidth' && "container mx-auto px-4 py-6 md:py-8",
          maxWidth === 'sm' && "max-w-2xl",
          maxWidth === 'md' && "max-w-4xl",
          maxWidth === 'lg' && "max-w-5xl",
          maxWidth === 'xl' && "max-w-6xl",
          maxWidth === '2xl' && "max-w-7xl",
        )}>
          {children}
        </div>
      </main>

      {/* Footer */}
      {variant !== 'minimal' && <ClientFooter />}
    </div>
  )
}

