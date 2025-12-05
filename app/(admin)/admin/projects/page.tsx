'use client'

import { useState, useEffect } from 'react'
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
import { useProjectList } from '@/components/projects/use-project-list'
import { getAllProjects, getInquiryCustomers, getProjectsByCustomerId } from '@/lib/utils/data-integration'
import { useDataSync } from '@/lib/utils/sync'
import { mockProducts } from '@/lib/mock/settings'
import { formatDateAs } from '@/lib/utils/format'
import { 
  Plus, 
  Users,
  Camera,
  Bell,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Customer } from '@/lib/types'

export default function ProjectsPage() {
  const router = useRouter()
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [inquiryDialogOpen, setInquiryDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('manager')
  
  const [selectedProject, setSelectedProject] = useState<{
    id: string
    name: string
    weddingDate: string
    weddingTime?: string
    weddingVenue?: string
    venueAddress?: string
    packageName?: string
    optionNames?: string[]
    currentPhotographerIds?: string[]
  } | null>(null)
  const [viewingProject, setViewingProject] = useState<typeof allProjects[0] | null>(null)
  const [selectedInquiryCustomer, setSelectedInquiryCustomer] = useState<Customer | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; email: string; name: string } | null>(null)
  
  // 통합 데이터 사용
  const [allProjects, setAllProjects] = useState(getAllProjects())
  const [inquiryCustomers, setInquiryCustomers] = useState(getInquiryCustomers())
  
  // BroadcastChannel 실시간 동기화
  const { subscribe } = useDataSync()

  // Use custom hook for project logic
  const { 
    projects: filteredProjects, 
    filters, 
    photographers, 
    updateFilter, 
    resetFilters, 
    hasActiveFilters 
  } = useProjectList(allProjects, currentUser, activeTab)

  // Get current user info from session storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = sessionStorage.getItem('mindgraphy_admin_user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          setCurrentUser(user)
          // If user is photographer, default to photographer tab
          if (user.role === 'photographer') {
            setActiveTab('photographer')
          }
        } catch (error) {
          console.error('Failed to parse user data:', error)
        }
      }
    }
  }, [])

  // 데이터 동기화 리스너
  useEffect(() => {
    const unsubscribe = subscribe('ALL', (message) => {
      console.log('[Projects] Data sync message received:', message.type)
      
      // 데이터 새로고침
      setAllProjects(getAllProjects())
      setInquiryCustomers(getInquiryCustomers())
    })

    return unsubscribe
  }, [subscribe])
  
  const handleOpenAssignDialog = (project: typeof allProjects[0]) => {
    // Get package and options info
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
      packageName: packageInfo?.name,
      optionNames,
      currentPhotographerIds: project.assignedPhotographers?.map(p => p.id) || []
    })
    setAssignDialogOpen(true)
  }

  const handleOpenDetailDialog = (project: typeof allProjects[0]) => {
    setViewingProject(project)
    setDetailDialogOpen(true)
  }

  const handleOpenInquiryDialog = (customer: Customer) => {
    setSelectedInquiryCustomer(customer)
    setInquiryDialogOpen(true)
  }

  const handleAssignPhotographer = (photographers: Array<{id: string, name: string, role: string}>) => {
    if (selectedProject) {
      toast.success('작가 배정이 완료되었습니다')
    }
    setAssignDialogOpen(false)
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-0">
        {/* Header */}
        <div className="flex flex-col gap-4">
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

          {/* 신규 문의 알림 카드 - 조건부 렌더링 ✅ */}
          {activeTab === 'manager' && inquiryCustomers.length > 0 && (
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
                      <div 
                        key={customer.id}
                        className="p-3 bg-white border border-blue-100 rounded-lg hover:border-blue-300 transition-colors"
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
                            onClick={() => handleOpenInquiryDialog(customer)}
                          >
                            상세보기
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {inquiryCustomers.length > 3 && (
                  <Button
                    variant="link"
                    className="w-full text-blue-600"
                    onClick={() => router.push('/admin/customers?tab=active&stage=inquiry')}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    {inquiryCustomers.length - 3}건 더 보기
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Main Content */}
          {currentUser?.role !== 'photographer' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                
                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-zinc-50">
                    <p className="text-muted-foreground">프로젝트가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        mode="manager" 
                        onOpenAssignDialog={handleOpenAssignDialog}
                        onOpenDetailDialog={handleOpenDetailDialog}
                      />
                    ))}
                  </div>
                )}
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

                {filteredProjects.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-zinc-50">
                    <p className="text-muted-foreground">작업할 프로젝트가 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        mode="photographer" 
                      />
                    ))}
                  </div>
                )}
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

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-zinc-50">
                  <p className="text-muted-foreground">작업할 프로젝트가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      mode="photographer" 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
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
        onStatusChange={() => {
          // 데이터 새로고침
          setInquiryCustomers(getInquiryCustomers())
        }}
      />
    </AdminLayout>
  )
}
