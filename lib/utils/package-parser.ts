/**
 * 패키지 정보를 파싱하여 캘린더에 표시할 정보를 추출합니다.
 */

export interface PackageInfo {
  photographerCount: number // 작가 수 (1인, 2인 등)
  packageType: 'album' | 'data' | 'hanbok' | 'outdoor' | 'other' // 앨범형/데이터형/한복/야외/기타
  hasLeadPhotographer: boolean // 대표작가 지정 여부
  hasSeniorPhotographer: boolean // 수석작가 지정 여부
  hasExtraGift: boolean // 작가 추가 선물 여부
  hasNewStructure: boolean // 새로운 구성 (60페이지) 여부
  hasDirectorOption: boolean // 이사 지정 여부
  displayLabel: string // 표시용 라벨 (예: "2인 앨범형")
}

/**
 * packageName과 options를 분석하여 PackageInfo를 반환합니다.
 */
export function parsePackageInfo(
  packageName: string,
  options: string[],
  photographerCount: number
): PackageInfo {
  const name = packageName.toLowerCase()
  const optionsStr = options.join(' ').toLowerCase()

  // 패키지 타입 분류
  let packageType: PackageInfo['packageType'] = 'other'
  if (name.includes('album') || name.includes('앨범') || name.includes('basic')) {
    packageType = 'album'
  } else if (name.includes('data') || name.includes('데이터')) {
    packageType = 'data'
  } else if (name.includes('hanbok') || name.includes('한복')) {
    packageType = 'hanbok'
  } else if (name.includes('outdoor') || name.includes('야외')) {
    packageType = 'outdoor'
  }

  // 대표작가/수석작가 지정 확인
  const hasLeadPhotographer = 
    optionsStr.includes('대표작가') || 
    optionsStr.includes('대표 작가') ||
    name.includes('대표작가')

  const hasSeniorPhotographer = 
    optionsStr.includes('수석작가') || 
    optionsStr.includes('수석 작가')

  // 작가 추가 선물 확인
  const hasExtraGift = 
    optionsStr.includes('작가추가') || 
    optionsStr.includes('작가 추가') ||
    optionsStr.includes('선물')

  // 새로운 구성 (60페이지) 확인
  const hasNewStructure = 
    optionsStr.includes('60페이지') || 
    optionsStr.includes('60p') ||
    optionsStr.includes('새로운 구성')

  // 이사 지정 확인
  const hasDirectorOption = 
    optionsStr.includes('이사') || 
    optionsStr.includes('옵션y')

  // 표시용 라벨 생성
  const typeLabel = {
    album: '앨범형',
    data: '데이터형',
    hanbok: '한복스냅',
    outdoor: '야외스냅',
    other: '기타'
  }[packageType]

  const countLabel = photographerCount > 0 ? `${photographerCount}인` : ''
  const displayLabel = countLabel ? `${countLabel} ${typeLabel}` : typeLabel

  return {
    photographerCount,
    packageType,
    hasLeadPhotographer,
    hasSeniorPhotographer,
    hasExtraGift,
    hasNewStructure,
    hasDirectorOption,
    displayLabel
  }
}

/**
 * PackageInfo를 기반으로 배지 목록을 생성합니다.
 */
export function getPackageBadges(info: PackageInfo): Array<{
  label: string
  color: string
}> {
  const badges: Array<{ label: string; color: string }> = []

  // 대표작가/수석작가
  if (info.hasSeniorPhotographer) {
    badges.push({ label: '수석작가', color: 'bg-purple-100 text-purple-700 border-purple-300' })
  } else if (info.hasLeadPhotographer) {
    badges.push({ label: '대표작가', color: 'bg-blue-100 text-blue-700 border-blue-300' })
  }

  // 작가 추가 선물
  if (info.hasExtraGift) {
    badges.push({ label: '작가추가', color: 'bg-pink-100 text-pink-700 border-pink-300' })
  }

  // 새로운 구성
  if (info.hasNewStructure) {
    badges.push({ label: '60p', color: 'bg-green-100 text-green-700 border-green-300' })
  }

  // 이사 지정
  if (info.hasDirectorOption) {
    badges.push({ label: '이사지정', color: 'bg-amber-100 text-amber-700 border-amber-300' })
  }

  return badges
}

/**
 * PackageType에 따른 아이콘 색상을 반환합니다.
 */
export function getPackageTypeColor(type: PackageInfo['packageType']): string {
  const colors = {
    album: 'text-purple-700',
    data: 'text-blue-700',
    hanbok: 'text-pink-700',
    outdoor: 'text-green-700',
    other: 'text-zinc-700'
  }
  return colors[type]
}

