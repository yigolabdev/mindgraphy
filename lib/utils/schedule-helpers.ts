/**
 * 작가 일정 관리 페이지 유틸리티
 * 중복 제거를 위한 공통 함수 및 상수
 */

/**
 * 상품 타입별 라벨 매핑
 */
export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  wedding: '웨딩 촬영',
  hanbok: 'HANBOK & CASUAL',
  dress_shop: 'DRESS SHOP',
  baby: 'BABY 돌스냅'
}

/**
 * 상품 타입별 배지 색상
 */
export const PRODUCT_TYPE_BADGE_COLORS: Record<string, string> = {
  wedding: 'bg-blue-100 text-blue-800 border-blue-200',
  hanbok: 'bg-purple-100 text-purple-800 border-purple-200',
  dress_shop: 'bg-pink-100 text-pink-800 border-pink-200',
  baby: 'bg-green-100 text-green-800 border-green-200'
}

/**
 * 일정 상태별 색상
 */
export const SCHEDULE_STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
  on_the_way: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  uploaded: 'bg-slate-100 text-slate-800 border-slate-200'
}

/**
 * 일정 상태별 라벨
 */
export const SCHEDULE_STATUS_LABELS: Record<string, string> = {
  upcoming: '예정',
  on_the_way: '이동중',
  in_progress: '촬영중',
  completed: '촬영완료',
  uploaded: '업로드완료'
}

/**
 * 상품 타입 라벨 반환
 */
export function getProductTypeLabel(type: string): string {
  return PRODUCT_TYPE_LABELS[type] || type
}

/**
 * 상품 타입 배지 색상 반환
 */
export function getProductTypeBadgeColor(type: string): string {
  return PRODUCT_TYPE_BADGE_COLORS[type] || 'bg-gray-100 text-gray-800'
}

/**
 * 일정 상태 색상 반환
 */
export function getScheduleStatusColor(status: string): string {
  return SCHEDULE_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
}

/**
 * 일정 상태 라벨 반환
 */
export function getScheduleStatusLabel(status: string): string {
  return SCHEDULE_STATUS_LABELS[status] || status
}

