import type {
  User,
  Customer,
  Contract,
  Payment,
  Project,
  ShootingSchedule,
  Photographer,
  PhotoAlbum,
  Photo,
  ProofGallerySession,
  EditingQueue,
  Deliverable,
  DashboardStats,
  CalendarEvent,
  Note
} from './types'
import { format, addDays } from 'date-fns'

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@mindgraphy.com',
    role: 'admin',
    firstName: '관리자',
    lastName: '김',
    status: 'active',
    phone: '010-1234-5678'
  },
  {
    id: 'user-2',
    email: 'manager@mindgraphy.com',
    role: 'manager',
    firstName: '매니저',
    lastName: '이',
    status: 'active',
    phone: '010-2345-6789'
  },
  {
    id: 'photo-1',
    email: 'photographer1@mindgraphy.com',
    role: 'photographer',
    firstName: '작가',
    lastName: '박',
    status: 'active',
    phone: '010-3456-7890',
    permissions: ['live-status', 'calendar', 'my-schedule', 'projects', 'board', 'gallery-upload', 'timetable']
  },
  {
    id: 'photo-2',
    email: 'photographer2@mindgraphy.com',
    role: 'photographer',
    firstName: '작가',
    lastName: '최',
    status: 'active',
    phone: '010-4567-8901',
    permissions: ['projects', 'gallery-upload', 'timetable']
  },
  {
    id: 'editor-1',
    email: 'editor@mindgraphy.com',
    role: 'editor',
    firstName: '편집자',
    lastName: '정',
    status: 'active',
    phone: '010-5678-9012'
  }
]

// Mock Photographers
export const mockPhotographers: Photographer[] = [
  {
    id: 'photographer-1',
    userId: 'photo-1',
    user: mockUsers[2],
    portfolioUrl: 'https://portfolio.example.com/park',
    experienceYears: 8,
    specialties: ['웨딩', '스튜디오', '야외촬영'],
    rating: 4.8,
    totalProjects: 156,
    availabilityStatus: 'available',
    createdAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 'photographer-2',
    userId: 'photo-2',
    user: mockUsers[3],
    portfolioUrl: 'https://portfolio.example.com/choi',
    experienceYears: 5,
    specialties: ['웨딩', '본식', '스냅'],
    rating: 4.6,
    totalProjects: 89,
    availabilityStatus: 'busy',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: 'photographer-3',
    userId: 'photo-3',
    user: {
      id: 'photo-3',
      email: 'photographer3@mindgraphy.com',
      role: 'photographer',
      firstName: '작가',
      lastName: '김',
      status: 'active',
      phone: '010-6789-0123'
    },
    portfolioUrl: 'https://portfolio.example.com/kim',
    experienceYears: 6,
    specialties: ['웨딩', '야외촬영', '스냅'],
    rating: 4.7,
    totalProjects: 120,
    availabilityStatus: 'available',
    createdAt: '2023-03-01T00:00:00Z'
  }
]

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    groomName: '홍길동',
    brideName: '김영희',
    groomPhone: '010-1111-2222',
    bridePhone: '010-3333-4444',
    email: 'couple1@example.com',
    sourceChannel: 'Instagram',
    leadStatus: 'completed',
    satisfaction: 5,
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '촬영 및 후반작업 완료. 매우 만족',
    createdAt: '2025-06-01T10:00:00Z'
  },
  {
    id: 'customer-2',
    groomName: '이철수',
    brideName: '박민지',
    groomPhone: '010-5555-6666',
    bridePhone: '010-7777-8888',
    email: 'couple2@example.com',
    sourceChannel: 'Naver Blog',
    leadStatus: 'completed',
    satisfaction: 4,
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '스튜디오 + 본식 패키지 완료. 만족',
    createdAt: '2025-07-15T14:30:00Z'
  },
  {
    id: 'customer-3',
    groomName: '강민수',
    brideName: '윤서연',
    groomPhone: '010-9999-0000',
    bridePhone: '010-1212-3434',
    email: 'couple3@example.com',
    sourceChannel: 'Facebook',
    leadStatus: 'completed',
    satisfaction: 5,
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '완벽한 촬영. 매우 만족',
    createdAt: '2025-05-20T09:15:00Z'
  },
  {
    id: 'customer-4',
    groomName: '김태현',
    brideName: '최수진',
    groomPhone: '010-2222-3333',
    bridePhone: '010-4444-5555',
    email: 'couple4@example.com',
    sourceChannel: '고객용 페이지',
    leadStatus: 'inquiry',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '고객용 페이지를 통해 신청. 2026년 4월 예식 예정. 일정 미확정',
    createdAt: '2025-11-18T15:30:00Z'
  },
  {
    id: 'customer-5',
    groomName: '박준호',
    brideName: '정하은',
    groomPhone: '010-6666-7777',
    bridePhone: '010-8888-9999',
    email: 'couple5@example.com',
    sourceChannel: '웨딩홀 제휴',
    leadStatus: 'inquiry',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '서울 그랜드 웨딩홀 제휴 고객. 2026년 5월 예식. 일정 미확정',
    createdAt: '2025-11-19T09:20:00Z'
  },
  {
    id: 'customer-6',
    groomName: '이동욱',
    brideName: '김소희',
    groomPhone: '010-7777-8888',
    bridePhone: '010-9999-0000',
    email: 'couple6@example.com',
    sourceChannel: '관리자 직접 등록',
    leadStatus: 'contracted',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '관리자가 직접 등록. 일정 자동 확정',
    createdAt: '2025-11-19T14:30:00Z'
  },
  {
    id: 'customer-7',
    groomName: '정우성',
    brideName: '송혜교',
    groomPhone: '010-1234-5678',
    bridePhone: '010-8765-4321',
    email: 'couple7@example.com',
    sourceChannel: '고객용 페이지',
    leadStatus: 'inquiry',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '한복 & 캐주얼 촬영 문의. 일정 미확정',
    createdAt: '2025-11-19T16:00:00Z'
  },
  {
    id: 'customer-8',
    groomName: '조인성',
    brideName: '한지민',
    groomPhone: '010-3333-4444',
    bridePhone: '010-5555-6666',
    email: 'couple8@example.com',
    sourceChannel: '고객용 페이지',
    leadStatus: 'inquiry',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '가봉 스냅 문의. 일정 미확정',
    createdAt: '2025-11-19T17:30:00Z'
  },
  {
    id: 'customer-9',
    groomName: '현빈',
    brideName: '손예진',
    groomPhone: '010-7777-9999',
    bridePhone: '010-8888-0000',
    email: 'couple9@example.com',
    sourceChannel: 'Instagram',
    leadStatus: 'inquiry',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: 'Instagram 통해 문의. 일정 미확정',
    createdAt: '2025-11-19T10:00:00Z'
  }
]

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-001',
    customerId: 'customer-1',
    packageType: '프리미엄 웨딩 패키지',
    weddingDate: '2025-12-15',
    weddingTime: '14:00',
    venue: '서울 그랜드 웨딩홀',
    totalAmount: 5000000,
    depositAmount: 2000000,
    balanceAmount: 3000000,
    groomName: mockCustomers[0].groomName,
    brideName: mockCustomers[0].brideName,
    signedAt: '2025-09-06T15:30:00Z',
    createdAt: '2025-09-05T10:00:00Z'
  },
  {
    id: 'contract-2',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-002',
    customerId: 'customer-3',
    packageType: '스탠다드 웨딩 패키지',
    weddingDate: '2026-03-10',
    weddingTime: '10:00',
    venue: '제주 야외 촬영',
    totalAmount: 3500000,
    depositAmount: 1500000,
    balanceAmount: 2000000,
    groomName: mockCustomers[2].groomName,
    brideName: mockCustomers[2].brideName,
    signedAt: '2025-08-26T11:00:00Z',
    createdAt: '2025-08-25T09:15:00Z'
  },
  // 추가 목업 데이터 (schedules.ts의 contractId와 매칭)
  {
    id: 'contract-001',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-003',
    customerId: 'customer-1',
    packageType: 'DATA',
    weddingDate: format(new Date(), 'yyyy-MM-dd'),
    weddingTime: '14:00',
    venue: '서울 그랜드 호텔',
    totalAmount: 4000000,
    depositAmount: 1500000,
    balanceAmount: 2500000,
    groomName: '홍길동',
    brideName: '김영희',
    signedAt: '2025-10-01T10:00:00Z',
    createdAt: '2025-09-30T09:00:00Z'
  },
  {
    id: 'contract-002',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-004',
    customerId: 'customer-1',
    packageType: 'PREMIUM',
    weddingDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    weddingTime: '14:00',
    venue: '파라다이스 시티',
    totalAmount: 5500000,
    depositAmount: 2000000,
    balanceAmount: 3500000,
    groomName: '이철수',
    brideName: '박민지',
    signedAt: '2025-10-02T11:00:00Z',
    createdAt: '2025-10-01T10:00:00Z'
  },
  {
    id: 'contract-003',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-005',
    customerId: 'customer-1',
    packageType: 'HANBOK B1',
    weddingDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    weddingTime: '11:00',
    venue: '북촌 한옥마을',
    totalAmount: 2000000,
    depositAmount: 800000,
    balanceAmount: 1200000,
    groomName: '김민수',
    brideName: '정은지',
    signedAt: '2025-10-03T12:00:00Z',
    createdAt: '2025-10-02T11:00:00Z'
  },
  {
    id: 'contract-004',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-006',
    customerId: 'customer-1',
    packageType: '돌잔치 행사',
    weddingDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    weddingTime: '13:00',
    venue: '라움 파티홀',
    totalAmount: 1800000,
    depositAmount: 700000,
    balanceAmount: 1100000,
    groomName: '박준영',
    brideName: '최지혜',
    signedAt: '2025-10-04T13:00:00Z',
    createdAt: '2025-10-03T12:00:00Z'
  },
  {
    id: 'contract-005',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-007',
    customerId: 'customer-1',
    packageType: '가봉 스냅 BASIC',
    weddingDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    weddingTime: '15:00',
    venue: '마인드그라피 스튜디오',
    totalAmount: 1500000,
    depositAmount: 500000,
    balanceAmount: 1000000,
    groomName: '송재현',
    brideName: '이소희',
    signedAt: '2025-10-05T14:00:00Z',
    createdAt: '2025-10-04T13:00:00Z'
  },
  {
    id: 'contract-006',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-008',
    customerId: 'customer-1',
    packageType: 'DATA',
    weddingDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    weddingTime: '12:00',
    venue: '더 플라자',
    totalAmount: 4200000,
    depositAmount: 1600000,
    balanceAmount: 2600000,
    groomName: '윤상혁',
    brideName: '장민지',
    signedAt: '2025-10-06T15:00:00Z',
    createdAt: '2025-10-05T14:00:00Z'
  },
  {
    id: 'contract-007',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-009',
    customerId: 'customer-1',
    packageType: 'PREMIUM',
    weddingDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
    weddingTime: '13:30',
    venue: '콘래드 서울',
    totalAmount: 5800000,
    depositAmount: 2200000,
    balanceAmount: 3600000,
    groomName: '강동훈',
    brideName: '임수정',
    signedAt: '2025-10-07T16:00:00Z',
    createdAt: '2025-10-06T15:00:00Z'
  },
  {
    id: 'contract-008',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-010',
    customerId: 'customer-1',
    packageType: 'HANBOK B2',
    weddingDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    weddingTime: '10:30',
    venue: '경복궁 일대',
    totalAmount: 2500000,
    depositAmount: 1000000,
    balanceAmount: 1500000,
    groomName: '서준호',
    brideName: '배수지',
    signedAt: '2025-10-08T17:00:00Z',
    createdAt: '2025-10-07T16:00:00Z'
  },
  {
    id: 'contract-009',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-011',
    customerId: 'customer-1',
    packageType: 'new DATA',
    weddingDate: format(addDays(new Date(), -7), 'yyyy-MM-dd'),
    weddingTime: '16:00',
    venue: '잠실 롯데호텔',
    totalAmount: 4300000,
    depositAmount: 1700000,
    balanceAmount: 2600000,
    groomName: '정우성',
    brideName: '송혜교',
    signedAt: '2025-10-09T18:00:00Z',
    createdAt: '2025-10-08T17:00:00Z'
  },
  {
    id: 'contract-010',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-012',
    customerId: 'customer-1',
    packageType: 'new DATA',
    weddingDate: format(new Date(), 'yyyy-MM-dd'),
    weddingTime: '10:00',
    venue: '명동 웨딩홀',
    totalAmount: 4300000,
    depositAmount: 1700000,
    balanceAmount: 2600000,
    groomName: '조인성',
    brideName: '김태희',
    signedAt: '2025-10-10T10:00:00Z',
    createdAt: '2025-10-09T09:00:00Z'
  },
  {
    id: 'contract-011',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-013',
    customerId: 'customer-1',
    packageType: 'BASIC',
    weddingDate: format(new Date(), 'yyyy-MM-dd'),
    weddingTime: '09:30',
    venue: '잠실 롯데호텔',
    totalAmount: 3000000,
    depositAmount: 1000000,
    balanceAmount: 2000000,
    groomName: '조현우',
    brideName: '박서연',
    signedAt: '2025-10-01T10:00:00Z',
    createdAt: '2025-09-30T09:00:00Z'
  },
  {
    id: 'contract-012',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-012',
    customerId: 'customer-1',
    packageType: 'HANBOK B1',
    weddingDate: '2025-11-20',
    weddingTime: '10:00',
    venue: '북촌 한옥마을',
    totalAmount: 2000000,
    depositAmount: 800000,
    balanceAmount: 1200000,
    groomName: '박지원',
    brideName: '최수진',
    signedAt: '2025-10-05T11:00:00Z',
    createdAt: '2025-10-04T10:00:00Z'
  },
  {
    id: 'contract-013',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-013',
    customerId: 'customer-1',
    packageType: '가봉 스냅 BASIC',
    weddingDate: '2025-11-22',
    weddingTime: '15:00',
    venue: '마인드그라피 스튜디오',
    totalAmount: 1500000,
    depositAmount: 500000,
    balanceAmount: 1000000,
    groomName: '유지민',
    brideName: '김태희',
    signedAt: '2025-10-10T14:00:00Z',
    createdAt: '2025-10-09T13:00:00Z'
  },
  {
    id: 'contract-014',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-014',
    customerId: 'customer-1',
    packageType: 'PREMIUM',
    weddingDate: '2025-12-06',
    weddingTime: '13:00',
    venue: '워커힐 호텔',
    totalAmount: 6000000,
    depositAmount: 2500000,
    balanceAmount: 3500000,
    groomName: '강태양',
    brideName: '송하늘',
    signedAt: '2025-10-20T15:00:00Z',
    createdAt: '2025-10-19T14:00:00Z'
  },
  {
    id: 'contract-015',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-015',
    customerId: 'customer-1',
    packageType: '돌잔치 행사',
    weddingDate: '2025-12-13',
    weddingTime: '11:00',
    venue: '라움 파티홀',
    totalAmount: 1800000,
    depositAmount: 700000,
    balanceAmount: 1100000,
    groomName: '이동혁',
    brideName: '박민주',
    signedAt: '2025-11-01T10:00:00Z',
    createdAt: '2025-10-31T09:00:00Z'
  },
  {
    id: 'contract-016',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-016',
    customerId: 'customer-1',
    packageType: 'DATA',
    weddingDate: '2025-12-20',
    weddingTime: '15:00',
    venue: '신라호텔',
    totalAmount: 4500000,
    depositAmount: 1800000,
    balanceAmount: 2700000,
    groomName: '조현우',
    brideName: '김예린',
    signedAt: '2025-11-05T16:00:00Z',
    createdAt: '2025-11-04T15:00:00Z'
  },
  {
    id: 'contract-017',
    templateId: 'contract-template-001',
    contractNumber: 'MG-2025-017',
    customerId: 'customer-1',
    packageType: 'HANBOK B2',
    weddingDate: '2025-12-27',
    weddingTime: '10:30',
    venue: '경복궁 일대',
    totalAmount: 2500000,
    depositAmount: 1000000,
    balanceAmount: 1500000,
    groomName: '서준호',
    brideName: '배수지',
    signedAt: '2025-11-10T12:00:00Z',
    createdAt: '2025-11-09T11:00:00Z'
  }
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    contractId: 'contract-1',
    paymentType: 'deposit',
    amount: 2000000,
    paymentMethod: '계좌이체',
    paymentStatus: 'completed',
    paymentDate: '2025-09-07',
    receiptUrl: 'https://s3.example.com/receipts/payment-1.pdf',
    cashReceiptIssued: true,
    notes: '계약금 입금 완료',
    createdAt: '2025-09-07T10:30:00Z'
  },
  {
    id: 'payment-2',
    contractId: 'contract-1',
    paymentType: 'balance',
    amount: 3000000,
    paymentMethod: '계좌이체',
    paymentStatus: 'pending',
    cashReceiptIssued: false,
    notes: '잔금 입금 대기중',
    createdAt: '2025-09-07T10:31:00Z'
  },
  {
    id: 'payment-3',
    contractId: 'contract-2',
    paymentType: 'deposit',
    amount: 1500000,
    paymentMethod: '신용카드',
    paymentStatus: 'completed',
    paymentDate: '2025-08-27',
    receiptUrl: 'https://s3.example.com/receipts/payment-3.pdf',
    cashReceiptIssued: true,
    notes: '계약금 카드 결제',
    createdAt: '2025-08-27T14:20:00Z'
  },
  {
    id: 'payment-4',
    contractId: 'contract-2',
    paymentType: 'balance',
    amount: 2000000,
    paymentMethod: '계좌이체',
    paymentStatus: 'pending',
    cashReceiptIssued: false,
    notes: '잔금 입금 예정',
    createdAt: '2025-08-27T14:21:00Z'
  }
]

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    projectNumber: 'PRJ-2025-001',
    customerId: 'customer-1',
    customer: mockCustomers[0],
    contractId: 'contract-1',
    projectType: 'wedding',
    packageId: 'new-basic',  // 고객 선택 패키지
    optionIds: ['option-1', 'option-2'],  // 고객 선택 옵션들
    projectStatus: 'proof_ready',
    weddingDate: '2025-12-15',
    weddingTime: '14:00',
    weddingVenue: '서울 그랜드 웨딩홀',
    makeupInfo: '웨딩홀 내 메이크업샵 (12:00)',
    specialRequests: '야외 촬영 희망',
    referralSource: 'Instagram',  // 유입 경로
    assignedPhotographerIds: ['photographer-1', 'photographer-2'],
    assignedPhotographers: [mockPhotographers[0], mockPhotographers[1]],
    assignedEditorId: 'editor-1',
    assignedEditor: mockUsers[4],
    progress: 60,
    webGallery: {
      id: 'gallery-1',
      galleryId: 'abc123',
      title: '홍길동 & 김영희 웨딩 갤러리',
      sharedUrl: '/gallery/abc123',
      photoCount: 12,
      isActive: true
    },
    weddingDetails: {
      timeConfirmed: true,
      makeupShop: '겐그레아 메이크업 본점, 서울 강남구 테헤란로',
      makeupStartTime: '06:30',
      makeupEndTime: '09:30',
      hasPreCeremonyPhoto: 'yes',
      hasOfficiant: 'yes',
      hasMC: 'yes',
      mcType: 'professional',
      hasRingExchange: 'yes',
      hasFlowerGirl: 'yes',
      hasPaebaek: 'yes',
      groomFamily: '아버님, 어머님, 누나, 매형, 조카 2명',
      brideFamily: '아버님, 어머님, 오빠, 올케, 조카 1명',
      preferredStyle: '밝고 자연스러운 느낌, 감성적이고 따뜻한 분위기. 가족들과의 행복한 순간을 자연스럽게 담아주세요.',
      notPreferredStyle: '너무 어두운 느낌이나 과한 보정은 선호하지 않습니다.',
      mainDressInfo: '아이보리 A라인 드레스',
      receptionDressInfo: '핑크 볼륨감 있는 드레스',
      groomSuitInfo: '네이비 턱시도',
      dressShop: '더 웨딩하우스',
      suitShop: '탑맨',
      makeupShopName: '겐그레아',
      planner: '웨딩플래너 김OO',
      videoTeam: '마인드필름 (2인3캠)',
      iphoneSnap: '',
      otherTeam: '',
      specialRequests: '가족사진을 많이 남기고 싶습니다. 특히 부모님과의 사진을 중요하게 생각합니다.',
      honeymoonDestination: '몰디브',
      honeymoonDeparture: '12.16 저녁 비행기',
      honeymoonReturn: '12.23',
      meetingType: 'direct',
      invitationUrl: 'https://example.com/invitation'
    },
    createdAt: '2025-09-06T10:00:00Z',
    updatedAt: '2025-11-02T15:30:00Z'
  },
  {
    id: 'project-2',
    projectNumber: 'PRJ-2025-002',
    customerId: 'customer-3',
    customer: mockCustomers[2],
    contractId: 'contract-2',
    projectType: 'wedding',
    packageId: 'new-data',  // 고객 선택 패키지
    optionIds: ['option-3'],  // 메이크업샵 촬영
    projectStatus: 'editing',
    weddingDate: '2025-11-20',
    weddingTime: '11:00',
    weddingVenue: '경기 럭셔리 컨벤션',
    makeupInfo: '외부 메이크업 (09:00)',
    referralSource: 'Naver Blog',  // 유입 경로
    assignedPhotographerIds: ['photographer-2', 'photographer-3'],
    assignedPhotographers: [mockPhotographers[1], mockPhotographers[2]],
    assignedEditorId: 'editor-1',
    assignedEditor: mockUsers[4],
    progress: 75,
    createdAt: '2025-08-26T10:00:00Z',
    updatedAt: '2025-11-01T10:00:00Z'
  },
  {
    id: 'project-3',
    projectNumber: 'PRJ-2025-003',
    customerId: 'customer-2',
    contractId: 'contract-3',
    projectType: 'hanbok',  // wedding에서 hanbok으로 변경
    packageId: 'hanbok-a2',  // 한복 패키지
    optionIds: [],
    projectStatus: 'scheduled',
    weddingDate: '2026-03-10',
    weddingTime: '10:00',
    weddingVenue: '제주 야외 촬영',
    specialRequests: '해변 배경 중점',
    referralSource: '웨딩홀 제휴',  // 유입 경로
    assignedPhotographerIds: ['photographer-1'],
    assignedPhotographers: [mockPhotographers[0]],
    progress: 10,
    createdAt: '2025-10-20T10:00:00Z',
    updatedAt: '2025-10-20T10:00:00Z'
  },
  {
    id: 'project-4',
    projectNumber: 'PRJ-2025-004',
    customerId: 'customer-1',
    customer: mockCustomers[0],
    contractId: 'contract-1',
    projectType: 'wedding',
    packageId: 'basic',  // BASIC 패키지
    optionIds: [],
    projectStatus: 'scheduled',
    weddingDate: '2025-12-22',
    weddingTime: '13:00',
    weddingVenue: '인천 드림웨딩홀',
    makeupInfo: '웨딩홀 내 메이크업샵 (11:00)',
    specialRequests: '가족 단체 사진 중요',
    referralSource: 'Facebook',  // 유입 경로
    assignedPhotographerIds: [],
    assignedPhotographers: [],
    progress: 5,
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-11-10T10:00:00Z'
  },
  {
    id: 'project-5',
    projectNumber: 'PRJ-2025-005',
    customerId: 'customer-3',
    customer: mockCustomers[2],
    contractId: 'contract-2',
    projectType: 'wedding',
    packageId: 'data',  // DATA 패키지
    optionIds: ['option-2'],  // 2인 작가
    projectStatus: 'scheduled',
    weddingDate: '2026-01-18',
    weddingTime: '15:00',
    weddingVenue: '부산 씨사이드호텔',
    makeupInfo: '호텔 스위트룸 (13:00)',
    specialRequests: '오션뷰 촬영 희망',
    referralSource: '지인 추천',  // 유입 경로
    assignedPhotographerIds: [],
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-12T14:00:00Z',
    updatedAt: '2025-11-12T14:00:00Z'
  },
  {
    id: 'project-6',
    projectNumber: 'PRJ-2025-006',
    customerId: 'customer-6',
    customer: mockCustomers[5],
    contractId: 'contract-3',
    projectType: 'wedding',
    packageId: 'new-basic',  // new BASIC 패키지
    optionIds: ['option-1'],  // 메이크업샵 촬영
    projectStatus: 'scheduled',
    weddingDate: '2026-02-14',
    weddingTime: '16:00',
    weddingVenue: '서울 르네상스 웨딩홀',
    makeupInfo: '웨딩홀 내 메이크업샵 (14:00)',
    specialRequests: '발렌타인데이 컨셉 촬영',
    referralSource: '관리자 직접 등록',  // 유입 경로
    assignedPhotographerIds: ['photographer-1'],
    assignedPhotographers: [mockPhotographers[0]],
    progress: 5,
    createdAt: '2025-11-19T14:30:00Z',
    updatedAt: '2025-11-19T14:30:00Z'
  },
  {
    id: 'project-7',
    projectNumber: 'PRJ-2025-007',
    customerId: 'customer-4',
    customer: mockCustomers[3],
    contractId: '',  // 아직 계약 전
    projectType: 'wedding',
    packageId: 'new-data',  // new DATA 패키지
    optionIds: ['option-1', 'option-2'],  // 메이크업샵 촬영 + 2인 작가
    projectStatus: 'scheduled',
    weddingDate: '2026-04-18',
    weddingTime: '14:00',
    weddingVenue: '경기 드림파크 웨딩홀',
    specialRequests: '야외 정원 촬영 희망, 가족 단체 사진 중요',
    referralSource: '고객용 페이지',  // 유입 경로
    assignedPhotographerIds: [],  // 작가 미배정 (일정 미확정)
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-18T15:30:00Z',
    updatedAt: '2025-11-18T15:30:00Z'
  },
  {
    id: 'project-8',
    projectNumber: 'PRJ-2025-008',
    customerId: 'customer-5',
    customer: mockCustomers[4],
    contractId: '',  // 아직 계약 전
    projectType: 'wedding',
    packageId: 'new-basic',  // new BASIC 패키지
    optionIds: ['option-3'],  // 본식스냅 (full)
    projectStatus: 'scheduled',
    weddingDate: '2026-05-23',
    weddingTime: '오후 2시',
    weddingVenue: '서울 그랜드 웨딩홀',
    specialRequests: '웨딩홀 제휴 고객입니다. 실내 촬영 위주로 진행해주세요.',
    referralSource: '웨딩홀 제휴',  // 유입 경로
    assignedPhotographerIds: [],  // 작가 미배정 (일정 미확정)
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-19T09:20:00Z',
    updatedAt: '2025-11-19T09:20:00Z'
  },
  {
    id: 'project-9',
    projectNumber: 'PRJ-2025-009',
    customerId: 'customer-7',
    customer: mockCustomers[6],
    contractId: '',  // 아직 계약 전
    projectType: 'hanbok',
    packageId: 'hanbok-a2',  // 한복 A-2 패키지
    optionIds: [],
    projectStatus: 'scheduled',
    weddingDate: '2026-03-15',
    weddingTime: '오전 10시',
    weddingVenue: '한옥마을 스튜디오',
    specialRequests: '전통 한복 컨셉. 한옥 배경으로 촬영 희망합니다.',
    referralSource: '고객용 페이지',  // 유입 경로
    assignedPhotographerIds: [],  // 작가 미배정 (일정 미확정)
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-19T16:00:00Z',
    updatedAt: '2025-11-19T16:00:00Z'
  },
  {
    id: 'project-10',
    projectNumber: 'PRJ-2025-010',
    customerId: 'customer-8',
    customer: mockCustomers[7],
    contractId: '',  // 아직 계약 전
    projectType: 'dress_shop',
    packageId: 'dress-1',  // 가봉 스냅 패키지
    optionIds: [],
    projectStatus: 'scheduled',
    weddingDate: '2026-02-28',
    weddingTime: '오후 3시',
    weddingVenue: '드레스샵 스튜디오',
    specialRequests: '드레스 가봉 과정 촬영. 자연스러운 분위기 원합니다.',
    referralSource: '고객용 페이지',  // 유입 경로
    assignedPhotographerIds: [],  // 작가 미배정 (일정 미확정)
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-19T17:30:00Z',
    updatedAt: '2025-11-19T17:30:00Z'
  },
  {
    id: 'project-11',
    projectNumber: 'PRJ-2025-011',
    customerId: 'customer-9',
    customer: mockCustomers[8],
    contractId: '',  // 아직 계약 전
    projectType: 'wedding',
    packageId: 'new-basic',  // new BASIC 패키지
    optionIds: ['option-2'],  // 2인 작가
    projectStatus: 'scheduled',
    weddingDate: '2026-06-20',
    weddingTime: '낮 12시',
    weddingVenue: '부산 해운대 웨딩홀',
    specialRequests: 'Instagram 보고 문의드렸습니다. 바다 배경 촬영 가능한가요?',
    referralSource: 'Instagram',  // 유입 경로
    assignedPhotographerIds: [],  // 작가 미배정 (일정 미확정)
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-19T10:00:00Z',
    updatedAt: '2025-11-19T10:00:00Z'
  }
]

// Mock Shooting Schedules
export const mockShootingSchedules: ShootingSchedule[] = [
  {
    id: 'schedule-1',
    projectId: 'project-1',
    project: mockProjects[0],
    scheduleType: 'main_shoot',
    startTime: '2025-12-15T14:00:00Z',
    endTime: '2025-12-15T18:00:00Z',
    location: '서울 그랜드 웨딩홀',
    locationAddress: '서울시 강남구 테헤란로 123',
    travelTimeMinutes: 30,
    photographerId: 'photographer-1',
    photographer: mockPhotographers[0],
    assistantIds: [],
    status: 'confirmed',
    notes: '야외 정원 촬영 포함',
    createdAt: '2025-09-10T10:00:00Z'
  },
  {
    id: 'schedule-2',
    projectId: 'project-2',
    project: mockProjects[1],
    scheduleType: 'main_shoot',
    startTime: '2025-11-20T11:00:00Z',
    endTime: '2025-11-20T16:00:00Z',
    location: '경기 럭셔리 컨벤션',
    locationAddress: '경기도 성남시 분당구 황새울로 200',
    travelTimeMinutes: 45,
    photographerId: 'photographer-2',
    photographer: mockPhotographers[1],
    assistantIds: [],
    status: 'completed',
    createdAt: '2025-09-01T10:00:00Z'
  }
]

// Mock Photo Albums
export const mockPhotoAlbums: PhotoAlbum[] = [
  {
    id: 'album-1',
    projectId: 'project-1',
    project: mockProjects[0],
    albumType: 'proof',
    storageLocation: 's3://mindgraphy-photos/project-1/proof/',
    totalPhotos: 250,
    totalSizeBytes: 5368709120,
    uploadStatus: 'completed',
    uploadedBy: 'photographer-1',
    uploadedAt: '2025-12-16T10:00:00Z',
    createdAt: '2025-12-15T20:00:00Z'
  },
  {
    id: 'album-2',
    projectId: 'project-2',
    project: mockProjects[1],
    albumType: 'edited',
    storageLocation: 's3://mindgraphy-photos/project-2/edited/',
    totalPhotos: 180,
    totalSizeBytes: 4294967296,
    uploadStatus: 'completed',
    uploadedBy: 'editor-1',
    uploadedAt: '2025-11-21T15:00:00Z',
    createdAt: '2025-11-20T18:00:00Z'
  }
]

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: '홍길동 & 김영희 웨딩',
    start: '2025-12-15T14:00:00',
    end: '2025-12-15T18:00:00',
    projectId: 'project-1',
    photographerId: 'photographer-1',
    location: '서울 그랜드 웨딩홀',
    status: 'confirmed',
    travelTime: 30,
    backgroundColor: '#10b981',
    borderColor: '#059669',
    extendedProps: {
      customerName: '홍길동 & 김영희',
      venue: '서울 그랜드 웨딩홀',
      type: '본식',
      notes: '야외 촬영 포함'
    }
  },
  {
    id: 'event-2',
    title: '강민수 & 윤서연 웨딩',
    start: '2025-11-20T11:00:00',
    end: '2025-11-20T16:00:00',
    projectId: 'project-2',
    photographerId: 'photographer-2',
    location: '경기 럭셔리 컨벤션',
    status: 'completed',
    travelTime: 45,
    backgroundColor: '#6366f1',
    borderColor: '#4f46e5',
    extendedProps: {
      customerName: '강민수 & 윤서연',
      venue: '경기 럭셔리 컨벤션',
      type: '본식'
    }
  },
  {
    id: 'event-3',
    title: '이철수 & 박민지 스냅촬영',
    start: '2025-11-10T10:00:00',
    end: '2025-11-10T14:00:00',
    projectId: 'project-3',
    photographerId: 'photographer-1',
    location: '제주도',
    status: 'scheduled',
    travelTime: 120,
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
    extendedProps: {
      customerName: '이철수 & 박민지',
      venue: '제주 해변',
      type: '스냅',
      notes: '제주도 출장'
    }
  },
  {
    id: 'event-4',
    title: '김민준 & 이서윤 웨딩',
    start: '2025-11-25T13:00:00',
    end: '2025-11-25T17:00:00',
    photographerId: 'photographer-1',
    location: '강남 웨딩타운',
    status: 'confirmed',
    travelTime: 20,
    backgroundColor: '#10b981',
    borderColor: '#059669',
    extendedProps: {
      customerName: '김민준 & 이서윤',
      venue: '강남 웨딩타운',
      type: '본식'
    }
  }
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalProjects: 45,
  activeProjects: 12,
  completedProjects: 30,
  conversionRate: 68.5,
  averageDeliveryTime: 14.2,
  customerSatisfaction: 4.7,
  revenue: {
    total: 150000000,
    deposits: 80000000,
    balance: 70000000
  },
  upcomingShootings: 5,
  pendingProofs: 3,
  editingQueue: 4
}

// Mock Editing Queue
export const mockEditingQueue: EditingQueue[] = [
  {
    id: 'edit-1',
    projectId: 'project-1',
    project: mockProjects[0],
    photoIds: ['photo-1', 'photo-2', 'photo-3'],
    assignedEditorId: 'editor-1',
    assignedEditor: mockUsers[4],
    priority: 'high',
    editingType: '색보정 + 리터칭',
    dueDate: '2025-11-10T23:59:59Z',
    status: 'in_progress',
    revisionCount: 0,
    notes: '신부 피부톤 밝게',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-02T14:00:00Z'
  },
  {
    id: 'edit-2',
    projectId: 'project-2',
    project: mockProjects[1],
    photoIds: ['photo-4', 'photo-5'],
    assignedEditorId: 'editor-1',
    assignedEditor: mockUsers[4],
    priority: 'normal',
    editingType: '색보정',
    dueDate: '2025-11-15T23:59:59Z',
    status: 'queued',
    revisionCount: 0,
    createdAt: '2025-11-03T09:00:00Z',
    updatedAt: '2025-11-03T09:00:00Z'
  }
]

// Mock Deliverables
export const mockDeliverables: Deliverable[] = [
  {
    id: 'delivery-1',
    projectId: 'project-2',
    project: mockProjects[1],
    deliveryType: 'digital_download',
    storagePath: 's3://mindgraphy-delivery/project-2/',
    downloadLink: 'https://download.mindgraphy.com/d/abc123',
    downloadToken: 'abc123',
    expiresAt: '2025-12-03T00:00:00Z',
    downloadCount: 2,
    maxDownloads: 5,
    deliveredAt: '2025-11-03T10:00:00Z',
    deliveryStatus: 'delivered',
    recipientName: '강민수',
    createdAt: '2025-11-02T15:00:00Z'
  }
]

// Helper function to get user by ID
export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id)
}

// Helper function to get customer by ID
export function getCustomerById(id: string): Customer | undefined {
  return mockCustomers.find(customer => customer.id === id)
}

// Helper function to get project by ID
export function getProjectById(id: string): Project | undefined {
  return mockProjects.find(project => project.id === id)
}

// Helper function to get photographer by ID
export function getPhotographerById(id: string): Photographer | undefined {
  return mockPhotographers.find(photographer => photographer.id === id)
}

// Mock Notes (고객 메모 + 내부 메모)
export const mockNotes: Note[] = [
  // customer-4 (김태현 & 최수진) 메모
  {
    id: 'note-1',
    content: '야외 정원 촬영을 꼭 포함해주세요. 가족 단체 사진도 많이 찍고 싶습니다.',
    author: 'customer',
    authorName: '김태현 & 최수진',
    createdAt: '2025-11-18T16:00:00Z'
  },
  {
    id: 'note-2',
    content: '촬영 가능 시간대 확인 완료. 작가 배정 진행 예정',
    author: 'admin',
    authorName: '담당자',
    createdAt: '2025-11-18T17:30:00Z'
  },
  // customer-5 (박준호 & 정하은) 메모
  {
    id: 'note-3',
    content: '웨딩홀 제휴 고객입니다. 실내 촬영 위주로 부탁드립니다.',
    author: 'customer',
    authorName: '박준호 & 정하은',
    createdAt: '2025-11-19T09:30:00Z'
  },
  {
    id: 'note-4',
    content: '웨딩홀 담당자와 일정 조율 필요. 제휴 할인 적용 예정',
    author: 'admin',
    authorName: '담당자',
    createdAt: '2025-11-19T14:00:00Z'
  },
  // customer-7 (정우성 & 송혜교) 메모
  {
    id: 'note-5',
    content: '전통 한복 촬영입니다. 한옥 배경으로 촬영해주세요.',
    author: 'customer',
    authorName: '정우성 & 송혜교',
    createdAt: '2025-11-19T16:10:00Z'
  },
  {
    id: 'note-6',
    content: '한옥 촬영 전문 작가 배정 검토 중',
    author: 'admin',
    authorName: '담당자',
    createdAt: '2025-11-19T18:00:00Z'
  },
  // customer-8 (조인성 & 한지민) 메모
  {
    id: 'note-7',
    content: '가봉 스냅 촬영입니다. 자연스러운 분위기를 원합니다.',
    author: 'customer',
    authorName: '조인성 & 한지민',
    createdAt: '2025-11-19T17:40:00Z'
  },
  // customer-9 (현빈 & 손예진) 메모
  {
    id: 'note-8',
    content: 'Instagram 보고 문의드렸습니다. 바다 배경 촬영 가능한가요?',
    author: 'customer',
    authorName: '현빈 & 손예진',
    createdAt: '2025-11-19T10:15:00Z'
  },
  {
    id: 'note-9',
    content: '해운대 바다 배경 촬영 가능. 날씨 확인 후 최종 일정 확정 예정',
    author: 'admin',
    authorName: '담당자',
    createdAt: '2025-11-19T11:00:00Z'
  },
  {
    id: 'note-10',
    content: '추가로 석양 촬영도 가능한지 궁금합니다.',
    author: 'customer',
    authorName: '현빈 & 손예진',
    createdAt: '2025-11-19T15:20:00Z'
  }
]

// Helper function to get notes by customer ID
export function getNotesByCustomerId(customerId: string): Note[] {
  const customerIdToNoteMap: Record<string, string[]> = {
    'customer-4': ['note-1', 'note-2'],
    'customer-5': ['note-3', 'note-4'],
    'customer-7': ['note-5', 'note-6'],
    'customer-8': ['note-7'],
    'customer-9': ['note-8', 'note-9', 'note-10']
  }
  
  const noteIds = customerIdToNoteMap[customerId] || []
  return mockNotes.filter(note => noteIds.includes(note.id))
}

