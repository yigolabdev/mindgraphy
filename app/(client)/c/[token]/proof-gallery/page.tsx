'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { getClientDataByToken } from '@/lib/mock/client'
import { getDaysUntilDeadline, isDeadlineNear, isDeadlineOverdue } from '@/lib/mock/client'
import { ROUTES } from '@/lib/constants'
import {
  generateMockProofPhotos,
  getCategoryLabel,
  getCategoryColor,
  canSelectMore,
  getSelectionProgress,
  commentTypeLabels,
  type ProofPhoto,
  type CommentType
} from '@/lib/mock/proof-gallery'
import {
  Check,
  X,
  MessageCircle,
  Filter,
  Grid3x3,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProofGalleryPageProps {
  params: Promise<{ token: string }>
}

export default function ProofGalleryPage({ params }: ProofGalleryPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const clientData = getClientDataByToken(token)

  // State
  const [photos, setPhotos] = useState<ProofPhoto[]>(generateMockProofPhotos(450))
  const [selectedCategory, setSelectedCategory] = useState<ProofPhoto['category'] | 'all'>('all')
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false)
  const [currentCommentPhoto, setCurrentCommentPhoto] = useState<ProofPhoto | null>(null)
  const [newComment, setNewComment] = useState('')
  const [commentType, setCommentType] = useState<CommentType>('general')

  // All hooks must be called before any conditional returns
  const maxSelections = clientData?.steps.proof.maxSelections || 50
  const selectedCount = photos.filter(p => p.selected).length
  const canSelect = canSelectMore(selectedCount, maxSelections)
  const selectionProgress = getSelectionProgress(selectedCount, maxSelections)

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'all') return photos
    return photos.filter(p => p.category === selectedCategory)
  }, [photos, selectedCategory])

  // Check after all hooks are called
  if (!clientData) {
    router.push(`/c/${token}/invalid`)
    return null
  }

  // Deadline info
  const deadline = clientData.steps.proof.deadline
  const daysUntil = deadline ? getDaysUntilDeadline(deadline) : null
  const isNear = deadline ? isDeadlineNear(deadline) : false
  const isOverdue = deadline ? isDeadlineOverdue(deadline) : false

  // Handlers
  const toggleSelect = (photoId: string) => {
    setPhotos(prev => prev.map(p => {
      if (p.id === photoId) {
        const willSelect = !p.selected
        if (willSelect && !canSelect) {
          toast.error(`최대 ${maxSelections}장까지만 선택할 수 있습니다`)
          return p
        }
        return { ...p, selected: !p.selected }
      }
      return p
    }))
  }

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToPrevious = () => {
    setCurrentPhotoIndex(prev => (prev > 0 ? prev - 1 : filteredPhotos.length - 1))
  }

  const goToNext = () => {
    setCurrentPhotoIndex(prev => (prev < filteredPhotos.length - 1 ? prev + 1 : 0))
  }

  const openCommentDrawer = (photo: ProofPhoto) => {
    setCurrentCommentPhoto(photo)
    setCommentDrawerOpen(true)
    setNewComment('')
    setCommentType('general')
  }

  const addComment = () => {
    if (!currentCommentPhoto || !newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      type: commentType,
      text: newComment.trim(),
      createdAt: new Date().toISOString()
    }

    setPhotos(prev => prev.map(p => 
      p.id === currentCommentPhoto.id 
        ? { ...p, comments: [...p.comments, comment] }
        : p
    ))

    setNewComment('')
    toast.success('코멘트가 추가되었습니다')
  }

  const handleSubmit = async () => {
    const selected = photos.filter(p => p.selected)
    
    if (selected.length === 0) {
      toast.error('최소 1장 이상 선택해주세요')
      return
    }

    console.log('Selected photos:', selected.length)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success(`${selected.length}장의 사진이 선택되었습니다!`)
    
    // Redirect to next step: Download
    setTimeout(() => {
      router.push(ROUTES.CLIENT_DOWNLOAD(token))
    }, 1000)
  }

  const gridSizeClass = {
    small: 'grid-cols-4 md:grid-cols-6 lg:grid-cols-8',
    medium: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    large: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }

  const currentPhoto = filteredPhotos[currentPhotoIndex]

  return (
    <ClientPortalLayout token={token}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">프루프 갤러리</h1>
          <p className="text-muted-foreground">
            원하시는 사진을 선택해주세요 (최대 {maxSelections}장)
          </p>
        </div>

        {/* Deadline Banner */}
        {deadline && (isNear || isOverdue) && (
          <Card className={cn(
            "border-2",
            isOverdue ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className={cn(
                  "h-5 w-5 mt-0.5 flex-shrink-0",
                  isOverdue ? "text-red-600" : "text-orange-600"
                )} />
                <div>
                  <h3 className={cn(
                    "font-semibold mb-1",
                    isOverdue ? "text-red-900" : "text-orange-900"
                  )}>
                    {isOverdue ? '선택 마감이 지났습니다!' : '선택 마감이 임박했습니다!'}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isOverdue ? "text-red-700" : "text-orange-700"
                  )}>
                    {isOverdue 
                      ? `${Math.abs(daysUntil!)}일 초과: 빠른 시일 내에 선택을 완료해주세요.`
                      : daysUntil === 0
                      ? '오늘이 마감일입니다. 지금 바로 선택을 완료해주세요!'
                      : `D-${daysUntil}: 서둘러 사진을 선택해주세요.`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Selection Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">선택한 사진</p>
                  <p className="text-2xl font-bold">
                    {selectedCount} / {maxSelections}
                  </p>
                </div>
                <Badge variant={selectedCount >= maxSelections ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                  {selectionProgress}%
                </Badge>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    selectedCount >= maxSelections 
                      ? "bg-green-500"
                      : "bg-blue-500"
                  )}
                  style={{ width: `${selectionProgress}%` }}
                />
              </div>
              {selectedCount >= maxSelections && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  모든 사진을 선택했습니다! 선택을 변경하거나 제출할 수 있습니다.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  전체 ({photos.length})
                </Button>
                {(['ceremony', 'makeup', 'outdoor', 'family', 'couple'] as const).map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {getCategoryLabel(cat)} ({photos.filter(p => p.category === cat).length})
                  </Button>
                ))}
              </div>

              {/* Grid Size */}
              <div className="flex items-center gap-2">
                <Button
                  variant={gridSize === 'small' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGridSize('small')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGridSize('medium')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={gridSize === 'large' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setGridSize('large')}
                >
                  <LayoutGrid className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Grid */}
        <div className={cn("grid gap-4", gridSizeClass[gridSize])}>
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative group aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg"
              style={{
                borderColor: photo.selected ? '#3b82f6' : 'transparent'
              }}
            >
              <img
                src={photo.thumbnail}
                alt={`Photo ${photo.id}`}
                className="w-full h-full object-cover"
                onClick={() => openLightbox(index)}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelect(photo.id)
                  }}
                  className={cn(
                    "absolute top-2 right-2 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                    photo.selected
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-300 opacity-0 group-hover:opacity-100"
                  )}
                >
                  {photo.selected && <Check className="h-5 w-5 text-white" />}
                </button>

                {/* Comment Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openCommentDrawer(photo)
                  }}
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  {photo.comments.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {photo.comments.length}
                    </span>
                  )}
                </button>

                {/* Zoom Icon */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                  <ZoomIn className="h-5 w-5 text-white drop-shadow-lg" />
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-2 left-2">
                  <Badge className={cn("text-xs", getCategoryColor(photo.category))}>
                    {getCategoryLabel(photo.category)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={selectedCount === 0}
              className="w-full h-12 text-lg"
              size="lg"
            >
              선택 완료 ({selectedCount}장)
            </Button>
            {selectedCount === 0 && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                최소 1장 이상 선택해주세요
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lightbox */}
      {lightboxOpen && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={goToPrevious}
            className="absolute left-4 w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 w-12 h-12 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>

          <div className="max-w-6xl max-h-[90vh] px-16">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.id}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <div className="mt-4 text-center space-y-2">
              <p className="text-white text-sm">
                {currentPhotoIndex + 1} / {filteredPhotos.length}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={currentPhoto.selected ? 'default' : 'secondary'}
                  onClick={() => toggleSelect(currentPhoto.id)}
                >
                  {currentPhoto.selected ? <Check className="mr-2 h-4 w-4" /> : null}
                  {currentPhoto.selected ? '선택됨' : '선택하기'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    openCommentDrawer(currentPhoto)
                    closeLightbox()
                  }}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  코멘트 ({currentPhoto.comments.length})
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comment Drawer */}
      <Sheet open={commentDrawerOpen} onOpenChange={setCommentDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>사진 코멘트</SheetTitle>
            <SheetDescription>
              보정이 필요한 부분이나 요청사항을 남겨주세요
            </SheetDescription>
          </SheetHeader>

          {currentCommentPhoto && (
            <div className="mt-6 space-y-6">
              {/* Photo Preview */}
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={currentCommentPhoto.thumbnail}
                  alt={currentCommentPhoto.id}
                  className="w-full"
                />
              </div>

              {/* Existing Comments */}
              {currentCommentPhoto.comments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">코멘트 ({currentCommentPhoto.comments.length})</h3>
                  {currentCommentPhoto.comments.map(comment => (
                    <div key={comment.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {commentTypeLabels[comment.type]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold">새 코멘트 추가</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">코멘트 유형</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['skin', 'exposure', 'trim', 'general'] as CommentType[]).map(type => (
                      <button
                        key={type}
                        onClick={() => setCommentType(type)}
                        className={cn(
                          "p-2 rounded-lg border-2 text-sm font-medium transition-all",
                          commentType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        {commentTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">코멘트 내용</label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="요청사항을 입력해주세요..."
                    rows={4}
                  />
                </div>

                <Button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  코멘트 추가
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </ClientPortalLayout>
  )
}
