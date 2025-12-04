/**
 * 패키지 옵션 상수 정의
 * 백엔드 통합 시 이 ID들을 사용하여 옵션을 식별합니다.
 */

export const PACKAGE_OPTIONS = {
  // 작가 관련
  LEAD_PHOTOGRAPHER: 'option-lead-photographer',      // 대표작가 지정
  SENIOR_PHOTOGRAPHER: 'option-senior-photographer',  // 수석작가 지정
  EXTRA_GIFT: 'option-extra-gift',                    // 작가 추가 선물
  
  // 구성 관련
  NEW_STRUCTURE_60P: 'option-60p',                    // 60페이지 구성
  
  // 특별 옵션
  DIRECTOR_OPTION: 'option-director',                 // 이사 지정 (옵션Y)
} as const

/**
 * 옵션 ID to 라벨 매핑
 * UI에 표시할 텍스트
 */
export const OPTION_LABELS: Record<string, string> = {
  'option-lead-photographer': '대표작가',
  'option-senior-photographer': '수석작가',
  'option-extra-gift': '작가추가',
  'option-60p': '60p',
  'option-director': '이사지정',
}

/**
 * 옵션 ID to 배지 스타일 매핑
 */
export const OPTION_BADGE_STYLES: Record<string, string> = {
  'option-senior-photographer': 'bg-purple-100 text-purple-700 border-purple-300',
  'option-lead-photographer': 'bg-blue-100 text-blue-700 border-blue-300',
  'option-extra-gift': 'bg-pink-100 text-pink-700 border-pink-300',
  'option-60p': 'bg-green-100 text-green-700 border-green-300',
  'option-director': 'bg-amber-100 text-amber-700 border-amber-300',
}

/**
 * 옵션 ID로 배지 목록 생성
 */
export function getBadgesFromOptionIds(optionIds: string[]): Array<{
  label: string
  color: string
}> {
  return optionIds
    .filter(id => id in OPTION_LABELS)
    .map(id => ({
      label: OPTION_LABELS[id],
      color: OPTION_BADGE_STYLES[id] || 'bg-zinc-100 text-zinc-700 border-zinc-300'
    }))
}

