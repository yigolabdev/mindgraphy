/**
 * 전화번호 포맷팅 유틸리티
 * 
 * 지원 형식:
 * - 휴대폰: 010-0000-0000
 * - 서울: 02-000-0000 / 02-0000-0000
 * - 지역번호: 031-000-0000 / 031-0000-0000
 * - 인터넷전화: 070-0000-0000
 * - 대표번호: 1588-0000
 * - 긴급번호: 119, 112
 */

/**
 * 전화번호를 자동으로 포맷팅합니다
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const digits = value.replace(/\D/g, '')
  
  // 빈 문자열 처리
  if (!digits) return ''
  
  // 긴급번호 (3자리)
  if (digits.length === 3) {
    return digits
  }
  
  // 1588, 1577 등 대표번호 (8자리)
  if (digits.startsWith('15') || digits.startsWith('16') || digits.startsWith('18')) {
    if (digits.length <= 4) {
      return digits
    } else if (digits.length <= 8) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`
    }
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`
  }
  
  // 02 (서울)
  if (digits.startsWith('02')) {
    if (digits.length <= 2) {
      return digits
    } else if (digits.length <= 5) {
      // 02-123
      return `${digits.slice(0, 2)}-${digits.slice(2)}`
    } else if (digits.length <= 9) {
      // 02-123-4567 (국번 3자리)
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
    } else {
      // 02-1234-5678 (국번 4자리)
      return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`
    }
  }
  
  // 010, 070 (휴대폰, 인터넷전화)
  if (digits.startsWith('010') || digits.startsWith('070')) {
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
    }
  }
  
  // 기타 지역번호 (031, 032, 033, 041, 042, 043, 044, 051, 052, 053, 054, 055, 061, 062, 063, 064)
  if (digits.length >= 3) {
    const areaCode = digits.slice(0, 3)
    const areaCodes = ['031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064']
    
    if (areaCodes.includes(areaCode)) {
      if (digits.length <= 3) {
        return digits
      } else if (digits.length <= 6) {
        // 031-123
        return `${digits.slice(0, 3)}-${digits.slice(3)}`
      } else if (digits.length <= 10) {
        // 031-123-4567 (국번 3자리)
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
      } else {
        // 031-1234-5678 (국번 4자리)
        return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
      }
    }
  }
  
  // 기본 포맷 (알 수 없는 형식)
  if (digits.length <= 3) {
    return digits
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  } else {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
  }
}

/**
 * 전화번호 유효성 검사
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false
  
  const digits = phone.replace(/\D/g, '')
  
  // 최소 길이 체크
  if (digits.length < 3) return false
  
  // 긴급번호
  if (digits === '119' || digits === '112' || digits === '110' || digits === '113') {
    return true
  }
  
  // 대표번호 (1588-1234 등)
  if (digits.startsWith('15') || digits.startsWith('16') || digits.startsWith('18')) {
    return digits.length >= 7 && digits.length <= 8
  }
  
  // 휴대폰 (010-1234-5678)
  if (digits.startsWith('010') || digits.startsWith('011') || digits.startsWith('016') || 
      digits.startsWith('017') || digits.startsWith('018') || digits.startsWith('019')) {
    return digits.length === 10 || digits.length === 11
  }
  
  // 인터넷전화 (070)
  if (digits.startsWith('070')) {
    return digits.length === 10 || digits.length === 11
  }
  
  // 서울 (02)
  if (digits.startsWith('02')) {
    return digits.length >= 9 && digits.length <= 10
  }
  
  // 지역번호
  const areaCode = digits.slice(0, 3)
  const areaCodes = ['031', '032', '033', '041', '042', '043', '044', '051', '052', '053', '054', '055', '061', '062', '063', '064']
  
  if (areaCodes.includes(areaCode)) {
    return digits.length >= 9 && digits.length <= 11
  }
  
  // 기타 (최소 9자리)
  return digits.length >= 9 && digits.length <= 11
}

/**
 * 전화번호 유효성 에러 메시지
 */
export function getPhoneErrorMessage(phone: string): string | null {
  if (!phone) return '전화번호를 입력해주세요'
  
  const digits = phone.replace(/\D/g, '')
  
  if (digits.length < 3) {
    return '전화번호를 정확히 입력해주세요'
  }
  
  if (!isValidPhoneNumber(phone)) {
    if (digits.startsWith('010') || digits.startsWith('070')) {
      return '휴대폰 번호는 10~11자리입니다'
    }
    if (digits.startsWith('02')) {
      return '서울 지역번호는 9~10자리입니다'
    }
    if (digits.startsWith('15') || digits.startsWith('16') || digits.startsWith('18')) {
      return '대표번호는 7~8자리입니다'
    }
    return '올바른 전화번호 형식이 아닙니다'
  }
  
  return null
}

/**
 * 전화번호 타입 감지
 */
export function getPhoneType(phone: string): 'mobile' | 'landline' | 'toll-free' | 'emergency' | 'unknown' {
  const digits = phone.replace(/\D/g, '')
  
  // 긴급번호
  if (['119', '112', '110', '113'].includes(digits)) {
    return 'emergency'
  }
  
  // 휴대폰
  if (digits.startsWith('010') || digits.startsWith('011') || 
      digits.startsWith('016') || digits.startsWith('017') || 
      digits.startsWith('018') || digits.startsWith('019')) {
    return 'mobile'
  }
  
  // 대표번호
  if (digits.startsWith('15') || digits.startsWith('16') || digits.startsWith('18')) {
    return 'toll-free'
  }
  
  // 일반전화
  if (digits.startsWith('02') || digits.startsWith('03') || 
      digits.startsWith('04') || digits.startsWith('05') || 
      digits.startsWith('06') || digits.startsWith('070')) {
    return 'landline'
  }
  
  return 'unknown'
}
