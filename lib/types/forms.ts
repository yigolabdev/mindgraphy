/**
 * 폼 데이터 타입 정의
 * 
 * 전체 애플리케이션에서 사용되는 폼 데이터의 타입을 정의합니다.
 */

import type { ProjectType } from './types'

/**
 * 프로젝트 생성 폼 데이터
 */
export interface CreateProjectFormData {
  // 상품 정보
  productType: ProjectType | ''
  clientType: 'direct' | 'venue' | ''
  
  // 기본 정보
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  mainContact: 'groom' | 'bride'
  email: string
  
  // 패키지 & 옵션
  packageId: string
  optionIds: string[]
  
  // 촬영 상세
  weddingDate: string
  weddingTime: string
  weddingVenue: string
  venueAddress: string
  
  // 유입 경로
  sourceType: 'client-direct' | 'venue-referral' | 'manual-registration' | ''
  venuePartnerId: string
  referralSource: string
  specialRequests: string
  
  // 결제 정보
  paymentStatus: 'unpaid' | 'paid' | 'partial'
  paymentMethod: 'transfer' | 'card' | 'cash' | ''
  paymentAmount: string
}

/**
 * 고객 포털 로그인 폼 데이터
 */
export interface ClientLoginFormData {
  phone: string
  password: string
}

/**
 * 고객 포털 배송 정보 폼 데이터
 */
export interface DeliveryAddressFormData {
  recipientName: string
  recipientPhone: string
  postalCode: string
  address: string
  detailAddress: string
  deliveryRequest: string
}

/**
 * 예식 상세 정보 폼 데이터
 */
export interface WeddingDetailsFormData {
  timeConfirmed: boolean
  // 타임테이블
  makeupShop?: string
  makeupStartTime?: string
  makeupEndTime?: string
  // 예식 내용
  hasPreCeremonyPhoto?: 'yes' | 'no'
  hasOfficiant?: 'yes' | 'no'
  hasMC?: 'yes' | 'no'
  mcType?: 'professional' | 'friend'
  hasRingExchange?: 'yes' | 'no'
  hasFlowerGirl?: 'yes' | 'no'
  hasPaebaek?: 'yes' | 'no'
  // 가족 구성
  groomFamily?: string
  brideFamily?: string
  // 사진 스타일
  preferredStyle?: string
  notPreferredStyle?: string
  // 의상 정보
  mainDressInfo?: string
  receptionDressInfo?: string
  groomSuitInfo?: string
  // 협력 업체
  dressShop?: string
  suitShop?: string
  makeupShopName?: string
  planner?: string
  videoTeam?: string
  iphoneSnap?: string
  otherTeam?: string
  specialRequests?: string
  // 신혼여행
  honeymoonDeparture?: string
  honeymoonDestination?: string
  honeymoonReturn?: string
  // 미팅 방식
  meetingType?: 'direct' | 'phone' | 'list'
  // 청첩장
  invitationUrl?: string
}

/**
 * 상품 생성/수정 폼 데이터
 */
export interface ProductFormData {
  name: string
  category: 'SNAP' | 'OPTION'
  title: string
  description: string[]
  albumIncluded: boolean
  photoCount: number
  albumPages?: number
  miniAlbums?: number
  basePrice: number
  delivery: {
    includesWebGallery: boolean
    includesRawDownload: boolean
  }
  isActive: boolean
}

/**
 * 정책 생성/수정 폼 데이터
 */
export interface PolicyFormData {
  name: string
  type: 'cancellation' | 'refund' | 'usage' | 'privacy'
  version: string
  content: string
  effectiveDate: string
  isActive: boolean
}

/**
 * 예식장 생성/수정 폼 데이터
 */
export interface VenueFormData {
  name: string
  type: 'wedding_hall' | 'hotel' | 'church' | 'outdoor' | 'other'
  address: string
  phone: string
  ballrooms: string[]
  parkingInfo?: string
  notes?: string
  isActive: boolean
}

/**
 * 협력사 생성/수정 폼 데이터
 */
export interface PartnerFormData {
  name: string
  type: 'makeup' | 'dress' | 'studio' | 'planner' | 'florist' | 'other'
  contactPerson: string
  phone: string
  email: string
  address?: string
  website?: string
  commissionRate?: number
  notes?: string
  isActive: boolean
}

/**
 * 타임테이블 엔트리 폼 데이터
 */
export interface TimeTableEntryFormData {
  time: string
  timeModifier: 'exact' | 'estimated' | 'around'
  event: string
  location?: string
  notes?: string
}

/**
 * 스케줄 생성 폼 데이터
 */
export interface CreateScheduleFormData {
  productType: ProjectType | ''
  customerName: string
  groomName: string
  brideName: string
  phone: string
  email: string
  weddingDate: string
  weddingTime: string
  venue: string
  venueAddress: string
  packageId: string
  optionIds: string[]
  photographerIds: string[]
  notes: string
}

/**
 * 프로젝트 필터 상태
 */
export interface ProjectFilters {
  status: string
  startDate: string
  endDate: string
  photographer: string
  searchQuery: string
}

/**
 * 고객 필터 상태
 */
export interface CustomerFilters {
  stage: string
  satisfaction: string
  source: string
  sortBy: 'latest' | 'name' | 'projects' | 'revenue'
}

/**
 * 폼 유효성 검증 결과
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * 폼 제출 결과
 */
export interface FormSubmitResult<T = any> {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string>
}

