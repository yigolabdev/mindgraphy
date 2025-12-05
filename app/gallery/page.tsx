'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Lock, Image as ImageIcon, Download, Share2, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Image from 'next/image'

// Mock data - 실제로는 API에서 가져올 데이터
const mockGallery = {
  id: 'gallery-1',
  galleryId: 'abc123',
  projectId: 'project-1',
  customerId: 'customer-1',
  title: '김철수 & 이영희 웨딩 갤러리',
  password: '5678', // 대표 번호 뒤 4자리
  sharedUrl: '/gallery?id=abc123',
  photoCount: 12,
  isActive: true,
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z'
}

const mockPhotos = [
  {
    id: 'photo-1',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    fileName: 'IMG_001.jpg',
    fileSizeBytes: 2048000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 1
  },
  {
    id: 'photo-2',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    fileName: 'IMG_002.jpg',
    fileSizeBytes: 2150000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 2
  },
  {
    id: 'photo-3',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    fileName: 'IMG_003.jpg',
    fileSizeBytes: 1980000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 3
  },
  {
    id: 'photo-4',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    fileName: 'IMG_004.jpg',
    fileSizeBytes: 2100000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 4
  },
  {
    id: 'photo-5',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    fileName: 'IMG_005.jpg',
    fileSizeBytes: 2200000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 5
  },
  {
    id: 'photo-6',
    galleryId: 'gallery-1',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop',
    fileName: 'IMG_006.jpg',
    fileSizeBytes: 1950000,
    width: 4000,
    height: 3000,
    uploadedAt: '2025-01-15T10:00:00Z',
    order: 6
  }
]

function GalleryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const galleryId = searchParams.get('id') || 'abc123'
  
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const [imageTransitioning, setImageTransitioning] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  useEffect(() => {
    setIsMounted(true)
    // 세션에서 인증 상태 확인
    const authStatus = sessionStorage.getItem(`gallery_${galleryId}_auth`)
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
  }, [galleryId])

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return
      
      if (e.key === 'ArrowLeft') {
        navigatePhoto('prev')
      } else if (e.key === 'ArrowRight') {
        navigatePhoto('next')
      } else if (e.key === 'Escape') {
        closePhotoViewer()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedPhotoIndex])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 개발 모드: 아무 비밀번호나 입력하면 통과
    if (password.length >= 4) {
      setIsAuthenticated(true)
      sessionStorage.setItem(`gallery_${galleryId}_auth`, 'true')
      setError('')
    } else {
      setError('비밀번호 4자리를 입력해주세요.')
      setPassword('')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      alert('링크가 클립보드에 복사되었습니다!')
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  const openPhotoViewer = (index: number) => {
    setSelectedPhotoIndex(index)
    setIsImageLoading(true)
  }

  const closePhotoViewer = () => {
    setImageTransitioning(true)
    setTimeout(() => {
      setSelectedPhotoIndex(null)
      setImageTransitioning(false)
    }, 200)
  }

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (selectedPhotoIndex === null) return
    
    setImageTransitioning(true)
    setIsImageLoading(true)
    
    setTimeout(() => {
      if (direction === 'prev' && selectedPhotoIndex > 0) {
        setSelectedPhotoIndex(selectedPhotoIndex - 1)
      } else if (direction === 'next' && selectedPhotoIndex < mockPhotos.length - 1) {
        setSelectedPhotoIndex(selectedPhotoIndex + 1)
      }
      setImageTransitioning(false)
    }, 150)
  }

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
    setIsImageLoading(false)
  }

  // 비밀번호 입력 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center p-4">
        <Card className={cn(
          "w-full max-w-md shadow-2xl transition-all duration-700",
          isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <h1 className="text-2xl font-semibold text-zinc-900">
                  마인드 웹 갤러리
                </h1>
                <p className="text-sm text-zinc-600">
                  비밀번호를 입력하여 갤러리에 접속하세요
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div>
                  <Input
                    type="password"
                    placeholder="••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    maxLength={4}
                    className={cn(
                      "text-center text-2xl tracking-widest h-14 transition-all",
                      error && "border-red-500 shake"
                    )}
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm text-red-600 mt-2 text-center animate-in fade-in slide-in-from-top-1 duration-300">
                      {error}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className={cn(
                    "w-full h-12 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300",
                    password.length === 4 && "shadow-lg shadow-zinc-900/20"
                  )}
                  disabled={password.length !== 4}
                >
                  갤러리 열기
                </Button>
              </form>

              <p className="text-xs text-zinc-500 animate-in fade-in duration-700 delay-500">
                비밀번호는 대표 전화번호 뒤 4자리입니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 갤러리 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-zinc-50 to-white">
      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-zinc-200/50 shadow-sm transition-all duration-700",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">
                {mockGallery.title}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                총 {mockPhotos.length}장의 사진
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 hover:shadow-md transition-all"
              >
                <Share2 className="h-4 w-4" />
                공유하기
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={cn(
                "relative aspect-square cursor-pointer group overflow-hidden rounded-xl bg-zinc-100 shadow-md hover:shadow-2xl transition-all duration-500",
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{
                transitionDelay: `${index * 50}ms`
              }}
              onClick={() => openPhotoViewer(index)}
            >
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
                  <Loader2 className="h-8 w-8 text-zinc-400 animate-spin" />
                </div>
              )}
              <Image
                src={photo.thumbnailUrl}
                alt={photo.fileName}
                fill
                className={cn(
                  "object-cover transition-all duration-700 ease-out",
                  "group-hover:scale-110 group-hover:rotate-1",
                  loadedImages.has(index) ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                onLoad={() => handleImageLoad(index)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Photo number overlay */}
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-zinc-900 text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Photo Viewer Modal */}
      {selectedPhotoIndex !== null && (
        <div
          className={cn(
            "fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300",
            imageTransitioning ? "opacity-0" : "opacity-100"
          )}
          onClick={closePhotoViewer}
        >
          {/* Close button */}
          <button
            onClick={closePhotoViewer}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-all z-20 p-2 rounded-full hover:bg-white/10 backdrop-blur-sm"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Previous button */}
          {selectedPhotoIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigatePhoto('prev')
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all z-20 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm hover:scale-110"
            >
              <ChevronLeft className="h-10 w-10" />
            </button>
          )}

          {/* Next button */}
          {selectedPhotoIndex < mockPhotos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigatePhoto('next')
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-all z-20 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm hover:scale-110"
            >
              <ChevronRight className="h-10 w-10" />
            </button>
          )}

          {/* Image container */}
          <div
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              </div>
            )}
            <div className={cn(
              "relative transition-all duration-300 ease-out",
              imageTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            )}>
              <Image
                src={mockPhotos[selectedPhotoIndex].imageUrl}
                alt={mockPhotos[selectedPhotoIndex].fileName}
                width={mockPhotos[selectedPhotoIndex].width}
                height={mockPhotos[selectedPhotoIndex].height}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                priority
                onLoad={() => setIsImageLoading(false)}
              />
            </div>
          </div>

          {/* Photo info bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-white">
              <div className="text-sm">
                <p className="font-medium">{mockPhotos[selectedPhotoIndex].fileName}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm">
                  {selectedPhotoIndex + 1} / {mockPhotos.length}
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-xs z-10 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
            ← → 화살표로 이동 · ESC 닫기
          </div>
        </div>
      )}
    </div>
  )
}


export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">로딩 중...</div>}>
      <GalleryContent />
    </Suspense>
  )
}
