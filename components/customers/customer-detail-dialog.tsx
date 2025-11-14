'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressBar } from '@/components/common/progress-bar'
import { DdayBadge } from '@/components/common/dday-badge'
import { mockProjects, mockContracts, mockPayments } from '@/lib/mock-data'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
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
  AlertCircle
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

        <div className="space-y-6 mt-4">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {customer.totalProjects}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">총 촬영 건수</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(paidAmount / 10000).toLocaleString('ko-KR')}만
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">총 결제금액</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {(pendingAmount / 10000).toLocaleString('ko-KR')}만
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">미수금</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {customer.latestProject 
                      ? formatDate(customer.latestProject.weddingDate)
                      : '-'
                    }
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">최근 촬영일</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">촬영 이력</TabsTrigger>
              <TabsTrigger value="contact">연락처</TabsTrigger>
              <TabsTrigger value="payment">결제 정보</TabsTrigger>
              <TabsTrigger value="notes">메모</TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 mt-4">
              {customerProjects.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    촬영 이력이 없습니다
                  </CardContent>
                </Card>
              ) : (
                customerProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <h3 className="font-semibold text-lg">
                                {project.projectNumber}
                              </h3>
                              <Badge className={getStatusColor(project.projectStatus)}>
                                {getStatusLabel(project.projectStatus)}
                              </Badge>
                              <DdayBadge targetDate={project.weddingDate} showIcon={false} />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(project.weddingDate)} {project.weddingTime}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {project.weddingVenue}
                              </div>
                            </div>

                            {project.specialRequests && (
                              <div className="mt-3 text-sm">
                                <span className="text-muted-foreground">특별 요청: </span>
                                <span>{project.specialRequests}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ProgressBar value={project.progress} showLabel />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
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
                      <div className="font-medium text-lg">{customer.groomName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        연락처
                      </div>
                      <div className="font-medium">{customer.groomPhone}</div>
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
                      <div className="font-medium text-lg">{customer.brideName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        연락처
                      </div>
                      <div className="font-medium">{customer.bridePhone}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {customer.email && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      이메일
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="font-medium">{customer.email}</div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    주소
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {customer.address ? (
                    <div className="font-medium">{customer.address}</div>
                  ) : (
                    <div className="text-sm text-muted-foreground">주소 정보가 없습니다</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    결제 요약
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">총 계약금액</span>
                    <span className="font-bold text-lg">{(totalRevenue / 10000).toLocaleString('ko-KR')}만원</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      입금 완료
                    </span>
                    <span className="font-bold">{(paidAmount / 10000).toLocaleString('ko-KR')}만원</span>
                  </div>
                  <div className="flex justify-between items-center text-orange-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      미수금
                    </span>
                    <span className="font-bold">{(pendingAmount / 10000).toLocaleString('ko-KR')}만원</span>
                  </div>
                </CardContent>
              </Card>

              {customerPayments.length > 0 ? (
                customerPayments.map((payment) => {
                  const paymentTypeLabel = 
                    payment.paymentType === 'deposit' ? '계약금' : 
                    payment.paymentType === 'balance' ? '잔금' : 
                    payment.paymentType === 'additional' ? '추가 결제' : '환불'
                  
                  return (
                    <Card key={payment.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{paymentTypeLabel}</span>
                              <Badge variant={payment.paymentStatus === 'completed' ? 'default' : 'outline'} 
                                className={payment.paymentStatus === 'completed' ? 'bg-green-600' : 'text-orange-600 border-orange-300'}>
                                {payment.paymentStatus === 'completed' ? '입금완료' : 
                                 payment.paymentStatus === 'pending' ? '미입금' : 
                                 payment.paymentStatus === 'failed' ? '입금실패' : '환불'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              결제수단: {payment.paymentMethod}
                            </div>
                            {payment.paymentDate && (
                              <div className="text-sm text-muted-foreground">
                                입금일: {formatDate(payment.paymentDate)}
                              </div>
                            )}
                            {payment.notes && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {payment.notes}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">{(payment.amount / 10000).toLocaleString('ko-KR')}만원</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    결제 내역이 없습니다
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    고객 메모
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      고객 관련 메모나 특이사항을 기록할 수 있습니다.
                    </p>
                    <Button variant="outline" className="w-full">
                      메모 추가
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {customer.specialRequests && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      특별 요청사항
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
                      {customer.specialRequests}
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

