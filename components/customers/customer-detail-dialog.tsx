'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressBar } from '@/components/common/progress-bar'
import { DdayBadge } from '@/components/common/dday-badge'
import { mockProjects, mockContracts, mockPayments, getNotesByCustomerId } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
import { mockScheduleEvents, mockSchedulePhotographers } from '@/lib/mock/schedules'
import { getVenuePartnerName, getVenuePartnerTypeLabel, mockVenuePartners } from '@/lib/mock/venue-partners'
import { applyScheduleUpdates } from '@/lib/utils/schedule-storage'
import { getStatusColor, getStatusLabel, formatDate, cn } from '@/lib/utils'
import { toast } from 'sonner'
import { 
  Phone, 
  Mail, 
  Calendar,
  MapPin,
  CreditCard,
  FileText,
  MessageSquare,
  TrendingUp,
  User,
  Heart,
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarCheck,
  Package,
  Tag,
  Users as UsersIcon,
  Camera,
  Edit,
  Building2,
  UserPlus
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface CustomerDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: any | null
}

export function CustomerDetailDialog({ 
  open, 
  onOpenChange, 
  customer 
}: CustomerDetailDialogProps) {
  if (!customer) return null

  const [confirmingSchedule, setConfirmingSchedule] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(false)
  const [editedWeddingDate, setEditedWeddingDate] = useState('')
  const [editedWeddingTime, setEditedWeddingTime] = useState('')
  const [editedVenue, setEditedVenue] = useState('')
  const [hasEdited, setHasEdited] = useState(false) // 수정 여부 추적
  const [leadStatus, setLeadStatus] = useState(customer.leadStatus) // 진행상태 관리

  // 고객의 프로젝트 가져오기
  const customerProjects = mockProjects.filter(p => p.customerId === customer.id)
  const customerContracts = mockContracts.filter(c => c.customerId === customer.id)
  const customerPayments = mockPayments.filter(p => 
    customerContracts.some(c => c.id === p.contractId)
  )

  // 통계 계산
  const totalRevenue = customerPayments.reduce((sum, p) => sum + p.amount, 0)
  const paidAmount = customerPayments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = customerPayments
    .filter(p => p.paymentStatus === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  // 최신 프로젝트 (일정 미확정)
  const latestProject = customerProjects.find(p => 
    p.projectStatus === 'scheduled' || p.projectStatus === 'in_progress'
  ) || customerProjects[0]

  // 상품 타입 라벨
  const getProductTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wedding': '웨딩',
      'hanbok': '한복 & 캐주얼',
      'dress_shop': '가봉 스냅',
      'baby': '돌스냅',
    }
    return labels[type] || type
  }

  // 시간 선택 옵션 (고객용 페이지와 동일)
  const getTimeSlots = (productType?: string) => {
    if (productType === 'hanbok') {
      return [
        { value: '오전 촬영', label: '오전 촬영 (B-1)' },
        { value: '일몰 촬영', label: '일몰 시간대 촬영 (B-2)' },
      ]
    }
    // 웨딩, 가봉 스냅, 돌스냅 - 30분 단위
    return [
      { value: '11:00', label: '오전 11시' },
      { value: '11:30', label: '오전 11시 30분' },
      { value: '12:00', label: '낮 12시' },
      { value: '12:30', label: '낮 12시 30분' },
      { value: '13:00', label: '오후 1시' },
      { value: '13:30', label: '오후 1시 30분' },
      { value: '14:00', label: '오후 2시' },
      { value: '14:30', label: '오후 2시 30분' },
      { value: '15:00', label: '오후 3시' },
      { value: '15:30', label: '오후 3시 30분' },
      { value: '16:00', label: '오후 4시' },
      { value: '16:30', label: '오후 4시 30분' },
      { value: '17:00', label: '오후 5시' },
      { value: '17:30', label: '오후 5시 30분' },
      { value: '18:00', label: '오후 6시' },
    ]
  }

  const timeSlots = getTimeSlots(latestProject?.projectType)

  // 현재 표시할 일정 정보 (수정되었으면 수정된 값, 아니면 원본)
  const getCurrentScheduleInfo = () => {
    if (hasEdited && editedWeddingDate && editedWeddingTime && editedVenue) {
      return {
        date: editedWeddingDate,
        time: editedWeddingTime,
        venue: editedVenue
      }
    }
    return {
      date: latestProject?.weddingDate || '',
      time: latestProject?.weddingTime || '',
      venue: latestProject?.weddingVenue || ''
    }
  }

  const currentSchedule = getCurrentScheduleInfo()

  // 해당 날짜의 스케줄 및 작가 현황 가져오기
  const getSchedulesForDate = (dateString: string) => {
    if (!dateString) return []
    
    // 날짜가 YYYY-MM-DD 형식인지 확인
    const targetDate = dateString.includes('년') 
      ? dateString 
      : format(new Date(dateString), 'yyyy-MM-dd')
    
    // localStorage 업데이트 적용
    const allSchedulesWithUpdates = applyScheduleUpdates(mockScheduleEvents)
    
    return allSchedulesWithUpdates.filter(event => {
      const eventDate = format(new Date(event.start), 'yyyy-MM-dd')
      return eventDate === targetDate
    })
  }

  const sameDateSchedules = getSchedulesForDate(currentSchedule.date)
  
  // 해당 날짜에 촬영 가능한 작가 리스트 가져오기
  const getAvailablePhotographers = () => {
    // 촬영 가능한 작가들 (availabilityStatus === 'available')
    const availablePhotographers = mockSchedulePhotographers.filter(
      p => p.availabilityStatus === 'available'
    )
    
    // 해당 날짜에 이미 배정된 작가들의 촬영 건수 계산
    const photographerScheduleCount = new Map<string, number>()
    
    sameDateSchedules.forEach(schedule => {
      if (schedule.photographerIds && schedule.photographerIds.length > 0) {
        schedule.photographerIds.forEach(photographerId => {
          const currentCount = photographerScheduleCount.get(photographerId) || 0
          photographerScheduleCount.set(photographerId, currentCount + 1)
        })
      }
    })
    
    // 작가 정보와 해당 날짜의 촬영 건수를 결합
    return availablePhotographers.map(photographer => ({
      id: photographer.id,
      name: photographer.name,
      phone: photographer.phone,
      scheduledCount: photographerScheduleCount.get(photographer.id) || 0,
      isAvailable: (photographerScheduleCount.get(photographer.id) || 0) === 0
    }))
  }

  const availablePhotographers = getAvailablePhotographers()

  // 일정 수정 시작
  const handleStartEditSchedule = () => {
    if (latestProject) {
      // 이미 수정된 값이 있으면 그것을 사용, 없으면 원본 사용
      setEditedWeddingDate(hasEdited && editedWeddingDate ? editedWeddingDate : latestProject.weddingDate || '')
      setEditedWeddingTime(hasEdited && editedWeddingTime ? editedWeddingTime : latestProject.weddingTime || '')
      setEditedVenue(hasEdited && editedVenue ? editedVenue : latestProject.weddingVenue || '')
    }
    setEditingSchedule(true)
  }

  // 일정 수정 취소
  const handleCancelEditSchedule = () => {
    setEditingSchedule(false)
    // 수정 중이던 값들을 초기화하지 않고 유지 (hasEdited가 true면 이전 수정 값 유지)
  }

  // 일정 수정 저장
  const handleSaveSchedule = () => {
    if (!editedWeddingDate || !editedWeddingTime || !editedVenue) {
      toast.error('모든 일정 정보를 입력해주세요')
      return
    }

    // 시간 레이블 가져오기
    const timeLabel = timeSlots.find(slot => slot.value === editedWeddingTime)?.label || editedWeddingTime

    // 실제로는 API 호출하여 일정 업데이트
    toast.success('일정이 수정되었습니다', {
      description: `${formatDate(editedWeddingDate)} ${timeLabel} - ${editedVenue}`
    })
    
    // TODO: 실제 구현에서는 latestProject 데이터 업데이트
    setHasEdited(true) // 수정 완료 표시
    setEditingSchedule(false)
  }

  // 촬영 캘린더 보기 핸들러
  const handleViewCalendar = () => {
    const scheduleInfo = getCurrentScheduleInfo()
    
    // 날짜가 있으면 해당 날짜로 필터된 캘린더를 새 탭에서 열기
    if (scheduleInfo.date) {
      const calendarUrl = `/admin/calendar?date=${scheduleInfo.date}`
      window.open(calendarUrl, '_blank')
    } else {
      // 날짜가 없으면 일반 캘린더 열기
      window.open('/admin/calendar', '_blank')
    }
  }

  // 일정 확정 핸들러
  const handleConfirmSchedule = () => {
    setConfirmingSchedule(true)
    
    // 실제로는 API 호출하여 스케줄에 추가 및 leadStatus 업데이트
    // leadStatus: 'inquiry' → 'contracted'
    setTimeout(() => {
      toast.success('일정이 확정되었습니다', {
        description: `${customer.groomName} & ${customer.brideName}님의 촬영 일정이 캘린더에 추가되고 leadStatus가 'contracted'로 변경되었습니다.`
      })
      setConfirmingSchedule(false)
      // 실제 구현에서는 여기서 customer.leadStatus를 'contracted'로 업데이트
      // onOpenChange(false) // 다이얼로그 닫기 (선택사항)
    }, 1000)
  }

  // 일정 확정이 필요한지 확인 (고객용 페이지 신청 건만)
  const needsScheduleConfirmation = leadStatus === 'inquiry'

  // 진행상태 라벨 및 색상 (최소 색상 사용)
  const leadStatusOptions = [
    { value: 'inquiry', label: '문의', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    { value: 'consultation', label: '상담중', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    { value: 'proposal', label: '제안', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    { value: 'contracted', label: '계약 완료', color: 'bg-zinc-900 text-white border-zinc-900' },
    { value: 'completed', label: '촬영 완료', color: 'bg-zinc-100 text-zinc-800 border-zinc-300' },
    { value: 'cancelled', label: '취소', color: 'bg-zinc-200 text-zinc-600 border-zinc-400' }
  ]

  const currentLeadStatus = leadStatusOptions.find(opt => opt.value === leadStatus)

  // 진행상태 변경 핸들러
  const handleLeadStatusChange = (newStatus: string) => {
    const previousStatus = leadStatus
    setLeadStatus(newStatus)
    
    // TODO: API 호출하여 상태 업데이트
    toast.success('진행상태가 변경되었습니다', {
      description: `${leadStatusOptions.find(opt => opt.value === previousStatus)?.label} → ${leadStatusOptions.find(opt => opt.value === newStatus)?.label}`
    })

    // contracted로 변경 시 일정 미확정 상태 해제
    if (newStatus === 'contracted' && previousStatus === 'inquiry') {
      toast.info('일정이 확정되었습니다', {
        description: '촬영 캘린더에 자동으로 추가됩니다.'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              {customer.groomName} & {customer.brideName}
            </DialogTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="flex items-center gap-1 border-zinc-300">
                <Heart className="h-3 w-3" />
                고객 ID: {customer.id}
              </Badge>
              
              {/* 유입 경로 타입 뱃지 */}
              {customer.sourceType === 'client-direct' && (
                <Badge variant="outline" className="bg-zinc-50 text-zinc-700 border-zinc-300">
                  고객 직접 문의
                </Badge>
              )}
              {customer.sourceType === 'venue-referral' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  제휴처 소개
                </Badge>
              )}
              {customer.sourceType === 'manual-registration' && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                  수동 등록
                </Badge>
              )}
              
              {customer.activeProjects > 0 && (
                <Badge className="bg-zinc-900 text-white">
                  진행 중 {customer.activeProjects}건
                </Badge>
              )}
              {customer.completedProjects > 0 && (
                <Badge className="bg-zinc-100 text-zinc-800 border border-zinc-300">
                  완료 {customer.completedProjects}건
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* 진행상태 변경 */}
        <Card className="border border-zinc-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <TrendingUp className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-zinc-700 mb-2 block">
                    진행상태
                  </Label>
                  <Select value={leadStatus} onValueChange={handleLeadStatusChange}>
                    <SelectTrigger className="w-full md:w-[280px] h-11">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <Badge className={`${currentLeadStatus?.color} border`}>
                            {currentLeadStatus?.label}
                          </Badge>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {leadStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={`${option.color} border text-xs`}>
                              {option.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 px-3 py-2 rounded-md border border-zinc-200">
                <Clock className="h-3 w-3" />
                <span>등록일: {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* 고객 입력 정보 요약 - 일정 & 상품 중심 */}
          {latestProject && (
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border border-zinc-200 bg-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-zinc-400" />
                    <div className="text-lg font-bold text-zinc-900">
                      {formatDate(latestProject.weddingDate)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">촬영 예정일</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {latestProject.weddingTime}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-zinc-200 bg-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Package className="h-5 w-5 mx-auto mb-2 text-zinc-400" />
                    <div className="text-base font-bold text-zinc-900">
                      {getProductTypeLabel(latestProject.projectType)}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">상품 타입</div>
                    {latestProject.packageId && (
                      <div className="text-xs text-zinc-400 mt-0.5">
                        {mockProducts.find(p => p.id === latestProject.packageId)?.name || '-'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-zinc-200 bg-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MapPin className="h-5 w-5 mx-auto mb-2 text-zinc-400" />
                    <div className="text-sm font-bold text-zinc-900 line-clamp-1">
                      {latestProject.weddingVenue || '-'}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">촬영 장소</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {latestProject.referralSource || '-'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={needsScheduleConfirmation 
                ? "border-2 border-zinc-900 bg-white" 
                : "border border-zinc-200 bg-zinc-50"
              }>
                <CardContent className="pt-6">
                  <div className="text-center">
                    {needsScheduleConfirmation ? (
                      <AlertCircle className="h-5 w-5 mx-auto mb-2 text-zinc-900" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-zinc-600" />
                    )}
                    <div className={`text-base font-bold ${needsScheduleConfirmation ? 'text-zinc-900' : 'text-zinc-800'}`}>
                      {needsScheduleConfirmation ? '일정 미확정' : '일정 확정'}
                    </div>
                    <div className={`text-xs mt-1 ${needsScheduleConfirmation ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      {needsScheduleConfirmation ? '승인 필요' : '진행 중'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!latestProject && (
            <Card className="border-zinc-200">
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">등록된 촬영 정보가 없습니다</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 진행 상태 프로그레스바 */}
          {latestProject && (
            <Card className="border border-zinc-200 bg-white">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-zinc-400" />
                      현재 진행 상태
                    </h3>
                    <Badge variant="outline" className="bg-zinc-100 text-zinc-800 border-zinc-300">
                      {getStatusLabel(latestProject.projectStatus)}
                    </Badge>
                  </div>
                  <ProgressBar value={latestProject.progress} className="h-3" />
                  <div className="text-xs text-zinc-500 text-right">
                    {latestProject.progress}% 완료
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 작가 배정 상태 */}
          {latestProject && (
            <Card className="border border-zinc-200 bg-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Camera className="h-5 w-5 mt-0.5 text-zinc-400" />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">작가 배정 상태</h3>
                      {latestProject.assignedPhotographers && latestProject.assignedPhotographers.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {latestProject.assignedPhotographers.map((photographer) => (
                              <Badge key={photographer.id} className="bg-zinc-900 text-white">
                                {photographer.user?.lastName}{photographer.user?.firstName}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-zinc-600">
                            작가가 배정되었습니다
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300">
                            작가 미배정
                          </Badge>
                          <p className="text-xs text-zinc-500 mt-1">
                            일정 확정 후 작가를 배정해주세요
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Content - 핵심 정보만 */}
          <Tabs defaultValue={latestProject ? "booking" : "contact"} className="w-full">
            <TabsList className={`grid w-full ${latestProject ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {latestProject && (
                <TabsTrigger value="booking" className="flex items-center gap-1 font-semibold">
                  <CalendarCheck className="h-4 w-4" />
                  고객 신청 정보
                  {needsScheduleConfirmation && (
                    <span className="ml-1 h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </TabsTrigger>
              )}
              <TabsTrigger value="contact">
                <Phone className="h-3 w-3 mr-1" />
                연락처
              </TabsTrigger>
              <TabsTrigger value="notes">
                <FileText className="h-3 w-3 mr-1" />
                메모
              </TabsTrigger>
            </TabsList>

            {/* Booking Info Tab - 고객 신청 정보 */}
            {latestProject && (
              <TabsContent value="booking" className="space-y-4 mt-4">
                {/* 일정 정보 카드 */}
                <Card className="border border-zinc-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <Calendar className="h-5 w-5 text-zinc-400" />
                      촬영 일정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="text-xs text-zinc-600 font-medium">촬영 날짜</div>
                        <div className="text-lg font-bold text-zinc-900">
                          {formatDate(latestProject.weddingDate)}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs text-zinc-600 font-medium">촬영 시간</div>
                        <div className="text-lg font-bold text-zinc-900">
                          {latestProject.weddingTime}
                        </div>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          촬영 장소
                        </div>
                        <div className="text-base font-semibold text-zinc-900">
                          {latestProject.weddingVenue}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상품 정보 카드 */}
                <Card className="border border-zinc-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <Package className="h-5 w-5 text-zinc-400" />
                      선택 상품
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {latestProject.projectType && (
                        <div className="space-y-1.5">
                          <div className="text-xs text-zinc-600 font-medium">상품 타입</div>
                          <Badge className="bg-zinc-900 text-white">
                            {getProductTypeLabel(latestProject.projectType)}
                          </Badge>
                        </div>
                      )}
                      
                      {latestProject.packageId && (
                        <div className="space-y-1.5">
                          <div className="text-xs text-zinc-600 font-medium">패키지</div>
                          <div className="text-base font-semibold text-zinc-900">
                            {mockProducts.find(p => p.id === latestProject.packageId)?.name || latestProject.packageId}
                          </div>
                        </div>
                      )}
                    </div>

                    {latestProject.optionIds && latestProject.optionIds.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-200">
                        <div className="text-xs text-zinc-600 font-medium">추가 옵션</div>
                        <div className="flex flex-wrap gap-2">
                          {latestProject.optionIds.map((optionId: string) => {
                            const option = mockProducts.find(p => p.id === optionId)
                            return option ? (
                              <Badge key={optionId} variant="outline" className="bg-zinc-50 text-zinc-800 border-zinc-300">
                                {option.name}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 추가 정보 카드 */}
                <Card className="border border-zinc-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <FileText className="h-5 w-5 text-zinc-400" />
                      유입 & 추가 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* 유입 경로 타입 */}
                    <div className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border-2",
                      customer.sourceType === 'client-direct' && "bg-zinc-50 border-zinc-300",
                      customer.sourceType === 'venue-referral' && "bg-blue-50 border-blue-300",
                      customer.sourceType === 'manual-registration' && "bg-purple-50 border-purple-300"
                    )}>
                      {customer.sourceType === 'client-direct' && <UserPlus className="h-5 w-5 text-zinc-600 mt-0.5" />}
                      {customer.sourceType === 'venue-referral' && <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />}
                      {customer.sourceType === 'manual-registration' && <User className="h-5 w-5 text-purple-600 mt-0.5" />}
                      <div className="space-y-1 flex-1">
                        <div className="text-xs font-medium" style={{
                          color: customer.sourceType === 'client-direct' ? '#52525b' :
                                 customer.sourceType === 'venue-referral' ? '#1d4ed8' :
                                 customer.sourceType === 'manual-registration' ? '#7e22ce' : '#52525b'
                        }}>
                          유입 타입
                        </div>
                        <div className="text-sm font-semibold" style={{
                          color: customer.sourceType === 'client-direct' ? '#18181b' :
                                 customer.sourceType === 'venue-referral' ? '#1e3a8a' :
                                 customer.sourceType === 'manual-registration' ? '#581c87' : '#18181b'
                        }}>
                          {customer.sourceType === 'client-direct' && '고객 직접 문의'}
                          {customer.sourceType === 'venue-referral' && '웨딩홀/플래너 제휴'}
                          {customer.sourceType === 'manual-registration' && '수동 등록'}
                        </div>
                        {customer.sourceType === 'venue-referral' && customer.venuePartnerId && (
                          <div className="text-xs text-blue-700 mt-1 flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            제휴처: {getVenuePartnerName(customer.venuePartnerId)}
                          </div>
                        )}
                        {customer.sourceChannel && (
                          <div className="text-xs text-zinc-600 mt-1">
                            {customer.sourceType === 'client-direct' && `구체적 경로: ${customer.sourceChannel}`}
                            {customer.sourceType === 'manual-registration' && `사유: ${customer.sourceChannel}`}
                          </div>
                        )}
                      </div>
                    </div>

                    {latestProject.specialRequests && (
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          특별 요청사항
                        </div>
                        <div className="text-sm bg-zinc-50 border border-zinc-300 rounded-lg p-3 text-zinc-900">
                          {latestProject.specialRequests}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 일정 확정/수정 - 고객용 페이지 신청 건만 표시 */}
                {needsScheduleConfirmation && (
                  <Card className="border-2 border-zinc-900 bg-white">
                    <CardContent className="pt-6">
                      {!editingSchedule ? (
                        <>
                          <div className="text-center mb-4">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-zinc-900" />
                            <h3 className="text-base font-semibold text-zinc-900 mb-1">일정 확정이 필요합니다</h3>
                            <p className="text-xs text-zinc-600">
                              {hasEdited ? '수정된 일정을 검토하고 확정해주세요' : '고객이 신청한 일정을 검토하고 확정해주세요'}
                            </p>
                          </div>

                          {/* 현재 일정 정보 표시 */}
                          {currentSchedule.date && currentSchedule.time && currentSchedule.venue && (
                            <div className="mb-4 p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                              <div className="flex items-start gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-500 mb-1">
                                    {hasEdited ? '최종 일정' : '신청 일정'}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {formatDate(currentSchedule.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 mb-2">
                                <Clock className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-500 mb-1">촬영 시간</p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {timeSlots.find(slot => slot.value === currentSchedule.time)?.label || currentSchedule.time}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-500 mb-1">촬영 장소</p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {currentSchedule.venue}
                                  </p>
                                </div>
                              </div>
                              {hasEdited && (
                                <div className="mt-3 pt-3 border-t border-zinc-200">
                                  <p className="text-xs text-zinc-600 flex items-center gap-1">
                                    <Edit className="h-3 w-3" />
                                    일정이 수정되었습니다
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 해당일 스케줄 및 작가 현황 */}
                          {currentSchedule.date && sameDateSchedules.length > 0 && (
                            <div className="mb-4 p-4 bg-white border-2 border-zinc-300 rounded-lg">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                                  <CalendarCheck className="h-4 w-4 text-zinc-600" />
                                  {formatDate(currentSchedule.date)} 일정 현황
                                </h4>
                                <Badge variant="outline" className="bg-zinc-100 text-zinc-800 border-zinc-300">
                                  총 {sameDateSchedules.length}건
                                </Badge>
                              </div>

                              {/* 촬영 가능한 작가 리스트 */}
                              {availablePhotographers.length > 0 && (
                                <div className="space-y-2 mb-3">
                                  <div className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                                    <Camera className="h-3 w-3" />
                                    촬영 가능한 작가
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    {availablePhotographers.map((photographer) => (
                                      <div 
                                        key={photographer.id}
                                        className={cn(
                                          "flex items-center justify-between p-2 rounded border",
                                          photographer.isAvailable
                                            ? "bg-green-50 border-green-200"
                                            : "bg-zinc-50 border-zinc-200"
                                        )}
                                      >
                                        <span className="text-xs font-medium text-zinc-900">
                                          {photographer.name}
                                        </span>
                                        {photographer.isAvailable ? (
                                          <Badge className="bg-green-600 text-white text-xs border-0">
                                            가능
                                          </Badge>
                                        ) : (
                                          <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300 text-xs">
                                            {photographer.scheduledCount}건
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 스케줄 목록 (최대 3개만 미리보기) */}
                              <div className="space-y-2">
                                <div className="text-xs text-zinc-600 font-medium">예정된 촬영</div>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {sameDateSchedules.slice(0, 3).map((schedule) => (
                                    <div 
                                      key={schedule.id}
                                      className="flex items-start gap-2 p-2 bg-zinc-50 rounded text-xs border border-zinc-200"
                                    >
                                      <Clock className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-zinc-900 truncate">
                                          {schedule.ceremonyTime} - {schedule.groomName} & {schedule.brideName}
                                        </div>
                                        <div className="text-zinc-500 truncate">
                                          {schedule.venueName}
                                        </div>
                                      </div>
                                      {schedule.photographerNames && schedule.photographerNames.length > 0 && (
                                        <Badge variant="outline" className="bg-zinc-900 text-white border-zinc-900 text-xs flex-shrink-0">
                                          {schedule.photographerNames[0]}
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                  {sameDateSchedules.length > 3 && (
                                    <div className="text-center text-xs text-zinc-500 py-1">
                                      외 {sameDateSchedules.length - 3}건 더보기 →
                                    </div>
                                  )}
                                </div>
                              </div>

                              {sameDateSchedules.length >= 3 && (
                                <div className="mt-3 pt-3 border-t border-zinc-200">
                                  <p className="text-xs text-zinc-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    해당 날짜에 {sameDateSchedules.length}건의 촬영이 예정되어 있습니다
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <Button 
                              onClick={handleViewCalendar}
                              variant="outline"
                              className="w-full border-zinc-300 hover:bg-zinc-100"
                              size="lg"
                            >
                              <Calendar className="mr-2 h-5 w-5" />
                              촬영 캘린더 보기
                            </Button>
                            <Button 
                              onClick={handleConfirmSchedule} 
                              disabled={confirmingSchedule}
                              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white"
                              size="lg"
                            >
                              <CalendarCheck className="mr-2 h-5 w-5" />
                              {confirmingSchedule ? '일정 확정 중...' : '일정 확정하기'}
                            </Button>
                            <Button 
                              onClick={handleStartEditSchedule}
                              variant="outline"
                              className="w-full border-zinc-300 hover:bg-zinc-50"
                              size="lg"
                            >
                              <Edit className="mr-2 h-5 w-5" />
                              일정 수정하기
                            </Button>
                          </div>
                          <p className="text-xs text-center text-zinc-500 mt-3">
                            확정 시 leadStatus가 'contracted'로 변경되고 촬영 캘린더에 추가됩니다
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-center mb-4">
                            <Edit className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <h3 className="text-base font-semibold text-zinc-900 mb-1">일정 수정</h3>
                            <p className="text-xs text-zinc-600">
                              촬영 일정 정보를 수정하세요
                            </p>
                          </div>
                          
                          <div className="space-y-4 mb-4">
                            <div>
                              <Label htmlFor="edit-wedding-date" className="text-sm font-medium">
                                촬영 날짜
                              </Label>
                              <Input
                                id="edit-wedding-date"
                                type="date"
                                value={editedWeddingDate}
                                onChange={(e) => setEditedWeddingDate(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="edit-wedding-time" className="text-sm font-medium">
                                촬영 시간
                              </Label>
                              <Select
                                value={editedWeddingTime}
                                onValueChange={setEditedWeddingTime}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="시간을 선택해주세요" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeSlots.map((slot) => (
                                    <SelectItem key={slot.value} value={slot.value}>
                                      {slot.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label htmlFor="edit-venue" className="text-sm font-medium">
                                촬영 장소
                              </Label>
                              <Input
                                id="edit-venue"
                                type="text"
                                value={editedVenue}
                                onChange={(e) => setEditedVenue(e.target.value)}
                                placeholder="예: 서울 그랜드 웨딩홀"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSaveSchedule}
                              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white"
                            >
                              <CalendarCheck className="mr-2 h-4 w-4" />
                              저장
                            </Button>
                            <Button 
                              onClick={handleCancelEditSchedule}
                              variant="outline"
                              className="flex-1"
                            >
                              취소
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 일정 확정 완료 상태 - 관리자 직접 등록 또는 승인 완료 */}
                {!needsScheduleConfirmation && (
                  <Card className="border border-zinc-200 bg-zinc-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-zinc-600 flex-shrink-0" />
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900">일정이 확정되었습니다</h3>
                          <p className="text-xs text-zinc-600 mt-1">
                            {customer.sourceChannel === '관리자 직접 등록' 
                              ? '관리자가 직접 등록하여 일정이 자동 확정되었습니다' 
                              : '촬영 캘린더에서 일정을 확인하실 수 있습니다'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 일정 확정 완료 상태 - 관리자 직접 등록 또는 승인 완료 */}
                {!needsScheduleConfirmation && (
                  <Card className="border border-zinc-200 bg-zinc-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-zinc-600 flex-shrink-0" />
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900">일정이 확정되었습니다</h3>
                          <p className="text-xs text-zinc-600 mt-1">
                            {customer.sourceChannel === '관리자 직접 등록' 
                              ? '관리자가 직접 등록하여 일정이 자동 확정되었습니다' 
                              : '촬영 캘린더에서 일정을 확인하실 수 있습니다'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}

            {/* Contact Tab - 고객용 페이지 수집 정보와 동일 */}
            <TabsContent value="contact" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    고객 연락처 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">신랑</div>
                      <div className="font-medium text-lg">{customer.groomName}</div>
                      {customer.groomPhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{customer.groomPhone}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">신부</div>
                      <div className="font-medium text-lg">{customer.brideName}</div>
                      {customer.bridePhone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{customer.bridePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {customer.email && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">이메일:</span>
                        <span className="font-medium">{customer.email}</span>
                      </div>
                    </div>
                  )}

                  {/* 유입 경로 정보 */}
                  <div className="pt-3 border-t space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">유입 타입:</span>
                      <Badge className="ml-auto" variant="outline">
                        {customer.sourceType === 'client-direct' && '고객 직접 문의'}
                        {customer.sourceType === 'venue-referral' && '웨딩홀/플래너 제휴'}
                        {customer.sourceType === 'manual-registration' && '수동 등록'}
                        {!customer.sourceType && '미분류'}
                      </Badge>
                    </div>

                    {customer.sourceType === 'venue-referral' && customer.venuePartnerId && (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <div className="text-xs text-blue-600 font-medium">제휴처</div>
                          <div className="text-sm font-semibold text-blue-900">
                            {getVenuePartnerName(customer.venuePartnerId)}
                          </div>
                          <div className="text-xs text-blue-700">
                            {mockVenuePartners.find(p => p.id === customer.venuePartnerId)?.contactPerson && 
                              `담당자: ${mockVenuePartners.find(p => p.id === customer.venuePartnerId)?.contactPerson}`}
                          </div>
                        </div>
                      </div>
                    )}

                    {customer.sourceType === 'client-direct' && customer.sourceChannel && (
                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">구체적 경로:</span>
                        <span className="font-medium">{customer.sourceChannel}</span>
                      </div>
                    )}

                    {customer.sourceType === 'manual-registration' && customer.sourceChannel && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">등록 사유:</span>
                        <span className="font-medium">{customer.sourceChannel}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      메모 내역
                    </CardTitle>
                    <Button variant="outline" size="sm">
                      메모 추가
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(() => {
                      const notes = getNotesByCustomerId(customer.id)
                      
                      if (notes.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
                            <p className="text-sm text-muted-foreground">
                              아직 메모가 없습니다.
                            </p>
                          </div>
                        )
                      }

                      return notes.map((note) => (
                        <div 
                          key={note.id}
                          className={cn(
                            "p-3 rounded-lg border",
                            note.author === 'customer'
                              ? 'border-zinc-900 bg-zinc-50'
                              : 'border-zinc-200 bg-white'
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={
                                note.author === 'customer' 
                                  ? 'bg-zinc-900 text-white border-zinc-900'
                                  : 'bg-zinc-100 text-zinc-700 border-zinc-300'
                              }>
                                {note.author === 'customer' ? (
                                  <User className="h-3 w-3 mr-1" />
                                ) : (
                                  <UsersIcon className="h-3 w-3 mr-1" />
                                )}
                                {note.author === 'customer' ? '고객' : '관리자'}
                              </Badge>
                              {note.authorName && (
                                <span className="text-xs text-zinc-500">
                                  {note.authorName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                              <Clock className="h-3 w-3" />
                              {format(new Date(note.createdAt), 'M월 d일 HH:mm', { locale: ko })}
                            </div>
                          </div>
                          <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
                            {note.content}
                          </p>
                        </div>
                      ))
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* 특별 요청사항 (고객이 신청 시 작성한 내용) */}
              {latestProject?.specialRequests && (
                <Card className="border border-zinc-300 bg-white">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <Heart className="h-4 w-4 text-zinc-400" />
                      신청 시 작성한 특별 요청사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-zinc-50 border border-zinc-200 rounded-lg p-3 leading-relaxed text-zinc-800">
                      {latestProject.specialRequests}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 내부 노트 */}
              {customer.notes && (
                <Card className="border border-zinc-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <FileText className="h-4 w-4 text-zinc-400" />
                      내부 메모
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-zinc-50 border border-zinc-200 rounded-lg p-3 leading-relaxed text-zinc-800">
                      {customer.notes}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

