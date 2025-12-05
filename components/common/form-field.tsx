/**
 * 공통 컴포넌트: Form Field
 * 
 * 폼 필드를 일관되게 표시합니다.
 */

import { memo, ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
  labelClassName?: string
}

/**
 * Form Field Component
 * 
 * 레이블, 입력 필드, 에러 메시지를 일관되게 표시합니다.
 */
export const FormField = memo(({
  label,
  required,
  error,
  hint,
  children,
  className,
  labelClassName
}: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <Label className={cn(labelClassName)}>
        {label}
        {required && (
          <span className="text-red-500 ml-1">*</span>
        )}
      </Label>
      
      {/* Input Field */}
      {children}
      
      {/* Hint */}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      
      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="font-medium">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
})

FormField.displayName = 'FormField'

