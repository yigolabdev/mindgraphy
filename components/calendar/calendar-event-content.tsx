import { format } from 'date-fns'
import { Clock, Users, Package, Tag, Building2 } from 'lucide-react'
import { ScheduleEvent } from '@/lib/mock/schedules'

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

  return (
    <div className="p-2 w-full overflow-hidden flex flex-col h-full justify-between gap-1">
      <div>
        <div className="font-bold text-sm mb-1 leading-tight text-zinc-900">
          {props.groomName} & {props.brideName}
        </div>
        
        <div className="flex flex-col gap-1 text-xs">
          {/* Time */}
          <div className="flex items-center gap-1.5 text-zinc-700">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-zinc-500" />
            <span className="font-medium">{timeString}</span>
          </div>

          {/* Venue */}
          <div className="flex items-start gap-1.5 text-zinc-700">
            <Building2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
            <span>{props.venueName}</span>
          </div>
          
          {/* Photographers */}
          {photographerCount > 0 && (
            <div className="flex items-start gap-1.5 text-blue-700 font-medium">
              <Users className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-blue-600" />
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-50 px-1.5 py-0.5 rounded text-[11px] border border-blue-100">
                  {photographerCount}명 배정됨
                </span>
                <span className="text-blue-800">({photographerText})</span>
              </div>
            </div>
          )}
          
          {/* Product & Package */}
          {props.packageName && (
            <div className="flex items-start gap-1.5 text-zinc-700">
              <Package className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
              <span className="font-medium text-purple-700">{props.packageName}</span>
            </div>
          )}
          
          {/* Options */}
          {props.options && props.options.length > 0 && (
            <div className="flex items-start gap-1.5 text-zinc-600">
              <Tag className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-zinc-500" />
              <div className="flex flex-wrap gap-1">
                {props.options.map((option, idx) => (
                  <span key={idx} className="bg-zinc-100 px-1.5 py-0.5 rounded text-[10px] border border-zinc-200 text-zinc-700 whitespace-normal">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

