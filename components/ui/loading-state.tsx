'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * 로딩 상태 컴포넌트
 */
export function LoadingState({ 
  message = '로딩 중...', 
  size = 'md',
  className 
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader2 className={cn("animate-spin text-zinc-400", sizeClasses[size])} />
      {message && (
        <p className="text-sm text-muted-foreground mt-4">{message}</p>
      )}
    </div>
  )
}

/**
 * Skeleton 로딩 (테이블용)
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-zinc-100 rounded-lg animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        />
      ))}
    </div>
  )
}

/**
 * Skeleton 로딩 (카드용)
 */
export function CardSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="p-6 border rounded-lg space-y-3 animate-pulse"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-6 bg-zinc-200 rounded w-3/4" />
          <div className="h-4 bg-zinc-100 rounded w-full" />
          <div className="h-4 bg-zinc-100 rounded w-5/6" />
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton 로딩 (폼용)
 */
export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-24" />
        <div className="h-12 bg-zinc-100 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-32" />
        <div className="h-12 bg-zinc-100 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-28" />
        <div className="h-24 bg-zinc-100 rounded" />
      </div>
    </div>
  )
}
