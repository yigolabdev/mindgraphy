'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressBar } from '@/components/common/progress-bar'
import { DdayBadge } from '@/components/common/dday-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockUsers } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  FileText,
  Camera,
  Tag,
  Package,
  Users,
  TrendingUp
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { toast } from 'sonner'
import type { ProjectStatus } from '@/lib/types'

interface ProjectDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: any | null
}

export function ProjectDetailDialog({ 
  open, 
  onOpenChange, 
  project 
}: ProjectDetailDialogProps) {
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(project?.projectStatus || 'scheduled')
  
  if (!project) return null

  // 복수 작가 지원
  const assignedPhotographers = project.assignedPhotographerIds
    ? project.assignedPhotographerIds.map((id: string) => {
        // Mock data에서 작가 정보 찾기 (실제로는 API에서 가져올 데이터)
        return {
          id,
          user: { lastName: '작가', firstName: id.slice(-1) },
          experienceYears: 5,
          rating: 4.5
        }
      })
    : []
  
  const assignedEditor = mockUsers.find(
    u => u.id === project.assignedEditorId
  )

  // 프로젝트 상태 옵션
  const projectStatusOptions = [
    { value: 'scheduled', label: '일정 확정', desc: '촬영 예정', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: '촬영 진행중', desc: '현재 촬영중', color: 'bg-purple-100 text-purple-800' },
    { value: 'proof_ready', label: '사진 선택', desc: '프루프 준비 완료', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'editing', label: '편집중', desc: '사진 보정 중', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: '편집 완료', desc: '작업 완료', color: 'bg-green-100 text-green-800' },
    { value: 'delivered', label: '배송 완료', desc: '최종 배송 완료', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: '취소', desc: '프로젝트 취소', color: 'bg-red-100 text-red-800' },
    { value: 'archived', label: '보관', desc: '아카이브', color: 'bg-zinc-100 text-zinc-800' }
  ]

  const currentStatus = projectStatusOptions.find(opt => opt.value === projectStatus)

  // 상태 변경 핸들러
  const handleStatusChange = (newStatus: ProjectStatus) => {
    const previousStatus = projectStatus
    setProjectStatus(newStatus)
    
    const prevLabel = projectStatusOptions.find(opt => opt.value === previousStatus)?.label
    const newLabel = projectStatusOptions.find(opt => opt.value === newStatus)?.label
    
    toast.success('프로젝트 상태가 변경되었습니다', {
      description: `${prevLabel} → ${newLabel}`
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <DialogTitle className="text-2xl">
              {project.customer?.groomName} & {project.customer?.brideName}
            </DialogTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">{project.projectNumber}</span>
              <Badge className={getStatusColor(projectStatus)}>
                {getStatusLabel(projectStatus)}
              </Badge>
              <DdayBadge targetDate={project.weddingDate} showIcon={false} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Project Status Management */}
          <Card className="border-2 border-zinc-200 bg-gradient-to-r from-zinc-50 to-white">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <TrendingUp className="h-5 w-5 text-zinc-600 flex-shrink-0" />
                  <div className="flex-1">
                    <Label className="text-sm font-medium text-zinc-700 mb-2 block">
                      프로젝트 상태
                    </Label>
                    <Select value={projectStatus} onValueChange={(value) => handleStatusChange(value as ProjectStatus)}>
                      <SelectTrigger className="w-full md:w-[320px] h-11">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <Badge className={`${currentStatus?.color} border`}>
                              {currentStatus?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden md:inline">
                              {currentStatus?.desc}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {projectStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={`${option.color} border text-xs`}>
                                {option.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {option.desc}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-zinc-100 px-3 py-2 rounded-md border border-zinc-200">
                  <Clock className="h-3 w-3" />
                  <span>포털 단계와 연동됩니다</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">진행 상황</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressBar value={project.progress} showLabel />
            </CardContent>
          </Card>

          {/* 1. 상품 & 고객 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                상품 & 고객 기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Type & Client Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">상품 타입</Label>
                  <div className="p-3 border-2 border-zinc-200 bg-zinc-50 rounded-lg">
                    <span className="font-semibold">
                      {project.projectType === 'wedding' ? '웨딩' : 
                       project.projectType === 'hanbok' ? '한복 & 캐주얼' :
                       project.projectType === 'dress_shop' ? '가봉 스냅' :
                       project.projectType === 'baby' ? '돌스냅' : project.projectType}
                    </span>
                  </div>
                </div>
                {project.clientType && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">고객 유형</Label>
                    <div className="p-3 border-2 border-zinc-200 bg-zinc-50 rounded-lg">
                      <span className="font-semibold">
                        {project.clientType === 'direct' ? '직접 문의' : '웨딩홀 제휴'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>신랑 이름</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.customer?.groomName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>신부 이름</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.customer?.brideName}</span>
                  </div>
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>신랑 연락처</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.customer?.groomPhone || '미입력'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>신부 연락처</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.customer?.bridePhone || '미입력'}</span>
                  </div>
                </div>
              </div>

              {/* Main Contact */}
              {project.customer?.mainContact && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">대표 연락처</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-4 rounded-lg border-2 text-left ${
                      project.customer.mainContact === 'groom' 
                        ? 'border-zinc-900 bg-zinc-50' 
                        : 'border-zinc-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-semibold">신랑</span>
                      </div>
                      {project.customer.groomPhone && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.customer.groomPhone}
                        </div>
                      )}
                    </div>
                    <div className={`p-4 rounded-lg border-2 text-left ${
                      project.customer.mainContact === 'bride' 
                        ? 'border-zinc-900 bg-zinc-50' 
                        : 'border-zinc-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-semibold">신부</span>
                      </div>
                      {project.customer.bridePhone && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.customer.bridePhone}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    주요 연락 및 포털 로그인에 사용됩니다
                  </p>
                </div>
              )}

              {/* Email */}
              {project.customer?.email && (
                <div className="space-y-2">
                  <Label>이메일</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.customer.email}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. 패키지 & 옵션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                패키지 & 옵션
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package */}
              {project.packageId && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">선택 패키지</Label>
                  <div className="p-4 rounded-lg border-2 border-zinc-900 bg-zinc-50">
                    <div className="font-semibold text-lg">
                      {mockProducts.find(p => p.id === project.packageId)?.name || project.packageId}
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              {project.optionIds && project.optionIds.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">추가 옵션</Label>
                  <div className="space-y-2">
                    {project.optionIds.map((optionId: string) => {
                      const option = mockProducts.find(p => p.id === optionId)
                      return option ? (
                        <div key={optionId} className="p-3 rounded-lg border-2 border-zinc-900 bg-zinc-50">
                          <div className="font-medium">{option.title}</div>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. 촬영 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                촬영 상세 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>촬영 날짜</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{formatDate(project.weddingDate)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>촬영 시간</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.weddingTime || '미입력'}</span>
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label>촬영 장소</Label>
                <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                  <span className="font-medium">{project.weddingVenue}</span>
                </div>
              </div>

              {/* Venue Address */}
              {project.venueAddress && (
                <div className="space-y-2">
                  <Label>상세 주소</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.venueAddress}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. 담당자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                담당자 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Assigned Photographers */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">담당 작가</Label>
                {assignedPhotographers.length > 0 ? (
                  <div className="space-y-2">
                    {assignedPhotographers.map((photographer: any, idx: number) => (
                      photographer && photographer.user && (
                        <div key={idx} className="p-3 border border-zinc-200 rounded-lg bg-white flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-600 text-white font-semibold">
                              {photographer.user.lastName?.charAt(0) || photographer.user.firstName?.charAt(0) || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {photographer.user.lastName}{photographer.user.firstName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              경력 {photographer.experienceYears}년 • ⭐ {photographer.rating}
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-orange-300 bg-orange-50 rounded-lg text-center">
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      미배정
                    </Badge>
                  </div>
                )}
              </div>

              {/* Assigned Editor */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">담당 에디터</Label>
                {assignedEditor ? (
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {assignedEditor.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {assignedEditor.lastName}{assignedEditor.firstName}
                    </span>
                  </div>
                ) : (
                  <div className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg text-center">
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      미배정
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 5. 유입 경로 & 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                유입 경로 & 추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Type */}
              {project.sourceType && (
                <div className="space-y-2">
                  <Label className="text-base font-semibold">고객 유입 경로 타입</Label>
                  <div className="p-4 border-2 border-zinc-200 bg-zinc-50 rounded-lg">
                    <span className="font-semibold">
                      {project.sourceType === 'client-direct' ? '고객 직접 문의' : 
                       project.sourceType === 'venue-referral' ? '웨딩홀/플래너' :
                       project.sourceType === 'manual-registration' ? '수동 등록' : project.sourceType}
                    </span>
                  </div>
                </div>
              )}

              {/* Referral Source */}
              {project.referralSource && (
                <div className="space-y-2">
                  <Label>구체적인 유입 경로</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                    <span className="font-medium">{project.referralSource}</span>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {project.specialRequests && (
                <div className="space-y-2">
                  <Label>특별 요청사항</Label>
                  <div className="p-3 border border-zinc-200 rounded-lg bg-blue-50 border-blue-200">
                    <span className="text-sm">{project.specialRequests}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 6. 결제 정보 (수동 등록 시만) */}
          {project.sourceType === 'manual-registration' && (project.paymentStatus || project.paymentMethod) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  결제 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Status */}
                {project.paymentStatus && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">결제 상태</Label>
                    <div className={`p-4 rounded-lg border-2 ${
                      project.paymentStatus === 'paid' ? 'border-green-600 bg-green-50' :
                      project.paymentStatus === 'partial' ? 'border-orange-500 bg-orange-50' :
                      'border-zinc-900 bg-zinc-50'
                    }`}>
                      <span className="font-semibold">
                        {project.paymentStatus === 'paid' ? '입금 완료' :
                         project.paymentStatus === 'partial' ? '예약금 입금' :
                         '미입금'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Method & Amount */}
                {project.paymentStatus !== 'unpaid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.paymentMethod && (
                      <div className="space-y-2">
                        <Label>결제 방식</Label>
                        <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                          <span className="font-medium">
                            {project.paymentMethod === 'transfer' ? '계좌 이체' :
                             project.paymentMethod === 'card' ? '카드 결제' :
                             project.paymentMethod === 'cash' ? '현금 (현장)' : project.paymentMethod}
                          </span>
                        </div>
                      </div>
                    )}

                    {project.paymentAmount && (
                      <div className="space-y-2">
                        <Label>결제 금액</Label>
                        <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                          <span className="font-medium">{project.paymentAmount}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 7. Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                주요 일정
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">촬영 생성</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(project.createdAt), 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">촬영 예정일</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(project.weddingDate)} {project.weddingTime}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                    <div className="font-medium">최종 수정</div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(project.updatedAt), 'yyyy년 M월 d일 (EEE) HH:mm', { locale: ko })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. 계약 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                계약 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>계약 번호</Label>
                <div className="p-3 border border-zinc-200 rounded-lg bg-white">
                  <span className="font-medium text-muted-foreground">{project.contractId}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
