'use client'

import { useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'

interface UploadedFile {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
}

export default function GalleryUploadPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock project data
  const [projectInfo] = useState({
    projectNumber: 'PRJ-2025-001',
    customerName: '홍길동 & 김영희',
    weddingDate: '2025-12-15',
  })

  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isGalleryDragActive, setIsGalleryDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  
  // 자동 생성된 갤러리 제목
  const galleryTitle = `${projectInfo.customerName} 웨딩 갤러리`

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsGalleryDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsGalleryDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsGalleryDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length !== newFiles.length) {
      toast.error('이미지 파일만 업로드 가능합니다')
    }

    const uploadedFiles: UploadedFile[] = imageFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }))

    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const simulateUpload = (file: UploadedFile): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'completed', progress: 100 } : f
          ))
          resolve()
        } else {
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'uploading', progress } : f
          ))
        }
      }, 200)
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('업로드할 사진을 선택해주세요')
      return
    }

    setIsUploading(true)

    // 순차적으로 업로드 (실제로는 병렬 처리 가능)
    for (const file of files) {
      if (file.status === 'pending') {
        await simulateUpload(file)
      }
    }

    setIsUploading(false)
    toast.success(`${files.length}장의 사진이 업로드되었습니다`)
  }

  const handleComplete = async () => {
    const completedCount = files.filter(f => f.status === 'completed').length
    
    if (completedCount === 0) {
      toast.error('업로드된 사진이 없습니다')
      return
    }

    setIsCompleting(true)

    // TODO: API 호출하여 갤러리 활성화
    // 자동 생성된 제목: galleryTitle
    setTimeout(() => {
      toast.success('갤러리가 고객에게 공개되었습니다!', {
        description: `${completedCount}장의 사진이 업로드되었습니다.`
      })
      setIsCompleting(false)
      
      // 프로젝트 상세 페이지로 돌아가기
      setTimeout(() => {
        router.push('/admin/projects')
      }, 1500)
    }, 1000)
  }

  const completedCount = files.filter(f => f.status === 'completed').length
  const uploadingCount = files.filter(f => f.status === 'uploading').length
  const totalProgress = files.length > 0 
    ? files.reduce((sum, f) => sum + f.progress, 0) / files.length 
    : 0

  return (
    <AdminLayout>
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
                  웹 갤러리 업로드
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  {projectInfo.customerName} · {projectInfo.projectNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {files.length}장
              </Badge>
              {completedCount > 0 && (
                <Badge className="bg-green-600 text-lg px-4 py-2">
                  완료 {completedCount}장
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">사진 업로드</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
                isGalleryDragActive 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50"
              )}
            >
              <Upload className={cn(
                "h-12 w-12 mx-auto mb-4",
                isGalleryDragActive ? "text-blue-500" : "text-zinc-400"
              )} />
              <p className="text-base font-medium text-zinc-900 mb-2">
                사진을 드래그하여 놓거나 클릭하여 선택하세요
              </p>
              <p className="text-sm text-zinc-500">
                JPG, PNG, HEIC 등 이미지 파일 지원
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {files.length > 0 && uploadingCount > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-blue-900">
                    업로드 중... {completedCount} / {files.length}
                  </span>
                  <span className="text-blue-700">{Math.round(totalProgress)}%</span>
                </div>
                <Progress value={totalProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files Grid */}
        {files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">업로드 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="relative aspect-square group rounded-lg overflow-hidden border-2 border-zinc-200"
                  >
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Status Overlay */}
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-white border-t-transparent animate-spin mb-2" />
                        <p className="text-white text-sm">{Math.round(file.progress)}%</p>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="h-12 w-12 text-green-600" />
                      </div>
                    )}

                    {file.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-white" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      {file.status === 'completed' && (
                        <Badge className="bg-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>

                    {/* Remove Button */}
                    {file.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(file.id)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {/* File Name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.file.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {files.some(f => f.status === 'pending') && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || files.length === 0}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {isUploading ? '업로드 중...' : `${files.filter(f => f.status === 'pending').length}장 업로드 시작`}
                </Button>
              )}

              {completedCount > 0 && (
                <Button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {isCompleting ? '완료 처리 중...' : '고객에게 갤러리 공개하기'}
                </Button>
              )}
            </div>

            <p className="text-xs text-zinc-500 mt-3 text-center">
              {completedCount > 0 
                ? '완료 버튼을 누르면 고객 포털에서 갤러리를 확인할 수 있습니다' 
                : '사진을 선택하고 업로드 시작 버튼을 눌러주세요'}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

