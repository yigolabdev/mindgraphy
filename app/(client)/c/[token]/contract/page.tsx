'use client'

import { use, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ContractPdfViewer } from '@/components/client/contract-pdf-viewer'
import { SignatureCanvasComponent, type SignatureCanvasRef } from '@/components/client/signature-canvas'
import { getClientDataByToken } from '@/lib/mock/client'
import { ROUTES } from '@/lib/constants'
import { CheckCircle2, AlertCircle, FileCheck, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ContractPageProps {
  params: Promise<{ token: string }>
}

export default function ContractPage({ params }: ContractPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const clientData = getClientDataByToken(token)
  const signatureRef = useRef<SignatureCanvasRef>(null)

  // State
  const [terms, setTerms] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    photoUsage: false,
    refundPolicy: false
  })
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [isSigned, setIsSigned] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!clientData) {
    router.push(`/c/${token}/invalid`)
    return null
  }

  const allTermsAccepted = Object.values(terms).every(Boolean)
  const canSign = allTermsAccepted
  const canSubmit = allTermsAccepted && signatureData && isSigned

  const handleTermChange = (key: keyof typeof terms) => {
    setTerms(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSign = () => {
    if (!signatureRef.current) return

    if (signatureRef.current.isEmpty()) {
      toast.error('서명을 해주세요')
      return
    }

    const dataUrl = signatureRef.current.toDataURL()
    setSignatureData(dataUrl)
    setIsSigned(true)
    toast.success('서명이 저장되었습니다')
  }

  const handleClearSignature = () => {
    signatureRef.current?.clear()
    setSignatureData(null)
    setIsSigned(false)
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error('모든 약관에 동의하고 서명을 완료해주세요')
      return
    }

    setIsSubmitting(true)

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In real implementation, this would update the backend
    // For now, we just show success and redirect to next step
    toast.success('계약이 완료되었습니다! 다음 단계로 이동합니다.')
    
    // Redirect to next step: Info
    setTimeout(() => {
      router.push(ROUTES.CLIENT_INFO(token))
    }, 1000)
  }

  return (
    <ClientPortalLayout token={token}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">계약서 확인 및 서명</h1>
            <p className="text-muted-foreground">
              계약 내용을 확인하시고 전자 서명을 진행해주세요
            </p>
          </div>
          {clientData.steps.contract.status === 'completed' && (
            <Badge className="bg-green-600">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              서명 완료
            </Badge>
          )}
        </div>

        {/* Progress Alert */}
        {!isSigned && (
          <Card className="border-blue-500 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    계약서 서명 절차
                  </h3>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>아래 계약서 내용을 꼼꼼히 확인해주세요</li>
                    <li>필수 약관에 모두 동의해주세요</li>
                    <li>전자 서명 영역에 서명해주세요</li>
                    <li>&quot;계약 완료&quot; 버튼을 눌러 제출하세요</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract PDF */}
        <ContractPdfViewer
          contractId={clientData.contractId}
          contractTitle="웨딩 촬영 서비스 계약서"
          packageName={clientData.packageName}
        />

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              약관 동의 (필수)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'serviceTerms', label: '서비스 이용약관에 동의합니다' },
              { key: 'privacyPolicy', label: '개인정보 처리방침에 동의합니다' },
              { key: 'photoUsage', label: '사진 저작권 및 초상권 관련 조항에 동의합니다' },
              { key: 'refundPolicy', label: '취소 및 환불 정책에 동의합니다' }
            ].map(({ key, label }) => (
              <label
                key={key}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                  terms[key as keyof typeof terms]
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                )}
              >
                <Checkbox
                  checked={terms[key as keyof typeof terms]}
                  onCheckedChange={() => handleTermChange(key as keyof typeof terms)}
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}

            {!allTermsAccepted && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                모든 약관에 동의해야 서명을 진행할 수 있습니다
              </p>
            )}
          </CardContent>
        </Card>

        {/* Signature Section */}
        <div className={cn(
          "transition-opacity duration-300",
          !canSign && "opacity-50 pointer-events-none"
        )}>
          <SignatureCanvasComponent ref={signatureRef} />
          
          <div className="mt-4 flex gap-2">
            <Button
              onClick={handleSign}
              disabled={!canSign}
              className="flex-1"
            >
              서명 저장
            </Button>
            <Button
              onClick={handleClearSignature}
              variant="outline"
              disabled={!canSign}
            >
              다시 작성
            </Button>
          </div>
        </div>

        {/* Signature Preview */}
        {signatureData && isSigned && (
          <Card className="border-green-500 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-green-900">
                <CheckCircle2 className="h-5 w-5" />
                서명 미리보기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {clientData.groomName} & {clientData.brideName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      서명일: {new Date().toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSignature}
                  >
                    재작성
                  </Button>
                </div>
                <img
                  src={signatureData}
                  alt="서명"
                  className="w-full max-w-md h-32 object-contain border rounded"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isSubmitting ? (
                '처리중...'
              ) : (
                <>
                  계약 완료
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
            {!canSubmit && (
              <p className="text-xs text-center text-muted-foreground mt-3">
                모든 약관 동의와 서명이 완료되면 제출할 수 있습니다
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientPortalLayout>
  )
}
