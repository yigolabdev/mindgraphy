'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getClientDataByToken } from '@/lib/mock/client'
import {
  mockDownloadFiles,
  mockExpiredFile,
  getFileTypeLabel,
  getFileTypeColor,
  isDownloadAvailable,
  getDownloadStatusMessage,
  getDaysUntilExpiry,
  mockDownloadFile,
  type DownloadFile
} from '@/lib/mock/downloads'
import {
  Download,
  FileArchive,
  Lock,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Calendar,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DownloadPageProps {
  params: Promise<{ token: string }>
}

export default function DownloadPage({ params }: DownloadPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const clientData = getClientDataByToken(token)

  // Include expired file for demo
  const [files] = useState<DownloadFile[]>([...mockDownloadFiles, mockExpiredFile])
  const [passwords, setPasswords] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [downloading, setDownloading] = useState<Record<string, boolean>>({})

  if (!clientData) {
    router.push(`/c/${token}/invalid`)
    return null
  }

  const handlePasswordChange = (fileId: string, value: string) => {
    setPasswords(prev => ({ ...prev, [fileId]: value }))
  }

  const toggleShowPassword = (fileId: string) => {
    setShowPasswords(prev => ({ ...prev, [fileId]: !prev[fileId] }))
  }

  const handleDownload = async (file: DownloadFile) => {
    setDownloading(prev => ({ ...prev, [file.id]: true }))

    // Get password if required
    const password = file.requiresPassword ? passwords[file.id] : undefined

    // Mock download attempt (logs to console)
    const result = mockDownloadFile(file, password)

    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    setDownloading(prev => ({ ...prev, [file.id]: false }))

    if (result.success) {
      toast.success(result.message)
      // In real app, would trigger actual file download
      // window.location.href = result.downloadUrl
    } else {
      toast.error(result.message)
    }
  }

  return (
    <ClientPortalLayout token={token}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <Link href={`/c/${token}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              진행 상황으로 돌아가기
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">다운로드</h1>
          <p className="text-muted-foreground">
            최종 결과물을 다운로드하실 수 있습니다
          </p>
        </div>

        {/* Info Card */}
        <Card className="border-blue-500 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  다운로드 안내
                </h3>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>파일은 만료일까지만 다운로드 가능합니다</li>
                  <li>다운로드 횟수 제한이 있을 수 있습니다</li>
                  <li>비밀번호가 필요한 파일은 입력 후 다운로드하세요</li>
                  <li>다운로드 문제 시 담당 작가에게 문의해주세요</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Files */}
        <div className="space-y-4">
          {files.map((file) => {
            const isAvailable = isDownloadAvailable(file)
            const daysUntilExpiry = getDaysUntilExpiry(file.expiresAt)
            const isExpiringSoon = daysUntilExpiry <= 7 && daysUntilExpiry > 0
            const isDownloading = downloading[file.id]

            return (
              <Card
                key={file.id}
                className={cn(
                  "transition-all",
                  file.isExpired && "opacity-60 border-red-200",
                  isExpiringSoon && "border-orange-300"
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg",
                        file.isExpired ? "bg-gray-200" : "bg-blue-100"
                      )}>
                        <FileArchive className={cn(
                          "h-6 w-6",
                          file.isExpired ? "text-gray-500" : "text-blue-600"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-1">
                          {file.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          {file.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn(getFileTypeColor(file.type))}>
                            {getFileTypeLabel(file.type)}
                          </Badge>
                          {file.isExpired ? (
                            <Badge variant="destructive">
                              만료됨
                            </Badge>
                          ) : isExpiringSoon ? (
                            <Badge variant="destructive" className="bg-orange-500">
                              {daysUntilExpiry}일 남음
                            </Badge>
                          ) : null}
                          {file.requiresPassword && (
                            <Badge variant="secondary">
                              <Lock className="mr-1 h-3 w-3" />
                              비밀번호 필요
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* File Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">용량</p>
                        <p className="text-sm font-medium">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileArchive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">형식</p>
                        <p className="text-sm font-medium">{file.format}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">만료일</p>
                        <p className={cn(
                          "text-sm font-medium",
                          file.isExpired && "text-red-600",
                          isExpiringSoon && "text-orange-600"
                        )}>
                          {format(new Date(file.expiresAt), 'M월 d일', { locale: ko })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">다운로드</p>
                        <p className="text-sm font-medium">
                          {getDownloadStatusMessage(file)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Field */}
                  {file.requiresPassword && !file.isExpired && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        비밀번호 <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type={showPasswords[file.id] ? "text" : "password"}
                            placeholder="비밀번호를 입력하세요"
                            value={passwords[file.id] || ''}
                            onChange={(e) => handlePasswordChange(file.id, e.target.value)}
                            disabled={!isAvailable}
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(file.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPasswords[file.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        비밀번호는 계약 시 전달받으신 번호입니다 (데모: 1234)
                      </p>
                    </div>
                  )}

                  {/* Expired Message */}
                  {file.isExpired && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <p className="text-sm text-red-700">
                        이 파일은 {format(new Date(file.expiresAt), 'yyyy년 M월 d일', { locale: ko })}에 만료되었습니다. 
                        재발급이 필요한 경우 담당 작가에게 문의해주세요.
                      </p>
                    </div>
                  )}

                  {/* Max Downloads Exceeded */}
                  {!file.isExpired && file.maxDownloads && file.downloadCount >= file.maxDownloads && (
                    <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <p className="text-sm text-orange-700">
                        다운로드 횟수({file.maxDownloads}회)를 모두 사용했습니다. 
                        추가 다운로드가 필요한 경우 담당 작가에게 문의해주세요.
                      </p>
                    </div>
                  )}

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(file)}
                    disabled={!isAvailable || isDownloading}
                    className="w-full h-12"
                    size="lg"
                  >
                    {isDownloading ? (
                      <>처리 중...</>
                    ) : file.isExpired ? (
                      <>
                        <AlertCircle className="mr-2 h-5 w-5" />
                        만료됨
                      </>
                    ) : !isAvailable ? (
                      <>
                        <AlertCircle className="mr-2 h-5 w-5" />
                        다운로드 불가
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-5 w-5" />
                        다운로드
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">도움이 필요하신가요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                다운로드 문제가 있으신가요? 담당 작가 {clientData.photographerName}에게 
                연락하세요: {clientData.photographerPhone}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                파일이 만료되었거나 추가 다운로드가 필요한 경우 재발급 요청이 가능합니다
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                다운로드한 파일은 안전한 곳에 백업하여 보관하시기 바랍니다
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientPortalLayout>
  )
}
