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
  CalendarEvent
} from './types'

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
    phone: '010-3456-7890'
  },
  {
    id: 'photo-2',
    email: 'photographer2@mindgraphy.com',
    role: 'photographer',
    firstName: '작가',
    lastName: '최',
    status: 'active',
    phone: '010-4567-8901'
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
    leadStatus: 'contracted',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '친구 추천으로 문의 주심',
    createdAt: '2025-09-01T10:00:00Z'
  },
  {
    id: 'customer-2',
    groomName: '이철수',
    brideName: '박민지',
    groomPhone: '010-5555-6666',
    bridePhone: '010-7777-8888',
    email: 'couple2@example.com',
    sourceChannel: 'Naver Blog',
    leadStatus: 'proposal',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    notes: '스튜디오 + 본식 패키지 관심',
    createdAt: '2025-10-15T14:30:00Z'
  },
  {
    id: 'customer-3',
    groomName: '강민수',
    brideName: '윤서연',
    groomPhone: '010-9999-0000',
    bridePhone: '010-1212-3434',
    email: 'couple3@example.com',
    sourceChannel: 'Facebook',
    leadStatus: 'contracted',
    assignedManagerId: 'user-2',
    assignedManager: mockUsers[1],
    createdAt: '2025-08-20T09:15:00Z'
  }
]

// Mock Contracts
export const mockContracts: Contract[] = [
  {
    id: 'contract-1',
    contractNumber: 'MG-2025-001',
    customerId: 'customer-1',
    customer: mockCustomers[0],
    packageType: '프리미엄 웨딩 패키지',
    totalAmount: 5000000,
    depositAmount: 2000000,
    balanceAmount: 3000000,
    contractStatus: 'signed',
    contractDate: '2025-09-05',
    signedAt: '2025-09-06T15:30:00Z',
    pdfUrl: 'https://s3.example.com/contracts/MG-2025-001.pdf',
    createdAt: '2025-09-05T10:00:00Z'
  },
  {
    id: 'contract-2',
    contractNumber: 'MG-2025-002',
    customerId: 'customer-3',
    customer: mockCustomers[2],
    packageType: '스탠다드 웨딩 패키지',
    totalAmount: 3500000,
    depositAmount: 1500000,
    balanceAmount: 2000000,
    contractStatus: 'signed',
    contractDate: '2025-08-25',
    signedAt: '2025-08-26T11:00:00Z',
    pdfUrl: 'https://s3.example.com/contracts/MG-2025-002.pdf',
    createdAt: '2025-08-25T09:15:00Z'
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
    projectStatus: 'proof_ready',
    weddingDate: '2025-12-15',
    weddingTime: '14:00',
    weddingVenue: '서울 그랜드 웨딩홀',
    makeupInfo: '웨딩홀 내 메이크업샵 (12:00)',
    specialRequests: '야외 촬영 희망',
    assignedPhotographerIds: ['photographer-1', 'photographer-2'],
    assignedPhotographers: [mockPhotographers[0], mockPhotographers[1]],
    assignedEditorId: 'editor-1',
    assignedEditor: mockUsers[4],
    progress: 60,
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
    projectStatus: 'editing',
    weddingDate: '2025-11-20',
    weddingTime: '11:00',
    weddingVenue: '경기 럭셔리 컨벤션',
    makeupInfo: '외부 메이크업 (09:00)',
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
    projectType: 'pre_wedding',
    projectStatus: 'scheduled',
    weddingDate: '2026-03-10',
    weddingTime: '10:00',
    weddingVenue: '제주 스냅 촬영',
    specialRequests: '해변 배경 중점',
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
    projectStatus: 'scheduled',
    weddingDate: '2025-12-22',
    weddingTime: '13:00',
    weddingVenue: '인천 드림웨딩홀',
    makeupInfo: '웨딩홀 내 메이크업샵 (11:00)',
    specialRequests: '가족 단체 사진 중요',
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
    projectStatus: 'scheduled',
    weddingDate: '2026-01-18',
    weddingTime: '15:00',
    weddingVenue: '부산 씨사이드호텔',
    makeupInfo: '호텔 스위트룸 (13:00)',
    specialRequests: '오션뷰 촬영 희망',
    assignedPhotographerIds: [],
    assignedPhotographers: [],
    progress: 0,
    createdAt: '2025-11-12T14:00:00Z',
    updatedAt: '2025-11-12T14:00:00Z'
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

