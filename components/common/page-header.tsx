/**
 * 공통 컴포넌트: Page Header
 * 
 * 페이지 상단의 일관된 헤더를 제공합니다.
 */

import { memo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  onBack?: () => void
  backLabel?: string
  className?: string
}

/**
 * Page Header Component
 * 
 * 페이지 최상단의 헤더를 일관되게 표시합니다.
 */
export const PageHeader = memo(({
  title,
  description,
  action,
  onBack,
  backLabel = '뒤로 가기',
  className
}: PageHeaderProps) => {
  return (
    <div className={cn('mb-6 md:mb-8', className)}>
      {/* Back Button */}
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backLabel}
        </Button>
      )}
      
      {/* Title & Description */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          {description && (
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
        
        {/* Action */}
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  )
})

PageHeader.displayName = 'PageHeader'

