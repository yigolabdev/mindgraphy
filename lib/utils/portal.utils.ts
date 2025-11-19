/**
 * Portal-specific utility functions
 * Handles business logic for customer portal operations
 */

import type { PortalStep } from '@/hooks/use-portal-data'

/**
 * Portal step configuration
 */
export const PORTAL_STEPS = [
  { id: 0 as PortalStep, label: '일정확인중', description: '담당자가 일정을 확인하고 있습니다' },
  { id: 1 as PortalStep, label: '일정확정', description: '일정이 확정되었습니다' },
  { id: 2 as PortalStep, label: '입금대기', description: '계약 진행 중입니다' },
  { id: 3 as PortalStep, label: '촬영대기', description: '촬영을 기다리고 있습니다' },
  { id: 4 as PortalStep, label: '사진선택', description: '사진 선택이 가능합니다' },
  { id: 5 as PortalStep, label: '편집중', description: '사진을 편집하고 있습니다' },
  { id: 6 as PortalStep, label: '배송완료', description: '배송이 완료되었습니다' }
] as const

/**
 * Determines if D-Day counter should be shown for given step
 * D-Day is shown for steps 0-3 (before shooting)
 */
export function shouldShowDDay(step: PortalStep): boolean {
  return step <= 3
}

/**
 * Gets the wedding date based on current step
 * Steps 0-3: Past date (already shot)
 * Steps 4-6: Future date (not yet shot)
 */
export function getWeddingDateByStep(step: PortalStep): string {
  return step <= 3 ? '2024-12-01' : '2025-04-12'
}

/**
 * Gets appropriate message for D-Day section
 */
export function getDDayMessage(isPast: boolean, step: PortalStep): {
  title: string
  subtitle: string
} {
  if (step <= 3) {
    return {
      title: isPast ? '촬영일' : '특별한 날까지',
      subtitle: isPast ? '곧 만나뵙게 됩니다' : '소중한 순간을 함께 담을 수 있어 기쁩니다'
    }
  }
  
  return {
    title: '촬영이 진행되었습니다',
    subtitle: '아름다운 순간들을 정성껏 편집하고 있습니다'
  }
}

/**
 * Validates phone number format (Korean)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/
  return phoneRegex.test(phone.replace(/-/g, ''))
}

/**
 * Formats phone number to standard format (010-1234-5678)
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Gets last 4 digits of phone number for password hint
 */
export function getPhoneLastFourDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.slice(-4) || '****'
}

/**
 * Formats wedding time to AM/PM format
 */
export function formatWeddingTime(timeString: string): string {
  if (!timeString || timeString === 'undecided') {
    return '미정'
  }
  
  const [hours, minutes] = timeString.split(':')
  const hour = parseInt(hours)
  const min = minutes || '00'
  
  if (hour < 12) {
    return `오전 ${hour}시 ${min}분`
  } else if (hour === 12) {
    return `오후 12시 ${min}분`
  } else {
    return `오후 ${hour - 12}시 ${min}분`
  }
}

/**
 * Generates shooting day tips based on product type
 */
export function getShootingTips(productType?: string): string[] {
  const commonTips = [
    '편안한 마음으로 자연스러운 표정과 모습을 보여주세요',
    '원하시는 컨셉이나 포즈가 있다면 미리 말씀해 주세요',
    '궁금하신 점은 언제든 작가님께 편하게 질문해 주세요'
  ]
  
  const specificTips: Record<string, string[]> = {
    hanbok: [
      '한복 촬영은 전통미를 살리는 자연스러운 포즈를 권장합니다',
      '소품이나 배경에 대한 요청사항이 있다면 미리 말씀해 주세요',
      ...commonTips
    ],
    baby: [
      '아기의 컨디션에 맞춰 여유롭게 촬영이 진행됩니다',
      '아기가 좋아하는 장난감이나 소품을 준비해 주세요',
      ...commonTips
    ],
    dress_shop: [
      '드레스 피팅 상태를 확인하며 자연스럽게 촬영합니다',
      '원하시는 각도나 디테일 컷이 있다면 말씀해 주세요',
      ...commonTips
    ]
  }
  
  return specificTips[productType || 'wedding'] || commonTips
}

/**
 * Calculates days between two dates
 */
export function calculateDaysBetween(date1: string | Date, date2: string | Date): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  
  const diffTime = d2.getTime() - d1.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Checks if date is in the past
 */
export function isDateInPast(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  
  date.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  return date < today
}

