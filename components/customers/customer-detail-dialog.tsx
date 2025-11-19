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
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
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
  Edit
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
      'wedding': '일반 웨딩',
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
    // 일반 웨딩, 가봉 스냅, 돌스냅 - 30분 단위
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

  // 진행상태 라벨 및 색상
  const leadStatusOptions = [
    { value: 'inquiry', label: '문의', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    { value: 'consultation', label: '상담중', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'proposal', label: '제안', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { value: 'contracted', label: '계약 완료', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'completed', label: '촬영 완료', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'cancelled', label: '취소', color: 'bg-red-100 text-red-800 border-red-300' }
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
              <Badge variant="outline" className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                고객 ID: {customer.id}
              </Badge>
              {customer.activeProjects > 0 && (
                <Badge className="bg-blue-600">
                  진행 중 {customer.activeProjects}건
                </Badge>
              )}
              {customer.completedProjects > 0 && (
                <Badge className="bg-green-600">
                  완료 {customer.completedProjects}건
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* 진행상태 변경 */}
        <Card className="border-2 border-zinc-200 bg-gradient-to-r from-zinc-50 to-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <TrendingUp className="h-5 w-5 text-zinc-600 flex-shrink-0" />
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
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-zinc-100 px-3 py-2 rounded-md border border-zinc-200">
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
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-blue-900">
                      {formatDate(latestProject.weddingDate)}
                    </div>
                    <div className="text-xs text-blue-700 mt-1">촬영 예정일</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {latestProject.weddingTime}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Package className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                    <div className="text-base font-bold text-purple-900">
                      {getProductTypeLabel(latestProject.projectType)}
                    </div>
                    <div className="text-xs text-purple-700 mt-1">상품 타입</div>
                    {latestProject.packageId && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {mockProducts.find(p => p.id === latestProject.packageId)?.name || '-'}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MapPin className="h-5 w-5 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-bold text-green-900 line-clamp-1">
                      {latestProject.weddingVenue || '-'}
                    </div>
                    <div className="text-xs text-green-700 mt-1">촬영 장소</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {latestProject.referralSource || '-'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={needsScheduleConfirmation 
                ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white" 
                : "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
              }>
                <CardContent className="pt-6">
                  <div className="text-center">
                    {needsScheduleConfirmation ? (
                      <AlertCircle className="h-5 w-5 mx-auto mb-2 text-orange-600 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 mx-auto mb-2 text-emerald-600" />
                    )}
                    <div className={`text-base font-bold ${needsScheduleConfirmation ? 'text-orange-900' : 'text-emerald-900'}`}>
                      {needsScheduleConfirmation ? '일정 미확정' : '일정 확정'}
                    </div>
                    <div className={`text-xs mt-1 ${needsScheduleConfirmation ? 'text-orange-700' : 'text-emerald-700'}`}>
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
            <Card className="border-zinc-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      현재 진행 상태
                    </h3>
                    <Badge variant="outline" className={
                      latestProject.projectStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                      latestProject.projectStatus === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                      latestProject.projectStatus === 'editing' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                      'bg-zinc-100 text-zinc-700 border-zinc-300'
                    }>
                      {getStatusLabel(latestProject.projectStatus)}
                    </Badge>
                  </div>
                  <ProgressBar value={latestProject.progress} className="h-3" />
                  <div className="text-xs text-muted-foreground text-right">
                    {latestProject.progress}% 완료
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 작가 배정 상태 */}
          {latestProject && (
            <Card className={latestProject.assignedPhotographers && latestProject.assignedPhotographers.length > 0 
              ? "border-green-200 bg-green-50/30" 
              : "border-orange-200 bg-orange-50/30"
            }>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Camera className={`h-5 w-5 mt-0.5 ${
                      latestProject.assignedPhotographers && latestProject.assignedPhotographers.length > 0 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`} />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1">작가 배정 상태</h3>
                      {latestProject.assignedPhotographers && latestProject.assignedPhotographers.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {latestProject.assignedPhotographers.map((photographer) => (
                              <Badge key={photographer.id} className="bg-green-600">
                                {photographer.user?.lastName}{photographer.user?.firstName}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-xs text-green-700">
                            작가가 배정되었습니다
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                            작가 미배정
                          </Badge>
                          <p className="text-xs text-orange-700 mt-1">
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
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                      <Calendar className="h-5 w-5" />
                      촬영 일정
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="text-xs text-blue-700 font-medium">촬영 날짜</div>
                        <div className="text-lg font-bold text-blue-900">
                          {formatDate(latestProject.weddingDate)}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-xs text-blue-700 font-medium">촬영 시간</div>
                        <div className="text-lg font-bold text-blue-900">
                          {latestProject.weddingTime}
                        </div>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <div className="text-xs text-blue-700 font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          촬영 장소
                        </div>
                        <div className="text-base font-semibold text-blue-900">
                          {latestProject.weddingVenue}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 상품 정보 카드 */}
                <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                      <Package className="h-5 w-5" />
                      선택 상품
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {latestProject.projectType && (
                        <div className="space-y-1.5">
                          <div className="text-xs text-purple-700 font-medium">상품 타입</div>
                          <Badge className={
                            latestProject.projectType === 'hanbok' ? 'bg-purple-600' :
                            latestProject.projectType === 'dress_shop' ? 'bg-pink-600' :
                            latestProject.projectType === 'baby' ? 'bg-blue-600' :
                            'bg-zinc-700'
                          }>
                            {getProductTypeLabel(latestProject.projectType)}
                          </Badge>
                        </div>
                      )}
                      
                      {latestProject.packageId && (
                        <div className="space-y-1.5">
                          <div className="text-xs text-purple-700 font-medium">패키지</div>
                          <div className="text-base font-semibold text-purple-900">
                            {mockProducts.find(p => p.id === latestProject.packageId)?.name || latestProject.packageId}
                          </div>
                        </div>
                      )}
                    </div>

                    {latestProject.optionIds && latestProject.optionIds.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-purple-200">
                        <div className="text-xs text-purple-700 font-medium">추가 옵션</div>
                        <div className="flex flex-wrap gap-2">
                          {latestProject.optionIds.map((optionId: string) => {
                            const option = mockProducts.find(p => p.id === optionId)
                            return option ? (
                              <Badge key={optionId} variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
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
                <Card className="border-zinc-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-900">
                      <FileText className="h-5 w-5" />
                      추가 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestProject.referralSource && (
                      <div className="flex items-start gap-3 p-3 bg-zinc-50 rounded-lg">
                        <UsersIcon className="h-5 w-5 text-zinc-600 mt-0.5" />
                        <div className="space-y-0.5">
                          <div className="text-xs text-zinc-600 font-medium">유입 경로</div>
                          <div className="text-sm font-semibold text-zinc-900">{latestProject.referralSource}</div>
                        </div>
                      </div>
                    )}

                    {latestProject.specialRequests && (
                      <div className="space-y-2">
                        <div className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          특별 요청사항
                        </div>
                        <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 text-zinc-900">
                          {latestProject.specialRequests}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 일정 확정/수정 - 고객용 페이지 신청 건만 표시 */}
                {needsScheduleConfirmation && (
                  <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-md">
                    <CardContent className="pt-6">
                      {!editingSchedule ? (
                        <>
                          <div className="text-center mb-4">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-600 animate-pulse" />
                            <h3 className="text-base font-semibold text-orange-900 mb-1">일정 확정이 필요합니다</h3>
                            <p className="text-xs text-orange-700">
                              {hasEdited ? '수정된 일정을 검토하고 확정해주세요' : '고객이 신청한 일정을 검토하고 확정해주세요'}
                            </p>
                          </div>

                          {/* 현재 일정 정보 표시 */}
                          {currentSchedule.date && currentSchedule.time && currentSchedule.venue && (
                            <div className="mb-4 p-4 bg-white border border-orange-200 rounded-lg">
                              <div className="flex items-start gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-600 mb-1">
                                    {hasEdited ? '최종 일정' : '신청 일정'}
                                  </p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {formatDate(currentSchedule.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 mb-2">
                                <Clock className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-600 mb-1">촬영 시간</p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {timeSlots.find(slot => slot.value === currentSchedule.time)?.label || currentSchedule.time}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-xs text-zinc-600 mb-1">촬영 장소</p>
                                  <p className="text-sm font-medium text-zinc-900">
                                    {currentSchedule.venue}
                                  </p>
                                </div>
                              </div>
                              {hasEdited && (
                                <div className="mt-3 pt-3 border-t border-orange-200">
                                  <p className="text-xs text-orange-700 flex items-center gap-1">
                                    <Edit className="h-3 w-3" />
                                    일정이 수정되었습니다
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="space-y-2">
                            <Button 
                              onClick={handleConfirmSchedule} 
                              disabled={confirmingSchedule}
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                              size="lg"
                            >
                              <CalendarCheck className="mr-2 h-5 w-5" />
                              {confirmingSchedule ? '일정 확정 중...' : '일정 확정하기'}
                            </Button>
                            <Button 
                              onClick={handleStartEditSchedule}
                              variant="outline"
                              className="w-full border-orange-300 hover:bg-orange-100"
                              size="lg"
                            >
                              <Edit className="mr-2 h-5 w-5" />
                              일정 수정하기
                            </Button>
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            확정 시 leadStatus가 'contracted'로 변경되고 촬영 캘린더에 추가됩니다
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="text-center mb-4">
                            <Edit className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                            <h3 className="text-base font-semibold text-blue-900 mb-1">일정 수정</h3>
                            <p className="text-xs text-blue-700">
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
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
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
                  <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50 to-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                        <div>
                          <h3 className="text-base font-semibold text-emerald-900">일정이 확정되었습니다</h3>
                          <p className="text-xs text-emerald-700 mt-1">
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

                  {latestProject?.referralSource && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">유입 경로:</span>
                        <span className="font-medium">{latestProject.referralSource}</span>
                      </div>
                    </div>
                  )}
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
                          className={`
                            p-3 rounded-lg border-l-4 
                            ${note.author === 'customer' 
                              ? 'bg-blue-50 border-blue-500 border-l-blue-500' 
                              : 'bg-zinc-50 border-zinc-400 border-l-zinc-400'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {note.author === 'customer' ? (
                                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                                  <User className="h-3 w-3 mr-1" />
                                  고객
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-300">
                                  <UsersIcon className="h-3 w-3 mr-1" />
                                  관리자
                                </Badge>
                              )}
                              {note.authorName && (
                                <span className="text-xs text-muted-foreground">
                                  {note.authorName}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                      <Heart className="h-4 w-4" />
                      신청 시 작성한 특별 요청사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 leading-relaxed">
                      {latestProject.specialRequests}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 내부 노트 */}
              {customer.notes && (
                <Card className="border-zinc-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2 text-zinc-700">
                      <FileText className="h-4 w-4" />
                      내부 메모
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-zinc-50 border border-zinc-200 rounded-lg p-3 leading-relaxed">
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

