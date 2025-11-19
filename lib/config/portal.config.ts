/**
 * Portal configuration and constants
 * Centralizes all portal-related configuration values
 */

import type { PortalStep } from '@/hooks/use-portal-data'

/**
 * Contact information for customer support
 */
export const CONTACT_INFO = {
  phone: '02-2202-9966',
  address: '서울 성동구 마조로15길 6 1층',
  kakaoChannel: 'https://pf.kakao.com/_xmxjxfxj',
  instagram: 'https://www.instagram.com/studio.mind.graphy',
  email: 'info@mind-graphy.com'
} as const

/**
 * Payment information
 */
export const PAYMENT_INFO = {
  bankName: '신한은행',
  accountNumber: '110-123-456789',
  accountHolder: '마인드그라피'
} as const

/**
 * Wedding date configuration based on portal step
 * Steps 0-3: Past date (before shooting)
 * Steps 4-6: Future date (after shooting)
 */
export const WEDDING_DATES = {
  past: '2024-12-01',
  future: '2025-04-12'
} as const

/**
 * Photo selection configuration
 */
export const PHOTO_SELECTION = {
  maxSelections: 60,
  defaultTotalPhotos: 200
} as const

/**
 * Portal step thresholds
 */
export const STEP_THRESHOLDS = {
  beforeShooting: 3, // Steps 0-3
  afterShooting: 4    // Steps 4-6
} as const

/**
 * Animation durations (in ms)
 */
export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  pageTransition: 1000
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  overlay: 20,
  modal: 30,
  toast: 40,
  tooltip: 50
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const

/**
 * Portal routes
 */
export const PORTAL_ROUTES = {
  home: '/c',
  productType: '/c/product-type',
  portal: '/c/portal',
  portalContract: '/c/portal/contract',
  portfolio: '/c/portfolio',
  packages: '/c/packages',
  options: '/c/options',
  weddingDate: '/c/wedding-date',
  venueContact: '/c/venue-contact',
  venueSelect: '/c/venue-select',
  venueComplete: '/c/venue-complete'
} as const

/**
 * Session storage keys
 */
export const SESSION_KEYS = {
  productType: 'productType',
  clientType: 'clientType',
  selectedPackage: 'selectedPackage',
  selectedOptions: 'selectedOptions',
  weddingDate: 'weddingDate',
  weddingTime: 'weddingTime',
  venue: 'venue',
  groomName: 'groomName',
  brideName: 'brideName',
  groomPhone: 'groomPhone',
  bridePhone: 'bridePhone',
  mainContact: 'mainContact',
  email: 'email',
  referralSource: 'referralSource',
  specialRequests: 'specialRequests'
} as const

/**
 * Product type labels
 */
export const PRODUCT_TYPE_LABELS = {
  wedding: '일반 웨딩',
  hanbok: '한복 & 캐주얼',
  dress_shop: '가봉 스냅',
  baby: '돌스냅'
} as const

/**
 * Lead status labels
 */
export const LEAD_STATUS_LABELS = {
  inquiry: '문의',
  consultation: '상담중',
  proposal: '제안',
  contracted: '계약',
  completed: '완료',
  cancelled: '취소'
} as const

/**
 * Project status labels
 */
export const PROJECT_STATUS_LABELS = {
  scheduled: '일정 확정',
  in_progress: '촬영 진행중',
  proof_ready: '사진 선택',
  editing: '편집중',
  completed: '편집 완료',
  delivered: '배송 완료',
  cancelled: '취소',
  archived: '보관'
} as const

/**
 * Validation rules
 */
export const VALIDATION_RULES = {
  phoneNumber: {
    pattern: /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
    message: '올바른 전화번호 형식이 아닙니다'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '올바른 이메일 형식이 아닙니다'
  },
  name: {
    minLength: 2,
    maxLength: 20,
    message: '이름은 2-20자 이내여야 합니다'
  }
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  network: '네트워크 연결을 확인해 주세요',
  server: '서버 오류가 발생했습니다',
  validation: '입력하신 정보를 다시 확인해 주세요',
  timeout: '요청 시간이 초과되었습니다',
  unknown: '알 수 없는 오류가 발생했습니다'
} as const

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  contractSigned: '계약서 서명이 완료되었습니다',
  requestSubmitted: '요청사항이 전달되었습니다',
  ratingSubmitted: '평가해 주셔서 감사합니다',
  photoSelected: '사진이 선택되었습니다'
} as const

