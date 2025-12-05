/**
 * 고객 포털 데이터 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react'
import { getCustomerByPhone, getProjectByCustomerId } from '@/lib/utils/customer-registration'
import { useDataSync } from '@/lib/utils/sync'
import type { Customer, Project } from '@/lib/types'

export interface PortalData {
  customer: Customer | null
  project: Project | null
  currentStep: number
  progress: number
}

export interface UsePortalDataReturn {
  data: PortalData | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  updateRequest: (content: string) => Promise<void>
  ratePhotographer: (rating: number, review: string) => Promise<void>
}

/**
 * 고객 포털 데이터 관리 훅
 */
export function usePortalData(phone: string): UsePortalDataReturn {
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const { subscribe } = useDataSync()

  // 데이터 로드
  const loadData = useCallback(async () => {
    if (!phone) {
      setData(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // 고객 정보 조회
      const customer = getCustomerByPhone(phone)
      if (!customer) {
        throw new Error('고객 정보를 찾을 수 없습니다')
      }
      
      // 프로젝트 정보 조회
      const project = getProjectByCustomerId(customer.id)
      if (!project) {
        throw new Error('프로젝트 정보를 찾을 수 없습니다')
      }

      // 현재 단계 계산
      const currentStep = calculateStep(customer, project)
      const progress = calculateProgress(currentStep)

      setData({
        customer,
        project,
        currentStep,
        progress,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('데이터 로드 실패'))
    } finally {
      setLoading(false)
    }
  }, [phone])

  // 초기 로드
  useEffect(() => {
    loadData()
  }, [loadData])

  // 실시간 동기화
  useEffect(() => {
    const unsubscribe = subscribe('ALL', (message) => {
      if (
        message.type.includes('CUSTOMER') || 
        message.type.includes('PROJECT') ||
        message.type === 'DATA_REFRESHED'
      ) {
        loadData()
      }
    })

    return unsubscribe
  }, [subscribe, loadData])

  // 요청사항 추가
  const updateRequest = useCallback(async (content: string) => {
    // TODO: API 호출
    console.log('Request added:', content)
    await loadData()
  }, [loadData])

  // 작가 평가
  const ratePhotographer = useCallback(async (rating: number, review: string) => {
    // TODO: API 호출
    console.log('Rating submitted:', rating, review)
    await loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    refresh: loadData,
    updateRequest,
    ratePhotographer,
  }
}

/**
 * 현재 단계 계산
 */
function calculateStep(customer: Customer, project: Project): number {
  // leadStatus 기반 단계 계산
  switch (customer.leadStatus) {
    case 'inquiry':
      return 0 // 일정 확인 중
    case 'consultation':
      return 1 // 일정 확정
    case 'proposal':
      return 1 // 일정 확정
    case 'contracted':
      // 프로젝트 상태에 따라 세분화
      switch (project.projectStatus) {
        case 'scheduled':
          return 2 // 입금 대기
        case 'in_progress':
          return 3 // 촬영 대기
        case 'proof_ready':
          return 4 // 사진 선택
        case 'editing':
          return 5 // 편집 중
        case 'completed':
        case 'delivered':
          return 6 // 배송 완료
        default:
          return 2
      }
    case 'completed':
      return 6 // 배송 완료
    default:
      return 0
  }
}

/**
 * 진행률 계산
 */
function calculateProgress(step: number): number {
  const totalSteps = 7
  return Math.round((step / (totalSteps - 1)) * 100)
}
