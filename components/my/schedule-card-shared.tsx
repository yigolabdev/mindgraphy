import { Badge } from '@/components/ui/badge'
import { DdayBadge } from '@/components/common/dday-badge'
import type { MySchedule } from '@/lib/mock/me'
import {
  Clock,
  MapPin,
  Phone,
  Package,
  Camera,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getProductTypeLabel,
  getProductTypeBadgeColor,
  getScheduleStatusColor,
  getScheduleStatusLabel
} from '@/lib/utils/schedule-helpers'

interface ScheduleCardInfoProps {
  schedule: MySchedule
  showDday?: boolean
  showFullDetails?: boolean
  className?: string
}

/**
 * 일정 카드 정보 표시 컴포넌트
 * MyDay, MyWeek에서 공통으로 사용
 */
export function ScheduleCardInfo({ 
  schedule, 
  showDday = false, 
  showFullDetails = false,
  className 
}: ScheduleCardInfoProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Time & Meta */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <div className="flex items-center gap-1 font-medium">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {schedule.startTime} - {schedule.endTime}
        </div>
        <span className="text-muted-foreground">·</span>
        <span>{schedule.productType === 'wedding' ? '예식' : '촬영'} {schedule.weddingTime}</span>
        {showDday && <DdayBadge targetDate={schedule.date} showIcon={false} />}
      </div>

      {/* Venue */}
      {schedule.venueName && (
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            {showFullDetails && schedule.venueAddress ? (
              <>
                <p className="font-medium">{schedule.venueName}</p>
                <p className="text-muted-foreground">{schedule.venueAddress}</p>
              </>
            ) : (
              <span>{schedule.venueName}</span>
            )}
          </div>
        </div>
      )}

      {/* Package & Options */}
      {showFullDetails && (
        <div className="flex items-start gap-2 text-sm">
          <Package className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{schedule.packageName}</Badge>
            {schedule.optionNames && schedule.optionNames.map((option, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Photographers */}
      {schedule.photographerNames && schedule.photographerNames.length > 0 && (
        <div className="flex items-start gap-2 text-sm">
          <Camera className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">담당 작가:</span>
            <span className="text-muted-foreground">
              {schedule.photographerNames.join(', ')}
            </span>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {schedule.photographerNames.length}명
            </Badge>
          </div>
        </div>
      )}

      {/* Contact Info (Full Details Only) */}
      {showFullDetails && (schedule.groomPhone || schedule.bridePhone || schedule.email) && (
        <div className="flex items-start gap-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg p-3">
          <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="space-y-1 text-xs">
            {schedule.groomPhone && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">신랑:</span>
                <span className="font-medium">{schedule.groomPhone}</span>
                {schedule.mainContact === 'groom' && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">메인</Badge>
                )}
              </div>
            )}
            {schedule.bridePhone && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">신부:</span>
                <span className="font-medium">{schedule.bridePhone}</span>
                {schedule.mainContact === 'bride' && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">메인</Badge>
                )}
              </div>
            )}
            {schedule.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="font-medium">{schedule.email}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface ScheduleCardHeaderProps {
  schedule: MySchedule
  showStatus?: boolean
  showDate?: boolean
  className?: string
}

/**
 * 일정 카드 헤더 컴포넌트
 */
export function ScheduleCardHeader({ 
  schedule, 
  showStatus = false,
  showDate = false,
  className 
}: ScheduleCardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between', className)}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{schedule.groomName} & {schedule.brideName}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn('text-xs', getProductTypeBadgeColor(schedule.productType))}>
            {getProductTypeLabel(schedule.productType)}
          </Badge>
          {showDate && (
            <p className="text-sm text-muted-foreground">
              {schedule.venueName}
            </p>
          )}
        </div>
      </div>
      {showStatus && (
        <Badge className={cn('border', getScheduleStatusColor(schedule.status))}>
          {getScheduleStatusLabel(schedule.status)}
        </Badge>
      )}
    </div>
  )
}

