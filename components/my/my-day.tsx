'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DdayBadge } from '@/components/common/dday-badge'
import { EmptyState } from '@/components/common/empty-state'
import type { MySchedule } from '@/lib/mock/me'
import {
  Clock,
  MapPin,
  Phone,
  Package,
  AlertCircle,
  Calendar,
  Play,
  CheckCheck,
  Camera,
  Mail,
  UploadCloud
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface MyDayProps {
  schedule: MySchedule[]
  onStatusChange?: (scheduleId: string, newStatus: 'on_the_way' | 'in_progress' | 'completed' | 'uploaded') => void
  onScheduleClick?: (schedule: MySchedule) => void
}

export function MyDay({ schedule, onStatusChange, onScheduleClick }: MyDayProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    scheduleId: string
    action: 'depart' | 'start' | 'complete' | 'upload'
    title: string
  }>({
    open: false,
    scheduleId: '',
    action: 'depart',
    title: ''
  })

  const handleStatusChangeClick = (item: MySchedule, action: 'depart' | 'start' | 'complete' | 'upload') => {
    setConfirmDialog({
      open: true,
      scheduleId: item.id,
      action,
      title: `${item.groomName} & ${item.brideName}`
    })
  }

  const handleConfirm = () => {
    let newStatus: 'on_the_way' | 'in_progress' | 'completed' | 'uploaded'
    let message: string
    
    switch (confirmDialog.action) {
      case 'depart':
        newStatus = 'on_the_way'
        message = '촬영지로 출발했습니다!'
        break
      case 'start':
        newStatus = 'in_progress'
        message = '촬영을 시작했습니다!'
        break
      case 'complete':
        newStatus = 'completed'
        message = '촬영이 완료되었습니다!'
        break
      case 'upload':
        newStatus = 'uploaded'
        message = '파일 업로드가 완료되었습니다!'
        break
    }
    
    if (onStatusChange) {
      onStatusChange(confirmDialog.scheduleId, newStatus!)
    }
    
    toast.success(message)
    setConfirmDialog({ ...confirmDialog, open: false })
  }

  if (schedule.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="오늘 일정이 없습니다"
        description="편안한 하루 보내세요!"
      />
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      on_the_way: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      uploaded: 'bg-slate-100 text-slate-800 border-slate-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      upcoming: '예정',
      on_the_way: '이동중',
      in_progress: '촬영중',
      completed: '촬영완료',
      uploaded: '업로드완료'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getProductTypeLabel = (type: string) => {
    const labels = {
      wedding: '웨딩 촬영',
      hanbok: 'HANBOK & CASUAL',
      dress_shop: 'DRESS SHOP',
      baby: 'BABY 돌스냅'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getProductTypeBadgeColor = (type: string) => {
    const colors = {
      wedding: 'bg-blue-100 text-blue-800 border-blue-200',
      hanbok: 'bg-purple-100 text-purple-800 border-purple-200',
      dress_shop: 'bg-pink-100 text-pink-800 border-pink-200',
      baby: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          오늘의 일정
        </h2>

        {schedule.map((item) => (
          <Card key={item.id} className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={() => {
            if (onScheduleClick) onScheduleClick(item)
          }}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{item.groomName} & {item.brideName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={cn("text-xs", getProductTypeBadgeColor(item.productType))}>
                      {getProductTypeLabel(item.productType)}
                    </Badge>
                    {item.venueName && (
                      <p className="text-sm text-muted-foreground">
                        {item.venueName}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={cn("border", getStatusColor(item.status))}>
                  {getStatusLabel(item.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time & Meta */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {item.startTime} - {item.endTime}
                </div>
                <span className="text-muted-foreground">·</span>
                <span>{item.productType === 'wedding' ? '예식' : '촬영'} {item.weddingTime}</span>
                <DdayBadge targetDate={item.date} showIcon={false} />
              </div>

              {/* Venue */}
              {item.venueName && item.venueAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{item.venueName}</p>
                    <p className="text-muted-foreground">{item.venueAddress}</p>
                  </div>
                </div>
              )}

              {/* Package & Options */}
              <div className="flex items-start gap-2 text-sm">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{item.packageName}</Badge>
                  {item.optionNames && item.optionNames.map((option, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-start gap-2 text-sm bg-zinc-50 border border-zinc-200 rounded-lg p-3">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1 text-xs">
                  {item.groomPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">신랑:</span>
                      <span className="font-medium">{item.groomPhone}</span>
                      {item.mainContact === 'groom' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">메인</Badge>
                      )}
                    </div>
                  )}
                  {item.bridePhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">신부:</span>
                      <span className="font-medium">{item.bridePhone}</span>
                      {item.mainContact === 'bride' && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">메인</Badge>
                      )}
                    </div>
                  )}
                  {item.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="font-medium">{item.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photographers */}
              {item.photographerNames && item.photographerNames.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Camera className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    <span className="font-medium">담당 작가:</span>
                    <span className="text-muted-foreground">
                      {item.photographerNames.join(', ')}
                    </span>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {item.photographerNames.length}명
                    </Badge>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {item.specialRequests && (
                <div className="flex items-start gap-2 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800">{item.specialRequests}</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                {item.groomPhone && (
                  <a href={`tel:${item.groomPhone}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      신랑
                    </Button>
                  </a>
                )}
                {item.bridePhone && (
                  <a href={`tel:${item.bridePhone}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Phone className="mr-2 h-4 w-4" />
                      신부
                    </Button>
                  </a>
                )}
                {item.venueAddress && (
                  <a
                    href={`https://map.kakao.com/?q=${encodeURIComponent(item.venueAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <MapPin className="mr-2 h-4 w-4" />
                      지도
                    </Button>
                  </a>
                )}
              </div>

              {/* Status Action Buttons - 4 Stages: Depart → Start → Complete → Upload */}
              {item.status !== 'uploaded' && (
                <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                  {item.status === 'upcoming' ? (
                    <Button
                      onClick={() => handleStatusChangeClick(item, 'depart')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      size="lg"
                    >
                      <MapPin className="mr-2 h-5 w-5" />
                      촬영지 출발
                    </Button>
                  ) : item.status === 'on_the_way' ? (
                    <Button
                      onClick={() => handleStatusChangeClick(item, 'start')}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      촬영 시작
                    </Button>
                  ) : item.status === 'in_progress' ? (
                    <Button
                      onClick={() => handleStatusChangeClick(item, 'complete')}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      <CheckCheck className="mr-2 h-5 w-5" />
                      촬영 완료
                    </Button>
                  ) : item.status === 'completed' ? (
                    <Button
                      onClick={() => handleStatusChangeClick(item, 'upload')}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      <UploadCloud className="mr-2 h-5 w-5" />
                      파일 업로드
                    </Button>
                  ) : null}
                </div>
              )}

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({...confirmDialog, open})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmDialog.action === 'depart' ? (
                <>
                  <MapPin className="h-5 w-5 text-yellow-600" />
                  촬영지 출발 확인
                </>
              ) : confirmDialog.action === 'start' ? (
                <>
                  <Play className="h-5 w-5 text-green-600" />
                  촬영 시작 확인
                </>
              ) : confirmDialog.action === 'complete' ? (
                <>
                  <CheckCheck className="h-5 w-5 text-blue-600" />
                  촬영 완료 확인
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5 text-purple-600" />
                  파일 업로드 확인
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'depart' ? (
                <>
                  <strong>{confirmDialog.title}</strong> 고객님 촬영지로 출발하시겠습니까?
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    출발 시간이 기록되며 실시간 현황판에 표시됩니다.
                  </span>
                </>
              ) : confirmDialog.action === 'start' ? (
                <>
                  <strong>{confirmDialog.title}</strong> 고객님의 촬영을 시작하시겠습니까?
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    시작 시간이 기록되며 실시간 현황판에 표시됩니다.
                  </span>
                </>
              ) : confirmDialog.action === 'complete' ? (
                <>
                  <strong>{confirmDialog.title}</strong> 고객님의 촬영을 완료하시겠습니까?
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    완료 시간이 기록되며 촬영이 종료됩니다. 다음 단계로 원본을 업로드하세요.
                  </span>
                </>
              ) : (
                <>
                  <strong>{confirmDialog.title}</strong> 고객님의 촬영 원본을 업로드하시겠습니까?
                  <br />
                  <span className="text-xs text-muted-foreground mt-2 block">
                    이 작업은 모든 촬영 일정을 마무리하는 단계입니다.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({...confirmDialog, open: false})}
            >
              취소
            </Button>
            <Button
              onClick={handleConfirm}
              className={
                confirmDialog.action === 'depart' ? 'bg-yellow-600 hover:bg-yellow-700' :
                confirmDialog.action === 'start' ? 'bg-green-600 hover:bg-green-700' :
                confirmDialog.action === 'complete' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-purple-600 hover:bg-purple-700'
              }
            >
              {confirmDialog.action === 'depart' ? '출발하기' : 
               confirmDialog.action === 'start' ? '시작하기' :
               confirmDialog.action === 'complete' ? '완료하기' :
               '업로드 완료'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


