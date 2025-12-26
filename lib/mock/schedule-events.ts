/**
 * Mock data for schedule events (meetings, appointments, etc.)
 * 촬영이 아닌 일반 일정(미팅, 약속 등)을 위한 Mock 데이터
 */

import { addDays, format } from 'date-fns'

export type ScheduleEventType = 
  | 'pre-meeting'    // 사전미팅
  | 'meeting'        // 미팅
  | 'conference'     // 회의
  | 'appointment'    // 약속
  | 'vacation'       // 휴가
  | 'training'       // 교육
  | 'other'          // 기타

export type ScheduleEventStatus = 
  | 'scheduled'      // 예정
  | 'confirmed'      // 확정
  | 'cancelled'      // 취소
  | 'completed'      // 완료

export interface ScheduleEvent {
  id: string
  title: string
  type: ScheduleEventType
  status: ScheduleEventStatus
  date: string          // YYYY-MM-DD
  startTime: string     // HH:mm
  endTime: string       // HH:mm
  location?: string
  description?: string
  attendees: string[]   // User IDs
  createdBy: string     // User ID
  createdAt: string
  updatedAt: string
}

const today = new Date()

export const mockScheduleEvents: ScheduleEvent[] = [
  // Today
  {
    id: 'event-1',
    title: '신규 고객 상담',
    type: 'meeting',
    status: 'confirmed',
    date: format(today, 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '11:00',
    location: '본사 상담실',
    description: '웨딩 패키지 상담 - 2025년 6월 예정',
    attendees: ['admin-1', 'photo-1'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -2), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -2), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'event-2',
    title: '월간 팀 회의',
    type: 'conference',
    status: 'confirmed',
    date: format(today, 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '16:00',
    location: '회의실 A',
    description: '이번 달 실적 리뷰 및 다음 달 계획 수립',
    attendees: ['admin-1', 'photo-1', 'photo-2', 'photo-3'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -7), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -7), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // Tomorrow
  {
    id: 'event-3',
    title: '촬영 장비 업체 미팅',
    type: 'meeting',
    status: 'scheduled',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    startTime: '11:00',
    endTime: '12:00',
    location: '강남 소니 스토어',
    description: '신규 카메라 및 렌즈 구매 상담',
    attendees: ['admin-1', 'photo-1'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -3), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -3), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'event-4',
    title: '촬영 기법 워크샵',
    type: 'training',
    status: 'confirmed',
    date: format(addDays(today, 1), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '18:00',
    location: '삼성동 교육센터',
    description: '드론 촬영 기법 및 항공 촬영 라이센스 교육',
    attendees: ['photo-1', 'photo-2', 'photo-3'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -10), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -10), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // 3 days later
  {
    id: 'event-5',
    title: '웨딩박람회 참가',
    type: 'other',
    status: 'confirmed',
    date: format(addDays(today, 3), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '18:00',
    location: '코엑스 Hall A',
    description: '2025 봄 웨딩박람회 - 부스 운영',
    attendees: ['admin-1', 'photo-1', 'photo-2'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -15), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -15), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // 5 days later
  {
    id: 'event-6',
    title: '협력 업체 미팅',
    type: 'meeting',
    status: 'scheduled',
    date: format(addDays(today, 5), 'yyyy-MM-dd'),
    startTime: '15:00',
    endTime: '16:30',
    location: '청담동 스튜디오',
    description: '실내 촬영 장소 계약 논의',
    attendees: ['admin-1'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -1), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -1), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // 7 days later
  {
    id: 'event-7',
    title: '정기 고객 감사 행사',
    type: 'other',
    status: 'scheduled',
    date: format(addDays(today, 7), 'yyyy-MM-dd'),
    startTime: '19:00',
    endTime: '21:00',
    location: '강남 레스토랑',
    description: 'VIP 고객 초청 저녁 식사 및 네트워킹',
    attendees: ['admin-1', 'photo-1', 'photo-2'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -20), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -20), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // 10 days later
  {
    id: 'event-8',
    title: '포토샵 심화 교육',
    type: 'training',
    status: 'scheduled',
    date: format(addDays(today, 10), 'yyyy-MM-dd'),
    startTime: '13:00',
    endTime: '17:00',
    location: '온라인 (Zoom)',
    description: '리터칭 고급 기법 및 배치 프로세싱',
    attendees: ['photo-1', 'photo-2', 'photo-3', 'photo-4'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -5), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -5), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // 14 days later
  {
    id: 'event-9',
    title: '시설 점검',
    type: 'appointment',
    status: 'scheduled',
    date: format(addDays(today, 14), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '12:00',
    location: '본사 스튜디오',
    description: '조명 장비 및 스튜디오 정기 점검',
    attendees: ['admin-1'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -30), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -30), 'yyyy-MM-dd HH:mm:ss'),
  },
  
  // Past events
  {
    id: 'event-10',
    title: '분기 실적 회의',
    type: 'conference',
    status: 'completed',
    date: format(addDays(today, -3), 'yyyy-MM-dd'),
    startTime: '10:00',
    endTime: '12:00',
    location: '본사 회의실',
    description: '1분기 실적 리뷰 및 2분기 목표 설정',
    attendees: ['admin-1', 'photo-1', 'photo-2', 'photo-3'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -10), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -3), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 'event-11',
    title: '마케팅 대행사 미팅',
    type: 'meeting',
    status: 'completed',
    date: format(addDays(today, -7), 'yyyy-MM-dd'),
    startTime: '14:00',
    endTime: '15:30',
    location: '역삼동 마케팅 사무실',
    description: 'SNS 마케팅 전략 논의',
    attendees: ['admin-1'],
    createdBy: 'admin-1',
    createdAt: format(addDays(today, -14), 'yyyy-MM-dd HH:mm:ss'),
    updatedAt: format(addDays(today, -7), 'yyyy-MM-dd HH:mm:ss'),
  },
]

// Helper functions
export function getUpcomingEvents(): ScheduleEvent[] {
  const todayStr = format(today, 'yyyy-MM-dd')
  return mockScheduleEvents
    .filter(event => event.date >= todayStr && event.status !== 'cancelled')
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })
}

export function getTodayEvents(): ScheduleEvent[] {
  const todayStr = format(today, 'yyyy-MM-dd')
  return mockScheduleEvents
    .filter(event => event.date === todayStr && event.status !== 'cancelled')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function getEventsByDateRange(startDate: string, endDate: string): ScheduleEvent[] {
  return mockScheduleEvents
    .filter(event => event.date >= startDate && event.date <= endDate)
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })
}

export function getEventsByType(type: ScheduleEventType): ScheduleEvent[] {
  return mockScheduleEvents.filter(event => event.type === type)
}

export function getEventsByStatus(status: ScheduleEventStatus): ScheduleEvent[] {
  return mockScheduleEvents.filter(event => event.status === status)
}

