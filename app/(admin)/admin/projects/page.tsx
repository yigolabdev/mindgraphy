'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/common/progress-bar'
import { DdayBadge } from '@/components/common/dday-badge'
import { AssignPhotographerDialog } from '@/components/projects/assign-photographer-dialog'
import { ProjectDetailDialog } from '@/components/projects/project-detail-dialog'
import { mockProjects } from '@/lib/mock-data'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'
import { Plus, Search, UserPlus, Eye } from 'lucide-react'
import { toast } from 'sonner'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{
    id: string
    name: string
    weddingDate: string
    currentPhotographerId?: string
  } | null>(null)
  const [viewingProject, setViewingProject] = useState<any | null>(null)

  const handleOpenAssignDialog = (project: any) => {
    setSelectedProject({
      id: project.id,
      name: `${project.customer?.groomName} & ${project.customer?.brideName}`,
      weddingDate: formatDate(project.weddingDate),
      currentPhotographerId: project.assignedPhotographers?.[0]?.user?.id
    })
    setAssignDialogOpen(true)
  }

  const handleOpenDetailDialog = (project: any) => {
    setViewingProject(project)
    setDetailDialogOpen(true)
  }

  const handleAssignPhotographer = (photographerId: string, photographerName: string) => {
    // TODO: Implement photographer assignment for multiple photographers
    console.log('Assign photographer:', photographerId, photographerName)
    setAssignDialogOpen(false)
  }

  return (
    <AdminLayout align="left">
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">촬영 관리</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              모든 웨딩 촬영을 관리하세요
            </p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            새 촬영 등록
          </Button>
        </div>

        {/* Projects List */}
        <div className="space-y-3 md:space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold">
                        {project.customer?.groomName} & {project.customer?.brideName}
                      </h3>
                      <Badge className={getStatusColor(project.projectStatus)}>
                        {getStatusLabel(project.projectStatus)}
                      </Badge>
                      <DdayBadge targetDate={project.weddingDate} showIcon={false} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">촬영번호:</span> {project.projectNumber}
                      </div>
                      <div>
                        <span className="font-medium">촬영일:</span> {formatDate(project.weddingDate)}
                      </div>
                      <div className="truncate">
                        <span className="font-medium">장소:</span> {project.weddingVenue}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">담당작가:</span>{' '}
                        {project.assignedPhotographers && project.assignedPhotographers.length > 0 ? (
                          <span className="text-foreground">
                            {project.assignedPhotographers.filter((p) => p && p.user).map((p, idx, arr) => (
                              <span key={p.id}>
                                {p.user!.lastName}{p.user!.firstName}
                                {idx < arr.length - 1 && ', '}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-300 bg-orange-50">
                            미배정
                          </Badge>
                        )}
                      </div>
                    </div>

                    <ProgressBar value={project.progress} showLabel={true} />
                  </div>

                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => handleOpenAssignDialog(project)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {project.assignedPhotographers && project.assignedPhotographers.length > 0 ? '작가 변경' : '작가 배정'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleOpenDetailDialog(project)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      상세보기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Assign Photographer Dialog */}
      <AssignPhotographerDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssignPhotographer={handleAssignPhotographer}
        currentPhotographerId={selectedProject?.currentPhotographerId}
        projectName={selectedProject?.name}
        weddingDate={selectedProject?.weddingDate}
      />

      {/* Project Detail Dialog */}
      <ProjectDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        project={viewingProject}
      />
    </AdminLayout>
  )
}

