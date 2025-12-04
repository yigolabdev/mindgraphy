import { addDays, subDays, format } from 'date-fns'

export type ScheduleStatus = 'reserved' | 'on_the_way' | 'in_progress' | 'editing' | 'completed' | 'cancelled' | 'uploaded'
export type ProductType = 'wedding' | 'hanbok' | 'dress_shop' | 'baby'
export type VenueType = 'hotel' | 'convention' | 'outdoor' | 'studio'

export interface ScheduleEvent {
  id: string
  title: string
  start: string
  end: string
  
  // Client info
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  mainContact?: 'groom' | 'bride' // 대표 연락처
  email?: string
  referralSource?: string
  contractId: string
  clientPortalToken: string
  projectDetailId?: string // 프로젝트 상세 페이지 연결용
  projectId?: string // ✅ 추가: 프로젝트 ID (백엔드 통합용)
  
  // Venue info
  venueName: string
  venueType: VenueType
  ballroom?: string
  venueAddress: string
  venuePhone?: string
  
  // Schedule details
  ceremonyTime: string
  makeupTime?: string
  makeupLocation?: string
  
  // Assignment (복수 작가 지원)
  photographerIds?: string[]
  photographerNames?: string[]
  assistantIds?: string[]
  
  // Product & Package & Options
  productType: ProductType  // 상품 유형 (웨딩, 한복 등)
  packageId: string  // ✅ 패키지 ID (백엔드 통합용: 'new-basic', 'data', 'hanbok-a2' 등)
  packageName: string  // 패키지 이름 (표시용: 'new BASIC', 'DATA' 등)
  options: string[]  // ❌ 레거시: 선택한 옵션들 (자유 텍스트)
  
  // ✅ 추가: 백엔드 통합용 정형화된 필드
  optionIds?: string[]  // 옵션 ID 목록 (예: ['option-lead-photographer', 'option-60p'])
  isAlbumType?: boolean  // 앨범형 여부 (true: 앨범형, false: 데이터형)
  
  // ✅ 추가: 명시적 특수 옵션 (백엔드가 직접 제공 가능)
  packageOptions?: {
    hasLeadPhotographer?: boolean     // 대표작가 지정
    hasSeniorPhotographer?: boolean   // 수석작가 지정
    hasExtraGift?: boolean            // 작가 추가 선물
    hasNewStructure?: boolean         // 60페이지 구성
    hasDirectorOption?: boolean       // 이사 지정
  }
  
  // Status & Meta
  status: ScheduleStatus
  specialRequests?: string
  internalNotes?: string
  internalNotesTimestamp?: string
  travelTimeMinutes?: number
  
  // Colors for calendar
  backgroundColor: string
  borderColor: string
  textColor: string
}

// Schedule용 간소화된 Photographer 타입 (lib/types.ts의 Photographer와 구분)
export interface SchedulePhotographer {
  id: string
  name: string
  color: string
  availabilityStatus: 'available' | 'busy' | 'on_leave'
  phone?: string
}

// Photographers (Schedule용)
export const mockSchedulePhotographers: SchedulePhotographer[] = [
  {
    id: 'photo-1',
    name: '박작가',
    color: '#3b82f6', // blue
    availabilityStatus: 'available',
    phone: '010-1234-5678'
  },
  {
    id: 'photo-2',
    name: '최작가',
    color: '#8b5cf6', // purple
    availabilityStatus: 'available',
    phone: '010-2345-6789'
  },
  {
    id: 'photo-3',
    name: '김작가',
    color: '#10b981', // green
    availabilityStatus: 'busy',
    phone: '010-3456-7890'
  },
  {
    id: 'photo-4',
    name: '이작가',
    color: '#f59e0b', // amber
    availabilityStatus: 'on_leave',
    phone: '010-4567-8901'
  },
  {
    id: 'photo-5',
    name: '정작가',
    color: '#ec4899', // pink
    availabilityStatus: 'available',
    phone: '010-5678-9012'
  },
  {
    id: 'photo-6',
    name: '강작가',
    color: '#14b8a6', // teal
    availabilityStatus: 'available',
    phone: '010-6789-0123'
  },
  {
    id: 'photo-7',
    name: '조작가',
    color: '#f97316', // orange
    availabilityStatus: 'on_leave',
    phone: '010-7890-1234'
  },
  {
    id: 'photo-8',
    name: '윤작가',
    color: '#06b6d4', // cyan
    availabilityStatus: 'available',
    phone: '010-8901-2345'
  },
  {
    id: 'photo-9',
    name: '장작가',
    color: '#8b5cf6', // violet
    availabilityStatus: 'on_leave',
    phone: '010-9012-3456'
  },
  {
    id: 'photo-10',
    name: '한작가',
    color: '#84cc16', // lime
    availabilityStatus: 'available',
    phone: '010-0123-4567'
  },
  {
    id: 'photo-11',
    name: '신작가',
    color: '#3b82f6', // blue
    availabilityStatus: 'available',
    phone: '010-1122-3344'
  },
  {
    id: 'photo-12',
    name: '오작가',
    color: '#ef4444', // red
    availabilityStatus: 'available',
    phone: '010-2233-4455'
  },
  {
    id: 'photo-13',
    name: '배작가',
    color: '#06b6d4', // cyan
    availabilityStatus: 'available',
    phone: '010-3344-5566'
  },
  {
    id: 'photo-14',
    name: '임작가',
    color: '#8b5cf6', // violet
    availabilityStatus: 'available',
    phone: '010-4455-6677'
  },
  {
    id: 'photo-15',
    name: '황작가',
    color: '#10b981', // emerald
    availabilityStatus: 'available',
    phone: '010-5566-7788'
  }
]

// Status color mapping
const statusColors: Record<ScheduleStatus, { backgroundColor: string; borderColor: string; textColor: string }> = {
  reserved: { backgroundColor: '#dbeafe', borderColor: '#3b82f6', textColor: '#1e40af' },
  on_the_way: { backgroundColor: '#dbeafe', borderColor: '#3b82f6', textColor: '#1e40af' },
  in_progress: { backgroundColor: '#fef3c7', borderColor: '#f59e0b', textColor: '#92400e' },
  editing: { backgroundColor: '#e9d5ff', borderColor: '#a855f7', textColor: '#6b21a8' },
  completed: { backgroundColor: '#d1fae5', borderColor: '#10b981', textColor: '#065f46' },
  cancelled: { backgroundColor: '#f3f4f6', borderColor: '#9ca3af', textColor: '#4b5563' },
  uploaded: { backgroundColor: '#f3e8ff', borderColor: '#7c3aed', textColor: '#5b21b6' }
}

const today = new Date()

// Generate mock schedule events
export const mockScheduleEvents: ScheduleEvent[] = [
  // Today - Early Morning (Completed)
  {
    id: 'schedule-0-1',
    title: '서진우 & 송하나',
    start: `${format(today, 'yyyy-MM-dd')}T09:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T12:00:00`,
    groomName: '서진우',
    brideName: '송하나',
    groomPhone: '010-1010-2020',
    bridePhone: '010-3030-4040',
    contractId: 'contract-010',
    clientPortalToken: 'token-010',
    venueName: '명동 웨딩홀',
    venueType: 'weddingHall' as VenueType,
    ballroom: '1층 로얄홀',
    venueAddress: '서울시 중구 명동길 50',
    venuePhone: '02-777-8888',
    ceremonyTime: '10:00',
    photographerIds: ['photo-10'],
    photographerNames: ['한작가'],
    productType: 'wedding',
    packageId: 'new-data',
    packageName: 'new DATA',
    options: ['메이크업샵 촬영'],
    status: 'completed',
    travelTimeMinutes: 20,
    ...statusColors.completed
  },

  // Today - Morning (Completed)
  {
    id: 'schedule-0-2',
    title: '조현우 & 박서연',
    start: `${format(today, 'yyyy-MM-dd')}T08:30:00`,
    end: `${format(today, 'yyyy-MM-dd')}T11:30:00`,
    groomName: '조현우',
    brideName: '박서연',
    groomPhone: '010-5050-6060',
    bridePhone: '010-7070-8080',
    contractId: 'contract-011',
    clientPortalToken: 'token-011',
    venueName: '잠실 롯데호텔',
    venueType: 'hotel',
    ballroom: '사파이어 볼룸',
    venueAddress: '서울시 송파구 올림픽로 240',
    venuePhone: '02-759-7311',
    ceremonyTime: '09:30',
    photographerIds: ['photo-4', 'photo-11'],
    photographerNames: ['이작가', '신작가'],
    productType: 'wedding',
    packageId: 'basic',
    packageName: 'BASIC',
    options: ['2인 작가', '원본 초고화질 다운로드'],
    status: 'completed',
    travelTimeMinutes: 30,
    ...statusColors.completed
  },

  // Today - Morning (In Progress) - 2명 작가
  {
    id: 'schedule-1',
    title: '홍길동 & 김영희',
    start: `${format(today, 'yyyy-MM-dd')}T11:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T16:00:00`,
    groomName: '홍길동',
    brideName: '김영희',
    groomPhone: '010-1234-5678',
    bridePhone: '010-2345-6789',
    mainContact: 'bride', // 대표 연락처: 신부
    contractId: 'contract-001',
    clientPortalToken: 'token-001',
    projectId: 'project-001', // ✅ 추가
    venueName: '서울 그랜드 호텔',
    venueType: 'hotel',
    ballroom: '그랜드 볼룸 1관',
    venueAddress: '서울시 강남구 테헤란로 123',
    venuePhone: '02-1234-5678',
    ceremonyTime: '14:00',
    makeupTime: '11:00',
    makeupLocation: '호텔 내 뷰티살롱',
    photographerIds: ['photo-1', 'photo-2'],
    photographerNames: ['박작가', '최작가'],
    assistantIds: [],
    productType: 'wedding',
    packageId: 'data', // ✅ 실제 Product ID
    packageName: '2인 데이터형',
    options: ['대표작가 지정', '야외촬영', '드론촬영', '당일편집'], // 레거시
    optionIds: ['option-lead-photographer'], // ✅ 추가
    isAlbumType: false, // ✅ 추가
    packageOptions: { // ✅ 추가
      hasLeadPhotographer: true,
      hasSeniorPhotographer: false,
      hasExtraGift: false,
      hasNewStructure: false,
      hasDirectorOption: false
    },
    status: 'in_progress',
    specialRequests: '야외 정원에서 가족 단체 사진 촬영 희망',
    internalNotes: '날씨 확인 필요, 드론 배터리 2개 준비',
    internalNotesTimestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    travelTimeMinutes: 30,
    ...statusColors.in_progress
  },
  
  // Today - Afternoon (In Progress)
  {
    id: 'schedule-2',
    title: '이철수 & 박민지',
    start: `${format(today, 'yyyy-MM-dd')}T13:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T17:00:00`,
    groomName: '이철수',
    brideName: '박민지',
    groomPhone: '010-3333-4444',
    bridePhone: '010-5555-6666',
    mainContact: 'groom', // 대표 연락처: 신랑
    contractId: 'contract-002',
    clientPortalToken: 'token-002',
    projectId: 'project-002', // ✅ 추가
    venueName: '코엑스 컨벤션',
    venueType: 'convention',
    ballroom: '3층 크리스탈 홀',
    venueAddress: '서울시 강남구 영동대로 513',
    venuePhone: '02-6000-0000',
    ceremonyTime: '14:00',
    photographerIds: ['photo-5', 'photo-6'],
    photographerNames: ['정작가', '강작가'],
    productType: 'wedding',
    packageId: 'new-data', // ✅ 실제 Product ID
    packageName: '1인 데이터형',
    options: ['작가 추가 선물', '메이크업 촬영'], // 레거시
    optionIds: ['option-extra-gift'], // ✅ 추가
    isAlbumType: false, // ✅ 추가
    packageOptions: { // ✅ 추가
      hasLeadPhotographer: false,
      hasSeniorPhotographer: false,
      hasExtraGift: true,
      hasNewStructure: false,
      hasDirectorOption: false
    },
    status: 'in_progress',
    specialRequests: '하객 단체 사진 많이 촬영 요청',
    travelTimeMinutes: 45,
    ...statusColors.in_progress
  },

  // Today - Early Afternoon (In Progress) - 3명 작가
  {
    id: 'schedule-2-1',
    title: '정수호 & 이지은',
    start: `${format(today, 'yyyy-MM-dd')}T12:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T16:30:00`,
    groomName: '정수호',
    brideName: '이지은',
    groomPhone: '010-1111-2222',
    bridePhone: '010-3333-4444',
    mainContact: 'bride', // 대표 연락처: 신부
    contractId: 'contract-012',
    clientPortalToken: 'token-012',
    projectId: 'project-012', // ✅ 추가
    venueName: '경주 힐튼 호텔',
    venueType: 'hotel',
    ballroom: '로열 볼룸',
    venueAddress: '경북 경주시 보문로 424',
    venuePhone: '054-745-7788',
    ceremonyTime: '13:30',
    photographerIds: ['photo-8', 'photo-10', 'photo-12'],
    photographerNames: ['윤작가', '한작가', '오작가'],
    productType: 'wedding',
    packageId: 'new-basic', // ✅ 실제 Product ID
    packageName: '2인 앨범형',
    options: ['대표작가 지정', '야외촬영', '당일편집', '60페이지 구성'], // 레거시
    optionIds: ['option-lead-photographer', 'option-60p'], // ✅ 추가
    isAlbumType: true, // ✅ 추가
    packageOptions: { // ✅ 추가
      hasLeadPhotographer: true,
      hasSeniorPhotographer: false,
      hasExtraGift: false,
      hasNewStructure: true,
      hasDirectorOption: false
    },
    status: 'in_progress',
    specialRequests: '경주 전통 건축물 배경으로 촬영',
    internalNotes: '이동 시간 고려 필요',
    travelTimeMinutes: 180,
    ...statusColors.in_progress
  },
  
  // Today - Evening (Reserved) - 2명 작가
  {
    id: 'schedule-2-2',
    title: '김태영 & 최수진',
    start: `${format(today, 'yyyy-MM-dd')}T17:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T20:30:00`,
    groomName: '김태영',
    brideName: '최수진',
    groomPhone: '010-5555-6666',
    bridePhone: '010-7777-8888',
    contractId: 'contract-013',
    clientPortalToken: 'token-013',
    venueName: '인천 파라다이스 호텔',
    venueType: 'hotel',
    ballroom: '스카이 볼룸',
    venueAddress: '인천시 중구 공항로 424',
    venuePhone: '032-745-5000',
    ceremonyTime: '18:00',
    makeupTime: '15:00',
    makeupLocation: '호텔 스위트룸',
    photographerIds: ['photo-3', 'photo-13'],
    photographerNames: ['김작가', '배작가'],
    productType: 'wedding' as ProductType,
    packageId: 'mind-g',
    packageName: '1인 데이터형',
    options: ['대표작가 지정', '야외촬영', '드론촬영', '프리웨딩 앨범'],
    status: 'reserved',
    specialRequests: '인천 바다 배경 스냅 촬영',
    travelTimeMinutes: 60,
    ...statusColors.reserved
  },

  // Today - Late Evening (Reserved) - 2명 작가
  {
    id: 'schedule-2-3',
    title: '박준영 & 한소희',
    start: `${format(today, 'yyyy-MM-dd')}T18:30:00`,
    end: `${format(today, 'yyyy-MM-dd')}T22:00:00`,
    groomName: '박준영',
    brideName: '한소희',
    groomPhone: '010-2222-3333',
    bridePhone: '010-4444-5555',
    contractId: 'contract-014',
    clientPortalToken: 'token-014',
    venueName: '부산 웨스틴 조선',
    venueType: 'hotel',
    ballroom: '그랜드 볼룸',
    venueAddress: '부산시 해운대구 동백로 67',
    venuePhone: '051-749-7000',
    ceremonyTime: '19:00',
    photographerIds: ['photo-14', 'photo-15'],
    photographerNames: ['임작가', '황작가'],
    productType: 'wedding',
    packageId: 'mind-bb',
    packageName: '1인 앨범형',
    options: ['대표작가 지정', '작가 추가 선물', '야외촬영'],
    status: 'reserved',
    specialRequests: '해운대 바다 배경 촬영',
    travelTimeMinutes: 240,
    ...statusColors.reserved
  },

  // Today - Afternoon (Reserved)
  {
    id: 'schedule-2-4',
    title: '윤민수 & 강예린',
    start: `${format(today, 'yyyy-MM-dd')}T15:00:00`,
    end: `${format(today, 'yyyy-MM-dd')}T18:30:00`,
    groomName: '윤민수',
    brideName: '강예린',
    groomPhone: '010-6666-7777',
    bridePhone: '010-8888-9999',
    contractId: 'contract-015',
    clientPortalToken: 'token-015',
    venueName: '수원 노보텔',
    venueType: 'hotel',
    ballroom: '크리스탈 볼룸',
    venueAddress: '경기 수원시 팔달구 중부대로 150',
    venuePhone: '031-222-5000',
    ceremonyTime: '16:00',
    photographerIds: ['photo-11'],
    photographerNames: ['신작가'],
    productType: 'wedding',
    packageId: 'new-data',
    packageName: 'new DATA',
    options: ['본식', '스냅'],
    status: 'reserved',
    travelTimeMinutes: 60,
    ...statusColors.reserved
  },
  
  // Tomorrow - 2명 작가
  {
    id: 'schedule-3',
    title: '강민수 & 윤서연',
    start: `${format(addDays(today, 1), 'yyyy-MM-dd')}T13:00:00`,
    end: `${format(addDays(today, 1), 'yyyy-MM-dd')}T18:00:00`,
    groomName: '강민수',
    brideName: '윤서연',
    groomPhone: '010-7777-8888',
    bridePhone: '010-9999-0000',
    contractId: 'contract-003',
    clientPortalToken: 'token-003',
    venueName: '인천 파라다이스 호텔',
    venueType: 'hotel',
    ballroom: '스카이 볼룸',
    venueAddress: '인천시 중구 공항로 424',
    venuePhone: '032-1111-2222',
    ceremonyTime: '15:00',
    makeupTime: '13:00',
    makeupLocation: '호텔 룸',
    photographerIds: ['photo-2', 'photo-5'],
    photographerNames: ['최작가', '정작가'],
    productType: 'wedding',
    packageId: 'data',
    packageName: 'DATA',
    options: ['본식+스냅', '야외촬영', '부모님 메이크업'],
    status: 'reserved',
    travelTimeMinutes: 60,
    ...statusColors.reserved
  },
  
  // Day after tomorrow
  {
    id: 'schedule-4',
    title: '정우성 & 한가인',
    start: `${format(addDays(today, 2), 'yyyy-MM-dd')}T14:00:00`,
    end: `${format(addDays(today, 2), 'yyyy-MM-dd')}T18:00:00`,
    groomName: '정우성',
    brideName: '한가인',
    groomPhone: '010-1111-2222',
    bridePhone: '010-3333-4444',
    contractId: 'contract-004',
    clientPortalToken: 'token-004',
    venueName: '부산 해운대 그랜드 호텔',
    venueType: 'hotel',
    ballroom: '오션뷰 홀',
    venueAddress: '부산시 해운대구 우동',
    ceremonyTime: '16:00',
    photographerIds: ['photo-1'],
    photographerNames: ['박작가'],
    productType: 'wedding',
    packageId: 'data',
    packageName: 'DATA',
    options: ['본식+스냅', '해변 촬영'],
    status: 'reserved',
    travelTimeMinutes: 240, // 4 hours to Busan
    ...statusColors.reserved
  },
  
  {
    id: 'schedule-5',
    title: '송중기 & 송혜교',
    start: `${format(addDays(today, 2), 'yyyy-MM-dd')}T16:00:00`,
    end: `${format(addDays(today, 2), 'yyyy-MM-dd')}T20:00:00`,
    groomName: '송중기',
    brideName: '송혜교',
    groomPhone: '010-5555-6666',
    bridePhone: '010-7777-8888',
    contractId: 'contract-005',
    clientPortalToken: 'token-005',
    venueName: '서울 신라호텔',
    venueType: 'hotel',
    ballroom: '다이너스티 홀',
    venueAddress: '서울시 중구 동호로 249',
    ceremonyTime: '18:00',
    photographerIds: ['photo-1'], // Same photographer - CONFLICT
    photographerNames: ['박작가'],
    productType: 'wedding',
    packageId: 'data',
    packageName: 'DATA',
    options: ['본식+스냅', '야외촬영', '당일편집'],
    status: 'reserved',
    travelTimeMinutes: 30,
    ...statusColors.reserved
  },
  
  // This week - Various venues
  {
    id: 'schedule-6',
    title: '김수현 & 아이유',
    start: `${format(addDays(today, 3), 'yyyy-MM-dd')}T11:00:00`,
    end: `${format(addDays(today, 3), 'yyyy-MM-dd')}T15:00:00`,
    groomName: '김수현',
    brideName: '아이유',
    groomPhone: '010-1212-3434',
    bridePhone: '010-5656-7878',
    contractId: 'contract-006',
    clientPortalToken: 'token-006',
    venueName: '제주 신라호텔',
    venueType: 'outdoor',
    venueAddress: '제주시 조천읍',
    ceremonyTime: '13:00',
    photographerIds: ['photo-3', 'photo-6'],
    photographerNames: ['김작가', '강작가'],
    productType: 'hanbok',
    packageId: 'hanbok-a2',
    packageName: 'HANBOK A2',
    options: [],
    status: 'reserved',
    specialRequests: '일몰 타이밍 맞춰 촬영',
    travelTimeMinutes: 180,
    ...statusColors.reserved
  },
  
  {
    id: 'schedule-7',
    title: '박서준 & 박보영',
    start: `${format(addDays(today, 4), 'yyyy-MM-dd')}T10:00:00`,
    end: `${format(addDays(today, 4), 'yyyy-MM-dd')}T13:00:00`,
    groomName: '박서준',
    brideName: '박보영',
    groomPhone: '010-9999-1111',
    bridePhone: '010-2222-3333',
    contractId: 'contract-007',
    clientPortalToken: 'token-007',
    venueName: '강남 웨딩 스튜디오',
    venueType: 'studio',
    venueAddress: '서울시 강남구 논현로',
    ceremonyTime: '11:00',
    photographerIds: ['photo-2'],
    photographerNames: ['최작가'],
    productType: 'dress_shop',
    packageId: 'dress-shop-1',
    packageName: '가봉 스냅',
    options: [],
    status: 'in_progress',
    travelTimeMinutes: 20,
    ...statusColors.in_progress
  },
  
  // Past - Completed
  {
    id: 'schedule-8',
    title: '현빈 & 손예진',
    start: `${format(subDays(today, 3), 'yyyy-MM-dd')}T14:00:00`,
    end: `${format(subDays(today, 3), 'yyyy-MM-dd')}T18:00:00`,
    groomName: '현빈',
    brideName: '손예진',
    groomPhone: '010-4444-5555',
    bridePhone: '010-6666-7777',
    contractId: 'contract-008',
    clientPortalToken: 'token-008',
    venueName: '경기 아침고요수목원',
    venueType: 'outdoor',
    venueAddress: '경기도 가평군',
    ceremonyTime: '16:00',
    photographerIds: ['photo-1'],
    photographerNames: ['박작가'],
    productType: 'hanbok',
    packageId: 'hanbok-a2',
    packageName: 'HANBOK A2',
    options: [],
    status: 'editing',
    travelTimeMinutes: 90,
    ...statusColors.editing
  },
  
  {
    id: 'schedule-9',
    title: '공유 & 정유미',
    start: `${format(subDays(today, 7), 'yyyy-MM-dd')}T13:00:00`,
    end: `${format(subDays(today, 7), 'yyyy-MM-dd')}T17:00:00`,
    groomName: '공유',
    brideName: '정유미',
    groomPhone: '010-8888-9999',
    bridePhone: '010-0000-1111',
    contractId: 'contract-009',
    clientPortalToken: 'token-009',
    venueName: '서울 웨스틴 조선호텔',
    venueType: 'hotel',
    ballroom: '그랜드 볼룸',
    venueAddress: '서울시 중구 소공로',
    ceremonyTime: '15:00',
    photographerIds: ['photo-2'],
    photographerNames: ['최작가'],
    productType: 'wedding',
    packageId: 'data',
    packageName: 'DATA',
    options: ['본식+스냅', '야외촬영'],
    status: 'completed',
    travelTimeMinutes: 25,
    ...statusColors.completed
  },
  
  // 권유은 아기 돌잔치 - 2025년 11월 8일 토요일
  {
    id: 'schedule-baby-kwon',
    title: '권유은 아기 돌잔치',
    start: '2025-11-08T12:00:00',
    end: '2025-11-08T13:00:00',
    groomName: '권용국',
    brideName: '공기윤',
    groomPhone: '010-2010-9616',
    bridePhone: '010-9132-3065',
    contractId: 'contract-baby-kwon',
    clientPortalToken: 'token-baby-kwon',
    projectDetailId: 'project-baby-kwon', // 프로젝트 상세 페이지 연결
    venueName: '안국역 파티나',
    venueType: 'hotel',
    ballroom: '4층',
    venueAddress: '서울 종로구 율곡로 83 4층',
    venuePhone: '010-4219-2935',
    ceremonyTime: '12:00 (정오)',
    photographerIds: [],
    photographerNames: [],
    productType: 'wedding',
    packageId: 'new-data',
    packageName: '돌잔치 행사',
    options: ['2인 촬영팀', '13x10인치 앨범 50p', '14x14인치 액자', '최종본 50장', '전체원본 제공'],
    status: 'reserved',
    specialRequests: '22년도 웨딩한복스냅 고객. 리핑 고객으로 돌잔치 + 한복스냅 진행',
    internalNotes: '잔금 입금 완료 (2025-03-30)',
    travelTimeMinutes: 25,
    ...statusColors.reserved
  },

  // 추가 목업 데이터 - 11월 중순
  {
    id: 'schedule-11',
    title: '정민호 & 이서연',
    start: '2025-11-15T14:00:00',
    end: '2025-11-15T17:00:00',
    groomName: '정민호',
    brideName: '이서연',
    groomPhone: '010-1234-5678',
    bridePhone: '010-8765-4321',
    email: 'minholee@example.com',
    referralSource: '인스타그램',
    contractId: 'contract-011',
    clientPortalToken: 'token-011',
    venueName: '그랜드 힐튼 서울',
    venueType: 'hotel',
    ballroom: '크리스탈 볼룸',
    venueAddress: '서울 강남구 봉은사로',
    ceremonyTime: '14:00',
    photographerIds: ['photo-1', 'photo-5'],
    photographerNames: ['김작가', '정작가'],
    productType: 'wedding',
    packageId: 'new-basic',
    packageName: 'new BASIC',
    options: ['본식+스냅', '앨범 50p'],
    status: 'reserved',
    travelTimeMinutes: 30,
    ...statusColors.reserved
  },

  {
    id: 'schedule-12',
    title: '한복 촬영 - 박지원 & 최수진',
    start: '2025-11-20T10:00:00',
    end: '2025-11-20T13:00:00',
    groomName: '박지원',
    brideName: '최수진',
    groomPhone: '010-2345-6789',
    bridePhone: '010-9876-5432',
    contractId: 'contract-012',
    clientPortalToken: 'token-012',
    venueName: '북촌 한옥마을',
    venueType: 'outdoor',
    venueAddress: '서울 종로구 북촌로',
    ceremonyTime: '10:00',
    photographerIds: ['photo-3'],
    photographerNames: ['박작가'],
    productType: 'hanbok',
    packageId: 'hanbok-b1',
    packageName: 'HANBOK B1',
    options: [],
    status: 'in_progress',
    specialRequests: '전통 한복 촬영, 자연광 선호',
    travelTimeMinutes: 40,
    ...statusColors.in_progress
  },

  {
    id: 'schedule-13',
    title: '가봉 스냅 - 유지민',
    start: '2025-11-22T15:00:00',
    end: '2025-11-22T17:00:00',
    groomName: '유지민',
    brideName: '김태희',
    groomPhone: '010-3456-7890',
    bridePhone: '010-6543-2109',
    contractId: 'contract-013',
    clientPortalToken: 'token-013',
    venueName: '마인드그라피 스튜디오',
    venueType: 'studio',
    venueAddress: '서울 성동구 마조로15길 6 1층',
    ceremonyTime: '15:00',
    photographerIds: ['photo-4'],
    photographerNames: ['이작가'],
    productType: 'dress_shop',
    packageId: 'dress-shop-basic',
    packageName: '가봉 스냅 BASIC',
    options: [],
    status: 'editing',
    travelTimeMinutes: 0,
    ...statusColors.editing
  },

  // 12월 초
  {
    id: 'schedule-14',
    title: '강태양 & 송하늘',
    start: '2025-12-06T13:00:00',
    end: '2025-12-06T16:00:00',
    groomName: '강태양',
    brideName: '송하늘',
    groomPhone: '010-4567-8901',
    bridePhone: '010-5432-1098',
    contractId: 'contract-014',
    clientPortalToken: 'token-014',
    venueName: '워커힐 호텔',
    venueType: 'hotel',
    ballroom: '아스토리움',
    venueAddress: '서울 광진구 워커힐로',
    ceremonyTime: '13:00',
    photographerIds: ['photo-2', 'photo-6'],
    photographerNames: ['최작가', '강작가'],
    productType: 'wedding',
    packageId: 'premium',
    packageName: 'PREMIUM',
    options: ['본식+스냅', '야외촬영', '앨범 80p'],
    status: 'reserved',
    travelTimeMinutes: 45,
    ...statusColors.reserved
  },

  {
    id: 'schedule-15',
    title: '돌스냅 - 이준서',
    start: '2025-12-13T11:00:00',
    end: '2025-12-13T12:30:00',
    groomName: '이동혁',
    brideName: '박민주',
    groomPhone: '010-5678-9012',
    bridePhone: '010-4321-0987',
    contractId: 'contract-015',
    clientPortalToken: 'token-015',
    venueName: '라움 파티홀',
    venueType: 'hotel',
    venueAddress: '서울 강남구 테헤란로',
    ceremonyTime: '11:00',
    photographerIds: ['photo-8'],
    photographerNames: ['윤작가'],
    productType: 'baby',
    packageId: 'baby-basic',
    packageName: '돌잔치 행사',
    options: ['2인 촬영팀', '앨범 50p'],
    status: 'reserved',
    travelTimeMinutes: 35,
    ...statusColors.reserved
  },

  {
    id: 'schedule-16',
    title: '조현우 & 김예린',
    start: '2025-12-20T15:00:00',
    end: '2025-12-20T18:00:00',
    groomName: '조현우',
    brideName: '김예린',
    groomPhone: '010-6789-0123',
    bridePhone: '010-3210-9876',
    email: 'hyunwoo@example.com',
    referralSource: '지인 추천',
    contractId: 'contract-016',
    clientPortalToken: 'token-016',
    venueName: '신라호텔',
    venueType: 'hotel',
    ballroom: '다이나스티 홀',
    venueAddress: '서울 중구 동호로',
    ceremonyTime: '15:00',
    photographerIds: ['photo-1', 'photo-10'],
    photographerNames: ['김작가', '한작가'],
    productType: 'wedding',
    packageId: 'data',
    packageName: 'DATA',
    options: ['본식+스냅', '앨범 50p', '액자'],
    status: 'reserved',
    specialRequests: '실내 촬영 위주',
    travelTimeMinutes: 25,
    ...statusColors.reserved
  },

  {
    id: 'schedule-17',
    title: '한복 촬영 - 서준호 & 배수지',
    start: '2025-12-27T10:30:00',
    end: '2025-12-27T13:30:00',
    groomName: '서준호',
    brideName: '배수지',
    groomPhone: '010-7890-1234',
    bridePhone: '010-2109-8765',
    contractId: 'contract-017',
    clientPortalToken: 'token-017',
    venueName: '경복궁 일대',
    venueType: 'outdoor',
    venueAddress: '서울 종로구 사직로',
    ceremonyTime: '10:30 (일몰 촬영)',
    photographerIds: ['photo-11'],
    photographerNames: ['신작가'],
    productType: 'hanbok',
    packageId: 'hanbok-b2',
    packageName: 'HANBOK B2',
    options: [],
    status: 'reserved',
    specialRequests: '일몰 시간대 촬영',
    travelTimeMinutes: 35,
    ...statusColors.reserved
  }
]

// Helper functions
export const getPhotographerById = (id: string) => {
  return mockSchedulePhotographers.find(p => p.id === id)
}

export const getEventsByPhotographer = (photographerId: string) => {
  return mockScheduleEvents.filter(e => e.photographerIds?.includes(photographerId))
}

export const getEventsByStatus = (status: ScheduleStatus) => {
  return mockScheduleEvents.filter(e => e.status === status)
}

export const getEventsByVenueType = (venueType: VenueType) => {
  return mockScheduleEvents.filter(e => e.venueType === venueType)
}

export const getEventsByProductType = (productType: ProductType) => {
  return mockScheduleEvents.filter(e => e.productType === productType)
}

// Check for conflicts (overlapping photographers and time)
export const checkConflicts = (event: ScheduleEvent): ScheduleEvent[] => {
  if (!event.photographerIds || event.photographerIds.length === 0) return []
  
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  
  return mockScheduleEvents.filter(e => {
    if (e.id === event.id) return false
    if (!e.photographerIds || e.photographerIds.length === 0) return false
    
    // Check if any photographer overlaps
    const hasPhotographerOverlap = event.photographerIds?.some(pid => 
      e.photographerIds?.includes(pid)
    )
    if (!hasPhotographerOverlap) return false
    
    const eStart = new Date(e.start)
    const eEnd = new Date(e.end)
    
    // Check if time ranges overlap
    return (eventStart < eEnd && eventEnd > eStart)
  })
}

// Get status label
export const getStatusLabel = (status: ScheduleStatus): string => {
  const labels: Record<ScheduleStatus, string> = {
    reserved: '예약',
    on_the_way: '출발',
    in_progress: '촬영중',
    editing: '보정중',
    completed: '완료',
    cancelled: '취소',
    uploaded: '업로드'
  }
  return labels[status]
}

// Get product type label
export const getProductTypeLabel = (productType: ProductType): string => {
  const labels: Record<ProductType, string> = {
    wedding: '웨딩',
    hanbok: '한복 & 캐주얼',
    dress_shop: '가봉 스냅',
    baby: '돌스냅'
  }
  return labels[productType]
}

// Get venue type label
export const getVenueTypeLabel = (venueType: VenueType): string => {
  const labels: Record<VenueType, string> = {
    hotel: '호텔',
    convention: '컨벤션',
    outdoor: '야외',
    studio: '스튜디오'
  }
  return labels[venueType]
}
