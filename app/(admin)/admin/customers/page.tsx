'use client'

import { useState, useMemo, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KPICard, StatCard, ProgressStat, StatusBadge } from '@/components/common'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomerDetailDialog } from '@/components/customers/customer-detail-dialog'
import { PaymentManagementDialog } from '@/components/customers/payment-management-dialog'
import { CustomerCardView } from '@/components/customers/customer-card-view'
import { formatDate } from '@/lib/utils'
import type { Customer, Project, Contract, Product, Payment } from '@/lib/types'
import { 
  Search, 
  Users,
  CheckCircle,
  Clock,
  Star,
  PhoneCall,
  Calendar,
  BarChart3,
  PieChart,
  SlidersHorizontal,
  ArrowUpDown,
  CreditCard,
  AlertCircle,
  Bell,
  Tag,
  Building2,
  UserPlus,
  User
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  
  // Filter and sort states
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [satisfactionFilter, setSatisfactionFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'name' | 'projects' | 'revenue'>('latest')

  // Data states
  const [mockCustomers, setMockCustomers] = useState<Customer[]>([])
  const [mockProjects, setMockProjects] = useState<Project[]>([])
  const [mockContracts, setMockContracts] = useState<Contract[]>([])
  const [mockPayments, setMockPayments] = useState<Payment[]>([])
  const [mockProducts, setMockProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const mockData = await import('@/lib/mock-data')
        const mockSettings = await import('@/lib/mock/settings')
        
        setMockCustomers(mockData.mockCustomers)
        setMockProjects(mockData.mockProjects)
        setMockContracts(mockData.mockContracts)
        setMockPayments(mockData.mockPayments)
        setMockProducts(mockSettings.mockProducts)
        setIsLoading(false)
      } catch (error) {
        const { handleError } = await import('@/lib/utils/error-handling')
        handleError(error, '고객 데이터 로딩')
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])

  // 현재 진행 단계 계산
  const getCurrentStage = (customer: Customer, projects: Project[], _contracts: unknown[]) => {
    const activeProjects = projects.filter(p => 
      p.projectStatus !== 'completed' && p.projectStatus !== 'delivered' && p.projectStatus !== 'cancelled'
    )
    
    if (activeProjects.length === 0) {
      const hasCompleted = projects.some(p => p.projectStatus === 'completed' || p.projectStatus === 'delivered')
      return hasCompleted ? { label: '완료', color: 'bg-green-100 text-green-800 border-green-200' } : 
             { label: '대기', color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }

    // 가장 진행 중인 프로젝트의 상태로 판단
    const mostRecentActive = activeProjects[0]
    const status = mostRecentActive.projectStatus
    
    if (status === 'scheduled') return { label: '촬영 예정', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    if (status === 'in_progress') return { label: '촬영 중', color: 'bg-purple-100 text-purple-800 border-purple-200' }
    if (status === 'proof_ready') return { label: '시안 확인', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    if (status === 'editing') return { label: '편집 중', color: 'bg-orange-100 text-orange-800 border-orange-200' }
    
    return { label: '진행 중', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  }

  // 입금 상태 확인 (Payment 데이터 기반)
  const getPaymentStatus = (customer: Customer, contracts: Contract[]) => {
    const customerContracts = contracts.filter(c => c.customerId === customer.id)
    if (customerContracts.length === 0) return { paid: 0, total: 0, percent: 0, methods: [] }
    
    // 고객의 총 계약 금액
    const totalAmount = customerContracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0)
    
    // 고객의 계약들에 대한 실제 입금된 금액 (Payment 집계)
    const contractIds = customerContracts.map(c => c.id)
    const completedPayments = mockPayments
      .filter(p => contractIds.includes(p.contractId) && p.paymentStatus === 'completed')
    
    const paidAmount = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const percent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0
    
    // 결제 방식 수집 (중복 제거)
    const paymentMethods = [...new Set(completedPayments.map(p => p.paymentMethod))]
    
    return { 
      paid: paidAmount / 10000, 
      total: totalAmount / 10000, 
      percent,
      methods: paymentMethods
    }
  }

  // 일정 미확정 여부 확인 (고객용 페이지를 통한 신청 후 일정 미확정)
  const isScheduleUnconfirmed = (customer: Customer, projects: Project[]) => {
    // leadStatus가 'inquiry'이면 일정 미확정 (고객이 신청했지만 관리자가 아직 승인하지 않음)
    // 단, 작가가 배정되지 않은 프로젝트가 있으면 일정 미확정으로 간주
    if (customer.leadStatus === 'inquiry') {
      return true
    }
    
    // contracted 상태지만 작가가 배정되지 않은 프로젝트가 있는 경우도 일정 미확정
    const hasUnassignedProject = projects.some(p => 
      p.projectStatus === 'scheduled' && 
      (!p.assignedPhotographerIds || p.assignedPhotographerIds.length === 0)
    )
    
    return hasUnassignedProject
  }

  // 고객별 프로젝트 통계 계산
  const customersWithStats = mockCustomers.map(customer => {
    const customerProjects = mockProjects.filter(p => p.customerId === customer.id)
    const customerContracts = mockContracts.filter(c => c.customerId === customer.id)
    const completedProjects = customerProjects.filter(p => 
      p.projectStatus === 'completed' || p.projectStatus === 'delivered'
    ).length
    const activeProjects = customerProjects.filter(p => 
      p.projectStatus !== 'completed' && p.projectStatus !== 'delivered' && p.projectStatus !== 'cancelled'
    ).length
    const totalRevenue = customerContracts.reduce((sum, c) => sum + (c.totalAmount || 0), 0)
    const scheduleUnconfirmed = isScheduleUnconfirmed(customer, customerProjects)

    return {
      ...customer,
      totalProjects: customerProjects.length,
      completedProjects,
      activeProjects,
      totalRevenue: totalRevenue / 10000, // 만원 단위로 변환
      latestProject: customerProjects[0] as Project | undefined,
      currentStage: getCurrentStage(customer, customerProjects, customerContracts),
      paymentStatus: getPaymentStatus(customer, mockContracts),
      scheduleUnconfirmed // 일정 미확정 여부
    }
  })

  // 검색 및 필터링, 정렬
  const filteredCustomers = useMemo(() => {
    let filtered = [...customersWithStats]
    
    // Active/Completed filter based on tab
    if (activeTab === 'active') {
      // 진행 중: 진행 중인 프로젝트가 있거나 일정 미확정인 고객
      filtered = filtered.filter(c => c.activeProjects > 0 || c.scheduleUnconfirmed)
    } else if (activeTab === 'completed') {
      // 완료: 진행 중인 프로젝트가 없고, 완료된 프로젝트가 있으며, 일정 미확정이 아닌 고객
      filtered = filtered.filter(c => c.activeProjects === 0 && c.completedProjects > 0 && !c.scheduleUnconfirmed)
    }
    
    // Search filter
    if (searchQuery) {
      const searchTerm = searchQuery.toLowerCase()
      filtered = filtered.filter(customer =>
        customer.groomName.toLowerCase().includes(searchTerm) ||
        customer.brideName.toLowerCase().includes(searchTerm) ||
        customer.groomPhone?.includes(searchTerm) ||
        customer.bridePhone?.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Stage filter
    if (stageFilter === 'unconfirmed') {
      // 일정 미확정 필터
      filtered = filtered.filter(c => c.scheduleUnconfirmed)
    } else if (stageFilter !== 'all') {
      filtered = filtered.filter(c => c.currentStage.label === stageFilter)
    }
    
    // Satisfaction filter (based on mock data, assuming 4-5 stars for completed projects)
    if (satisfactionFilter !== 'all') {
      filtered = filtered.filter(c => {
        // Mock satisfaction based on completion status
        const hasCompleted = c.completedProjects > 0
        const avgRating = hasCompleted ? 4.5 : 0 // Simplified mock rating
        if (satisfactionFilter === '4+') return avgRating >= 4
        if (satisfactionFilter === '3') return avgRating >= 3 && avgRating < 4
        if (satisfactionFilter === '2-') return avgRating < 3 && avgRating > 0
        return true
      })
    }
    
    // Source type filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(c => c.sourceType === sourceFilter)
    }
    
    // Sorting - 일정 미확정 고객이 항상 최우선
    filtered.sort((a, b) => {
      // 1순위: 일정 미확정 고객을 최상단에
      if (a.scheduleUnconfirmed && !b.scheduleUnconfirmed) return -1
      if (!a.scheduleUnconfirmed && b.scheduleUnconfirmed) return 1
      
      // 2순위: 선택한 정렬 기준
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'name':
          return a.groomName.localeCompare(b.groomName)
        case 'projects':
          return b.totalProjects - a.totalProjects
        case 'revenue':
          return b.totalRevenue - a.totalRevenue
        default:
          return 0
      }
    })
    
    return filtered
  }, [customersWithStats, searchQuery, stageFilter, satisfactionFilter, sourceFilter, sortBy, activeTab])

  // KPI 계산
  const totalCustomers = customersWithStats.length
  const activeCustomers = customersWithStats.filter(c => c.activeProjects > 0).length
  const completedCustomers = customersWithStats.filter(c => c.completedProjects > 0 && c.activeProjects === 0).length
  const unconfirmedCustomers = customersWithStats.filter(c => c.scheduleUnconfirmed).length
  const totalRevenue = customersWithStats.reduce((sum, c) => sum + c.totalRevenue, 0)
  const avgRevenue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
  
  // 고객만족도 계산 (완료된 고객만)
  const completedCustomersWithSatisfaction = mockCustomers.filter(c => c.leadStatus === 'completed' && c.satisfaction)
  const avgSatisfaction = completedCustomersWithSatisfaction.length > 0
    ? completedCustomersWithSatisfaction.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / completedCustomersWithSatisfaction.length
    : 0
  
  // 단계별 분포
  const stageDistribution = {
    '촬영 예정': customersWithStats.filter(c => c.currentStage.label === '촬영 예정').length,
    '촬영 중': customersWithStats.filter(c => c.currentStage.label === '촬영 중').length,
    '시안 확인': customersWithStats.filter(c => c.currentStage.label === '시안 확인').length,
    '편집 중': customersWithStats.filter(c => c.currentStage.label === '편집 중').length,
    '완료': customersWithStats.filter(c => c.currentStage.label === '완료').length,
  }
  
  // 유입 경로별 분포
  const sourceDistribution = {
    'client-direct': customersWithStats.filter(c => c.sourceType === 'client-direct').length,
    'venue-referral': customersWithStats.filter(c => c.sourceType === 'venue-referral').length,
    'manual-registration': customersWithStats.filter(c => c.sourceType === 'manual-registration').length,
  }

  const handleViewCustomer = (customer: typeof customersWithStats[0]) => {
    setSelectedCustomer(customer)
    setDetailDialogOpen(true)
  }

  const handleCheckPayment = (customer: typeof customersWithStats[0], e?: React.MouseEvent) => {
    e?.stopPropagation() // 행 클릭 이벤트 전파 방지
    
    // 고객의 가장 최근 계약 찾기
    const customerContracts = mockContracts.filter(c => c.customerId === customer.id)
    if (customerContracts.length === 0) {
      toast.error('계약 정보가 없습니다')
      return
    }
    
    // 가장 최근 계약
    const latestContract = customerContracts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    
    setSelectedContract(latestContract)
    setPaymentDialogOpen(true)
  }

  const handlePaymentUpdate = (updatedPayments: Payment[]) => {
    setMockPayments(updatedPayments)
    toast.success('입금 정보가 업데이트되었습니다')
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              고객 관리
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              고객 정보와 진행 상황을 관리하세요
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-5 animate-in fade-in slide-in-from-bottom duration-300">
          <KPICard
            title="전체 고객"
            value={totalCustomers}
            description="총 등록 고객 수"
            icon={Users}
            valueClassName="group-hover:text-blue-600"
            onClick={() => {}}
          />
          
          {/* 일정 미확정 고객 - 긴급 알림 */}
          <div 
            onClick={() => {
              setActiveTab('active')
              setStageFilter('unconfirmed')
            }}
            className="cursor-pointer"
          >
            <KPICard
              title="일정 미확정"
              value={unconfirmedCustomers}
              description={unconfirmedCustomers > 0 ? "⚠️ 긴급 확인 필요" : "모두 확정됨"}
              icon={unconfirmedCustomers > 0 ? AlertCircle : CheckCircle}
              valueClassName={cn(
                unconfirmedCustomers > 0 ? "text-red-700 animate-pulse" : "text-green-600"
              )}
              className={cn(
                unconfirmedCustomers > 0 && "ring-2 ring-red-300 bg-gradient-to-br from-red-50 to-white hover:ring-red-400"
              )}
              onClick={() => {}}
            />
          </div>
          
          <KPICard
            title="진행 중"
            value={activeCustomers}
            description="현재 진행 중인 고객"
            icon={Clock}
            valueClassName="text-blue-600"
            onClick={() => {}}
          />
          
          <KPICard
            title="완료"
            value={completedCustomers}
            description="촬영 완료 고객"
            icon={CheckCircle}
            valueClassName="text-green-600"
            onClick={() => {}}
          />
          
          <KPICard
            title="고객만족도"
            value={avgSatisfaction > 0 ? `${avgSatisfaction.toFixed(1)} / 5.0` : '-'}
            description={completedCustomersWithSatisfaction.length > 0 ? `${completedCustomersWithSatisfaction.length}명 평가` : '평가 없음'}
            icon={Star}
            valueClassName="text-yellow-600"
            onClick={() => setActiveTab('completed')}
          />
        </div>

        {/* 유입 경로 통계 */}
        <Card className="border border-zinc-200 bg-white animate-in fade-in slide-in-from-bottom duration-400">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-zinc-600" />
              유입 경로별 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setActiveTab('active')
                  setSourceFilter('client-direct')
                }}
                className="group p-4 bg-zinc-50 border-2 border-zinc-200 rounded-lg hover:border-zinc-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="h-4 w-4 text-zinc-600" />
                  <span className="text-xs font-medium text-zinc-600">고객 직접 문의</span>
                </div>
                <div className="text-2xl font-bold text-zinc-900 group-hover:text-zinc-700">
                  {sourceDistribution['client-direct']}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {totalCustomers > 0 ? Math.round((sourceDistribution['client-direct'] / totalCustomers) * 100) : 0}%
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('active')
                  setSourceFilter('venue-referral')
                }}
                className="group p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700">웨딩홀/플래너</span>
                </div>
                <div className="text-2xl font-bold text-blue-900 group-hover:text-blue-700">
                  {sourceDistribution['venue-referral']}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {totalCustomers > 0 ? Math.round((sourceDistribution['venue-referral'] / totalCustomers) * 100) : 0}%
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('active')
                  setSourceFilter('manual-registration')
                }}
                className="group p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-700">수동 등록</span>
                </div>
                <div className="text-2xl font-bold text-purple-900 group-hover:text-purple-700">
                  {sourceDistribution['manual-registration']}
                </div>
                <div className="text-xs text-purple-600 mt-1">
                  {totalCustomers > 0 ? Math.round((sourceDistribution['manual-registration'] / totalCustomers) * 100) : 0}%
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Active and Completed */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')} className="animate-in fade-in slide-in-from-bottom duration-500">
          <TabsList className="grid w-full max-w-xl grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              진행 중 ({activeCustomers + unconfirmedCustomers})
              {unconfirmedCustomers > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 min-w-5 text-xs animate-pulse">
                  {unconfirmedCustomers}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              완료 ({completedCustomers})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {/* Filters & Sort */}
            <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search & Sort Row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="고객명, 연락처, 이메일로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 focus-ring"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">최신 등록순</SelectItem>
                        <SelectItem value="name">고객명순</SelectItem>
                        <SelectItem value="projects">프로젝트 많은순</SelectItem>
                        <SelectItem value="revenue">매출 높은순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Filter Row */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="font-medium">필터:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select value={stageFilter} onValueChange={setStageFilter}>
                      <SelectTrigger className={cn(
                        stageFilter === 'unconfirmed' && "ring-2 ring-red-300 bg-red-50"
                      )}>
                        <SelectValue placeholder="진행 단계" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 단계</SelectItem>
                        <SelectItem value="unconfirmed" className="text-red-600 font-semibold">
                          ⚠️ 일정 미확정 ({unconfirmedCustomers})
                        </SelectItem>
                        <SelectItem value="촬영 예정">촬영 예정</SelectItem>
                        <SelectItem value="촬영 중">촬영 중</SelectItem>
                        <SelectItem value="시안 확인">시안 확인</SelectItem>
                        <SelectItem value="편집 중">편집 중</SelectItem>
                        <SelectItem value="완료">완료</SelectItem>
                        <SelectItem value="대기">대기</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="유입 경로" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 유입 경로</SelectItem>
                        <SelectItem value="client-direct">고객 직접 문의</SelectItem>
                        <SelectItem value="venue-referral">웨딩홀/플래너 제휴</SelectItem>
                        <SelectItem value="manual-registration">수동 등록</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={satisfactionFilter} onValueChange={setSatisfactionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="만족도" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">모든 만족도</SelectItem>
                        <SelectItem value="4+">⭐ 4점 이상</SelectItem>
                        <SelectItem value="3">⭐ 3점대</SelectItem>
                        <SelectItem value="2-">⭐ 3점 미만</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Active Filters */}
                  {(stageFilter !== 'all' || satisfactionFilter !== 'all' || searchQuery) && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">활성 필터:</span>
                      {searchQuery && (
                        <Badge variant="secondary" className="gap-1">
                          검색: {searchQuery}
                          <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-foreground">×</button>
                        </Badge>
                      )}
                      {stageFilter === 'unconfirmed' && (
                        <Badge variant="destructive" className="gap-1 animate-pulse">
                          ⚠️ 일정 미확정
                          <button onClick={() => setStageFilter('all')} className="ml-1 hover:text-foreground">×</button>
                        </Badge>
                      )}
                      {stageFilter !== 'all' && stageFilter !== 'unconfirmed' && (
                        <Badge variant="secondary" className="gap-1">
                          단계: {stageFilter}
                          <button onClick={() => setStageFilter('all')} className="ml-1 hover:text-foreground">×</button>
                        </Badge>
                      )}
                      {satisfactionFilter !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                          만족도: {satisfactionFilter === '4+' ? '4점 이상' : satisfactionFilter === '3' ? '3점대' : '3점 미만'}
                          <button onClick={() => setSatisfactionFilter('all')} className="ml-1 hover:text-foreground">×</button>
                        </Badge>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSearchQuery('')
                          setStageFilter('all')
                          setSatisfactionFilter('all')
                        }}
                        className="h-6 text-xs"
                      >
                        전체 초기화
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customers Table */}
            <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>고객 목록</span>
                  <Badge variant="secondary">{filteredCustomers.length}명</Badge>
                </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="md:hidden">
              <CustomerCardView
                customers={filteredCustomers}
                products={mockProducts}
                onCustomerClick={handleViewCustomer}
                onPaymentClick={handleCheckPayment}
              />
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>고객명</TableHead>
                    <TableHead>대표 연락처</TableHead>
                    <TableHead className="text-center">입력일</TableHead>
                    <TableHead className="text-center">촬영일</TableHead>
                    <TableHead className="text-center">상품타입</TableHead>
                    <TableHead className="text-center">패키지</TableHead>
                    <TableHead className="text-center">입금 상태</TableHead>
                    <TableHead className="text-center">일정 확정</TableHead>
                    <TableHead className="text-center">현재 단계</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer, idx) => (
                      <TableRow 
                        key={customer.id}
                        onClick={() => handleViewCustomer(customer)}
                        className={cn(
                          "cursor-pointer transition-all animate-in fade-in slide-in-from-bottom",
                          customer.scheduleUnconfirmed 
                            ? "bg-gradient-to-r from-red-50 via-red-25 to-transparent border-l-4 border-l-red-500 hover:from-red-100 hover:via-red-50" 
                            : "hover:bg-gradient-to-r hover:from-zinc-50 hover:to-transparent"
                        )}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {customer.scheduleUnconfirmed && (
                              <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
                            )}
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {customer.groomName} & {customer.brideName}
                              </div>
                              <div className="flex items-center gap-1">
                                {customer.sourceType === 'client-direct' && (
                                  <Badge variant="outline" className="text-xs bg-zinc-50 text-zinc-700 border-zinc-300">
                                    고객문의
                                  </Badge>
                                )}
                                {customer.sourceType === 'venue-referral' && (
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300">
                                    제휴
                                  </Badge>
                                )}
                                {customer.sourceType === 'manual-registration' && (
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                                    수동등록
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <PhoneCall className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">
                              {customer.groomPhone}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(customer.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.latestProject?.weddingDate ? (
                            <div className="text-xs font-medium text-blue-700">
                              {formatDate(customer.latestProject.weddingDate)}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.latestProject?.projectType ? (
                            <Badge variant="outline" className={
                              customer.latestProject.projectType === 'hanbok' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              customer.latestProject.projectType === 'dress_shop' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                              customer.latestProject.projectType === 'baby' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-zinc-50 text-zinc-700 border-zinc-200'
                            }>
                              {customer.latestProject.projectType === 'wedding' ? '웨딩' :
                               customer.latestProject.projectType === 'hanbok' ? '한복 & 캐주얼' :
                               customer.latestProject.projectType === 'dress_shop' ? '가봉 스냅' :
                               customer.latestProject.projectType === 'baby' ? '돌스냅' : '-'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.latestProject?.packageId ? (
                            <div className="text-xs font-medium">
                              {mockProducts.find(p => p.id === customer.latestProject?.packageId)?.name || customer.latestProject.packageId}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleCheckPayment(customer, e)}
                            className={cn(
                              "h-auto px-3 py-2 flex-col items-start",
                              customer.paymentStatus.percent === 100 ? "hover:bg-green-50" :
                              customer.paymentStatus.percent > 0 ? "hover:bg-orange-50" : "hover:bg-red-50"
                            )}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <CreditCard className={cn(
                                "h-4 w-4",
                                customer.paymentStatus.percent === 100 ? "text-green-600" :
                                customer.paymentStatus.percent > 0 ? "text-orange-600" : "text-red-600"
                              )} />
                              {customer.paymentStatus.total > 0 ? (
                                <div className="flex flex-col items-start">
                                  <span className={cn(
                                    "text-xs font-semibold",
                                    customer.paymentStatus.percent === 100 ? "text-green-700" :
                                    customer.paymentStatus.percent > 0 ? "text-orange-700" : "text-red-700"
                                  )}>
                                    {customer.paymentStatus.percent}%
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {customer.paymentStatus.paid.toLocaleString()}/{customer.paymentStatus.total.toLocaleString()}만
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </div>
                            {customer.paymentStatus.methods && customer.paymentStatus.methods.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap">
                                {customer.paymentStatus.methods.map((method, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className="text-xs px-1.5 py-0 h-5 bg-zinc-50 text-zinc-700 border-zinc-300"
                                  >
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.scheduleUnconfirmed ? (
                            <div className="flex flex-col gap-1 items-center">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border-2 border-red-300 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-600 animate-pulse" />
                                <span className="text-xs font-bold text-red-700">미확정</span>
                              </div>
                              <span className="text-xs text-red-600 font-medium">
                                승인 필요
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 items-center">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-semibold text-green-700">확정</span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={customer.currentStage.label} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            {/* Same content as active tab */}
            {/* Filters & Sort */}
            <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {/* Search & Sort Row */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="고객명, 연락처, 이메일로 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 focus-ring"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="정렬" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">최신 등록순</SelectItem>
                        <SelectItem value="name">고객명순</SelectItem>
                        <SelectItem value="projects">프로젝트 많은순</SelectItem>
                        <SelectItem value="revenue">매출 높은순</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Active Filters */}
                  {searchQuery && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">활성 필터:</span>
                      <Badge variant="secondary" className="gap-1">
                        검색: {searchQuery}
                        <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-foreground">×</button>
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Table */}
            <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[180px]">고객명</TableHead>
                    <TableHead className="w-[140px]">연락처</TableHead>
                    <TableHead className="w-[110px] text-center">상품타입</TableHead>
                    <TableHead className="w-[100px] text-center">패키지</TableHead>
                    <TableHead className="w-[100px] text-center">진행상태</TableHead>
                    <TableHead className="w-[90px] text-center">만족도</TableHead>
                    <TableHead className="w-[100px] text-center">입금현황</TableHead>
                    <TableHead className="w-[100px] text-right">매출</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        완료된 고객이 없습니다
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer, idx) => (
                      <TableRow 
                        key={customer.id}
                        onClick={() => handleViewCustomer(customer)}
                        className="cursor-pointer hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom"
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div>{customer.groomName} & {customer.brideName}</div>
                            <div className="text-xs text-muted-foreground">{customer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-1 text-zinc-700">
                              <PhoneCall className="h-3 w-3" />
                              {customer.groomPhone}
                            </div>
                            <div className="flex items-center gap-1 text-zinc-700">
                              <PhoneCall className="h-3 w-3" />
                              {customer.bridePhone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.latestProject?.projectType ? (
                            <Badge variant="outline" className={
                              customer.latestProject.projectType === 'hanbok' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              customer.latestProject.projectType === 'dress_shop' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                              customer.latestProject.projectType === 'baby' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              'bg-zinc-50 text-zinc-700 border-zinc-200'
                            }>
                              {customer.latestProject.projectType === 'wedding' ? '웨딩' :
                               customer.latestProject.projectType === 'hanbok' ? '한복 & 캐주얼' :
                               customer.latestProject.projectType === 'dress_shop' ? '가봉 스냅' :
                               customer.latestProject.projectType === 'baby' ? '돌스냅' : '-'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {customer.latestProject?.packageId ? (
                            <div className="text-xs font-medium">
                              {mockProducts.find(p => p.id === customer.latestProject?.packageId)?.name || customer.latestProject.packageId}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={customer.currentStage.color}>
                            {customer.currentStage.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {mockCustomers.find(c => c.id === customer.id)?.satisfaction ? (
                            <div className="flex items-center justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= (mockCustomers.find(c => c.id === customer.id)?.satisfaction || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">미평가</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <button
                            onClick={(e) => handleCheckPayment(customer, e)}
                            className="flex flex-col items-center gap-1 w-full hover:bg-muted rounded-lg p-2 transition-all focus-ring"
                          >
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              <span className={`text-xs font-medium ${
                                customer.paymentStatus.percent === 100 ? 'text-green-600' :
                                customer.paymentStatus.percent > 0 ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {customer.paymentStatus.percent}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all ${
                                  customer.paymentStatus.percent === 100 ? 'bg-green-600' :
                                  customer.paymentStatus.percent > 0 ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${customer.paymentStatus.percent}%` }}
                              />
                            </div>
                            {customer.paymentStatus.methods && customer.paymentStatus.methods.length > 0 && (
                              <div className="flex gap-1 mt-1 flex-wrap justify-center">
                                {customer.paymentStatus.methods.map((method, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant="outline" 
                                    className="text-xs px-1.5 py-0 h-4 bg-zinc-50 text-zinc-700 border-zinc-300"
                                  >
                                    {method}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </button>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {customer.totalRevenue.toLocaleString('ko-KR')}만원
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Customer Detail Dialog */}
      <CustomerDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        customer={selectedCustomer}
        onPaymentClick={(customer) => {
          setDetailDialogOpen(false)
          handleCheckPayment(customer)
        }}
      />

      <PaymentManagementDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        contract={selectedContract}
        payments={mockPayments}
        onPaymentUpdate={handlePaymentUpdate}
      />
    </AdminLayout>
  )
}

