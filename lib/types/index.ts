/**
 * Mindgraphy 공통 타입 정의
 * 
 * 모든 타입을 중앙에서 관리하여 일관성 확보
 */

// ============================================================================
// Base Types
// ============================================================================

export type ID = string

export type Timestamp = string

export type Status = 'active' | 'inactive' | 'deleted'

// ============================================================================
// User & Auth Types
// ============================================================================

export interface User {
  id: ID
  email: string
  firstName: string
  lastName: string
  role: UserRole
  phone?: string
  avatar?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type UserRole = 'admin' | 'photographer' | 'editor' | 'manager' | 'customer'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// ============================================================================
// Customer Types
// ============================================================================

export type LeadStatus = 
  | 'inquiry'           // 문의
  | 'consulting'        // 상담중
  | 'contract_pending'  // 계약대기
  | 'contracted'        // 계약완료
  | 'shooting_scheduled'// 촬영예정
  | 'shooting_completed'// 촬영완료
  | 'editing'           // 편집중
  | 'completed'         // 완료
  | 'cancelled'         // 취소

export type SourceType = 
  | 'client-direct'     // 고객 직접 문의
  | 'venue-referral'    // 제휴처 소개
  | 'manual-registration' // 수동 등록

export interface Customer {
  id: ID
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone?: string
  email: string
  mainContact: 'groom' | 'bride'
  
  // Lead 정보
  leadStatus: LeadStatus
  sourceType: SourceType
  sourceChannel?: string
  
  // 통계
  totalProjects: number
  completedProjects: number
  activeProjects: number
  totalRevenue: number
  
  // 만족도
  satisfaction?: 1 | 2 | 3 | 4 | 5
  
  // 타임스탬프
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Project Types
// ============================================================================

export type ProjectType = 
  | 'wedding'      // 웨딩
  | 'hanbok'       // 한복 & 캐주얼
  | 'dress_shop'   // 가봉 스냅
  | 'baby'         // 돌스냅

export type ProjectStatus = 
  | 'scheduled'       // 예약됨
  | 'confirmed'       // 확정
  | 'in_progress'     // 진행중
  | 'shooting'        // 촬영중
  | 'editing'         // 편집중
  | 'review'          // 검토중
  | 'delivered'       // 전달완료
  | 'completed'       // 완료
  | 'cancelled'       // 취소

export interface Project {
  id: ID
  customerId: ID
  projectType: ProjectType
  projectStatus: ProjectStatus
  
  // 프로젝트 정보
  projectName: string
  packageId?: string
  optionIds?: string[]
  
  // 촬영 정보
  weddingDate?: Timestamp
  weddingTime?: string
  weddingVenue?: string
  venueAddress?: string
  venueHall?: string
  venuePartnerId?: string
  
  // 작가 배정
  assignedPhotographers?: User[]
  
  // 진행률
  progress: number // 0-100
  
  // 타임스탬프
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Contract & Payment Types
// ============================================================================

export type ContractStatus = 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled'

export interface Contract {
  id: ID
  customerId: ID
  projectId?: ID
  
  contractNumber: string
  contractStatus: ContractStatus
  
  // 금액
  totalAmount: number
  depositAmount: number
  balanceAmount: number
  
  // 계약 정보
  packageId?: string
  optionIds?: string[]
  
  // 타임스탬프
  contractDate?: Timestamp
  signedDate?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type PaymentMethod = '계좌이체' | '신용카드' | '현금' | '기타'

export type PaymentType = 'deposit' | 'balance' | 'additional'

export interface Payment {
  id: ID
  contractId: ID
  
  amount: number
  paymentMethod: PaymentMethod
  paymentType: PaymentType
  paymentStatus: PaymentStatus
  
  // 상세 정보
  paymentDate?: Timestamp
  description?: string
  transactionId?: string
  
  // 타임스탬프
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Product Types
// ============================================================================

export type ProductCategory = 'package' | 'option' | 'addon'

export interface Product {
  id: ID
  name: string
  category: ProductCategory
  projectType?: ProjectType
  
  // 가격
  price: number
  originalPrice?: number
  
  // 설명
  description?: string
  features?: string[]
  
  // 재고/가용성
  isAvailable: boolean
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Schedule & Calendar Types
// ============================================================================

export type ScheduleEventType = 
  | 'shooting'    // 촬영
  | 'meeting'     // 미팅
  | 'editing'     // 편집
  | 'delivery'    // 전달
  | 'other'       // 기타

export type ScheduleStatus = 
  | 'scheduled'   // 예약됨
  | 'confirmed'   // 확정
  | 'completed'   // 완료
  | 'cancelled'   // 취소

export interface ScheduleEvent {
  id: ID
  title: string
  eventType: ScheduleEventType
  status: ScheduleStatus
  
  // 시간
  start: Timestamp
  end: Timestamp
  allDay?: boolean
  
  // 연결
  customerId?: ID
  projectId?: ID
  photographerIds?: ID[]
  
  // 장소
  location?: string
  address?: string
  
  // 메모
  notes?: string
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Venue Partner Types
// ============================================================================

export type VenuePartnerType = 
  | 'wedding-hall'    // 웨딩홀
  | 'hotel'           // 호텔
  | 'studio'          // 스튜디오
  | 'outdoor'         // 야외
  | 'restaurant'      // 레스토랑
  | 'other'           // 기타

export interface VenuePartner {
  id: ID
  name: string
  type: VenuePartnerType
  
  // 연락처
  phone: string
  email?: string
  website?: string
  
  // 주소
  address: string
  region?: string
  
  // 계약 정보
  commissionRate?: number
  contractStatus?: Status
  
  createdAt: Timestamp
  updatedAt: Timestamp
}

// ============================================================================
// Form Data Types (Client Pages)
// ============================================================================

export interface InquiryFormData {
  // 신랑신부 정보
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone?: string
  email: string
  mainContact: 'groom' | 'bride'
  
  // 촬영 정보
  productType: ProjectType
  weddingDate?: string
  packageId?: string
  optionIds?: string[]
  
  // 예식장 정보
  weddingVenue?: string
  venueAddress?: string
  venueHall?: string
  weddingTime?: string
  
  // 추가 정보
  notes?: string
}

// ============================================================================
// Statistics & Analytics Types
// ============================================================================

export interface DashboardStats {
  // KPI
  totalCustomers: number
  activeProjects: number
  monthlyRevenue: number
  completionRate: number
  
  // 추세
  customerGrowth: number
  revenueGrowth: number
  
  // 차트 데이터
  revenueByMonth: Array<{ month: string; amount: number }>
  projectsByStatus: Array<{ status: string; count: number }>
  customersBySource: Array<{ source: string; count: number }>
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

// ============================================================================
// UI State Types
// ============================================================================

export interface DialogState<T = any> {
  open: boolean
  data: T | null
}

export interface LoadingState {
  isLoading: boolean
  error: string | null
}

export interface FilterState {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  [key: string]: any
}

export interface SortState {
  field: string
  direction: 'asc' | 'desc'
}

// ============================================================================
// Utility Types
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type Nullable<T> = T | null

export type ValueOf<T> = T[keyof T]
