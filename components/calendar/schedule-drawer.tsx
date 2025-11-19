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
import { getStatusLabel, getProductTypeLabel, getVenueTypeLabel } from '@/lib/mock/schedules'
import {
  MapPin,
  Clock,
  User,
  Building2,
  Package,
  FileText,
  Plus,
  Save,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { currentUser } from '@/lib/mock/me'

interface InternalMemo {
  id: string
  content: string
  author: string
  authorRole: string
  timestamp: string
}

interface ScheduleDrawerProps {
  event: ScheduleEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ScheduleDrawer({ event, open, onOpenChange }: ScheduleDrawerProps) {
  const [memoDialogOpen, setMemoDialogOpen] = useState(false)
  const [memoType, setMemoType] = useState<'internal' | 'special'>('internal')
  const [memoContent, setMemoContent] = useState('')
  const [internalMemos, setInternalMemos] = useState<InternalMemo[]>([])
  const [specialRequests, setSpecialRequests] = useState<string>('')

  // Initialize notes when event changes
  useEffect(() => {
    if (event) {
      // Initialize with existing notes (in real app, this would come from API)
      if (event.internalNotes) {
        setInternalMemos([{
          id: '1',
          content: event.internalNotes,
          author: '관리자',
          authorRole: 'admin',
          timestamp: event.internalNotesTimestamp || new Date().toISOString()
        }])
      } else {
        setInternalMemos([])
      }
      setSpecialRequests(event.specialRequests || '')
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
    setMemoContent(type === 'special' ? specialRequests : '')
    setMemoDialogOpen(true)
  }

  const handleSaveMemo = () => {
    if (!memoContent.trim()) {
      toast.error('메모 내용을 입력해주세요')
      return
    }

    const timestamp = new Date().toISOString()

    // Update the notes
    if (memoType === 'internal') {
      // Add new memo to the list
      const newMemo: InternalMemo = {
        id: Date.now().toString(),
        content: memoContent,
        author: currentUser.name,
        authorRole: currentUser.role,
        timestamp
      }
      setInternalMemos(prev => [newMemo, ...prev]) // Add to beginning for newest first
      toast.success('내부 메모가 추가되었습니다')
    } else {
      setSpecialRequests(memoContent)
      toast.success('특이사항이 저장되었습니다')
    }

    // TODO: API call to save memo
    console.log('Saving memo:', {
      eventId: event.id,
      type: memoType,
      content: memoContent,
      timestamp,
      author: currentUser.name
    })

    setMemoDialogOpen(false)
    setMemoContent('')
  }

  const handleDeleteMemo = (memoId: string) => {
    setInternalMemos(prev => prev.filter(memo => memo.id !== memoId))
    toast.success('메모가 삭제되었습니다')
    
    // TODO: API call to delete memo
    console.log('Deleting memo:', {
      eventId: event.id,
      memoId
    })
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
              {getProductTypeLabel(event.productType)}
            </Badge>
          </div>

          {/* Customer Info - 고객용 페이지와 동일한 형태 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              고객 정보
            </h3>
            <div className="space-y-3 text-sm bg-zinc-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <span className="text-muted-foreground">신랑:</span>
                  <p className="font-medium">{event.groomName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">신부:</span>
                  <p className="font-medium">{event.brideName}</p>
                </div>
                {event.groomPhone && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">신랑 연락처:</span>
                      {event.mainContact === 'groom' && (
                        <Badge variant="secondary" className="text-xs h-5">
                          대표
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{event.groomPhone}</p>
                  </div>
                )}
                {event.bridePhone && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">신부 연락처:</span>
                      {event.mainContact === 'bride' && (
                        <Badge variant="secondary" className="text-xs h-5">
                          대표
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">{event.bridePhone}</p>
                  </div>
                )}
              </div>
              {event.email && (
                <div>
                  <span className="text-muted-foreground">이메일:</span>
                  <p className="font-medium">{event.email}</p>
                </div>
              )}
              {event.referralSource && (
                <div>
                  <span className="text-muted-foreground">유입 경로:</span>
                  <p className="font-medium">{event.referralSource}</p>
                </div>
              )}
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
            {specialRequests ? (
              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="whitespace-pre-wrap">{specialRequests}</p>
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
                {internalMemos.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {internalMemos.length}
                  </Badge>
                )}
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOpenMemoDialog('internal')}
              >
                <Plus className="h-3 w-3 mr-1" />
                메모 추가
              </Button>
            </div>
            
            {internalMemos.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {internalMemos.map((memo) => (
                  <div 
                    key={memo.id} 
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm whitespace-pre-wrap flex-1">{memo.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                        onClick={() => handleDeleteMemo(memo.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-blue-200">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{memo.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {memo.authorRole === 'admin' ? '관리자' : 
                           memo.authorRole === 'photographer' ? '작가' : '매니저'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(memo.timestamp).toLocaleString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic border border-dashed rounded-lg p-4 text-center">
                내부 메모가 없습니다
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button className="w-full">
              일정 수정
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
              {memoType === 'internal' ? '내부 메모 추가' : '특이사항 수정'}
            </DialogTitle>
            <DialogDescription>
              {memoType === 'internal' 
                ? '촬영 관련 내부 메모를 작성하세요. 이 메모는 관리자와 작가만 볼 수 있습니다.' 
                : '고객 요청사항이나 특별히 주의할 사항을 기록하세요.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Author Info */}
            {memoType === 'internal' && (
              <div className="flex items-center gap-2 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{currentUser.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role === 'admin' ? '관리자' : 
                   currentUser.role === 'photographer' ? '작가' : '매니저'}
                </Badge>
                <span className="text-xs text-muted-foreground">님이 작성합니다</span>
              </div>
            )}
            
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
                maxLength={1000}
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

