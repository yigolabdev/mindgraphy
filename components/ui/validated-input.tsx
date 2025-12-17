'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

interface ValidatedInputProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  validation?: {
    status: 'idle' | 'validating' | 'valid' | 'invalid'
    error: string | null
    touched: boolean
  }
  label?: string
  required?: boolean
  optional?: boolean
  showValidation?: boolean
}

/**
 * 실시간 검증 피드백이 있는 Input 컴포넌트
 * 
 * 사용 예시:
 * ```tsx
 * const emailValidation = useRealtimeValidation({
 *   value: email,
 *   rules: [commonValidationRules.required('이메일'), commonValidationRules.email()]
 * })
 * 
 * <ValidatedInput
 *   label="이메일"
 *   required
 *   value={email}
 *   onChange={setEmail}
 *   validation={emailValidation}
 * />
 * ```
 */
export function ValidatedInput({
  value,
  onChange,
  validation,
  label,
  required,
  optional,
  showValidation = true,
  className,
  ...props
}: ValidatedInputProps) {
  const showStatus = showValidation && validation && validation.touched
  const isValid = showStatus && validation.status === 'valid'
  const isInvalid = showStatus && validation.status === 'invalid'
  const isValidating = showStatus && validation.status === 'validating'

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {optional && !required && (
            <span className="text-zinc-400 font-normal ml-1">(선택)</span>
          )}
        </label>
      )}

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "pr-10 transition-all duration-200",
            isValid && "border-green-500 focus:border-green-600",
            isInvalid && "border-red-500 focus:border-red-600",
            className
          )}
          {...props}
        />

        {/* Validation Icon */}
        {showStatus && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValidating && (
              <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
            )}
            {isValid && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {isInvalid && (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showStatus && isInvalid && validation.error && (
        <p className="text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {validation.error}
        </p>
      )}

      {/* Success Message (optional) */}
      {showStatus && isValid && (
        <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-3 w-3" />
          올바른 형식입니다
        </p>
      )}
    </div>
  )
}

/**
 * Textarea 버전
 */
import { Textarea } from '@/components/ui/textarea'

interface ValidatedTextareaProps extends Omit<React.ComponentProps<'textarea'>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  validation?: {
    status: 'idle' | 'validating' | 'valid' | 'invalid'
    error: string | null
    touched: boolean
  }
  label?: string
  required?: boolean
  optional?: boolean
  showValidation?: boolean
}

export function ValidatedTextarea({
  value,
  onChange,
  validation,
  label,
  required,
  optional,
  showValidation = true,
  className,
  ...props
}: ValidatedTextareaProps) {
  const showStatus = showValidation && validation && validation.touched
  const isValid = showStatus && validation.status === 'valid'
  const isInvalid = showStatus && validation.status === 'invalid'
  const isValidating = showStatus && validation.status === 'validating'

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-zinc-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {optional && !required && (
            <span className="text-zinc-400 font-normal ml-1">(선택)</span>
          )}
        </label>
      )}

      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "transition-all duration-200",
            isValid && "border-green-500 focus:border-green-600",
            isInvalid && "border-red-500 focus:border-red-600",
            className
          )}
          {...props}
        />

        {/* Validation Icon */}
        {showStatus && (
          <div className="absolute right-3 top-3">
            {isValidating && (
              <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" />
            )}
            {isValid && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {isInvalid && (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {showStatus && isInvalid && validation.error && (
        <p className="text-xs text-red-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3" />
          {validation.error}
        </p>
      )}

      {/* Success Message */}
      {showStatus && isValid && (
        <p className="text-xs text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="h-3 w-3" />
          올바른 형식입니다
        </p>
      )}
    </div>
  )
}
