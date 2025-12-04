import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProgressBar, DdayBadge, StatusBadge } from '@/components/common'
import { formatDate } from '@/lib/utils'
import { 
  UserPlus, 
  Eye, 
  Upload, 
  ClipboardList,
} from 'lucide-react'
import { Project } from '@/lib/types'

interface ProjectCardProps {
  project: any // Replace with actual Project type
  mode: 'manager' | 'photographer'
  onOpenAssignDialog?: (project: any) => void
  onOpenDetailDialog?: (project: any) => void
}

export function ProjectCard({ 
  project, 
  mode, 
  onOpenAssignDialog, 
  onOpenDetailDialog 
}: ProjectCardProps) {
  
  const getProjectTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'wedding': '웨딩',
      'hanbok': '한복 & 캐주얼',
      'dress_shop': '가봉 스냅',
      'baby': '돌스냅',
    }
    return labels[type] || type
  }

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] border-0 ring-1 ring-zinc-200/50 animate-in fade-in slide-in-from-bottom"
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
                    {project.assignedPhotographers.filter((p: any) => p && p.user).map((p: any, idx: number, arr: any[]) => (
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
            {mode === 'manager' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm"
                  onClick={() => onOpenAssignDialog?.(project)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {project.assignedPhotographers && project.assignedPhotographers.length > 0 ? '작가 변경' : '작가 배정'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm"
                  onClick={() => onOpenDetailDialog?.(project)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  상세보기
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = `/admin/gallery/${project.id}/upload`}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  웹 갤러리
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.location.href = `/admin/timetable/${project.id}`}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  타임테이블
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={() => window.location.href = `/admin/gallery/${project.id}/upload`}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  웹 갤러리 업로드
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full sm:w-auto focus-ring transition-all hover:shadow-sm border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => window.location.href = `/admin/timetable/${project.id}`}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  타임 테이블 관리
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

