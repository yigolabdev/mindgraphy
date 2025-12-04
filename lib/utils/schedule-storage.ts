/**
 * 스케줄 상태 업데이트를 localStorage에 저장하고 불러오는 유틸리티
 */

import type { ScheduleEvent } from '@/lib/mock/schedules'

export interface ScheduleUpdate {
  status: 'on_the_way' | 'in_progress' | 'completed' | 'reserved' | 'uploaded'
  updatedAt: string
  updatedBy: string
}

export interface ScheduleUpdates {
  [scheduleId: string]: ScheduleUpdate
}

export interface ScheduleAcceptance {
  acceptanceStatus: 'pending' | 'accepted' | 'rejected'
  acceptedAt?: string
  acceptedBy?: string
  rejectionReason?: string
}

export interface ScheduleAcceptances {
  [scheduleId: string]: ScheduleAcceptance
}

const STORAGE_KEY = 'mindgraphy_schedule_updates'
const ACCEPTANCE_STORAGE_KEY = 'mindgraphy_schedule_acceptances'

/**
 * localStorage에서 스케줄 업데이트 가져오기
 */
export function getScheduleUpdates(): ScheduleUpdates {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('[ScheduleStorage] Error reading schedule updates:', error)
    return {}
  }
}

/**
 * 스케줄 업데이트 저장
 */
export function saveScheduleUpdate(
  scheduleId: string, 
  status: 'on_the_way' | 'in_progress' | 'completed' | 'reserved' | 'uploaded',
  updatedBy: string
): void {
  if (typeof window === 'undefined') return
  
  try {
    const updates = getScheduleUpdates()
    
    updates[scheduleId] = {
      status,
      updatedAt: new Date().toISOString(),
      updatedBy
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates))
    
    console.log('[ScheduleStorage] Schedule update saved:', { scheduleId, status })
  } catch (error) {
    console.error('[ScheduleStorage] Error saving schedule update:', error)
  }
}

/**
 * mockScheduleEvents에 localStorage의 업데이트를 적용
 */
export function applyScheduleUpdates(schedules: ScheduleEvent[]): ScheduleEvent[] {
  const updates = getScheduleUpdates()
  
  if (Object.keys(updates).length === 0) {
    return schedules
  }
  
  return schedules.map(schedule => {
    const update = updates[schedule.id]
    if (update) {
      return {
        ...schedule,
        status: update.status
      }
    }
    return schedule
  })
}

/**
 * 특정 스케줄의 업데이트된 상태 가져오기
 */
export function getScheduleStatus(scheduleId: string, originalStatus: string): string {
  const updates = getScheduleUpdates()
  const update = updates[scheduleId]
  
  return update ? update.status : originalStatus
}

/**
 * 모든 스케줄 업데이트 및 수락 정보 삭제 (테스트/개발용)
 */
export function clearAllScheduleUpdates(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ACCEPTANCE_STORAGE_KEY)
    console.log('[ScheduleStorage] All schedule updates and acceptances cleared')
  } catch (error) {
    console.error('[ScheduleStorage] Error clearing schedule updates:', error)
  }
}

/**
 * localStorage에서 스케줄 수락/거절 정보 가져오기
 */
export function getScheduleAcceptances(): ScheduleAcceptances {
  if (typeof window === 'undefined') return {}
  
  try {
    const stored = localStorage.getItem(ACCEPTANCE_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('[ScheduleStorage] Error reading schedule acceptances:', error)
    return {}
  }
}

/**
 * 스케줄 수락 저장
 */
export function saveScheduleAcceptance(
  scheduleId: string,
  photographerId: string,
  accept: boolean,
  rejectionReason?: string
): void {
  if (typeof window === 'undefined') return
  
  try {
    const acceptances = getScheduleAcceptances()
    
    acceptances[scheduleId] = {
      acceptanceStatus: accept ? 'accepted' : 'rejected',
      acceptedAt: new Date().toISOString(),
      acceptedBy: photographerId,
      rejectionReason: rejectionReason
    }
    
    localStorage.setItem(ACCEPTANCE_STORAGE_KEY, JSON.stringify(acceptances))
    
    console.log('[ScheduleStorage] Schedule acceptance saved:', { scheduleId, accept })
  } catch (error) {
    console.error('[ScheduleStorage] Error saving schedule acceptance:', error)
  }
}

/**
 * 특정 스케줄의 수락 상태 가져오기
 */
export function getScheduleAcceptanceStatus(scheduleId: string): ScheduleAcceptance | null {
  const acceptances = getScheduleAcceptances()
  return acceptances[scheduleId] || null
}

/**
 * 스케줄에 수락 상태 적용
 */
export function applyScheduleAcceptances(schedules: any[]): any[] {
  const acceptances = getScheduleAcceptances()
  
  const result = schedules.map(schedule => {
    // localStorage에 저장된 수락 정보 확인
    const acceptance = acceptances[schedule.id || schedule.eventId]
    if (acceptance) {
      return {
        ...schedule,
        acceptanceStatus: acceptance.acceptanceStatus,
        acceptedAt: acceptance.acceptedAt,
        rejectionReason: acceptance.rejectionReason
      }
    }
    
    // localStorage에 없으면 mock 데이터의 acceptanceStatus 유지, 없으면 'pending'
    return {
      ...schedule,
      acceptanceStatus: schedule.acceptanceStatus || 'pending'
    }
  })
  
  console.log('[ScheduleStorage] Applied acceptances:', result.map(s => ({
    id: s.id,
    acceptanceStatus: s.acceptanceStatus
  })))
  
  return result
}

/**
 * 모든 스케줄 수락 정보 삭제 (테스트/개발용)
 */
export function clearAllScheduleAcceptances(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(ACCEPTANCE_STORAGE_KEY)
    console.log('[ScheduleStorage] All schedule acceptances cleared')
  } catch (error) {
    console.error('[ScheduleStorage] Error clearing schedule acceptances:', error)
  }
}
