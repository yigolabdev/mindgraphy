import { format } from 'date-fns'
import { ScheduleEvent } from '@/lib/mock/schedules'
import { Smartphone } from 'lucide-react'

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

  // 시작 시간만 표시
  const startTime = start ? format(start, 'HH:mm') : ''

  // 아이폰 스냅 옵션 확인
  const hasIphoneOption = 
    (props.optionIds && props.optionIds.includes('option-iphone')) ||
    (props.options && props.options.some(opt => opt.toLowerCase().includes('아이폰') || opt.toLowerCase().includes('iphone')))

  return (
    <div className="p-2 w-full overflow-hidden">
      {/* 한 줄 형식: 시간 + 작가명 + [아이폰] + [웨딩홀] + 신랑 신부 */}
      <div className="text-xs leading-relaxed text-zinc-800">
        <span className="font-bold text-zinc-900">{startTime}</span>
        {' '}
        {photographerCount > 0 && (
          <>
            <span className="font-semibold text-blue-700">{photographerText}</span>
            {' '}
          </>
        )}
        {hasIphoneOption && (
          <>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded text-[10px] font-bold border border-purple-300">
              <Smartphone className="h-2.5 w-2.5" />
              아이폰
            </span>
            {' '}
          </>
        )}
        <span className="text-zinc-600">[{props.venueName}]</span>
        {' '}
        <span className="font-medium">{props.groomName} {props.brideName} 님</span>
      </div>
    </div>
  )
}
