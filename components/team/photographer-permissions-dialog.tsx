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
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getAllPermissions } from '@/lib/config/navigation'
import type { PagePermission } from '@/lib/types/auth'
import { Shield, Check } from 'lucide-react'

interface PhotographerPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  photographer: {
    id: string
    name: string
    email: string
    currentPermissions?: PagePermission[]
  } | null
  onSave: (photographerId: string, permissions: PagePermission[]) => void
}

export function PhotographerPermissionsDialog({
  open,
  onOpenChange,
  photographer,
  onSave,
}: PhotographerPermissionsDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<PagePermission[]>([])
  const allPermissions = getAllPermissions()

  // 다이얼로그가 열릴 때 현재 권한으로 초기화
  useEffect(() => {
    if (open && photographer) {
      setSelectedPermissions(photographer.currentPermissions || [])
    }
  }, [open, photographer])

  const handleTogglePermission = (permission: PagePermission) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permission)) {
        return prev.filter(p => p !== permission)
      } else {
        return [...prev, permission]
      }
    })
  }

  const handleSelectAll = () => {
    setSelectedPermissions(allPermissions.map(p => p.value))
  }

  const handleClearAll = () => {
    setSelectedPermissions([])
  }

  const handleSave = () => {
    if (photographer) {
      onSave(photographer.id, selectedPermissions)
      onOpenChange(false)
    }
  }

  if (!photographer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            작가 권한 설정
          </DialogTitle>
          <DialogDescription>
            {photographer.name}({photographer.email})님의 페이지 접근 권한을 설정합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 권한 요약 */}
          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg border">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                선택된 권한: {selectedPermissions.length}개
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={selectedPermissions.length === allPermissions.length}
              >
                전체 선택
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={selectedPermissions.length === 0}
              >
                전체 해제
              </Button>
            </div>
          </div>

          {/* 권한 목록 */}
          <div className="h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            <div className="space-y-3">
              {allPermissions.map((permission) => {
                const isSelected = selectedPermissions.includes(permission.value)
                
                return (
                  <div
                    key={permission.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                    onClick={() => handleTogglePermission(permission.value)}
                  >
                    <Checkbox
                      id={permission.value}
                      checked={isSelected}
                      onCheckedChange={() => handleTogglePermission(permission.value)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={permission.value}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {permission.label}
                        </Label>
                        {isSelected && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <p className="text-sm text-zinc-600">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>💡 안내:</strong> 선택한 권한에 따라 작가가 접근할 수 있는 페이지가 결정됩니다. 
              권한이 없는 페이지는 네비게이션에서 숨겨지며 직접 URL로 접근해도 차단됩니다.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Shield className="h-4 w-4" />
            권한 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

