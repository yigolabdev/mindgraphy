'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressBar } from '@/components/common/progress-bar'
import { DdayBadge } from '@/components/common/dday-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockPhotographers, mockUsers } from '@/lib/mock-data'
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
  Edit2
} from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

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
              <Badge className={getStatusColor(project.projectStatus)}>
                {getStatusLabel(project.projectStatus)}
              </Badge>
              <DdayBadge targetDate={project.weddingDate} showIcon={false} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">촬영 정보</TabsTrigger>
                  <TabsTrigger value="customer">고객 정보</TabsTrigger>
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
                    계약 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">촬영 유형</div>
                    <div className="font-medium">
                      {project.projectType === 'wedding' ? '본식 촬영' : '프리웨딩'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">계약 번호</div>
                    <div className="font-medium text-sm">{project.contractId}</div>
                  </div>
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

