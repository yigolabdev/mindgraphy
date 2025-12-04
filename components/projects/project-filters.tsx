import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import { ProjectFilterState } from './use-project-list'

interface ProjectFiltersProps {
  filters: ProjectFilterState
  photographers: string[]
  onUpdateFilter: (key: keyof ProjectFilterState, value: string) => void
  onResetFilters: () => void
  hasActiveFilters: boolean
}

export function ProjectFilters({
  filters,
  photographers,
  onUpdateFilter,
  onResetFilters,
  hasActiveFilters
}: ProjectFiltersProps) {
  const allProjectTypes = ['wedding', 'hanbok', 'dress_shop', 'baby']
  
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
    <Card className="border-0 ring-1 ring-zinc-200/50 shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="고객명 또는 촬영번호 검색..."
                value={filters.searchQuery}
                onChange={(e) => onUpdateFilter('searchQuery', e.target.value)}
                className="pl-9 focus-ring"
              />
            </div>
            <Select 
              value={filters.sortBy} 
              onValueChange={(v) => onUpdateFilter('sortBy', v)}
            >
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
          
          {/* Filter Label */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-medium">필터:</span>
          </div>

          {/* Bottom Row: Specific Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select 
              value={filters.statusFilter} 
              onValueChange={(v) => onUpdateFilter('statusFilter', v)}
            >
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
            
            <Select 
              value={filters.photographerFilter} 
              onValueChange={(v) => onUpdateFilter('photographerFilter', v)}
            >
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
            
            <Select 
              value={filters.packageFilter} 
              onValueChange={(v) => onUpdateFilter('packageFilter', v)}
            >
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

          {/* Reset Button */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onResetFilters}
                className="h-6 text-xs"
              >
                전체 초기화
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

