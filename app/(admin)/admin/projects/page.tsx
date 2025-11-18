'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Card, CardContent } from '@/components/ui/card'
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
import { ProgressBar, DdayBadge, StatusBadge } from '@/components/common'
import { AssignPhotographerDialog } from '@/components/projects/assign-photographer-dialog'
import { ProjectDetailDialog } from '@/components/projects/project-detail-dialog'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { mockProjects } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'
import { Plus, Search, UserPlus, Eye, SlidersHorizontal, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { useMemo } from 'react'

export default function ProjectsPage() {
  const [projects, setProjects] = useState(mockProjects)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{
    id: string
    name: string
    weddingDate: string
    currentPhotographerIds?: string[]
  } | null>(null)
  const [viewingProject, setViewingProject] = useState<typeof mockProjects[0] | null>(null)
  
  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [photographerFilter, setPhotographerFilter] = useState<string>('all')
  const [packageFilter, setPackageFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'date' | 'progress' | 'name'>('latest')
  
  // Get unique photographers and packages for filters
  const photographers = useMemo(() => {
    const photoSet = new Set<string>()
    projects.forEach(p => {
      p.assignedPhotographers?.forEach(ph => {
        const name = ph.user ? `${ph.user.lastName}${ph.user.firstName}` : '미배정'
        photoSet.add(name)
      })
    })
    return Array.from(photoSet)
  }, [projects])
  
  // 모든 상품 유형을 하드코딩 (동적으로 추출하면 데이터에 없는 타입은 필터에 표시되지 않음)
  const allProjectTypes = ['wedding', 'hanbok', 'dress_shop', 'baby']
  
  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wedding': '일반 웨딩',
      'hanbok': '한복 & 캐주얼',
      'dress_shop': '가봉 스냅',
      'baby': '돌스냅',
    }
    return labels[type] || type
  }
  
  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.customer?.groomName?.toLowerCase().includes(query) ||
        p.customer?.brideName?.toLowerCase().includes(query) ||
        p.projectNumber?.toLowerCase().includes(query)
      )
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.projectStatus === statusFilter)
    }
    
    // Photographer filter
    if (photographerFilter !== 'all') {
      filtered = filtered.filter(p => 
        p.assignedPhotographers?.some(ph => {
          const name = ph.user ? `${ph.user.lastName}${ph.user.firstName}` : '미배정'
          return name === photographerFilter
        })
      )
    }
    
    // Package filter (using projectType)
    if (packageFilter !== 'all') {
      filtered = filtered.filter(p => p.projectType === packageFilter)
    }
    
    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'date':
          return new Date(a.weddingDate).getTime() - new Date(b.weddingDate).getTime()
        case 'progress':
          return (b.progress || 0) - (a.progress || 0)
        case 'name':
          return (a.customer?.groomName || '').localeCompare(b.customer?.groomName || '')
        default:
          return 0
      }
    })
    
    return filtered
  }, [projects, searchQuery, statusFilter, photographerFilter, packageFilter, sortBy])

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
      // TODO: Implement actual API call to update photographers
      // API would persist photographer assignments to database
      
      // Mock update for UI feedback
      // In real implementation, this would be done on the backend
      toast.success('작가 배정이 완료되었습니다')
    }
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
              모든 웨딩 촬영을 관리하세요 • 총 {filteredProjects.length}개
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            새 촬영 등록
          </Button>
        </div>

        {/* Filters & Sort */}
        <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Search & Sort Row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="고객명 또는 촬영번호 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 focus-ring"
                  />
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신 등록순</SelectItem>
                    <SelectItem value="date">촬영 날짜순</SelectItem>
                    <SelectItem value="progress">진행률 높은순</SelectItem>
                    <SelectItem value="name">고객명순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Filter Row */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="font-medium">필터:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 상태</SelectItem>
                    <SelectItem value="reserved">예약</SelectItem>
                    <SelectItem value="in_progress">진행중</SelectItem>
                    <SelectItem value="editing">편집중</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={photographerFilter} onValueChange={setPhotographerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="작가" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 작가</SelectItem>
                    {photographers.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={packageFilter} onValueChange={setPackageFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="촬영 유형" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    {allProjectTypes.map(type => (
                      <SelectItem key={type} value={type}>{getProjectTypeLabel(type)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Active Filters */}
              {(statusFilter !== 'all' || photographerFilter !== 'all' || packageFilter !== 'all' || searchQuery) && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">활성 필터:</span>
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      검색: {searchQuery}
                      <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-foreground">×</button>
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      상태: {statusFilter}
                      <button onClick={() => setStatusFilter('all')} className="ml-1 hover:text-foreground">×</button>
                    </Badge>
                  )}
                  {photographerFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      작가: {photographerFilter}
                      <button onClick={() => setPhotographerFilter('all')} className="ml-1 hover:text-foreground">×</button>
                    </Badge>
                  )}
                  {packageFilter !== 'all' && (
                    <Badge variant="secondary" className="gap-1">
                      유형: {getProjectTypeLabel(packageFilter)}
                      <button onClick={() => setPackageFilter('all')} className="ml-1 hover:text-foreground">×</button>
                    </Badge>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                      setPhotographerFilter('all')
                      setPackageFilter('all')
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

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <Card className="border-0 ring-1 ring-zinc-200/50">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-sm text-muted-foreground mb-4">
                다른 검색어나 필터를 사용해보세요
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                  setPhotographerFilter('all')
                  setPackageFilter('all')
                }}
              >
                필터 초기화
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredProjects.map((project, idx) => (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 ring-1 ring-zinc-200/50 animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <CardContent className="pt-4 md:pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap">
                      <h3 className="text-base md:text-lg font-semibold">
                        {project.customer?.groomName} & {project.customer?.brideName}
                      </h3>
                      <StatusBadge status={project.projectStatus} />
                      <DdayBadge targetDate={project.weddingDate} showIcon={false} />
                      {project.projectType && (
                        <Badge 
                          variant="outline" 
                          className={
                            project.projectType === 'hanbok' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            project.projectType === 'dress_shop' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                            project.projectType === 'baby' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-zinc-50 text-zinc-700 border-zinc-200'
                          }
                        >
                          {getProjectTypeLabel(project.projectType)}
                        </Badge>
                      )}
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
                      className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm"
                      onClick={() => handleOpenAssignDialog(project)}
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      {project.assignedPhotographers && project.assignedPhotographers.length > 0 ? '작가 변경' : '작가 배정'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm"
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
        )}
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => {
          // TODO: 실제로는 프로젝트 목록을 새로고침해야 함
          toast.success('프로젝트가 생성되었습니다')
        }}
      />

      {/* Assign Photographer Dialog */}
      <AssignPhotographerDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onAssignPhotographer={handleAssignPhotographer}
        currentPhotographerIds={selectedProject?.currentPhotographerIds}
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

