import { useState, useEffect, useCallback } from 'react'
import type { InquiryFormData } from '@/lib/types'

/**
 * 고객 신청 플로우 관리 훅
 * 
 * 8단계 신청 프로세스의 상태를 관리하고
 * sessionStorage와 동기화
 */

const STORAGE_PREFIX = 'mindgraphy_'

const STORAGE_KEYS = {
  PRODUCT_TYPE: `${STORAGE_PREFIX}product_type`,
  WEDDING_DATE: `${STORAGE_PREFIX}wedding_date`,
  PACKAGE_ID: `${STORAGE_PREFIX}package_id`,
  OPTION_IDS: `${STORAGE_PREFIX}option_ids`,
  WEDDING_VENUE: `${STORAGE_PREFIX}wedding_venue`,
  VENUE_ADDRESS: `${STORAGE_PREFIX}venue_address`,
  VENUE_HALL: `${STORAGE_PREFIX}venue_hall`,
  BRIDE_NAME: `${STORAGE_PREFIX}bride_name`,
  BRIDE_PHONE: `${STORAGE_PREFIX}bride_phone`,
  GROOM_NAME: `${STORAGE_PREFIX}groom_name`,
  GROOM_PHONE: `${STORAGE_PREFIX}groom_phone`,
  EMAIL: `${STORAGE_PREFIX}email`,
  MAIN_CONTACT: `${STORAGE_PREFIX}main_contact`,
  WEDDING_TIME: `${STORAGE_PREFIX}wedding_time`,
} as const

export function useInquiryFlow() {
  const [formData, setFormData] = useState<Partial<InquiryFormData>>({})
  const [isClient, setIsClient] = useState(false)

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true)
  }, [])

  // sessionStorage에서 데이터 로드
  useEffect(() => {
    if (!isClient) return

    const loadedData: Partial<InquiryFormData> = {}

    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const value = sessionStorage.getItem(storageKey)
      if (value) {
        // optionIds는 배열로 파싱
        if (key === 'OPTION_IDS') {
          try {
            loadedData.optionIds = JSON.parse(value)
          } catch {
            loadedData.optionIds = []
          }
        } else {
          const fieldKey = key.toLowerCase().replace(/_/g, '') as keyof InquiryFormData
          ;(loadedData as any)[fieldKey] = value
        }
      }
    })

    setFormData(loadedData)
  }, [isClient])

  // 개별 필드 업데이트
  const updateField = useCallback(<K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K]
  ) => {
    if (!isClient) return

    setFormData(prev => ({ ...prev, [field]: value }))

    // sessionStorage에 저장
    const storageKey = Object.entries(STORAGE_KEYS).find(
      ([key]) => key.toLowerCase().replace(/_/g, '') === field.toLowerCase()
    )?.[1]

    if (storageKey) {
      if (value === null || value === undefined || value === '') {
        sessionStorage.removeItem(storageKey)
      } else {
        const stringValue = Array.isArray(value) ? JSON.stringify(value) : String(value)
        sessionStorage.setItem(storageKey, stringValue)
      }
    }
  }, [isClient])

  // 여러 필드 한번에 업데이트
  const updateFields = useCallback((updates: Partial<InquiryFormData>) => {
    Object.entries(updates).forEach(([key, value]) => {
      updateField(key as keyof InquiryFormData, value as any)
    })
  }, [updateField])

  // 전체 데이터 초기화
  const clearAll = useCallback(() => {
    if (!isClient) return

    setFormData({})
    Object.values(STORAGE_KEYS).forEach(key => {
      sessionStorage.removeItem(key)
    })
  }, [isClient])

  // 특정 단계까지 초기화
  const clearFrom = useCallback((step: keyof typeof STORAGE_KEYS) => {
    if (!isClient) return

    const keys = Object.entries(STORAGE_KEYS)
    const startIndex = keys.findIndex(([key]) => key === step)
    
    if (startIndex >= 0) {
      keys.slice(startIndex).forEach(([, storageKey]) => {
        sessionStorage.removeItem(storageKey)
      })
    }
  }, [isClient])

  // 완료 여부 체크
  const isStepComplete = useCallback((step: number): boolean => {
    switch (step) {
      case 1: // 상품 선택
        return !!formData.productType
      case 2: // 예식일 선택
        return !!formData.weddingDate
      case 3: // 패키지 선택
        return !!formData.packageId
      case 4: // 옵션 선택 (선택 사항)
        return true
      case 5: // 예식장 정보
        return !!formData.weddingVenue && !!formData.venueAddress
      case 6: // 연락처 입력
        return !!formData.groomName && !!formData.brideName && 
               !!formData.email && (!!formData.groomPhone || !!formData.bridePhone)
      case 7: // 예식 상세
        return !!formData.venueHall
      case 8: // 예식일 확정
        return !!formData.weddingTime
      default:
        return false
    }
  }, [formData])

  // 전체 진행률
  const progress = useCallback((): number => {
    const totalSteps = 8
    let completedSteps = 0

    for (let i = 1; i <= totalSteps; i++) {
      if (isStepComplete(i)) {
        completedSteps++
      }
    }

    return Math.round((completedSteps / totalSteps) * 100)
  }, [isStepComplete])

  return {
    formData,
    updateField,
    updateFields,
    clearAll,
    clearFrom,
    isStepComplete,
    progress,
    isClient
  }
}

/**
 * 특정 필드의 값을 가져오는 헬퍼 훅
 */
export function useInquiryField<K extends keyof InquiryFormData>(field: K) {
  const { formData, updateField } = useInquiryFlow()
  
  return {
    value: formData[field],
    setValue: (value: InquiryFormData[K]) => updateField(field, value)
  }
}
