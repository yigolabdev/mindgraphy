'use client'

import { cn } from '@/lib/utils'

interface FormLabelProps {
  htmlFor: string
  children: React.ReactNode
  required?: boolean
  optional?: boolean
  className?: string
}

/**
 * 통일된 폼 레이블 컴포넌트
 * 
 * 사용법:
 * - 필수: <FormLabel htmlFor="name" required>이름</FormLabel>
 * - 선택: <FormLabel htmlFor="phone" optional>전화번호</FormLabel>
 * - 기본: <FormLabel htmlFor="email">이메일</FormLabel>
 */
export function FormLabel({
  htmlFor,
  children,
  required = false,
  optional = false,
  className
}: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-zinc-700",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
      {optional && !required && (
        <span className="text-zinc-400 font-normal ml-1">(선택)</span>
      )}
    </label>
  )
}
