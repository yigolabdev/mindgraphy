import { SESSION_KEYS } from '@/lib/constants'

/**
 * Session Storage Utility Functions
 * 클라이언트 사이드에서만 사용 가능한 세션 스토리지 유틸리티
 */

// Type-safe session storage getter
export function getSessionItem(key: keyof typeof SESSION_KEYS): string | null {
  if (typeof window === 'undefined') return null
  try {
    return sessionStorage.getItem(SESSION_KEYS[key])
  } catch (error) {
    console.error(`Error reading session storage key: ${key}`, error)
    return null
  }
}

// Type-safe session storage setter
export function setSessionItem(key: keyof typeof SESSION_KEYS, value: string): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(SESSION_KEYS[key], value)
  } catch (error) {
    console.error(`Error writing session storage key: ${key}`, error)
  }
}

// Remove a specific session item
export function removeSessionItem(key: keyof typeof SESSION_KEYS): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(SESSION_KEYS[key])
  } catch (error) {
    console.error(`Error removing session storage key: ${key}`, error)
  }
}

// Clear all mindgraphy session items
export function clearAllSession(): void {
  if (typeof window === 'undefined') return
  try {
    Object.values(SESSION_KEYS).forEach(key => {
      sessionStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Error clearing session storage', error)
  }
}

// Get JSON data from session
export function getSessionJSON<T>(key: keyof typeof SESSION_KEYS): T | null {
  const value = getSessionItem(key)
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch (error) {
    console.error(`Error parsing JSON from session storage key: ${key}`, error)
    return null
  }
}

// Set JSON data to session
export function setSessionJSON<T>(key: keyof typeof SESSION_KEYS, value: T): void {
  try {
    setSessionItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error stringifying JSON to session storage key: ${key}`, error)
  }
}

// Get all client form data (for submission)
export interface ClientFormData {
  // Product Selection
  productType: string | null
  clientType: string | null
  packageId: string | null
  optionIds: string[]
  
  // Customer Information
  brideName: string | null
  groomName: string | null
  bridePhone: string | null
  groomPhone: string | null
  phone: string | null
  email: string | null
  mainContact: string | null
  
  // Event Details
  weddingDate: string | null
  weddingTime: string | null
  weddingDateInfo: string | null
  weddingVenue: string | null // venue 대신 weddingVenue 사용
  venue: string | null
  venueRequest: string | null
  
  // Referral
  referralSource: string | null
  specialRequests: string | null // 특별 요청사항 추가
}

export function getAllClientFormData(): ClientFormData {
  if (typeof window === 'undefined') {
    return {} as ClientFormData
  }
  
  // venue 정보 통합 (venue_name + venue_hall)
  const venueName = sessionStorage.getItem('mindgraphy_venue_name') || ''
  const venueHall = sessionStorage.getItem('mindgraphy_venue_hall') || ''
  const weddingVenue = venueName && venueHall 
    ? `${venueName} ${venueHall}`.trim()
    : venueName || venueHall || getSessionItem('VENUE') || null
  
  const venueRequest = getSessionItem('VENUE_REQUEST')
  
  // 유입 경로 결정
  const sourceChannel = sessionStorage.getItem('mindgraphy_source_channel') || getSessionItem('REFERRAL_SOURCE')
  const clientType = getSessionItem('CLIENT_TYPE')
  let referralSource = sourceChannel || '고객용 페이지'
  
  // clientType에 따라 유입 경로 구체화
  if (!sourceChannel && clientType === 'venue') {
    referralSource = '웨딩홀 제휴'
  } else if (!sourceChannel && clientType === 'direct') {
    referralSource = '고객용 페이지 (직접 문의)'
  }
  
  return {
    // Product Selection
    productType: getSessionItem('PRODUCT_TYPE'),
    clientType: clientType,
    packageId: getSessionItem('PACKAGE'),
    optionIds: getSessionJSON<string[]>('OPTIONS') || [],
    
    // Customer Information
    brideName: getSessionItem('BRIDE_NAME'),
    groomName: getSessionItem('GROOM_NAME'),
    bridePhone: getSessionItem('BRIDE_PHONE'),
    groomPhone: getSessionItem('GROOM_PHONE'),
    phone: getSessionItem('PHONE'),
    email: getSessionItem('EMAIL'),
    mainContact: getSessionItem('MAIN_CONTACT'),
    
    // Event Details
    weddingDate: getSessionItem('WEDDING_DATE'),
    weddingTime: getSessionItem('WEDDING_TIME'),
    weddingDateInfo: getSessionItem('WEDDING_DATE_INFO'),
    weddingVenue: weddingVenue,
    venue: weddingVenue,
    venueRequest: venueRequest,
    
    // Referral
    referralSource: referralSource,
    specialRequests: venueRequest, // venueRequest를 specialRequests로도 사용
  }
}

// Validate required fields
export function validateClientFormData(data: ClientFormData): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []
  
  // Required fields check
  if (!data.productType) missingFields.push('상품 타입')
  if (!data.packageId && data.productType === 'wedding') missingFields.push('패키지')
  
  // At least one contact required
  if (!data.bridePhone && !data.groomPhone && !data.phone) {
    missingFields.push('연락처')
  }
  
  if (!data.weddingDate) missingFields.push('촬영 날짜')
  
  // Venue required for venue-affiliated clients
  if (data.clientType === 'venue_affiliated' && !data.venue) {
    missingFields.push('예식장')
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

