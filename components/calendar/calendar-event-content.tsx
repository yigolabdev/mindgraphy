import { format } from 'date-fns'
import { Clock, Users, Package, Building2 } from 'lucide-react'
import { ScheduleEvent } from '@/lib/mock/schedules'
import { parsePackageInfo, getPackageBadges, getPackageTypeColor } from '@/lib/utils/package-parser'
import { getBadgesFromOptionIds } from '@/lib/constants/package-options'

interface CalendarEventContentProps {
  eventInfo: any
}

export function CalendarEventContent({ eventInfo }: CalendarEventContentProps) {
  const { event } = eventInfo
  const props = event.extendedProps as ScheduleEvent

  // 작가 정보
  const photographers = props.photographerNames || []
  const photographerCount = photographers.length
  const photographerText = photographers.join(', ')

  // 시간 포맷
  const start = event.start
  const end = event.end
  const timeString = start && end 
    ? `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`
    : ''

  // ========================================
  // 패키지 정보 및 배지 생성 (우선순위 적용)
  // ========================================
  let packageBadges: Array<{ label: string; color: string }> = []
  let packageTypeColor = 'text-zinc-700'
  let displayLabel = props.packageName || ''

  // ✅ 우선순위 1: packageOptions 사용 (백엔드가 명시적으로 제공)
  if (props.packageOptions) {
    const opts = props.packageOptions
    
    // 배지 생성
    if (opts.hasSeniorPhotographer) {
      packageBadges.push({ label: '수석작가', color: 'bg-purple-100 text-purple-700 border-purple-300' })
    } else if (opts.hasLeadPhotographer) {
      packageBadges.push({ label: '대표작가', color: 'bg-blue-100 text-blue-700 border-blue-300' })
    }
    
    if (opts.hasExtraGift) {
      packageBadges.push({ label: '작가추가', color: 'bg-pink-100 text-pink-700 border-pink-300' })
    }
    
    if (opts.hasNewStructure) {
      packageBadges.push({ label: '60p', color: 'bg-green-100 text-green-700 border-green-300' })
    }
    
    if (opts.hasDirectorOption) {
      packageBadges.push({ label: '이사지정', color: 'bg-amber-100 text-amber-700 border-amber-300' })
    }
    
    // 패키지 타입 색상
    if (props.isAlbumType !== undefined) {
      packageTypeColor = props.isAlbumType ? 'text-purple-700' : 'text-blue-700'
    }
    
    // 표시 라벨
    const typeLabel = props.isAlbumType ? '앨범형' : '데이터형'
    displayLabel = photographerCount > 0 ? `${photographerCount}인 ${typeLabel}` : typeLabel
  }
  // ✅ 우선순위 2: optionIds 사용 (정형화된 ID)
  else if (props.optionIds && props.optionIds.length > 0) {
    packageBadges = getBadgesFromOptionIds(props.optionIds)
    
    // 패키지 타입 색상
    if (props.isAlbumType !== undefined) {
      packageTypeColor = props.isAlbumType ? 'text-purple-700' : 'text-blue-700'
    }
    
    // 표시 라벨
    if (props.isAlbumType !== undefined) {
      const typeLabel = props.isAlbumType ? '앨범형' : '데이터형'
      displayLabel = photographerCount > 0 ? `${photographerCount}인 ${typeLabel}` : typeLabel
    }
  }
  // ❌ 폴백: 기존 문자열 파싱 (레거시 데이터)
  else {
    const packageInfo = parsePackageInfo(
      props.packageName || '',
      props.options || [],
      photographerCount
    )
    packageBadges = getPackageBadges(packageInfo)
    packageTypeColor = getPackageTypeColor(packageInfo.packageType)
    displayLabel = packageInfo.displayLabel
  }

  return (
    <div className="p-2 w-full overflow-hidden flex flex-col h-full justify-between gap-1.5">
      <div>
        {/* 신랑신부 이름 */}
        <div className="font-bold text-sm mb-1.5 leading-tight text-zinc-900">
          {props.groomName} & {props.brideName}
        </div>
        
        <div className="flex flex-col gap-1.5 text-xs">
          {/* 시간 */}
          <div className="flex items-center gap-1.5 text-zinc-700">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            <span className="font-medium">{timeString}</span>
          </div>

          {/* 장소 */}
          <div className="flex items-start gap-1.5 text-zinc-700">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
            <span className="line-clamp-1">{props.venueName}</span>
          </div>
          
          {/* 작가 정보 */}
          {photographerCount > 0 && (
            <div className="flex items-start gap-1.5">
              <Users className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-blue-800 font-semibold text-[11px] leading-tight">
                  {photographerText}
                </span>
              </div>
            </div>
          )}
          
          {/* 패키지 타입 */}
          <div className="flex items-start gap-1.5">
            <Package className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${packageTypeColor}`} />
            <span className={`font-bold ${packageTypeColor}`}>
              {displayLabel}
            </span>
          </div>
          
          {/* 특별 옵션 배지 */}
          {packageBadges.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {packageBadges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${badge.color} whitespace-nowrap`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          )}

          {/* 기타 주요 옵션 (배지에 없는 것들만 - 레거시 지원) */}
          {!props.packageOptions && !props.optionIds && props.options && props.options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-0.5">
              {props.options
                .filter(opt => {
                  const optLower = opt.toLowerCase()
                  // 이미 배지로 표시된 옵션은 제외
                  return !optLower.includes('대표') && 
                         !optLower.includes('수석') && 
                         !optLower.includes('추가') && 
                         !optLower.includes('선물') &&
                         !optLower.includes('60') &&
                         !optLower.includes('이사')
                })
                .slice(0, 2) // 최대 2개만 표시
                .map((option, idx) => (
                  <span 
                    key={idx} 
                    className="bg-zinc-100 px-1.5 py-0.5 rounded text-[9px] border border-zinc-200 text-zinc-600 whitespace-nowrap"
                  >
                    {option}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
