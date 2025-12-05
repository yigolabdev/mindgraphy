/**
 * 로딩 컴포넌트
 * 
 * 데이터 로딩 중 표시되는 스켈레톤 및 로딩 UI
 */

import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// ============================================================================
// 전체 페이지 로딩
// ============================================================================

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      className
    )}>
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-zinc-400" />
        <p className="text-sm text-muted-foreground">로딩 중...</p>
      </div>
    </div>
  )
}

// ============================================================================
// 섹션 로딩
// ============================================================================

export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn("py-12 flex items-center justify-center", className)}>
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-zinc-400" />
        <p className="text-xs text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    </div>
  )
}

// ============================================================================
// 인라인 로딩
// ============================================================================

export function InlineLoader({ 
  text = "로딩 중...",
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

// ============================================================================
// 프로젝트 카드 스켈레톤
// ============================================================================

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProjectListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// 고객 카드 스켈레톤
// ============================================================================

export function CustomerCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

export function CustomerListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ============================================================================
// 테이블 스켈레톤
// ============================================================================

export function TableSkeleton({ 
  rows = 5, 
  cols = 4 
}: { 
  rows?: number
  cols?: number 
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// 폼 스켈레톤
// ============================================================================

export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// ============================================================================
// 버튼 로딩
// ============================================================================

export function ButtonLoader({ 
  text = "처리 중...",
  className 
}: {
  text?: string
  className?: string
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {text}
    </span>
  )
}

