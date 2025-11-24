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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockPhotographers, mockUsers } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  FileText,
  Camera,
  Edit2,
  Tag,
  Package,
  Users,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  Share2,
  Link as LinkIcon,
  ClipboardList
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
    ? project.assignedPhotographerIds.map((id: string) => 
        mockPhotographers.find(p => p.id === id)
      ).filter(Boolean)
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
    
    // TODO: API 호출하여 상태 업데이트
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

        <div className="space-y-6 mt-4">
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

          {/* Main Content */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left Column - Tabs */}
            <div className="lg:col-span-2 space-y-4">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="info">촬영 정보</TabsTrigger>
                  <TabsTrigger value="customer">고객 정보</TabsTrigger>
                  <TabsTrigger value="details">예식 정보</TabsTrigger>
                  <TabsTrigger value="timeline">타임라인</TabsTrigger>
                </TabsList>

                {/* Shooting Info Tab */}
                <TabsContent value="info" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        일정 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">촬영일</div>
                          <div className="font-medium">{formatDate(project.weddingDate)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">촬영 시간</div>
                          <div className="font-medium">{project.weddingTime}</div>
                        </div>
                      </div>
                      
                      {project.makeupInfo && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">메이크업 정보</div>
                          <div className="font-medium">{project.makeupInfo}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        장소 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-medium text-lg">{project.weddingVenue}</div>
                      {project.specialRequests && (
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground mb-1">특별 요청사항</div>
                          <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                            {project.specialRequests}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Customer Info Tab */}
                <TabsContent value="customer" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        신랑 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">이름</div>
                        <div className="font-medium text-lg">{project.customer?.groomName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          연락처
                        </div>
                        <div className="font-medium">{project.customer?.groomPhone}</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        신부 정보
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">이름</div>
                        <div className="font-medium text-lg">{project.customer?.brideName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          연락처
                        </div>
                        <div className="font-medium">{project.customer?.bridePhone}</div>
                      </div>
                    </CardContent>
                  </Card>

                  {project.customer?.email && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          이메일
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-medium">{project.customer.email}</div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Wedding Details Tab */}
                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Mock wedding details data - 실제로는 API에서 가져올 데이터 */}
                  {project.weddingDetails ? (
                    <>
                      {/* 타임테이블 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            당일 타임테이블
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">메이크업샵</div>
                            <div className="font-medium">{project.weddingDetails.makeupShop || '미입력'}</div>
                          </div>
                          {project.weddingDetails.makeupStartTime && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">입실 시간</div>
                                <div className="font-medium">{project.weddingDetails.makeupStartTime}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">퇴실 시간</div>
                                <div className="font-medium">{project.weddingDetails.makeupEndTime}</div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* 예식 내용 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">예식 진행 내용</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">선원판</span>
                              <span className="font-medium">{project.weddingDetails.hasPreCeremonyPhoto === 'yes' ? '✓ 진행' : '진행 안함'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">주례</span>
                              <span className="font-medium">{project.weddingDetails.hasOfficiant === 'yes' ? '✓ 있음' : '없음'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">사회자</span>
                              <span className="font-medium">
                                {project.weddingDetails.hasMC === 'yes' 
                                  ? `✓ ${project.weddingDetails.mcType === 'professional' ? '전문' : '지인'}` 
                                  : '없음'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">반지교환</span>
                              <span className="font-medium">{project.weddingDetails.hasRingExchange === 'yes' ? '✓ 진행' : '진행 안함'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">화동</span>
                              <span className="font-medium">{project.weddingDetails.hasFlowerGirl === 'yes' ? '✓ 있음' : '없음'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">폐백</span>
                              <span className="font-medium">{project.weddingDetails.hasPaebaek === 'yes' ? '✓ 진행' : '진행 안함'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 가족 구성 */}
                      {(project.weddingDetails.groomFamily || project.weddingDetails.brideFamily) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              가족 구성
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {project.weddingDetails.groomFamily && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">신랑측</div>
                                <div className="text-sm">{project.weddingDetails.groomFamily}</div>
                              </div>
                            )}
                            {project.weddingDetails.brideFamily && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">신부측</div>
                                <div className="text-sm">{project.weddingDetails.brideFamily}</div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* 사진 스타일 */}
                      {(project.weddingDetails.preferredStyle || project.weddingDetails.notPreferredStyle) && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              사진 스타일
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {project.weddingDetails.preferredStyle && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">선호 스타일</div>
                                <div className="text-sm bg-green-50 border border-green-200 rounded p-2">
                                  {project.weddingDetails.preferredStyle}
                                </div>
                              </div>
                            )}
                            {project.weddingDetails.notPreferredStyle && (
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">비선호 스타일</div>
                                <div className="text-sm bg-red-50 border border-red-200 rounded p-2">
                                  {project.weddingDetails.notPreferredStyle}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* 의상 정보 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">의상 정보</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {project.weddingDetails.mainDressInfo && (
                            <div className="bg-zinc-50 p-3 rounded">
                              <div className="text-sm font-medium mb-2">메인 드레스</div>
                              <div className="text-sm text-muted-foreground">
                                {project.weddingDetails.mainDressInfo}
                              </div>
                            </div>
                          )}
                          {project.weddingDetails.receptionDressInfo && (
                            <div className="bg-zinc-50 p-3 rounded">
                              <div className="text-sm font-medium mb-2">연회장 의상</div>
                              <div className="text-sm text-muted-foreground">
                                {project.weddingDetails.receptionDressInfo}
                              </div>
                            </div>
                          )}
                          {project.weddingDetails.groomSuitInfo && (
                            <div className="bg-zinc-50 p-3 rounded">
                              <div className="text-sm font-medium mb-2">신랑 의상</div>
                              <div className="text-sm text-muted-foreground">
                                {project.weddingDetails.groomSuitInfo}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* 협력 업체 */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">협력 업체</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {project.weddingDetails.dressShop && (
                              <div>
                                <span className="text-muted-foreground">드레스샵: </span>
                                <span className="font-medium">{project.weddingDetails.dressShop}</span>
                              </div>
                            )}
                            {project.weddingDetails.makeupShopName && (
                              <div>
                                <span className="text-muted-foreground">메이크업: </span>
                                <span className="font-medium">{project.weddingDetails.makeupShopName}</span>
                              </div>
                            )}
                            {project.weddingDetails.videoTeam && (
                              <div>
                                <span className="text-muted-foreground">영상팀: </span>
                                <span className="font-medium">{project.weddingDetails.videoTeam}</span>
                              </div>
                            )}
                            {project.weddingDetails.planner && (
                              <div>
                                <span className="text-muted-foreground">플래너: </span>
                                <span className="font-medium">{project.weddingDetails.planner}</span>
                              </div>
                            )}
                          </div>
                          {project.weddingDetails.specialRequests && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="text-sm text-muted-foreground mb-1">특별 요청사항</div>
                              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-2">
                                {project.weddingDetails.specialRequests}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* 신혼여행 */}
                      {project.weddingDetails.honeymoonDestination && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">신혼여행 일정</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">목적지: </span>
                              <span className="font-medium">{project.weddingDetails.honeymoonDestination}</span>
                            </div>
                            {project.weddingDetails.honeymoonDeparture && (
                              <div>
                                <span className="text-muted-foreground">출발: </span>
                                <span className="font-medium">{project.weddingDetails.honeymoonDeparture}</span>
                              </div>
                            )}
                            {project.weddingDetails.honeymoonReturn && (
                              <div>
                                <span className="text-muted-foreground">귀국: </span>
                                <span className="font-medium">{project.weddingDetails.honeymoonReturn}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* 미팅 방식 */}
                      {project.weddingDetails.meetingType && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">미팅 방식</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm">
                              {project.weddingDetails.meetingType === 'direct' && '✓ 직접 미팅 (한양대 작업실)'}
                              {project.weddingDetails.meetingType === 'phone' && '✓ 전화 미팅'}
                              {project.weddingDetails.meetingType === 'list' && '✓ 리스트로만 진행'}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                          <p className="text-sm">아직 입력된 예식 정보가 없습니다</p>
                          <p className="text-xs mt-2 text-zinc-400">
                            고객이 마인드 포털에서 정보를 입력하면 여기에 표시됩니다
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Timeline Tab */}
                <TabsContent value="timeline" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-4 w-4" />
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
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Assigned Staff */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    담당자 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">담당 작가</div>
                    {assignedPhotographers.length > 0 ? (
                      <div className="space-y-2">
                        {assignedPhotographers.map((photographer: any, idx: number) => (
                          photographer && photographer.user && (
                            <div key={idx} className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                                  {photographer.user.lastName?.charAt(0) || photographer.user.firstName?.charAt(0) || 'P'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {photographer.user.lastName}{photographer.user.firstName}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                        미배정
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">담당 에디터</div>
                    {assignedEditor ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                            {assignedEditor.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {assignedEditor.lastName}{assignedEditor.firstName}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-gray-600 border-gray-300">
                        미배정
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Contract Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    상품 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.projectType && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        상품 타입
                      </div>
                      <div className="font-medium">
                        {project.projectType === 'wedding' ? '일반 웨딩' : 
                         project.projectType === 'hanbok' ? '한복 & 캐주얼' :
                         project.projectType === 'dress_shop' ? '가봉 스냅' :
                         project.projectType === 'baby' ? '돌스냅' : project.projectType}
                      </div>
                    </div>
                  )}
                  
                  {project.packageId && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        선택 패키지
                      </div>
                      <div className="font-medium">
                        {mockProducts.find(p => p.id === project.packageId)?.name || project.packageId}
                      </div>
                    </div>
                  )}
                  
                  {project.optionIds && project.optionIds.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        선택 옵션
                      </div>
                      <div className="space-y-1">
                        {project.optionIds.map((optionId: string) => {
                          const option = mockProducts.find(p => p.id === optionId)
                          return option ? (
                            <div key={optionId} className="text-sm font-medium">
                              • {option.name}
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  
                  {project.referralSource && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        유입 경로
                      </div>
                      <div className="font-medium">{project.referralSource}</div>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground mb-1">계약 번호</div>
                    <div className="font-medium text-sm text-muted-foreground">{project.contractId}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Web Gallery */}
              <Card className="border-purple-200 bg-purple-50/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-purple-900">
                    <ImageIcon className="h-4 w-4" />
                    웹 갤러리
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Mock gallery data - 실제로는 API에서 가져올 데이터 */}
                  {project.webGallery ? (
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-zinc-900">
                              {project.webGallery.title}
                            </p>
                            <p className="text-xs text-zinc-600 mt-1">
                              {project.webGallery.photoCount}장의 사진
                            </p>
                          </div>
                          <Badge className="bg-green-600">
                            활성화됨
                          </Badge>
                        </div>
                        
                        <div className="pt-2 border-t border-purple-200">
                          <div className="flex items-center gap-2 text-xs text-zinc-600 mb-2">
                            <LinkIcon className="h-3 w-3" />
                            <span>공유 링크</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={typeof window !== 'undefined' 
                                ? window.location.origin + project.webGallery.sharedUrl 
                                : project.webGallery.sharedUrl}
                              readOnly
                              className="text-xs font-mono bg-white border-purple-200"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const url = typeof window !== 'undefined' 
                                  ? window.location.origin + project.webGallery.sharedUrl 
                                  : project.webGallery.sharedUrl
                                window.open(url, '_blank', 'noopener,noreferrer')
                              }}
                              className="flex-shrink-0"
                              title="갤러리 보기"
                            >
                              <ImageIcon className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const url = typeof window !== 'undefined' 
                                  ? window.location.origin + project.webGallery.sharedUrl 
                                  : project.webGallery.sharedUrl
                                try {
                                  await navigator.clipboard.writeText(url)
                                  toast.success('링크가 복사되었습니다')
                                } catch (err) {
                                  const textArea = document.createElement('textarea')
                                  textArea.value = url
                                  document.body.appendChild(textArea)
                                  textArea.select()
                                  document.execCommand('copy')
                                  document.body.removeChild(textArea)
                                  toast.success('링크가 복사되었습니다')
                                }
                              }}
                              className="flex-shrink-0"
                              title="링크 복사"
                            >
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={() => {
                          window.location.href = `/admin/gallery/${project.id}/upload`
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        사진 추가 및 편집
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center py-6 bg-white rounded-lg border border-purple-200">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                        <p className="text-sm text-zinc-600 mb-1">
                          아직 생성된 갤러리가 없습니다
                        </p>
                        <p className="text-xs text-zinc-500">
                          사진을 업로드하면 갤러리가 자동으로 생성됩니다
                        </p>
                      </div>
                      
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => {
                          window.location.href = `/admin/gallery/${project.id}/upload`
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        갤러리 생성 및 사진 업로드
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Time Table */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-blue-900">
                    <ClipboardList className="h-4 w-4" />
                    타임 테이블
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    촬영 당일 일정표를 관리하고<br />
                    고객에게 공유할 수 있습니다
                  </p>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      window.location.href = `/admin/timetable/${project.id}`
                    }}
                  >
                    <ClipboardList className="h-4 w-4 mr-2" />
                    타임 테이블 관리
                  </Button>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    메모
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    작업 메모가 없습니다
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

