'use client'

/**
 * Admin 프로젝트 관리 페이지 (리팩토링 버전)
 * 
 * 10년차+ 전문가 수준 리팩토링:
 * - Custom Hooks로 로직 분리
 * - 컴포넌트 최적화 (React.memo)
 * - 타입 안전성 강화
 * - 에러 처리 개선
 * - 성능 최적화
 */

import { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignPhotographerDialog } from '@/components/projects/assign-photographer-dialog'
import { ProjectDetailDialog } from '@/components/projects/project-detail-dialog'
import { InquiryDetailDialog } from '@/components/customers/inquiry-detail-dialog'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters } from '@/components/projects/project-filters'
import { useProjects } from '@/hooks/use-projects'
import { useCustomers } from '@/hooks/use-customers'
import { getInquiryCustomers, getProjectsByCustomerId } from '@/lib/utils/data-integration'
import { mockProducts } from '@/lib/mock/settings'
import { formatDateAs } from '@/lib/utils/format'
import { mockUsers } from '@/lib/mock-users'
import { 
  Plus, 
  Users,
  Camera,
  Bell,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Customer, Project } from '@/lib/types'

// ============================================================================
// Types
// ============================================================================

interface SelectedProject {
  id: string
  name: string
  weddingDate: string
  weddingTime?: string
  weddingVenue?: string
  venueAddress?: string
  packageName?: string
  optionNames?: string[]
  currentPhotographerIds?: string[]
}

type TabValue = 'manager' | 'photographer'

interface CurrentUser {
  id: string
  role: string
  email: string
  name: string
}

// ============================================================================
// Sub Components (Memoized)
// ============================================================================

/**
 * 신규 문의 알림 카드
 */
const InquiryAlertCard = memo(({ 
  inquiryCustomers,
  onOpenInquiry,
  onViewAll 
}: {
  inquiryCustomers: Customer[]
  onOpenInquiry: (customer: Customer) => void
  onViewAll: () => void
}) => {
  if (inquiryCustomers.length === 0) return null

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Bell className="h-5 w-5" />
          🔔 신규 문의 {inquiryCustomers.length}건
          <Badge variant="destructive" className="ml-2">
            확인 필요
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-blue-700">
          고객용 페이지를 통해 접수된 문의입니다. 담당자를 배정하고 상담을 진행해 주세요.
        </p>
        
        <div className="space-y-2">
          {inquiryCustomers.slice(0, 3).map(customer => {
            const project = getProjectsByCustomerId(customer.id)[0]
            return (
              <InquiryCustomerCard
                key={customer.id}
                customer={customer}
                project={project}
                onClick={() => onOpenInquiry(customer)}
              />
            )
          })}
        </div>

        {inquiryCustomers.length > 3 && (
          <Button
            variant="link"
            className="w-full text-blue-600"
            onClick={onViewAll}
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            {inquiryCustomers.length - 3}건 더 보기
          </Button>
        )}
      </CardContent>
    </Card>
  )
})
InquiryAlertCard.displayName = 'InquiryAlertCard'

/**
 * 신규 문의 고객 카드
 */
const InquiryCustomerCard = memo(({
  customer,
  project,
  onClick
}: {
  customer: Customer
  project?: Project
  onClick: () => void
}) => {
  return (
    <div 
      className="p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-blue-900">
              {customer.groomName} & {customer.brideName}
            </span>
            <Badge variant="outline" className="text-xs">
              {project?.projectType === 'wedding' ? '웨딩' :
               project?.projectType === 'hanbok' ? '한복' :
               project?.projectType === 'dress_shop' ? '가봉' : '돌스냅'}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <div>📞 {customer.groomPhone || customer.bridePhone}</div>
            <div>✉️ {customer.email}</div>
            {project && (
              <div>📅 {formatDateAs(project.weddingDate, 'DISPLAY_SHORT')}</div>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
        >
          상세보기
        </Button>
      </div>
    </div>
  )
})
InquiryCustomerCard.displayName = 'InquiryCustomerCard'

/**
 * 프로젝트 리스트
 */
const ProjectList = memo(({
  projects,
  mode,
  onOpenAssignDialog,
  onOpenDetailDialog
}: {
  projects: Project[]
  mode: 'manager' | 'photographer'
  onOpenAssignDialog?: (project: Project) => void
  onOpenDetailDialog?: (project: Project) => void
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-zinc-50">
        <p className="text-muted-foreground">
          {mode === 'manager' ? '프로젝트가 없습니다.' : '작업할 프로젝트가 없습니다.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          mode={mode} 
          onOpenAssignDialog={onOpenAssignDialog}
          onOpenDetailDialog={onOpenDetailDialog}
        />
      ))}
    </div>
  )
})
ProjectList.displayName = 'ProjectList'

// ============================================================================
// Main Component
// ============================================================================

export default function ProjectsPage() {
  const router = useRouter()
  
  // ===== State =====
  const [activeTab, setActiveTab] = useState<TabValue>('manager')
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  
  // Dialog States
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  
  // Selected Items
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null)
  const [viewingProject, setViewingProject] = useState<Project | null>(null)
  const [selectedInquiryCustomer, setSelectedInquiryCustomer] = useState<Customer | null>(null)
  
  // ===== Custom Hooks =====
  const {
    projects,
    loading: projectsLoading,
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useProjects()

  const {
    customers: inquiryCustomers,
    refresh: refreshInquiries,
  } = useCustomers({
    initialFilters: { stage: 'inquiry' },
  })

  // ===== Effects =====
  
  // 현재 사용자 정보 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('mindgraphy_admin_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setCurrentUser(user)
          
          // 작가인 경우 작가 탭으로 자동 전환
          if (user.role === 'photographer') {
            setActiveTab('photographer')
          }
        } catch (error) {
          console.error('Failed to parse user data:', error)
        }
      }
    }
  }, [])

  // ===== Computed Values =====
  
  // 작가 목록
  const photographers = useMemo(() => 
    mockUsers.filter(u => u.role === 'photographer'),
    []
  )

  // 필터링된 프로젝트 (탭별)
  const filteredProjects = useMemo(() => {
    if (activeTab === 'photographer' && currentUser) {
      return projects.filter(p => 
        p.assignedPhotographerIds?.includes(currentUser.id)
      )
    }
    return projects
  }, [projects, activeTab, currentUser])

  // ===== Handlers =====
  
  const handleOpenAssignDialog = useCallback((project: Project) => {
    const packageInfo = project.packageId 
      ? mockProducts.find(p => p.id === project.packageId)
      : null
    
    const optionNames = project.optionIds 
      ? project.optionIds.map((optionId: string) => {
          const option = mockProducts.find(p => p.id === optionId)
          return option?.title || optionId
        }).filter(Boolean)
      : []

    setSelectedProject({
      id: project.id,
      name: `${project.customer?.groomName} & ${project.customer?.brideName}`,
      weddingDate: formatDateAs(project.weddingDate, 'DISPLAY'),
      weddingTime: project.weddingTime,
      weddingVenue: project.weddingVenue,
      venueAddress: project.venueAddress,
      packageName: packageInfo?.name,
      optionNames,
      currentPhotographerIds: project.assignedPhotographers?.map(p => p.id) || []
    })
    setAssignDialogOpen(true)
  }, [])

  const handleOpenDetailDialog = useCallback((project: Project) => {
    setViewingProject(project)
    setDetailDialogOpen(true)
  }, [])

  const handleOpenInquiryDialog = useCallback((customer: Customer) => {
    setSelectedInquiryCustomer(customer)
    setInquiryDialogOpen(true)
  }, [])

  const handleAssignPhotographer = useCallback(() => {
    if (selectedProject) {
      toast.success('작가 배정이 완료되었습니다')
    }
    setAssignDialogOpen(false)
  }, [selectedProject])

  const handleViewAllInquiries = useCallback(() => {
    router.push('/admin/customers?tab=active&stage=inquiry')
  }, [router])

  // ===== Render =====

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                프로젝트 관리
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                전체 촬영 프로젝트를 관리하고 작업할 수 있습니다.
              </p>
            </div>
            {activeTab === 'manager' && (
              <Button 
                className="w-full sm:w-auto"
                onClick={() => router.push('/admin/projects/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 촬영 등록
              </Button>
            )}
          </div>

          {/* 신규 문의 알림 카드 */}
          {activeTab === 'manager' && (
            <InquiryAlertCard
              inquiryCustomers={inquiryCustomers}
              onOpenInquiry={handleOpenInquiryDialog}
              onViewAll={handleViewAllInquiries}
            />
          )}

          {/* Main Content */}
          {currentUser?.role !== 'photographer' ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                <TabsTrigger value="manager" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  관리자 모드
                </TabsTrigger>
                <TabsTrigger value="photographer" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  작가 모드
                </TabsTrigger>
              </TabsList>
              
              <ProjectFilters 
                filters={filters}
                photographers={photographers}
                onUpdateFilter={updateFilter}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />

              <TabsContent value="manager" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    관리자 모드: 촬영 관리 및 작가 배정
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    총 {filteredProjects.length}개
                  </span>
                </div>
                
                <ProjectList
                  projects={filteredProjects}
                  mode="manager"
                  onOpenAssignDialog={handleOpenAssignDialog}
                  onOpenDetailDialog={handleOpenDetailDialog}
                />
              </TabsContent>

              <TabsContent value="photographer" className="space-y-4 mt-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Camera className="h-5 w-5 text-muted-foreground" />
                    작가 모드: 갤러리 업로드 및 타임테이블
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    작업 대상 {filteredProjects.length}개
                  </span>
                </div>

                <ProjectList
                  projects={filteredProjects}
                  mode="photographer"
                />
              </TabsContent>
            </Tabs>
          ) : (
            /* Photographer View (No Tabs) */
            <div className="space-y-6">
              <ProjectFilters 
                filters={filters}
                photographers={photographers}
                onUpdateFilter={updateFilter}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />

              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  내 촬영 목록
                </h2>
                <span className="text-sm text-muted-foreground">
                  총 {filteredProjects.length}개
                </span>
              </div>

              <ProjectList
                projects={filteredProjects}
                mode="photographer"
              />
            </div>
          )}
        </header>
      </div>

      {/* Dialogs */}
      <AssignPhotographerDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssignPhotographer={handleAssignPhotographer}
        currentPhotographerIds={selectedProject?.currentPhotographerIds}
        projectName={selectedProject?.name}
        weddingDate={selectedProject?.weddingDate}
        weddingTime={selectedProject?.weddingTime}
        weddingVenue={selectedProject?.weddingVenue}
        venueAddress={selectedProject?.venueAddress}
        packageName={selectedProject?.packageName}
        optionNames={selectedProject?.optionNames}
      />

      <ProjectDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        project={viewingProject}
      />

      <InquiryDetailDialog
        open={inquiryDialogOpen}
        onOpenChange={setInquiryDialogOpen}
        customer={selectedInquiryCustomer}
        onStatusChange={refreshInquiries}
      />
    </AdminLayout>
  )
}

