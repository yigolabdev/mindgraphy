'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { mockTeamUsers, formatCurrency, getRoleLabel, getStatusColor } from '@/lib/mock/users'
import {
  Camera,
  DollarSign,
  Target,
  Award,
  Calendar,
  Clock,
  Users,
  ThumbsUp,
  ArrowLeft,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function PerformanceContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  
  const photographer = mockTeamUsers.find(u => u.id === id)

  if (!photographer || photographer.role !== 'photographer' || !photographer.photographerStats) {
    return (
      <AdminLayout align="left">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">사진작가를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mb-6">존재하지 않거나 사진작가가 아닙니다</p>
          <Link href="/admin/team">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              팀 관리로 돌아가기
            </Button>
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const stats = photographer.photographerStats

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link href="/admin/team">
            <Button variant="ghost" size="sm" className="w-fit">
              <ArrowLeft className="mr-2 h-4 w-4" />
              팀 관리로 돌아가기
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-zinc-900 text-white text-xl">
                  {photographer.lastName.charAt(0)}{photographer.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {photographer.lastName}{photographer.firstName} 작가
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {getRoleLabel(photographer.role)}
                  </Badge>
                  <Badge className={cn("border", getStatusColor(photographer.status))}>
                    {photographer.status === 'active' ? '활성' : photographer.status === 'inactive' ? '비활성' : '휴가'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 프로젝트</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                완료: {stats.completedProjects}건
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">진행중</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{stats.ongoingProjects}</div>
              <p className="text-xs text-green-600">
                현재 진행중인 프로젝트
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonthProjects}</div>
              <p className="text-xs text-muted-foreground">
                진행한 프로젝트
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">평균 평점</CardTitle>
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-700">{stats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-yellow-600">
                고객 평가
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue & Financial */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              수익 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">총 수익</span>
                  <span className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground mb-1">프로젝트당 평균</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(Math.floor(stats.totalRevenue / stats.totalProjects))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground mb-1">이번 달 예상</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(Math.floor(stats.totalRevenue / stats.totalProjects * stats.thisMonthProjects))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground mb-1">월 평균</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(Math.floor(stats.totalRevenue / 12))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                업무 성과
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">정시 납품률</span>
                  <span className="text-lg font-bold">{stats.onTimeDeliveryRate}%</span>
                </div>
                <Progress value={stats.onTimeDeliveryRate} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.onTimeDeliveryRate >= 95 ? '우수' : stats.onTimeDeliveryRate >= 90 ? '양호' : '개선 필요'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">완료율</span>
                  <span className="text-lg font-bold">
                    {Math.floor(stats.completedProjects / stats.totalProjects * 100)}%
                  </span>
                </div>
                <Progress value={stats.completedProjects / stats.totalProjects * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedProjects} / {stats.totalProjects} 프로젝트 완료
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5" />
                고객 만족도
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">전체 만족도</span>
                  <span className="text-lg font-bold">{stats.customerSatisfaction}%</span>
                </div>
                <Progress value={stats.customerSatisfaction} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.customerSatisfaction >= 95 ? '매우 우수' : stats.customerSatisfaction >= 90 ? '우수' : '양호'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">평균 평점</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= stats.averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                    <span className="text-lg font-bold ml-2">{stats.averageRating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.completedProjects}건의 프로젝트 평가
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Recognition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              성과 및 인정사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.averageRating >= 4.8 && (
                <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                    <span className="font-semibold text-yellow-900">최우수 작가</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    평균 평점 {stats.averageRating}점 달성
                  </p>
                </div>
              )}

              {stats.onTimeDeliveryRate >= 95 && (
                <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">정시 납품 우수</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {stats.onTimeDeliveryRate}% 정시 납품률
                  </p>
                </div>
              )}

              {stats.totalProjects >= 50 && (
                <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">베테랑 작가</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    {stats.totalProjects}건 프로젝트 완료
                  </p>
                </div>
              )}
            </div>

            {stats.averageRating < 4.8 && stats.onTimeDeliveryRate < 95 && stats.totalProjects < 50 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                더 많은 성과를 달성하면 배지가 표시됩니다
              </p>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              연락처 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">이메일</div>
                <div className="font-medium">{photographer.email}</div>
              </div>
              {photographer.phone && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">연락처</div>
                  <div className="font-medium">{photographer.phone}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground mb-1">입사일</div>
                <div className="font-medium">
                  {new Date(photographer.joinDate).toLocaleDateString('ko-KR')}
                </div>
              </div>
              {photographer.lastLogin && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">마지막 로그인</div>
                  <div className="font-medium">
                    {new Date(photographer.lastLogin).toLocaleString('ko-KR')}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function PhotographerPerformancePage() {
  return (
    <Suspense fallback={
      <AdminLayout align="left">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">로딩 중...</p>
          </div>
        </div>
      </AdminLayout>
    }>
      <PerformanceContent />
    </Suspense>
  )
}

