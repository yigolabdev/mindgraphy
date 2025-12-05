/**
 * 폼 유효성 검증 유틸리티
 * 
 * 전체 애플리케이션에서 사용되는 공통 유효성 검증 로직을 제공합니다.
 */

import type { ValidationResult } from '../types/forms'

/**
 * 이메일 유효성 검증
 */
export function validateEmail(email: string): boolean {
  if (!email) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 전화번호 유효성 검증 (한국)
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false
  // 01x-xxxx-xxxx 또는 01xxxxxxxxx 형식
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * 전화번호 포맷팅 (자동)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return ''
  
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '')
  
  // 길이에 따라 포맷팅
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

/**
 * 날짜 유효성 검증
 */
export function validateDate(dateString: string): boolean {
  if (!dateString) return false
  
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

/**
 * 필수 필드 검증
 */
export function validateRequired(value: any, fieldName: string): string | null {
  if (value === null || value === undefined || value === '') {
    return `${fieldName}은(는) 필수 입력 항목입니다`
  }
  return null
}

/**
 * 최소 길이 검증
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value && value.length < minLength) {
    return `${fieldName}은(는) 최소 ${minLength}자 이상이어야 합니다`
  }
  return null
}

/**
 * 최대 길이 검증
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value && value.length > maxLength) {
    return `${fieldName}은(는) 최대 ${maxLength}자까지 입력 가능합니다`
  }
  return null
}

/**
 * 숫자 범위 검증
 */
export function validateRange(value: number, min: number, max: number, fieldName: string): string | null {
  if (value < min || value > max) {
    return `${fieldName}은(는) ${min}에서 ${max} 사이의 값이어야 합니다`
  }
  return null
}

/**
 * 프로젝트 생성 폼 유효성 검증
 */
export function validateCreateProjectForm(formData: any): ValidationResult {
  const errors: Record<string, string> = {}
  
  // 상품 타입
  if (!formData.productType) {
    errors.productType = '상품 타입을 선택해주세요'
  }
  
  // 고객 유형
  if (!formData.clientType) {
    errors.clientType = '고객 유형을 선택해주세요'
  }
  
  // 신랑/신부 이름
  if (!formData.groomName || formData.groomName.length < 2) {
    errors.groomName = '신랑 이름을 2자 이상 입력해주세요'
  }
  if (!formData.brideName || formData.brideName.length < 2) {
    errors.brideName = '신부 이름을 2자 이상 입력해주세요'
  }
  
  // 연락처 (최소 한 명)
  if (!formData.groomPhone && !formData.bridePhone) {
    errors.phone = '최소 한 명의 연락처를 입력해주세요'
  }
  
  // 대표 연락처 유효성
  if (formData.mainContact === 'groom' && !formData.groomPhone) {
    errors.groomPhone = '신랑이 대표 연락처로 선택되었지만 연락처가 없습니다'
  }
  if (formData.mainContact === 'bride' && !formData.bridePhone) {
    errors.bridePhone = '신부가 대표 연락처로 선택되었지만 연락처가 없습니다'
  }
  
  // 전화번호 형식
  if (formData.groomPhone && !validatePhone(formData.groomPhone)) {
    errors.groomPhone = '올바른 전화번호 형식이 아닙니다'
  }
  if (formData.bridePhone && !validatePhone(formData.bridePhone)) {
    errors.bridePhone = '올바른 전화번호 형식이 아닙니다'
  }
  
  // 이메일
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다'
  }
  
  // 패키지
  if (!formData.packageId) {
    errors.packageId = '패키지를 선택해주세요'
  }
  
  // 촬영 날짜
  if (!formData.weddingDate) {
    errors.weddingDate = '촬영 날짜를 선택해주세요'
  } else if (!validateDate(formData.weddingDate)) {
    errors.weddingDate = '올바른 날짜 형식이 아닙니다'
  }
  
  // 촬영 장소
  if (!formData.weddingVenue) {
    errors.weddingVenue = '촬영 장소를 입력해주세요'
  }
  
  // 유입 경로
  if (!formData.sourceType) {
    errors.sourceType = '고객 유입 경로 타입을 선택해주세요'
  }
  
  // 제휴처 선택 (venue-referral인 경우)
  if (formData.sourceType === 'venue-referral' && !formData.venuePartnerId) {
    errors.venuePartnerId = '제휴처를 선택해주세요'
  }
  
  // 결제 정보 (manual-registration인 경우)
  if (formData.sourceType === 'manual-registration') {
    if (!formData.paymentStatus) {
      errors.paymentStatus = '결제 상태를 선택해주세요'
    }
    if (formData.paymentStatus !== 'unpaid' && !formData.paymentMethod) {
      errors.paymentMethod = '결제 방식을 선택해주세요'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 고객 포털 로그인 폼 유효성 검증
 */
export function validateClientLoginForm(formData: any): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!formData.phone) {
    errors.phone = '전화번호를 입력해주세요'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다'
  }
  
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요'
  } else if (formData.password.length !== 4) {
    errors.password = '비밀번호는 4자리 숫자입니다'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 배송 정보 폼 유효성 검증
 */
export function validateDeliveryAddressForm(formData: any): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!formData.recipientName) {
    errors.recipientName = '받는 분 이름을 입력해주세요'
  }
  
  if (!formData.recipientPhone) {
    errors.recipientPhone = '연락처를 입력해주세요'
  } else if (!validatePhone(formData.recipientPhone)) {
    errors.recipientPhone = '올바른 전화번호 형식이 아닙니다'
  }
  
  if (!formData.postalCode) {
    errors.postalCode = '우편번호를 입력해주세요'
  }
  
  if (!formData.address) {
    errors.address = '주소를 입력해주세요'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 상품 폼 유효성 검증
 */
export function validateProductForm(formData: any): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!formData.name) {
    errors.name = '상품명을 입력해주세요'
  }
  
  if (!formData.category) {
    errors.category = '카테고리를 선택해주세요'
  }
  
  if (!formData.title) {
    errors.title = '상품 제목을 입력해주세요'
  }
  
  if (!formData.basePrice || formData.basePrice < 0) {
    errors.basePrice = '올바른 가격을 입력해주세요'
  }
  
  if (!formData.description || formData.description.length === 0) {
    errors.description = '상품 설명을 입력해주세요'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 스케줄 생성 폼 유효성 검증
 */
export function validateCreateScheduleForm(formData: any): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!formData.productType) {
    errors.productType = '촬영 타입을 선택해주세요'
  }
  
  if (!formData.groomName) {
    errors.groomName = '신랑 이름을 입력해주세요'
  }
  
  if (!formData.brideName) {
    errors.brideName = '신부 이름을 입력해주세요'
  }
  
  if (!formData.phone) {
    errors.phone = '연락처를 입력해주세요'
  } else if (!validatePhone(formData.phone)) {
    errors.phone = '올바른 전화번호 형식이 아닙니다'
  }
  
  if (!formData.weddingDate) {
    errors.weddingDate = '촬영 날짜를 선택해주세요'
  }
  
  if (!formData.venue) {
    errors.venue = '촬영 장소를 입력해주세요'
  }
  
  if (!formData.packageId) {
    errors.packageId = '패키지를 선택해주세요'
  }
  
  if (!formData.photographerIds || formData.photographerIds.length === 0) {
    errors.photographerIds = '최소 1명의 작가를 선택해주세요'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * 공통 폼 에러 메시지 표시 헬퍼
 */
export function getErrorMessage(errors: Record<string, string>, field: string): string | undefined {
  return errors[field]
}

/**
 * 폼 에러 존재 여부 확인
 */
export function hasFormErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0
}

/**
 * 첫 번째 에러 필드로 스크롤
 */
export function scrollToFirstError(errors: Record<string, string>) {
  const firstErrorField = Object.keys(errors)[0]
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                   document.querySelector(`#${firstErrorField}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (element instanceof HTMLElement) {
        element.focus()
      }
    }
  }
}

