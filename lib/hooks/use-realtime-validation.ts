import { useState, useEffect, useCallback } from 'react'

type ValidationRule<T> = {
  validate: (value: T) => boolean
  message: string
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid'

interface UseRealtimeValidationOptions<T> {
  value: T
  rules: ValidationRule<T>[]
  debounce?: number
  validateOnChange?: boolean
}

interface ValidationResult {
  status: ValidationStatus
  isValid: boolean
  isInvalid: boolean
  isValidating: boolean
  error: string | null
  touched: boolean
}

/**
 * 실시간 입력 검증 훅
 * 
 * 사용 예시:
 * ```
 * const emailValidation = useRealtimeValidation({
 *   value: email,
 *   rules: [
 *     { validate: (v) => v.length > 0, message: '이메일을 입력해주세요' },
 *     { validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: '올바른 이메일 형식이 아닙니다' }
 *   ],
 *   debounce: 300
 * })
 * ```
 */
export function useRealtimeValidation<T>({
  value,
  rules,
  debounce = 300,
  validateOnChange = true
}: UseRealtimeValidationOptions<T>): ValidationResult {
  const [status, setStatus] = useState<ValidationStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const validate = useCallback(() => {
    if (!validateOnChange && !touched) {
      return
    }

    setStatus('validating')

    // 모든 규칙 검증
    for (const rule of rules) {
      if (!rule.validate(value)) {
        setStatus('invalid')
        setError(rule.message)
        return
      }
    }

    setStatus('valid')
    setError(null)
  }, [value, rules, validateOnChange, touched])

  useEffect(() => {
    if (!validateOnChange && !touched) {
      return
    }

    const timer = setTimeout(() => {
      validate()
    }, debounce)

    return () => clearTimeout(timer)
  }, [value, validate, debounce, validateOnChange, touched])

  // 값이 변경되면 touched를 true로
  useEffect(() => {
    if (value !== null && value !== undefined && value !== '') {
      setTouched(true)
    }
  }, [value])

  return {
    status,
    isValid: status === 'valid',
    isInvalid: status === 'invalid',
    isValidating: status === 'validating',
    error,
    touched
  }
}

/**
 * 여러 필드를 한번에 검증하는 훅
 */
interface UseFormValidationOptions {
  fields: Record<string, {
    value: any
    rules: ValidationRule<any>[]
  }>
  debounce?: number
}

export function useFormValidation({
  fields,
  debounce = 300
}: UseFormValidationOptions) {
  const validations: Record<string, ValidationResult> = {}

  Object.keys(fields).forEach(key => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    validations[key] = useRealtimeValidation({
      value: fields[key].value,
      rules: fields[key].rules,
      debounce
    })
  })

  const isFormValid = Object.values(validations).every(v => v.isValid)
  const hasErrors = Object.values(validations).some(v => v.isInvalid)
  const isValidating = Object.values(validations).some(v => v.isValidating)

  return {
    validations,
    isFormValid,
    hasErrors,
    isValidating
  }
}

/**
 * 공통 검증 규칙들
 */
export const commonValidationRules = {
  required: (fieldName: string): ValidationRule<any> => ({
    validate: (value) => {
      if (typeof value === 'string') {
        return value.trim().length > 0
      }
      return value !== null && value !== undefined
    },
    message: `${fieldName}을(를) 입력해주세요`
  }),

  minLength: (min: number, fieldName: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: `${fieldName}은(는) 최소 ${min}자 이상이어야 합니다`
  }),

  maxLength: (max: number, fieldName: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: `${fieldName}은(는) 최대 ${max}자까지 입력 가능합니다`
  }),

  email: (): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: '올바른 이메일 형식이 아닙니다'
  }),

  phone: (): ValidationRule<string> => ({
    validate: (value) => {
      const digits = value.replace(/\D/g, '')
      return digits.length >= 9 && digits.length <= 11
    },
    message: '올바른 전화번호 형식이 아닙니다'
  }),

  pattern: (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => regex.test(value),
    message
  }),

  custom: (validator: (value: any) => boolean, message: string): ValidationRule<any> => ({
    validate: validator,
    message
  })
}
