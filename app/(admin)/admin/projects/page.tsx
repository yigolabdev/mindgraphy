'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AssignPhotographerDialog } from '@/components/projects/assign-photographer-dialog'
import { ProjectDetailDialog } from '@/components/projects/project-detail-dialog'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFilters } from '@/components/projects/project-filters'
import { useProjectList } from '@/components/projects/use-project-list'
import { mockProjects } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { 
  Plus, 
  Users,
  Camera,
} from 'lucide-react'
import { toast } from 'sonner'

export default function ProjectsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('manager')
  
  const [selectedProject, setSelectedProject] = useState<{
    id: string
    name: string
    weddingDate: string
    currentPhotographerIds?: string[]
  } | null>(null)
  const [viewingProject, setViewingProject] = useState<typeof mockProjects[0] | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string; email: string; name: string } | null>(null)
  
  // Use custom hook for project logic
  const { 
    projects: filteredProjects, 
    filters, 
    photographers, 
    updateFilter, 
    resetFilters, 
    hasActiveFilters 
  } = useProjectList(mockProjects, currentUser, activeTab)

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
  
  const handleOpenAssignDialog = (project: typeof mockProjects[0]) => {
    setSelectedProject({
      id: project.id,
      name: `${project.customer?.groomName} & ${project.customer?.brideName}`,
      weddingDate: formatDate(project.weddingDate),
      currentPhotographerIds: project.assignedPhotographers?.map(p => p.id) || []
    })
    setAssignDialogOpen(true)
  }

  const handleOpenDetailDialog = (project: typeof mockProjects[0]) => {
    setViewingProject(project)
    setDetailDialogOpen(true)
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
                onClick={() => setCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                새 촬영 등록
              </Button>
            )}
          </div>

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
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => toast.success('프로젝트가 생성되었습니다')}
      />

      <AssignPhotographerDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssignPhotographer={handleAssignPhotographer}
        currentPhotographerIds={selectedProject?.currentPhotographerIds}
        projectName={selectedProject?.name}
        weddingDate={selectedProject?.weddingDate}
      />

      <ProjectDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        project={viewingProject}
      />
    </AdminLayout>
  )
}
