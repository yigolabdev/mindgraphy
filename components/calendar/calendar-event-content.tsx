import { format } from 'date-fns'
import { Clock, Users, Package, Building2 } from 'lucide-react'
import { ScheduleEvent } from '@/lib/mock/schedules'
import { parsePackageInfo, getPackageBadges, getPackageTypeColor } from '@/lib/utils/package-parser'

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

  // 패키지 정보 파싱
  const packageInfo = parsePackageInfo(
    props.packageName || '',
    props.options || [],
    photographerCount
  )
  const packageBadges = getPackageBadges(packageInfo)
  const packageTypeColor = getPackageTypeColor(packageInfo.packageType)

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
          
          {/* 작가 정보 - 개선된 표시 */}
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
              {packageInfo.displayLabel}
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

          {/* 기타 주요 옵션 (배지에 없는 것들만) */}
          {props.options && props.options.length > 0 && (
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
