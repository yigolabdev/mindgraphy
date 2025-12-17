/**
 * Mindgraphy 공통 상수
 */

import type { LeadStatus, ProjectStatus, ProjectType, VenuePartnerType } from '@/lib/types'

// ============================================================================
// Lead Status
// ============================================================================

export const LEAD_STATUS_CONFIG: Record<LeadStatus, {
  label: string
  color: string
  description: string
}> = {
  inquiry: {
    label: '문의',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: '초기 문의 상태'
  },
  consulting: {
    label: '상담중',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: '상담 진행 중'
  },
  contract_pending: {
    label: '계약대기',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    description: '계약서 검토/대기 중'
  },
  contracted: {
    label: '계약완료',
    color: 'bg-green-50 text-green-700 border-green-200',
    description: '계약이 완료됨'
  },
  shooting_scheduled: {
    label: '촬영예정',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: '촬영 일정 확정'
  },
  shooting_completed: {
    label: '촬영완료',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    description: '촬영이 완료됨'
  },
  editing: {
    label: '편집중',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    description: '사진 편집 진행 중'
  },
  completed: {
    label: '완료',
    color: 'bg-zinc-50 text-zinc-700 border-zinc-200',
    description: '모든 프로세스 완료'
  },
  cancelled: {
    label: '취소',
    color: 'bg-red-50 text-red-700 border-red-200',
    description: '계약/프로젝트 취소'
  }
}

// ============================================================================
// Project Status
// ============================================================================

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, {
  label: string
  color: string
  icon: string
}> = {
  scheduled: {
    label: '예약됨',
    color: 'bg-blue-100 text-blue-800',
    icon: 'calendar'
  },
  confirmed: {
    label: '확정',
    color: 'bg-green-100 text-green-800',
    icon: 'check-circle'
  },
  in_progress: {
    label: '진행중',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'clock'
  },
  shooting: {
    label: '촬영중',
    color: 'bg-purple-100 text-purple-800',
    icon: 'camera'
  },
  editing: {
    label: '편집중',
    color: 'bg-orange-100 text-orange-800',
    icon: 'edit'
  },
  review: {
    label: '검토중',
    color: 'bg-indigo-100 text-indigo-800',
    icon: 'eye'
  },
  delivered: {
    label: '전달완료',
    color: 'bg-teal-100 text-teal-800',
    icon: 'package'
  },
  completed: {
    label: '완료',
    color: 'bg-zinc-100 text-zinc-800',
    icon: 'check'
  },
  cancelled: {
    label: '취소',
    color: 'bg-red-100 text-red-800',
    icon: 'x-circle'
  }
}

// ============================================================================
// Project Type
// ============================================================================

export const PROJECT_TYPE_CONFIG: Record<ProjectType, {
  label: string
  color: string
  icon: string
  description: string
}> = {
  wedding: {
    label: '웨딩',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: 'heart',
    description: '결혼식 촬영'
  },
  hanbok: {
    label: '한복 & 캐주얼',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'users',
    description: '한복 및 캐주얼 스냅'
  },
  dress_shop: {
    label: '가봉 스냅',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: 'camera',
    description: '드레스 가봉 촬영'
  },
  baby: {
    label: '돌스냅',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'baby',
    description: '아기 돌잔치 촬영'
  }
}

// ============================================================================
// Venue Partner Type
// ============================================================================

export const VENUE_TYPE_CONFIG: Record<VenuePartnerType, {
  label: string
  icon: string
}> = {
  'wedding-hall': {
    label: '웨딩홀',
    icon: 'building'
  },
  'hotel': {
    label: '호텔',
    icon: 'hotel'
  },
  'studio': {
    label: '스튜디오',
    icon: 'camera'
  },
  'outdoor': {
    label: '야외',
    icon: 'tree'
  },
  'restaurant': {
    label: '레스토랑',
    icon: 'utensils'
  },
  'other': {
    label: '기타',
    icon: 'more-horizontal'
  }
}

// ============================================================================
// Time Slots
// ============================================================================

export const TIME_SLOTS = [
  { value: '10:00', label: '오전 10시' },
  { value: '10:30', label: '오전 10시 30분' },
  { value: '11:00', label: '오전 11시' },
  { value: '11:30', label: '오전 11시 30분' },
  { value: '12:00', label: '낮 12시' },
  { value: '12:30', label: '낮 12시 30분' },
  { value: '13:00', label: '오후 1시' },
  { value: '13:30', label: '오후 1시 30분' },
  { value: '14:00', label: '오후 2시' },
  { value: '14:30', label: '오후 2시 30분' },
  { value: '15:00', label: '오후 3시' },
  { value: '15:30', label: '오후 3시 30분' },
  { value: '16:00', label: '오후 4시' },
  { value: '16:30', label: '오후 4시 30분' },
  { value: '17:00', label: '오후 5시' },
  { value: '17:30', label: '오후 5시 30분' },
  { value: '18:00', label: '오후 6시' }
] as const

// ============================================================================
// Pagination
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

// ============================================================================
// Date Formats
// ============================================================================

export const DATE_FORMAT = 'yyyy-MM-dd'
export const DATETIME_FORMAT = 'yyyy-MM-dd HH:mm'
export const TIME_FORMAT = 'HH:mm'
export const DISPLAY_DATE_FORMAT = 'yyyy년 MM월 dd일'
export const DISPLAY_DATETIME_FORMAT = 'yyyy년 MM월 dd일 HH시 mm분'

// ============================================================================
// Validation Rules
// ============================================================================

export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 11,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100
} as const

// ============================================================================
// File Upload
// ============================================================================

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  MAX_IMAGES: 50
} as const

// ============================================================================
// Routes
// ============================================================================

export const ROUTES = {
  // Admin
  ADMIN: {
    HOME: '/admin',
    DASHBOARD: '/admin/dashboard',
    CUSTOMERS: '/admin/customers',
    PROJECTS: '/admin/projects',
    PROJECT_NEW: '/admin/projects/new',
    CALENDAR: '/admin/calendar',
    SCHEDULE: '/admin/schedule',
    TEAM: '/admin/team',
    SETTINGS: '/admin/settings',
    LOGIN: '/admin/login'
  },
  // Client
  CLIENT: {
    HOME: '/c',
    INQUIRY: '/c/inquiry',
    PRODUCT_TYPE: '/c/product-type',
    WEDDING_DATE: '/c/wedding-date',
    PACKAGES: '/c/packages',
    OPTIONS: '/c/options',
    VENUE_INFO: '/c/venue-info',
    VENUE_CONTACT: '/c/venue-contact',
    VENUE_DETAILS: '/c/venue-details',
    VENUE_DATE: '/c/venue-date',
    VENUE_COMPLETE: '/c/venue-complete',
    PORTAL: '/c/portal',
    LOGIN: '/c/login'
  }
} as const

// ============================================================================
// Local Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mindgraphy_auth_token',
  USER_DATA: 'mindgraphy_user_data',
  THEME: 'mindgraphy_theme',
  LANGUAGE: 'mindgraphy_language'
} as const

// ============================================================================
// API Endpoints
// ============================================================================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me'
  },
  CUSTOMERS: {
    LIST: '/api/customers',
    DETAIL: (id: string) => `/api/customers/${id}`,
    CREATE: '/api/customers',
    UPDATE: (id: string) => `/api/customers/${id}`,
    DELETE: (id: string) => `/api/customers/${id}`
  },
  PROJECTS: {
    LIST: '/api/projects',
    DETAIL: (id: string) => `/api/projects/${id}`,
    CREATE: '/api/projects',
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`
  },
  PAYMENTS: {
    LIST: '/api/payments',
    CREATE: '/api/payments',
    UPDATE: (id: string) => `/api/payments/${id}`
  }
} as const
