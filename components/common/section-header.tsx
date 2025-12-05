/**
 * 공통 컴포넌트: Section Header
 * 
 * 모든 페이지에서 일관된 섹션 헤더를 제공합니다.
 */

import { memo, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Section Header Component
 * 
 * 페이지 내 섹션의 헤더를 일관되게 표시합니다.
 */
export const SectionHeader = memo(({ 
  icon: Icon, 
  title, 
  description,
  action,
  className,
  size = 'md'
}: SectionHeaderProps) => {
  const sizeClasses = {
    sm: {
      container: 'mb-3',
      iconBox: 'p-1.5',
      icon: 'h-4 w-4',
      title: 'text-base',
      description: 'text-xs'
    },
    md: {
      container: 'mb-4',
      iconBox: 'p-2',
      icon: 'h-5 w-5',
      title: 'text-lg',
      description: 'text-sm'
    },
    lg: {
      container: 'mb-6',
      iconBox: 'p-3',
      icon: 'h-6 w-6',
      title: 'text-xl',
      description: 'text-base'
    }
  }

  const classes = sizeClasses[size]

  return (
    <div className={cn(
      'flex items-start justify-between',
      classes.container,
      className
    )}>
      <div className="flex items-start gap-3 flex-1">
        {Icon && (
          <div className={cn(
            'bg-zinc-900 text-white rounded-lg flex-shrink-0',
            classes.iconBox
          )}>
            <Icon className={classes.icon} />
          </div>
        )}
        <div className="flex-1">
          <h2 className={cn(
            'font-bold text-zinc-900',
            classes.title
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              'text-muted-foreground mt-0.5',
              classes.description
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
      
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  )
})

SectionHeader.displayName = 'SectionHeader'

