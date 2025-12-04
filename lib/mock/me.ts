import { addDays, subDays, format, startOfWeek, addWeeks } from 'date-fns'
import type { ScheduleEvent } from './schedules'

export interface MySchedule {
  id: string
  eventId: string
  date: string
  startTime: string
  endTime: string
  
  // Customer info (from client-facing pages)
  groomName: string
  brideName: string
  groomPhone?: string  // Optional from client input
  bridePhone?: string  // Optional from client input
  email?: string  // Optional from client input
  mainContact?: 'groom' | 'bride'  // Selected main contact
  
  // Product & Venue info
  productType: 'wedding' | 'hanbok' | 'dress_shop' | 'baby'  // From client selection
  packageId: string  // e.g. 'new-basic', 'hanbok-a1'
  packageName: string  // e.g. 'new BASIC', 'A-1'
  optionIds?: string[]  // Selected option IDs (only for wedding)
  optionNames?: string[]  // Selected option names for display
  weddingDate: string  // YYYY-MM-DD (or "미정")
  weddingTime: string  // e.g. "14:00", "오후 2시", or "미정"
  venueName?: string  // For wedding/hanbok (optional for others)
  venueAddress?: string  // For wedding/hanbok
  
  // Process info
  referralSource?: string  // How they found us
  specialRequests?: string  // Free-form requests
  photographerNames?: string[] // Assigned photographers
  
  // Schedule management
  travelTimeMinutes: number
  status: 'upcoming' | 'on_the_way' | 'in_progress' | 'completed' | 'uploaded'
  acceptanceStatus?: 'pending' | 'accepted' | 'rejected'
  rejectionReason?: string
  checklistCompleted: number
  checklistTotal: number
}

export interface WeeklyAvailability {
  date: string // YYYY-MM-DD
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  slots: {
    morning: boolean // 09:00 - 13:00
    afternoon: boolean // 13:00 - 18:00
    evening: boolean // 18:00 - 22:00
  }
  status: 'available' | 'booked' | 'leave' | 'requested_swap'
  note?: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: 'equipment' | 'preparation' | 'travel' | 'post'
}

export interface ShiftSwapRequest {
  id: string
  scheduleId: string
  scheduleName: string
  date: string
  reason: string
  targetPhotographerId?: string
  targetPhotographerName?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

// Current user (photographer)
export const currentUser = {
  id: 'photo-1',
  name: '박작가',
  role: 'photographer',
  email: 'park.photographer@mindgraphy.com',
  phone: '010-1234-5678'
}

const today = new Date()

// My Today's Schedule
export const getTodaySchedule = (): MySchedule[] => {
  return [
    {
      id: 'my-schedule-1',
      eventId: 'schedule-1',
      date: format(today, 'yyyy-MM-dd'),
      startTime: '11:00',
      endTime: '16:00',
      
      // Customer info
      groomName: '홍길동',
      brideName: '김영희',
      groomPhone: '010-1234-5678',
      bridePhone: '010-2345-6789',
      email: 'hong.kim@example.com',
      mainContact: 'bride',
      
      // Product & Venue info
      productType: 'wedding',
      packageId: 'new-basic',
      packageName: 'new BASIC',
      optionIds: ['early-progress', 'outdoor-photography'],
      optionNames: ['얼리 진행', '야외 촬영'],
      weddingDate: format(today, 'yyyy-MM-dd'),
      weddingTime: '오후 2시',
      venueName: '서울 그랜드 웨딩홀',
      venueAddress: '서울시 강남구 테헤란로 123',
      
      // Process info
      referralSource: 'Instagram',
      specialRequests: '야외 정원에서 가족 단체 사진 촬영 희망',
      photographerNames: ['박작가', '최작가'],
      
      // Schedule management
      travelTimeMinutes: 30,
      status: 'upcoming',
      acceptanceStatus: 'accepted',
      checklistCompleted: 3,
      checklistTotal: 5
    },
    {
      id: 'my-schedule-test',
      eventId: 'schedule-test',
      date: format(today, 'yyyy-MM-dd'),
      startTime: '17:00',
      endTime: '21:00',
      
      // Customer info
      groomName: '김태영',
      brideName: '이수진',
      groomPhone: '010-9876-5432',
      bridePhone: '010-8765-4321',
      email: 'kim.lee@example.com',
      mainContact: 'groom',
      
      // Product & Venue info
      productType: 'wedding',
      packageId: 'data',
      packageName: 'DATA',
      optionIds: ['same-day-edit'],
      optionNames: ['당일 속편집'],
      weddingDate: format(today, 'yyyy-MM-dd'),
      weddingTime: '오후 6시',
      venueName: '인천 파라다이스 호텔',
      venueAddress: '인천시 중구',
      
      // Process info
      referralSource: '웨딩홀 제휴',
      specialRequests: '당일 편집 영상을 예식 중간에 상영해주세요',
      photographerNames: ['최작가'],
      
      // Schedule management
      travelTimeMinutes: 60,
      status: 'upcoming',
      acceptanceStatus: 'accepted',
      checklistCompleted: 0,
      checklistTotal: 5
    }
  ]
}

// My Week's Schedule
export const getWeekSchedule = (): MySchedule[] => {
  return [
    // Today - Wedding
    {
      id: 'my-schedule-1',
      eventId: 'schedule-1',
      date: format(today, 'yyyy-MM-dd'),
      startTime: '11:00',
      endTime: '16:00',
      
      groomName: '홍길동',
      brideName: '김영희',
      groomPhone: '010-1234-5678',
      bridePhone: '010-2345-6789',
      email: 'hong.kim@example.com',
      mainContact: 'bride',
      
      productType: 'wedding',
      packageId: 'new-basic',
      packageName: 'new BASIC',
      optionIds: ['early-progress', 'outdoor-photography'],
      optionNames: ['얼리 진행', '야외 촬영'],
      weddingDate: format(today, 'yyyy-MM-dd'),
      weddingTime: '오후 2시',
      venueName: '서울 그랜드 웨딩홀',
      venueAddress: '서울시 강남구 테헤란로 123',
      
      referralSource: 'Instagram',
      specialRequests: '야외 정원에서 가족 단체 사진 촬영 희망',
      photographerNames: ['박작가', '최작가'],
      
      travelTimeMinutes: 30,
      status: 'in_progress',
      checklistCompleted: 3,
      checklistTotal: 5
    },
    // Day after tomorrow - Hanbok
    {
      id: 'my-schedule-2',
      eventId: 'schedule-4',
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      startTime: '10:00',
      endTime: '14:00',
      
      groomName: '정우성',
      brideName: '한가인',
      groomPhone: '010-1111-2222',
      bridePhone: '010-3333-4444',
      mainContact: 'groom',
      
      productType: 'hanbok',
      packageId: 'hanbok-a2',
      packageName: 'A-2',
      weddingDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      weddingTime: '오전 10시',
      venueName: '경복궁 일대',
      venueAddress: '서울시 종로구',
      
      referralSource: '지인 추천',
      specialRequests: '한복 의상은 직접 준비. 경복궁과 북촌 한옥마을 두 곳 촬영 희망',
      photographerNames: ['박작가'],
      
      travelTimeMinutes: 45,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 5 days later - Wedding
    {
      id: 'my-schedule-3',
      eventId: 'schedule-6',
      date: format(addDays(today, 5), 'yyyy-MM-dd'),
      startTime: '13:00',
      endTime: '18:00',
      
      groomName: '최민수',
      brideName: '한예슬',
      groomPhone: '010-5555-6666',
      bridePhone: '010-7777-8888',
      email: 'choi.han@example.com',
      mainContact: 'bride',
      
      productType: 'wedding',
      packageId: 'data',
      packageName: 'DATA',
      optionIds: ['outdoor-photography'],
      optionNames: ['야외 촬영'],
      weddingDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      weddingTime: '오후 3시',
      venueName: '경기 럭셔리 컨벤션',
      venueAddress: '경기도 고양시',
      
      referralSource: '웨딩홀 제휴',
      photographerNames: ['박작가'],
      
      travelTimeMinutes: 90,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    }
  ]
}

// All Upcoming Schedules (including future)
export const getAllUpcomingSchedule = (): MySchedule[] => {
  return [
    // Today - Wedding
    {
      id: 'my-schedule-1',
      eventId: 'schedule-1',
      date: format(today, 'yyyy-MM-dd'),
      startTime: '11:00',
      endTime: '16:00',
      
      groomName: '홍길동',
      brideName: '김영희',
      groomPhone: '010-1234-5678',
      bridePhone: '010-2345-6789',
      email: 'hong.kim@example.com',
      mainContact: 'bride',
      
      productType: 'wedding',
      packageId: 'new-basic',
      packageName: 'new BASIC',
      optionIds: ['early-progress', 'outdoor-photography'],
      optionNames: ['얼리 진행', '야외 촬영'],
      weddingDate: format(today, 'yyyy-MM-dd'),
      weddingTime: '오후 2시',
      venueName: '서울 그랜드 웨딩홀',
      venueAddress: '서울시 강남구 테헤란로 123',
      
      referralSource: 'Instagram',
      specialRequests: '야외 정원에서 가족 단체 사진 촬영 희망',
      photographerNames: ['박작가', '최작가'],
      
      travelTimeMinutes: 30,
      status: 'in_progress',
      checklistCompleted: 3,
      checklistTotal: 5
    },
    // Day after tomorrow - Hanbok
    {
      id: 'my-schedule-2',
      eventId: 'schedule-4',
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      startTime: '10:00',
      endTime: '14:00',
      
      groomName: '정우성',
      brideName: '한가인',
      groomPhone: '010-1111-2222',
      bridePhone: '010-3333-4444',
      mainContact: 'groom',
      
      productType: 'hanbok',
      packageId: 'hanbok-a2',
      packageName: 'A-2',
      weddingDate: format(addDays(today, 2), 'yyyy-MM-dd'),
      weddingTime: '오전 10시',
      venueName: '경복궁 일대',
      venueAddress: '서울시 종로구',
      
      referralSource: '지인 추천',
      specialRequests: '한복 의상은 직접 준비. 경복궁과 북촌 한옥마을 두 곳 촬영 희망',
      photographerNames: ['박작가'],
      
      travelTimeMinutes: 45,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 5 days later - Wedding
    {
      id: 'my-schedule-3',
      eventId: 'schedule-6',
      date: format(addDays(today, 5), 'yyyy-MM-dd'),
      startTime: '13:00',
      endTime: '18:00',
      
      groomName: '최민수',
      brideName: '한예슬',
      groomPhone: '010-5555-6666',
      bridePhone: '010-7777-8888',
      email: 'choi.han@example.com',
      mainContact: 'bride',
      
      productType: 'wedding',
      packageId: 'data',
      packageName: 'DATA',
      optionIds: ['outdoor-photography'],
      optionNames: ['야외 촬영'],
      weddingDate: format(addDays(today, 5), 'yyyy-MM-dd'),
      weddingTime: '오후 3시',
      venueName: '경기 럭셔리 컨벤션',
      venueAddress: '경기도 고양시',
      
      referralSource: '웨딩홀 제휴',
      photographerNames: ['박작가'],
      
      travelTimeMinutes: 90,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 10 days later - Dress Shop
    {
      id: 'my-schedule-4',
      eventId: 'schedule-7',
      date: format(addDays(today, 10), 'yyyy-MM-dd'),
      startTime: '14:00',
      endTime: '17:00',
      
      groomName: '이병헌',
      brideName: '이민정',
      groomPhone: '010-9999-0000',
      mainContact: 'bride',
      
      productType: 'dress_shop',
      packageId: 'dress-shop-basic',
      packageName: 'DRESS SHOP 기본',
      weddingDate: format(addDays(today, 10), 'yyyy-MM-dd'),
      weddingTime: '오후 2시',
      
      referralSource: 'Naver 블로그',
      specialRequests: '가봉 과정도 자세히 찍어주세요',
      photographerNames: ['최작가'],
      
      travelTimeMinutes: 40,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 14 days later - Baby
    {
      id: 'my-schedule-5',
      eventId: 'schedule-8',
      date: format(addDays(today, 14), 'yyyy-MM-dd'),
      startTime: '11:00',
      endTime: '13:00',
      
      groomName: '송중기',
      brideName: '송혜교',
      bridePhone: '010-3030-4040',
      email: 'song.song@example.com',
      mainContact: 'bride',
      
      productType: 'baby',
      packageId: 'baby-basic',
      packageName: 'BABY 돌스냅',
      weddingDate: format(addDays(today, 14), 'yyyy-MM-dd'),
      weddingTime: '오전 11시',
      
      referralSource: 'Instagram',
      specialRequests: '아이가 낮잠을 오전에 자기 때문에 11시 이후 시작 부탁드립니다',
      photographerNames: ['김작가'],
      
      travelTimeMinutes: 35,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 21 days later - Wedding
    {
      id: 'my-schedule-6',
      eventId: 'schedule-9',
      date: format(addDays(today, 21), 'yyyy-MM-dd'),
      startTime: '13:30',
      endTime: '18:30',
      
      groomName: '현빈',
      brideName: '손예진',
      groomPhone: '010-5050-6060',
      bridePhone: '010-7070-8080',
      mainContact: 'groom',
      
      productType: 'wedding',
      packageId: 'new-basic',
      packageName: 'new BASIC',
      optionIds: ['outdoor-photography', 'drone-photography', 'same-day-edit'],
      optionNames: ['야외 촬영', '드론 촬영', '당일 속편집'],
      weddingDate: format(addDays(today, 21), 'yyyy-MM-dd'),
      weddingTime: '오후 4시',
      venueName: '서울 신라호텔',
      venueAddress: '서울시 중구 동호로',
      
      referralSource: '지인 추천',
      photographerNames: ['박작가', '최작가', '김작가'],
      
      travelTimeMinutes: 45,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    },
    // 28 days later - Wedding (Jeju)
    {
      id: 'my-schedule-7',
      eventId: 'schedule-10',
      date: format(addDays(today, 28), 'yyyy-MM-dd'),
      startTime: '14:00',
      endTime: '19:00',
      
      groomName: '공유',
      brideName: '정유미',
      groomPhone: '010-1212-3434',
      bridePhone: '010-5656-7878',
      email: 'gong.jung@example.com',
      mainContact: 'bride',
      
      productType: 'wedding',
      packageId: 'basic',
      packageName: 'BASIC',
      optionIds: ['outdoor-photography', 'drone-photography'],
      optionNames: ['야외 촬영', '드론 촬영'],
      weddingDate: format(addDays(today, 28), 'yyyy-MM-dd'),
      weddingTime: '오후 4시 30분',
      venueName: '제주 롯데호텔',
      venueAddress: '제주시 탑동로',
      
      referralSource: 'Facebook',
      specialRequests: '제주 출장 - 전날 출발 필요. 해변 일몰 촬영 중점 부탁드립니다',
      photographerNames: ['박작가', '김작가'],
      
      travelTimeMinutes: 180,
      status: 'upcoming',
      checklistCompleted: 0,
      checklistTotal: 5
    }
  ]
}

// Weekly Availability (Next 2 weeks)
export const getWeeklyAvailability = (): WeeklyAvailability[] => {
  const availability: WeeklyAvailability[] = []
  const startDate = startOfWeek(today, { weekStartsOn: 0 }) // Sunday

  for (let week = 0; week < 2; week++) {
    for (let day = 0; day < 7; day++) {
      const date = addDays(addWeeks(startDate, week), day)
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Check if there's a schedule on this day
      const hasSchedule = getWeekSchedule().some(s => s.date === dateStr)
      
      availability.push({
        date: dateStr,
        dayOfWeek: day,
        slots: {
          morning: !hasSchedule,
          afternoon: !hasSchedule,
          evening: true
        },
        status: hasSchedule ? 'booked' : 'available',
        note: hasSchedule ? '촬영 예정' : undefined
      })
    }
  }

  return availability
}

// My Checklist
export const getMyChecklist = (): ChecklistItem[] => {
  return [
    {
      id: 'check-1',
      text: '카메라 배터리 완충 (본체 3개)',
      completed: true,
      category: 'equipment'
    },
    {
      id: 'check-2',
      text: '메모리 카드 포맷 및 여유 공간 확인',
      completed: true,
      category: 'equipment'
    },
    {
      id: 'check-3',
      text: '렌즈 청소 (24-70mm, 70-200mm)',
      completed: true,
      category: 'equipment'
    },
    {
      id: 'check-4',
      text: '플래시 배터리 확인',
      completed: false,
      category: 'equipment'
    },
    {
      id: 'check-5',
      text: '드론 배터리 2개 충전',
      completed: false,
      category: 'equipment'
    },
    {
      id: 'check-6',
      text: '이동 경로 확인 (네비게이션)',
      completed: true,
      category: 'travel'
    },
    {
      id: 'check-7',
      text: '예식장 주차 정보 확인',
      completed: false,
      category: 'travel'
    },
    {
      id: 'check-8',
      text: '고객 연락처 저장',
      completed: true,
      category: 'preparation'
    },
    {
      id: 'check-9',
      text: '특이사항 메모 확인',
      completed: true,
      category: 'preparation'
    },
    {
      id: 'check-10',
      text: '날씨 확인 (야외 촬영)',
      completed: false,
      category: 'preparation'
    }
  ]
}

// Shift Swap Requests
export const getShiftSwapRequests = (): ShiftSwapRequest[] => {
  return [
    {
      id: 'swap-1',
      scheduleId: 'schedule-4',
      scheduleName: '정우성 & 한가인 (부산)',
      date: format(addDays(today, 2), 'yyyy-MM-dd'),
      reason: '개인 사정으로 부산 출장이 어렵습니다.',
      targetPhotographerId: 'photo-2',
      targetPhotographerName: '최작가',
      status: 'pending',
      createdAt: format(subDays(today, 1), 'yyyy-MM-dd HH:mm:ss')
    }
  ]
}

// Helper: Toggle checklist item
export const toggleChecklistItem = (id: string, items: ChecklistItem[]): ChecklistItem[] => {
  return items.map(item => 
    item.id === id ? { ...item, completed: !item.completed } : item
  )
}

// Helper: Update availability slot
export const updateAvailabilitySlot = (
  date: string,
  slot: 'morning' | 'afternoon' | 'evening',
  value: boolean,
  availability: WeeklyAvailability[]
): WeeklyAvailability[] => {
  return availability.map(day => {
    if (day.date === date) {
      return {
        ...day,
        slots: {
          ...day.slots,
          [slot]: value
        }
      }
    }
    return day
  })
}

// Helper: Create shift swap request
export const createShiftSwapRequest = (
  scheduleId: string,
  scheduleName: string,
  date: string,
  reason: string,
  targetPhotographerId?: string,
  targetPhotographerName?: string
): ShiftSwapRequest => {
  return {
    id: `swap-${Date.now()}`,
    scheduleId,
    scheduleName,
    date,
    reason,
    targetPhotographerId,
    targetPhotographerName,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}

// Helper: Request leave
export const requestLeave = (
  startDate: string,
  endDate: string,
  reason: string
) => {
  return {
    id: `leave-${Date.now()}`,
    startDate,
    endDate,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
}

