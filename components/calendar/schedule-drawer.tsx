'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DdayBadge } from '@/components/common/dday-badge'
import type { ScheduleEvent } from '@/lib/mock/schedules'
import { getStatusLabel, getPackageLabel, getVenueTypeLabel } from '@/lib/mock/schedules'
import { ROUTES } from '@/lib/constants'
import {
  Phone,
  MapPin,
  Clock,
  User,
  Building2,
  Package,
  FileText,
  CheckSquare,
  ExternalLink,
  Plus,
  Save,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ScheduleDrawerProps {
  event: ScheduleEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleDrawer({ event, open, onOpenChange }: ScheduleDrawerProps) {
  const [memoDialogOpen, setMemoDialogOpen] = useState(false)
  const [memoType, setMemoType] = useState<'internal' | 'special'>('internal')
  const [memoContent, setMemoContent] = useState('')
  const [existingNotes, setExistingNotes] = useState<{
    internalNotes?: string
    internalNotesTimestamp?: string
    specialRequests?: string
  }>({})
  
  // Checklist state
  const defaultChecklist = ['장비 확인', '배터리 충전', '메모리카드 준비', '이동 경로 확인']
  const [checklist, setChecklist] = useState<{ item: string; checked: boolean }[]>(
    defaultChecklist.map(item => ({ item, checked: false }))
  )

  // Initialize notes when event changes
  useEffect(() => {
    if (event) {
      setExistingNotes({
        internalNotes: event.internalNotes,
        internalNotesTimestamp: event.internalNotesTimestamp,
        specialRequests: event.specialRequests
      })
    }
  }, [event])

  if (!event) return null

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      reserved: 'bg-blue-100 text-blue-800 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      editing: 'bg-purple-100 text-purple-800 border-purple-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleOpenMemoDialog = (type: 'internal' | 'special') => {
    setMemoType(type)
    setMemoContent(type === 'internal' ? (existingNotes.internalNotes || '') : (existingNotes.specialRequests || ''))
    setMemoDialogOpen(true)
  }

  const handleSaveMemo = () => {
    if (!memoContent.trim()) {
      toast.error('메모 내용을 입력해주세요')
      return
    }

    const timestamp = new Date().toISOString()

    // Update the existing notes
    if (memoType === 'internal') {
      setExistingNotes(prev => ({ 
        ...prev, 
        internalNotes: memoContent,
        internalNotesTimestamp: timestamp
      }))
      toast.success('내부 메모가 저장되었습니다')
    } else {
      setExistingNotes(prev => ({ ...prev, specialRequests: memoContent }))
      toast.success('특이사항이 저장되었습니다')
    }

    // TODO: API call to save memo
    console.log('Saving memo:', {
      eventId: event.id,
      type: memoType,
      content: memoContent,
      timestamp
    })

    setMemoDialogOpen(false)
    setMemoContent('')
  }

  const handleChecklistToggle = (index: number) => {
    setChecklist(prev => prev.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    ))
    
    // Show success toast when all items are checked
    const updatedChecklist = checklist.map((item, i) => 
      i === index ? { ...item, checked: !item.checked } : item
    )
    const allChecked = updatedChecklist.every(item => item.checked)
    
    if (allChecked) {
      toast.success('모든 체크리스트 항목이 완료되었습니다! 🎉')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">
            {event.groomName} & {event.brideName}
          </SheetTitle>
          <SheetDescription>
            {event.venueName} · {event.ceremonyTime}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status & Meta */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn("border", getStatusColor(event.status))}>
              {getStatusLabel(event.status)}
            </Badge>
            <DdayBadge targetDate={event.start.split('T')[0]} showIcon={false} />
            <Badge variant="outline" className="text-xs">
              {getPackageLabel(event.packageType)}
            </Badge>
          </div>

          {/* Quick Actions */}
          {event.projectDetailId && (
            <Link href={`/admin/projects/${event.projectDetailId}`}>
              <Button className="w-full mb-3" size="lg">
                <FileText className="mr-2 h-5 w-5" />
                프로젝트 상세 보기
              </Button>
            </Link>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${event.groomPhone}`}
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                신랑 전화
              </Button>
            </a>
            <a
              href={`tel:${event.bridePhone}`}
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                신부 전화
              </Button>
            </a>
            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent(event.venueAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="w-full">
                <MapPin className="mr-2 h-4 w-4" />
                지도 보기
              </Button>
            </a>
            <Link href={ROUTES.CLIENT_PORTAL(event.clientPortalToken)}>
              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                고객 포털
              </Button>
            </Link>
          </div>

          {/* Client Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              고객 정보
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-zinc-50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">신랑:</span>
                <p className="font-medium">{event.groomName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">신부:</span>
                <p className="font-medium">{event.brideName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">신랑 연락처:</span>
                <p className="font-medium">{event.groomPhone}</p>
              </div>
              <div>
                <span className="text-muted-foreground">신부 연락처:</span>
                <p className="font-medium">{event.bridePhone}</p>
              </div>
            </div>
          </div>

          {/* Venue Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              예식장 정보
            </h3>
            <div className="space-y-2 text-sm bg-zinc-50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">예식장:</span>
                <p className="font-medium">{event.venueName}</p>
              </div>
              {event.ballroom && (
                <div>
                  <span className="text-muted-foreground">볼룸:</span>
                  <p className="font-medium">{event.ballroom}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">주소:</span>
                <p className="font-medium">{event.venueAddress}</p>
              </div>
              {event.venuePhone && (
                <div>
                  <span className="text-muted-foreground">전화:</span>
                  <p className="font-medium">{event.venuePhone}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">유형:</span>
                <p className="font-medium">{getVenueTypeLabel(event.venueType)}</p>
              </div>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              스케줄
            </h3>
            <div className="space-y-2 text-sm bg-zinc-50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">예식 시간:</span>
                <p className="font-medium">{event.ceremonyTime}</p>
              </div>
              {event.makeupTime && (
                <div>
                  <span className="text-muted-foreground">메이크업:</span>
                  <p className="font-medium">{event.makeupTime} ({event.makeupLocation})</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">촬영 시간:</span>
                <p className="font-medium">
                  {new Date(event.start).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 
                  {' - '}
                  {new Date(event.end).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>

          {/* Package & Options */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Package className="h-4 w-4" />
              패키지 & 옵션
            </h3>
            <div className="space-y-2 text-sm bg-zinc-50 rounded-lg p-4">
              <div>
                <span className="text-muted-foreground">패키지:</span>
                <p className="font-medium">{event.packageName}</p>
              </div>
              {event.options.length > 0 && (
                <div>
                  <span className="text-muted-foreground">옵션:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.options.map((option, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignment */}
          {event.photographerNames && event.photographerNames.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                배정 정보
              </h3>
              <div className="text-sm bg-zinc-50 rounded-lg p-4">
                <span className="text-muted-foreground">사진작가:</span>
                <p className="font-medium">{event.photographerNames.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                특이사항
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOpenMemoDialog('special')}
              >
                수정
              </Button>
            </div>
            {existingNotes.specialRequests ? (
              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="whitespace-pre-wrap">{existingNotes.specialRequests}</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic border border-dashed rounded-lg p-4">
                특이사항이 없습니다
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4" />
                내부 메모
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOpenMemoDialog('internal')}
              >
                메모 추가
              </Button>
            </div>
            {existingNotes.internalNotes ? (
              <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="whitespace-pre-wrap">{existingNotes.internalNotes}</p>
                {existingNotes.internalNotesTimestamp && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t border-blue-200">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(existingNotes.internalNotesTimestamp).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic border border-dashed rounded-lg p-4">
                내부 메모가 없습니다
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                촬영 체크리스트
                <Badge variant="outline" className="ml-2 text-xs">
                  {checklist.filter(item => item.checked).length}/{checklist.length}
                </Badge>
              </h3>
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              {checklist.map((item, index) => (
                <label 
                  key={index} 
                  className={cn(
                    "flex items-center gap-3 cursor-pointer hover:bg-zinc-50 p-2 rounded transition-all",
                    item.checked && "bg-green-50 hover:bg-green-100"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    checked={item.checked}
                    onChange={() => handleChecklistToggle(index)}
                  />
                  <span className={cn(
                    "text-sm flex-1",
                    item.checked && "text-muted-foreground line-through"
                  )}>
                    {item.item}
                  </span>
                  {item.checked && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </label>
              ))}
            </div>
            {checklist.every(item => item.checked) && (
              <div className="text-sm text-green-600 font-medium flex items-center gap-2 bg-green-50 p-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                모든 준비가 완료되었습니다!
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button className="flex-1">
              일정 수정
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => handleOpenMemoDialog('internal')}
            >
              <Plus className="mr-2 h-4 w-4" />
              메모 추가
            </Button>
          </div>
        </div>
      </SheetContent>

      {/* Memo Dialog */}
      <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {memoType === 'internal' ? '내부 메모' : '특이사항'} {existingNotes[memoType === 'internal' ? 'internalNotes' : 'specialRequests'] ? '수정' : '추가'}
            </DialogTitle>
            <DialogDescription>
              {memoType === 'internal' 
                ? '촬영 관련 내부 메모를 작성하세요. 이 메모는 관리자만 볼 수 있습니다.' 
                : '고객 요청사항이나 특별히 주의할 사항을 기록하세요.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="memo-content" className="text-sm font-medium">
                메모 내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="memo-content"
                placeholder={
                  memoType === 'internal'
                    ? '예: 촬영 전 확인사항, 장비 체크리스트 등...'
                    : '예: 특정 포즈 요청, 피해야 할 각도, 가족 관계 주의사항 등...'
                }
                value={memoContent}
                onChange={(e) => setMemoContent(e.target.value)}
                className="min-h-[150px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {memoContent.length} / 1000자
              </p>
            </div>

            {/* Quick Tips */}
            <div className="rounded-lg bg-muted p-3 space-y-2">
              <p className="text-xs font-medium">💡 작성 팁:</p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                {memoType === 'internal' ? (
                  <>
                    <li>• 촬영 시간, 장소 도착 시간 기록</li>
                    <li>• 필요한 장비나 소품 리스트</li>
                    <li>• 동료 스탭에게 전달할 내용</li>
                  </>
                ) : (
                  <>
                    <li>• 고객이 원하는 특정 샷이나 구도</li>
                    <li>• 민감한 가족 관계나 주의사항</li>
                    <li>• 신체적 특징이나 배려사항</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMemoDialogOpen(false)
                setMemoContent('')
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSaveMemo}
              disabled={!memoContent.trim()}
            >
              <Save className="mr-2 h-4 w-4" />
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}

