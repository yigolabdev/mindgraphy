'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Clock, 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  GripVertical,
  Calendar,
  MapPin,
  StickyNote
} from 'lucide-react'
import { toast } from 'sonner'
import type { TimeTableEntry, TimeModifier } from '@/lib/types'

// Mock 프로젝트 데이터
const mockProject = {
  id: 'project-1',
  projectNumber: 'MG-2025-001',
  customer: {
    groomName: '김철수',
    brideName: '이영희'
  },
  weddingDate: '2025-06-15',
  weddingTime: '오후 2시'
}

// Mock 타임테이블 데이터
const mockTimeTableEntries: TimeTableEntry[] = [
  {
    id: 'entry-1',
    projectId: 'project-1',
    time: '06:30',
    timeModifier: 'estimated',
    event: '헤어.메이크업 인',
    location: '겐그레아',
    notes: '',
    order: 1,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'entry-2',
    projectId: 'project-1',
    time: '09:30',
    timeModifier: 'estimated',
    event: '헤어.메이크업 아웃',
    location: '겐그레아',
    notes: '',
    order: 2,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'entry-3',
    projectId: 'project-1',
    time: '09:50',
    timeModifier: 'around',
    event: '식장 도착 예정',
    location: '',
    notes: '네이버 AI: 5분 이동시간 예측',
    order: 3,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  }
]

export default function TimeTableManagementPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [entries, setEntries] = useState<TimeTableEntry[]>(mockTimeTableEntries)
  const [isSaving, setIsSaving] = useState(false)

  // 새 항목 추가
  const handleAddEntry = () => {
    const newEntry: TimeTableEntry = {
      id: `entry-${Date.now()}`,
      projectId,
      time: '12:00',
      timeModifier: 'exact',
      event: '',
      location: '',
      notes: '',
      order: entries.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setEntries([...entries, newEntry])
  }

  // 항목 삭제
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
    toast.success('항목이 삭제되었습니다')
  }

  // 항목 업데이트
  const handleUpdateEntry = (id: string, field: keyof TimeTableEntry, value: any) => {
    setEntries(entries.map(entry => 
      entry.id === id 
        ? { ...entry, [field]: value, updatedAt: new Date().toISOString() }
        : entry
    ))
  }

  // 순서 변경 (위로)
  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newEntries = [...entries]
    const temp = newEntries[index]
    newEntries[index] = newEntries[index - 1]
    newEntries[index - 1] = temp
    // order 재조정
    newEntries.forEach((entry, idx) => {
      entry.order = idx + 1
    })
    setEntries(newEntries)
  }

  // 순서 변경 (아래로)
  const handleMoveDown = (index: number) => {
    if (index === entries.length - 1) return
    const newEntries = [...entries]
    const temp = newEntries[index]
    newEntries[index] = newEntries[index + 1]
    newEntries[index + 1] = temp
    // order 재조정
    newEntries.forEach((entry, idx) => {
      entry.order = idx + 1
    })
    setEntries(newEntries)
  }

  // 저장
  const handleSave = async () => {
    setIsSaving(true)
    
    // TODO: API 호출하여 저장
    // POST /api/timetable/${projectId}
    // Body: { entries }
    
    setTimeout(() => {
      setIsSaving(false)
      toast.success('타임 테이블이 저장되었습니다', {
        description: '고객 포털에서 확인할 수 있습니다'
      })
    }, 1000)
  }

  // 시간 수식어 텍스트
  const getTimeModifierText = (modifier: TimeModifier) => {
    switch (modifier) {
      case 'exact': return '정확'
      case 'estimated': return '예상'
      case 'around': return '즈음'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                돌아가기
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">
                  타임 테이블 관리
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  {mockProject.customer.groomName} & {mockProject.customer.brideName} · {mockProject.projectNumber}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-zinc-900 mb-1">
                  촬영 일정 정보
                </h3>
                <div className="text-sm text-zinc-700 space-y-1">
                  <p>• 촬영일: {mockProject.weddingDate}</p>
                  <p>• 촬영 시간: {mockProject.weddingTime}</p>
                  <p className="text-xs text-zinc-600 mt-2">
                    💡 타임 테이블은 고객 포털에서 확인할 수 있으며, 당일 일정을 상세하게 안내합니다
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Table Entries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">타임 테이블 항목</CardTitle>
            <Button
              onClick={handleAddEntry}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              항목 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-zinc-400" />
                <p className="text-sm">아직 추가된 항목이 없습니다</p>
                <p className="text-xs text-zinc-400 mt-1">
                  "항목 추가" 버튼을 눌러 일정을 추가하세요
                </p>
              </div>
            ) : (
              entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-4 hover:border-zinc-300 transition-colors"
                >
                  {/* Header: Order & Delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-8 p-0 text-zinc-400 hover:text-zinc-600"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          ▲
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-8 p-0 text-zinc-400 hover:text-zinc-600"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === entries.length - 1}
                        >
                          ▼
                        </Button>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        #{index + 1}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Time Input */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-zinc-600 mb-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        시간
                      </Label>
                      <Input
                        type="time"
                        value={entry.time}
                        onChange={(e) => handleUpdateEntry(entry.id, 'time', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-zinc-600 mb-2">
                        시간 수식어
                      </Label>
                      <Select
                        value={entry.timeModifier}
                        onValueChange={(value) => handleUpdateEntry(entry.id, 'timeModifier', value as TimeModifier)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exact">정확</SelectItem>
                          <SelectItem value="estimated">예상</SelectItem>
                          <SelectItem value="around">즈음</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <div className="text-sm text-zinc-600 bg-white px-3 py-2 rounded border border-zinc-200 w-full">
                        {entry.time} {getTimeModifierText(entry.timeModifier)}
                      </div>
                    </div>
                  </div>

                  {/* Event Input */}
                  <div>
                    <Label className="text-xs text-zinc-600 mb-2">
                      이벤트 내용 *
                    </Label>
                    <Input
                      value={entry.event}
                      onChange={(e) => handleUpdateEntry(entry.id, 'event', e.target.value)}
                      placeholder="예: 헤어.메이크업 인"
                      className="font-medium"
                    />
                  </div>

                  {/* Location Input */}
                  <div>
                    <Label className="text-xs text-zinc-600 mb-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      장소 (선택사항)
                    </Label>
                    <Input
                      value={entry.location || ''}
                      onChange={(e) => handleUpdateEntry(entry.id, 'location', e.target.value)}
                      placeholder="예: 겐그레아"
                    />
                  </div>

                  {/* Notes Input */}
                  <div>
                    <Label className="text-xs text-zinc-600 mb-2 flex items-center gap-1">
                      <StickyNote className="h-3 w-3" />
                      메모 (선택사항)
                    </Label>
                    <Textarea
                      value={entry.notes || ''}
                      onChange={(e) => handleUpdateEntry(entry.id, 'notes', e.target.value)}
                      placeholder="추가 안내사항을 입력하세요"
                      rows={2}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        {entries.length > 0 && (
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-green-900">
                <Clock className="h-4 w-4" />
                고객 포털 미리보기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-6 border border-green-200">
                <h3 className="font-semibold text-zinc-900 mb-4 text-center">
                  [ 타임 테이블 ]
                </h3>
                <div className="space-y-3 text-sm">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex gap-4">
                      <div className="font-mono text-zinc-700 min-w-[120px]">
                        {entry.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-zinc-900">{entry.event}</p>
                        {entry.location && (
                          <p className="text-zinc-600 text-xs mt-1">
                            - 장소: {entry.location}
                          </p>
                        )}
                        {entry.notes && (
                          <p className="text-zinc-500 text-xs mt-1">
                            ({entry.notes})
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button (Bottom) */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2 min-w-[120px]"
          >
            <Save className="h-4 w-4" />
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  )
}

