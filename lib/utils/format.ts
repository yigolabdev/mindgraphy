/**
 * 날짜/시간 포맷 통일 유틸리티
 * 
 * 전체 애플리케이션에서 일관된 날짜/시간 표시를 보장합니다.
 */

import { format, parse, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

/**
 * 날짜 포맷 상수
 */
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',                    // 2025-06-15
  ISO_TIME: 'yyyy-MM-dd HH:mm',         // 2025-06-15 14:00
  ISO_FULL: "yyyy-MM-dd'T'HH:mm:ss",    // 2025-06-15T14:00:00
  DISPLAY: 'yyyy년 MM월 dd일',          // 2025년 6월 15일
  DISPLAY_SHORT: 'M월 d일',             // 6월 15일
  DISPLAY_DOT: 'yyyy.MM.dd',            // 2025.06.15
  DISPLAY_WITH_DAY: 'yyyy년 MM월 dd일 (E)', // 2025년 6월 15일 (토)
  TIME: 'HH:mm',                        // 14:00
  TIME_12H: 'a h:mm',                   // 오후 2:00
} as const

/**
 * 날짜 문자열을 표준 ISO 형식(yyyy-MM-dd)으로 변환
 * 
 * @param dateString - 변환할 날짜 문자열
 * @returns yyyy-MM-dd 형식의 날짜 문자열
 */
export function toISODate(dateString: string | Date | null | undefined): string {
  if (!dateString) return ''
  
  try {
    // 이미 Date 객체인 경우
    if (dateString instanceof Date) {
      return isValid(dateString) ? format(dateString, DATE_FORMATS.ISO) : ''
    }
    
    // 이미 yyyy-MM-dd 형식인 경우
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    
    // 다양한 형식 파싱 시도
    const patterns = [
      { regex: /^\d{4}\.\d{2}\.\d{2}$/, format: 'yyyy.MM.dd' },      // 2025.06.15
      { regex: /^\d{4}\/\d{2}\/\d{2}$/, format: 'yyyy/MM/dd' },      // 2025/06/15
      { regex: /^\d{2}\/\d{2}\/\d{4}$/, format: 'MM/dd/yyyy' },      // 06/15/2025
      { regex: /^\d{4}년\s*\d{1,2}월\s*\d{1,2}일$/, format: '' },    // 2025년 6월 15일
    ]
    
    for (const pattern of patterns) {
      if (pattern.regex.test(dateString)) {
        if (pattern.format) {
          const parsed = parse(dateString, pattern.format, new Date())
          return isValid(parsed) ? format(parsed, DATE_FORMATS.ISO) : ''
        } else {
          // 한글 날짜 처리
          const match = dateString.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
          if (match) {
            const [, year, month, day] = match
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          }
        }
      }
    }
    
    // Date 생성자로 파싱 시도
    const date = new Date(dateString)
    if (isValid(date)) {
      return format(date, DATE_FORMATS.ISO)
    }
    
    return dateString // 변환 실패 시 원본 반환
  } catch (error) {
    console.error('[Format] Date conversion error:', error)
    return ''
  }
}

/**
 * 시간 문자열을 표준 HH:mm 형식으로 변환
 * 
 * @param timeString - 변환할 시간 문자열
 * @returns HH:mm 형식의 시간 문자열
 */
export function toStandardTime(timeString: string | null | undefined): string {
  if (!timeString) return ''
  if (timeString === 'undecided' || timeString === '미정') return '미정'
  
  try {
    // 이미 HH:mm 형식인 경우
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString
    }
    
    // 한글 시간 형식 파싱
    const patterns = [
      { regex: /오전\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?/, handler: (h: string, m?: string) => {
        const hour = parseInt(h)
        const minute = m ? parseInt(m) : 0
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      }},
      { regex: /오후\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?/, handler: (h: string, m?: string) => {
        const hour = parseInt(h)
        const minute = m ? parseInt(m) : 0
        const hour24 = hour === 12 ? 12 : hour + 12
        return `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      }},
      { regex: /낮\s*(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?/, handler: (h: string, m?: string) => {
        const hour = parseInt(h)
        const minute = m ? parseInt(m) : 0
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      }},
      { regex: /(\d{1,2})\s*시(?:\s*(\d{1,2})\s*분)?/, handler: (h: string, m?: string) => {
        const hour = parseInt(h)
        const minute = m ? parseInt(m) : 0
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      }},
    ]
    
    for (const pattern of patterns) {
      const match = timeString.match(pattern.regex)
      if (match) {
        return pattern.handler(match[1], match[2])
      }
    }
    
    return timeString // 변환 실패 시 원본 반환
  } catch (error) {
    console.error('[Format] Time conversion error:', error)
    return ''
  }
}

/**
 * 날짜를 지정된 형식으로 포맷팅
 * 
 * @param date - 포맷팅할 날짜
 * @param formatType - 포맷 타입
 * @returns 포맷된 날짜 문자열
 */
export function formatDateAs(
  date: string | Date | null | undefined,
  formatType: keyof typeof DATE_FORMATS = 'DISPLAY'
): string {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? new Date(toISODate(date)) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, DATE_FORMATS[formatType], { locale: ko })
  } catch (error) {
    console.error('[Format] Date formatting error:', error)
    return ''
  }
}

/**
 * 시간을 지정된 형식으로 포맷팅
 * 
 * @param time - 포맷팅할 시간 (HH:mm 형식)
 * @param formatType - '24h' | '12h'
 * @returns 포맷된 시간 문자열
 */
export function formatTimeAs(
  time: string | null | undefined,
  formatType: '24h' | '12h' = '24h'
): string {
  if (!time) return ''
  
  const standardTime = toStandardTime(time)
  if (standardTime === '미정') return '미정'
  if (!standardTime) return ''
  
  try {
    if (formatType === '24h') {
      return standardTime
    }
    
    // 12시간 형식으로 변환
    const [hour, minute] = standardTime.split(':').map(Number)
    const period = hour < 12 ? '오전' : '오후'
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${period} ${hour12}:${minute.toString().padStart(2, '0')}`
  } catch (error) {
    console.error('[Format] Time formatting error:', error)
    return standardTime
  }
}

/**
 * 날짜와 시간을 결합하여 ISO 문자열로 반환
 * 
 * @param date - 날짜 문자열
 * @param time - 시간 문자열
 * @returns ISO 8601 형식 문자열
 */
export function combineDateTimeToISO(
  date: string | null | undefined,
  time: string | null | undefined
): string {
  if (!date) return ''
  
  const isoDate = toISODate(date)
  if (!isoDate) return ''
  
  if (!time) {
    return `${isoDate}T00:00:00`
  }
  
  const standardTime = toStandardTime(time)
  if (standardTime === '미정') {
    return `${isoDate}T00:00:00`
  }
  
  return `${isoDate}T${standardTime}:00`
}

/**
 * 날짜 유효성 검증
 * 
 * @param dateString - 검증할 날짜 문자열
 * @returns 유효한 날짜 여부
 */
export function isValidDate(dateString: string | Date | null | undefined): boolean {
  if (!dateString) return false
  
  try {
    if (dateString instanceof Date) {
      return isValid(dateString)
    }
    
    const isoDate = toISODate(dateString)
    if (!isoDate) return false
    
    const date = new Date(isoDate)
    return isValid(date)
  } catch {
    return false
  }
}

/**
 * 시간 유효성 검증
 * 
 * @param timeString - 검증할 시간 문자열
 * @returns 유효한 시간 여부
 */
export function isValidTime(timeString: string | null | undefined): boolean {
  if (!timeString) return false
  if (timeString === 'undecided' || timeString === '미정') return true
  
  const standardTime = toStandardTime(timeString)
  if (!standardTime || standardTime === '미정') return true
  
  return /^\d{2}:\d{2}$/.test(standardTime)
}

/**
 * 날짜 차이 계산 (D-day)
 * 
 * @param targetDate - 목표 날짜
 * @param baseDate - 기준 날짜 (기본값: 오늘)
 * @returns 날짜 차이 (일)
 */
export function getDaysUntil(
  targetDate: string | Date | null | undefined,
  baseDate: Date = new Date()
): number {
  if (!targetDate) return 0
  
  try {
    const target = typeof targetDate === 'string' ? new Date(toISODate(targetDate)) : targetDate
    if (!isValid(target)) return 0
    
    const base = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate())
    const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate())
    
    const diffTime = targetDay.getTime() - base.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch {
    return 0
  }
}

