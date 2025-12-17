'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

  // 역할에 따라 자동으로 모드 결정
  const activeTab = currentUser?.role === 'photographer' ? 'photographer' : 'manager'

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
                {currentUser?.role === 'photographer' 
                  ? '내 촬영 프로젝트를 확인하고 작업할 수 있습니다.'
                  : '전체 촬영 프로젝트를 관리하고 작업할 수 있습니다.'}
              </p>
            </div>
            {currentUser?.role !== 'photographer' && (
              <Button 
                className="w-full sm:w-auto"
                onClick={() => router.push('/admin/projects/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 촬영 등록
              </Button>
            )}
          </div>

          {/* Main Content - 역할에 따라 자동으로 적절한 모드 표시 */}
          <div className="space-y-6">
            <ProjectFilters 
              filters={filters}
              photographers={photographers}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {currentUser?.role === 'photographer' ? (
              /* 작가 모드 */
              <>
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
              </>
            ) : (
              /* 관리자 모드 */
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    촬영 관리 및 작가 배정
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
              </>
            )}
          </div>
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
