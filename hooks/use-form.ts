/**
 * 폼 상태 관리 커스텀 훅
 */

import { useState, useCallback } from 'react'
import type { ValidationResult } from '@/lib/types/forms'

export interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => ValidationResult
  onSubmit: (values: T) => Promise<void> | void
}

export interface UseFormReturn<T> {
  values: T
  errors: Record<string, string>
  isSubmitting: boolean
  isDirty: boolean
  setValue: (key: keyof T, value: any) => void
  setValues: (values: Partial<T>) => void
  setError: (key: string, message: string) => void
  clearError: (key: string) => void
  clearErrors: () => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  reset: () => void
}

/**
 * 폼 상태 관리 훅
 */
export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>
): UseFormReturn<T> {
  const { initialValues, validate, onSubmit } = options

  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  // 단일 값 업데이트
  const setValue = useCallback((key: keyof T, value: any) => {
    setValuesState(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
    // 해당 필드의 에러 클리어
    if (errors[key as string]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[key as string]
        return next
      })
    }
  }, [errors])

  // 여러 값 동시 업데이트
  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState(prev => ({ ...prev, ...newValues }))
    setIsDirty(true)
  }, [])

  // 에러 설정
  const setError = useCallback((key: string, message: string) => {
    setErrors(prev => ({ ...prev, [key]: message }))
  }, [])

  // 단일 에러 클리어
  const clearError = useCallback((key: string) => {
    setErrors(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  // 모든 에러 클리어
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  // 폼 제출
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // 유효성 검증
    if (validate) {
      const result = validate(values)
      if (!result.isValid) {
        setErrors(result.errors)
        return
      }
    }

    setIsSubmitting(true)
    clearErrors()

    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
      if (error instanceof Error) {
        setError('_form', error.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate, onSubmit, clearErrors, setError])

  // 폼 초기화
  const reset = useCallback(() => {
    setValuesState(initialValues)
    setErrors({})
    setIsSubmitting(false)
    setIsDirty(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    handleSubmit,
    reset,
  }
}

