'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { mockSchedulePhotographers } from '@/lib/mock/schedules'
import {
  User,
  AlertCircle,
  CheckCircle,
  Search,
  Calendar,
  Star,
  X,
  Camera,
  UserCheck,
  Smartphone,
  Clock,
  MapPin,
  Package,
  Tag
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export type PhotographerRole = 'main' | 'assistant' | 'iphone'

interface SelectedPhotographer {
  id: string
  name: string
  role: PhotographerRole
}

interface AssignPhotographerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAssignPhotographer: (photographers: SelectedPhotographer[]) => void
  currentPhotographerIds?: string[]
  projectName?: string
  weddingDate?: string
  weddingTime?: string
  weddingVenue?: string
  venueAddress?: string
  packageName?: string
  optionNames?: string[]
}

const ROLE_CONFIG = {
  main: { label: '메인 작가', icon: Camera, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  assistant: { label: '보조 작가', icon: UserCheck, color: 'bg-green-100 text-green-800 border-green-200' },
  iphone: { label: '아이폰 스냅', icon: Smartphone, color: 'bg-purple-100 text-purple-800 border-purple-200' },
}

export function AssignPhotographerDialog({
  open,
  onOpenChange,
  onAssignPhotographer,
  currentPhotographerIds = [],
  projectName,
  weddingDate,
  weddingTime,
  weddingVenue,
  venueAddress,
  packageName,
  optionNames = []
}: AssignPhotographerDialogProps) {
  const [photographerSearch, setPhotographerSearch] = useState('')
  const [selectedPhotographers, setSelectedPhotographers] = useState<SelectedPhotographer[]>([])

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setPhotographerSearch('')
    }
  }, [open])

  const handleTogglePhotographer = (photographerId: string, photographerName: string) => {
    setSelectedPhotographers(prev => {
      const exists = prev.find(p => p.id === photographerId)
      if (exists) {
        // Remove if already selected
        return prev.filter(p => p.id !== photographerId)
      } else {
        // Add with default role
        const defaultRole: PhotographerRole = prev.length === 0 ? 'main' : 'assistant'
        return [...prev, { id: photographerId, name: photographerName, role: defaultRole }]
      }
    })
  }

  const handleUpdateRole = (photographerId: string, role: PhotographerRole) => {
    setSelectedPhotographers(prev =>
      prev.map(p => p.id === photographerId ? { ...p, role } : p)
    )
  }

  const handleRemovePhotographer = (photographerId: string) => {
    setSelectedPhotographers(prev => prev.filter(p => p.id !== photographerId))
  }

  const handleAssign = () => {
    if (selectedPhotographers.length === 0) {
      toast.error('최소 1명의 작가를 선택해주세요')
      return
    }

    // Check if there's at least one main photographer
    const hasMain = selectedPhotographers.some(p => p.role === 'main')
    if (!hasMain) {
      toast.error('메인 작가를 최소 1명 지정해주세요')
      return
    }

    onAssignPhotographer(selectedPhotographers)
    const names = selectedPhotographers.map(p => `${p.name}(${ROLE_CONFIG[p.role].label})`).join(', ')
    toast.success(`${names}가 배정되었습니다`)
    onOpenChange(false)
    setSelectedPhotographers([])
  }

  const filteredPhotographers = mockSchedulePhotographers.filter(p =>
    p.name.toLowerCase().includes(photographerSearch.toLowerCase())
  )

  const getPhotographerAvailability = (photographerId: string) => {
    // TODO: Check photographer availability for wedding date
    const random = Math.random()
    if (random > 0.7) return 'busy'
    return 'available'
  }

  const getPhotographerStats = (photographerId: string) => {
    return {
      completedProjects: Math.floor(Math.random() * 50) + 10,
      rating: (4.5 + Math.random() * 0.5).toFixed(1)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            사진작가 배정 (다중 선택)
          </DialogTitle>
          <DialogDescription>
            촬영 프로젝트에 사진작가를 배정하세요. 최대 3명까지 선택 가능합니다.
          </DialogDescription>
        </DialogHeader>

        {/* Project Information */}
        {projectName && (
          <div className="mt-4 space-y-4">
            {/* Basic Info */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-3">
              <div className="font-semibold text-lg text-blue-900">{projectName}</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Date and Time */}
                {weddingDate && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-blue-600 font-medium">촬영 날짜</div>
                      <div className="text-sm font-medium text-blue-900">{weddingDate}</div>
                    </div>
                  </div>
                )}
                
                {weddingTime && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-blue-600 font-medium">촬영 시간</div>
                      <div className="text-sm font-medium text-blue-900">{weddingTime}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Venue */}
              {weddingVenue && (
                <div className="flex items-start gap-2 pt-2 border-t border-blue-200">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 font-medium mb-1">촬영 장소</div>
                    <div className="text-sm font-medium text-blue-900">{weddingVenue}</div>
                    {venueAddress && (
                      <div className="text-xs text-blue-700 mt-1">{venueAddress}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Package & Options */}
            {(packageName || optionNames.length > 0) && (
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg space-y-3">
                {packageName && (
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-medium mb-1">선택 패키지</div>
                      <div className="text-sm font-semibold">{packageName}</div>
                    </div>
                  </div>
                )}

                {optionNames.length > 0 && (
                  <div className="flex items-start gap-2 pt-2 border-t border-zinc-200">
                    <Tag className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-medium mb-1">추가 옵션</div>
                      <div className="space-y-1">
                        {optionNames.map((option, idx) => (
                          <div key={idx} className="text-sm font-medium">• {option}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="작가명으로 검색..."
              value={photographerSearch}
              onChange={(e) => setPhotographerSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected Photographers Summary */}
          {selectedPhotographers.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-3 flex items-center justify-between">
                <span>선택된 작가 ({selectedPhotographers.length}명)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPhotographers([])}
                  className="h-auto py-1 px-2 text-xs"
                >
                  전체 해제
                </Button>
              </div>
              <div className="space-y-2">
                {selectedPhotographers.map((photographer) => {
                  const RoleIcon = ROLE_CONFIG[photographer.role].icon
                  return (
                    <div
                      key={photographer.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100"
                    >
                      <Avatar className="bg-blue-600 h-9 w-9">
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {photographer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{photographer.name}</div>
                      </div>
                      <Select
                        value={photographer.role}
                        onValueChange={(value: PhotographerRole) => handleUpdateRole(photographer.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">
                            <div className="flex items-center gap-2">
                              <Camera className="h-3 w-3" />
                              메인 작가
                            </div>
                          </SelectItem>
                          <SelectItem value="assistant">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-3 w-3" />
                              보조 작가
                            </div>
                          </SelectItem>
                          <SelectItem value="iphone">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3 w-3" />
                              아이폰 스냅
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePhotographer(photographer.id)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {selectedPhotographers.length > 0 && <Separator />}

          {/* Photographer List */}
          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">
              작가 목록 ({filteredPhotographers.length}명)
              <span className="text-xs text-muted-foreground ml-2">
                클릭하여 선택/해제
              </span>
            </div>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredPhotographers.map((photographer) => {
                const availability = getPhotographerAvailability(photographer.id)
                const stats = getPhotographerStats(photographer.id)
                const isSelected = selectedPhotographers.some(p => p.id === photographer.id)
                const isCurrent = currentPhotographerIds.includes(photographer.id)

                return (
                  <button
                    key={photographer.id}
                    type="button"
                    onClick={() => handleTogglePhotographer(photographer.id, photographer.name)}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all text-left",
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className={cn(
                        "h-10 w-10",
                        isSelected ? "bg-blue-600" : "bg-gray-600"
                      )}>
                        <AvatarFallback className={cn(
                          "text-white",
                          isSelected ? "bg-blue-600" : "bg-gray-600"
                        )}>
                          {photographer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{photographer.name}</span>
                          {isCurrent && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              기존 배정
                            </Badge>
                          )}
                          {availability === 'available' && !isCurrent && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              가능
                            </Badge>
                          )}
                          {availability === 'busy' && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              바쁨
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          사진작가
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{stats.completedProjects}건 완료</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{stats.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                )
              })}

              {filteredPhotographers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>검색 결과가 없습니다</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setSelectedPhotographers([])
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedPhotographers.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            배정하기 ({selectedPhotographers.length}명)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
