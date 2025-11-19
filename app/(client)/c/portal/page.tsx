'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Camera, Calendar, CreditCard, Image, FileText, CheckCircle2, Star } from 'lucide-react'

// Mock data - 실제로는 API에서 가져올 데이터
const mockCustomerData = {
  coupleName: '김철수 & 이영희',
  weddingDate: '2024-12-01', // currentStep에 따라 자동 조정 (0-3: 과거, 4-6: 미래)
  currentStep: 2, // 0: 일정확인중, 1: 일정확정, 2: 입금대기, 3: 촬영대기, 4: 사진선택, 5: 편집중, 6: 배송완료
  contractInfo: {
    contractNumber: 'MG-2025-001',
    contractDate: '2025-01-15',
    isSigned: false,
    contractUrl: '/contracts/sample.pdf'
  },
  paymentInfo: {
    bankName: '신한은행',
    accountNumber: '110-123-456789',
    accountHolder: '마인드그라피',
    amount: 1210000,
    depositAmount: 500000,
    balanceAmount: 710000,
    isPaid: false
  },
  venue: '서울 그랜드 웨딩홀',
  packageName: 'new BASIC',
  requestHistory: [
    {
      id: '1',
      content: '메이크업샵 촬영 포함 부탁드립니다.',
      createdAt: '2025-01-10T10:30:00'
    }
  ],
  photoSelectionAvailable: false,
  totalPhotos: 0,
  selectedPhotos: 0,
  maxSelections: 60,
  photographerRating: {
    rating: 0, // 0 means not rated yet, 1-5 stars
    review: '',
    submittedAt: null as string | null
  }
}

const processSteps = [
  { id: 0, label: '일정확인중', icon: Calendar },
  { id: 1, label: '일정확정', icon: CheckCircle2 },
  { id: 2, label: '입금대기', icon: CreditCard },
  { id: 3, label: '촬영대기', icon: Camera },
  { id: 4, label: '사진선택', icon: Image },
  { id: 5, label: '편집중', icon: FileText },
  { id: 6, label: '배송완료', icon: CheckCircle2 }
]

export default function PortalPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [customerData, setCustomerData] = useState(mockCustomerData)
  const [newRequest, setNewRequest] = useState('')
  const [daysUntil, setDaysUntil] = useState(0)
  const [isPast, setIsPast] = useState(false)
  const [showTestPanel, setShowTestPanel] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [review, setReview] = useState('')

  useEffect(() => {
    setIsMounted(true)
    
    // Calculate days until wedding
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weddingDate = new Date(customerData.weddingDate)
    weddingDate.setHours(0, 0, 0, 0)
    const diffTime = weddingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    setDaysUntil(Math.abs(diffDays))
    setIsPast(diffDays < 0)
    
    // Load existing rating
    setRating(customerData.photographerRating.rating)
    setReview(customerData.photographerRating.review)
  }, [customerData.weddingDate, customerData.photographerRating])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[date.getDay()]
    
    return `${year}년 ${month}월 ${day}일 (${dayName})`
  }

  const progressPercentage = ((customerData.currentStep + 1) / processSteps.length) * 100

  const handlePhotoSelection = () => {
    router.push('/c/portal/photos')
  }

  const handleAddRequest = () => {
    if (!newRequest.trim()) return
    
    const newRequestItem = {
      id: Date.now().toString(),
      content: newRequest.trim(),
      createdAt: new Date().toISOString()
    }
    
    setCustomerData(prev => ({
      ...prev,
      requestHistory: [...prev.requestHistory, newRequestItem]
    }))
    
    setNewRequest('')
    alert('요청사항이 추가되었습니다.')
  }

  const handleSubmitRating = () => {
    if (rating === 0) {
      alert('별점을 선택해 주세요')
      return
    }
    
    setCustomerData(prev => ({
      ...prev,
      photographerRating: {
        rating,
        review,
        submittedAt: new Date().toISOString()
      }
    }))
    
    // Show success message (실제로는 API 호출)
    alert('소중한 평가를 남겨주셔서 감사합니다!\n작가님께 큰 힘이 됩니다 ❤️')
  }

  const handleContractSign = () => {
    // Navigate to contract page
    router.push('/c/portal/contract')
  }

  const handleContractDownload = () => {
    // TODO: Implement actual PDF download
    alert('계약서를 다운로드합니다.')
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    router.push('/c/product-type')
  }

  // Test functions
  const setTestStep = (step: number) => {
    // 촬영대기(3)까지는 과거 날짜, 사진선택(4)부터는 미래 날짜
    const newWeddingDate = step <= 3 ? '2024-12-01' : '2025-04-12'
    const newIsPast = step <= 3
    
    setCustomerData(prev => ({
      ...prev,
      currentStep: step,
      photoSelectionAvailable: step === 4,
      weddingDate: newWeddingDate
    }))
    
    setIsPast(newIsPast)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Test Control Panel */}
      {showTestPanel && (
        <div className="bg-zinc-900 text-white p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">🧪 테스트 컨트롤 패널</h3>
              <button
                onClick={() => setShowTestPanel(false)}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                닫기 ✕
              </button>
            </div>
            
            {/* Step Selection */}
            <div className="space-y-2">
              <p className="text-xs text-zinc-400">진행 단계 변경:</p>
              <div className="grid grid-cols-7 gap-2">
                {processSteps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setTestStep(step.id)}
                    className={cn(
                      "px-2 py-1.5 text-xs rounded transition-all",
                      customerData.currentStep === step.id
                        ? "bg-white text-zinc-900 font-semibold"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    )}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                💡 촬영대기까지는 과거 날짜, 사진선택부터는 미래 날짜로 자동 전환됩니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Show Test Panel Button (when hidden) */}
      {!showTestPanel && (
        <button
          onClick={() => setShowTestPanel(true)}
          className="fixed top-4 right-4 z-50 px-4 py-2 text-xs bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-800 transition-all"
        >
          🧪 테스트 패널 열기
        </button>
      )}

      <div 
        className={cn(
          "max-w-2xl mx-auto px-4 py-12 space-y-12 transition-all duration-1000 ease-out",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-zinc-900 tracking-tight">
            {customerData.coupleName}
          </h1>
          <p className="text-sm text-zinc-500">
            Mind Portal
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* D-Day Counter */}
        <div className="text-center space-y-4 py-8">
          {customerData.currentStep <= 3 ? (
            <>
              <p className="text-sm text-zinc-500 tracking-wide">
                {isPast ? '촬영일' : '특별한 날까지'}
              </p>
              <div className="space-y-2">
                <p className="text-6xl font-light text-zinc-900 tracking-tight">
                  D-{daysUntil}
                </p>
                <p className="text-sm text-zinc-500">
                  {formatDate(customerData.weddingDate)}
                </p>
              </div>
              <p className="text-xs text-zinc-400 pt-4 leading-relaxed">
                {isPast ? '곧 만나뵙게 됩니다' : '소중한 순간을 함께 담을 수 있어 기쁩니다'}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-500 tracking-wide">
                촬영이 진행되었습니다
              </p>
              <div className="space-y-2">
                <p className="text-3xl font-light text-zinc-900 tracking-tight">
                  {formatDate(customerData.weddingDate)}
                </p>
              </div>
              <p className="text-xs text-zinc-400 pt-4 leading-relaxed">
                아름다운 순간들을 정성껏 편집하고 있습니다
              </p>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Wedding Info */}
        <div className="space-y-4 bg-zinc-50 border border-zinc-200 p-6">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">예식장</span>
            <span className="font-medium text-zinc-900">{customerData.venue}</span>
          </div>
          <div className="border-t border-zinc-200"></div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">선택 패키지</span>
            <span className="font-medium text-zinc-900">{customerData.packageName}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Progress Bar */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-zinc-900 text-center">
            진행 상황
          </h2>
          
          {/* Progress Bar Visual */}
          <div className="space-y-4">
            <Progress value={progressPercentage} className="h-2" />
            
            {/* Steps */}
            <div className="grid grid-cols-7 gap-2">
              {processSteps.map((step) => {
                const Icon = step.icon
                const isCompleted = step.id < customerData.currentStep
                const isCurrent = step.id === customerData.currentStep
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted && "bg-zinc-900 text-white",
                      isCurrent && "bg-zinc-900 text-white ring-4 ring-zinc-200",
                      !isCompleted && !isCurrent && "bg-zinc-100 text-zinc-400"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={cn(
                      "text-xs text-center leading-tight transition-colors duration-300",
                      (isCompleted || isCurrent) ? "text-zinc-900 font-medium" : "text-zinc-400"
                    )}>
                      {step.label}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Current Status Message */}
          <div className="text-center pt-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              {customerData.currentStep === 0 && '일정을 확인하고 있습니다'}
              {customerData.currentStep === 1 && '일정이 확정되었습니다'}
              {customerData.currentStep === 2 && '계약 진행 중입니다'}
              {customerData.currentStep === 3 && '촬영을 기다리고 있습니다'}
              {customerData.currentStep === 4 && '사진 선택이 가능합니다'}
              {customerData.currentStep === 5 && '사진을 편집하고 있습니다'}
              {customerData.currentStep === 6 && '배송이 완료되었습니다'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Step 0: 일정확인중 */}
        {customerData.currentStep === 0 && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                일정 확인 중
              </h2>
              
              <div className="bg-amber-50 border-2 border-amber-200 p-6 space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-amber-900 font-medium">
                    담당자가 일정을 확인하고 있습니다
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    영업일 기준 1-2일 이내에 연락드립니다<br />
                    급한 문의사항은 전화나 카카오톡으로 부탁드립니다
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 1: 일정확정 - 계약 진행 */}
        {customerData.currentStep === 1 && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                계약 진행
              </h2>
              
              <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">계약번호</span>
                    <span className="text-sm font-medium text-zinc-900 font-mono">
                      {customerData.contractInfo.contractNumber}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">계약일</span>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatDate(customerData.contractInfo.contractDate)}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">계약 상태</span>
                    <span className={cn(
                      "text-sm font-medium",
                      customerData.contractInfo.isSigned ? "text-zinc-900" : "text-amber-600"
                    )}>
                      {customerData.contractInfo.isSigned ? '서명 완료' : '서명 대기'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  {!customerData.contractInfo.isSigned ? (
                    <>
                      <Button
                        onClick={handleContractSign}
                        className={cn(
                          "w-full h-12 text-base font-normal transition-all duration-300",
                          "bg-zinc-900 hover:bg-zinc-800 text-white",
                          "active:scale-[0.98]",
                          "shadow-md hover:shadow-lg"
                        )}
                      >
                        계약서 확인 및 서명하기
                      </Button>
                      <p className="text-xs text-zinc-500 leading-relaxed text-center">
                        계약서를 확인하시고 전자 서명을 진행해 주세요
                      </p>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleContractDownload}
                        variant="outline"
                        className={cn(
                          "w-full h-12 text-base font-normal transition-all duration-300",
                          "border-2 border-zinc-300 bg-white text-zinc-700",
                          "hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
                          "active:scale-[0.98]"
                        )}
                      >
                        계약서 다운로드
                      </Button>
                      <p className="text-xs text-zinc-500 leading-relaxed text-center">
                        서명이 완료된 계약서를 다운로드할 수 있습니다
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 3: 촬영대기 - 감성 메시지 */}
        {customerData.currentStep === 3 && (
          <>
            <div className="space-y-6">
              <div className="text-center space-y-6 py-8">
                <div className="inline-block">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center animate-pulse">
                    <Camera className="w-10 h-10 text-purple-600" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl font-light text-zinc-900">
                    곧 만나뵙게 됩니다
                  </h2>
                  
                  <div className="max-w-md mx-auto space-y-3">
                    <p className="text-base text-zinc-700 leading-relaxed">
                      두 분의 특별한 순간을 담을 준비가 되어있습니다
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      설렘과 행복이 가득한 그날,<br />
                      가장 아름다운 모습을 자연스럽게 담아드리겠습니다
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-zinc-200 max-w-sm mx-auto">
                    <div className="bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-lg p-4 space-y-2">
                      <p className="text-xs text-zinc-500 font-medium">💡 촬영 당일 Tip</p>
                      <ul className="text-xs text-zinc-600 space-y-1 text-left">
                        <li className="flex items-start gap-2">
                          <span className="text-zinc-400">•</span>
                          <span>편안한 마음으로 자연스러운 표정과 모습을 보여주세요</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-zinc-400">•</span>
                          <span>원하시는 컨셉이나 포즈가 있다면 미리 말씀해 주세요</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-zinc-400">•</span>
                          <span>궁금하신 점은 언제든 작가님께 편하게 질문해 주세요</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 1, 3: 입금 안내 (일정확정 or 촬영대기) */}
        {(customerData.currentStep === 1 || customerData.currentStep === 3) && !customerData.paymentInfo.isPaid && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                입금 안내
              </h2>
              
              <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">은행</span>
                    <span className="text-sm font-medium text-zinc-900">
                      {customerData.paymentInfo.bankName}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">계좌번호</span>
                    <span className="text-sm font-medium text-zinc-900 font-mono">
                      {customerData.paymentInfo.accountNumber}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">예금주</span>
                    <span className="text-sm font-medium text-zinc-900">
                      {customerData.paymentInfo.accountHolder}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">총 금액</span>
                    <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(customerData.paymentInfo.amount)}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">계약금</span>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatCurrency(customerData.paymentInfo.depositAmount)}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-zinc-600">잔금</span>
                    <span className="text-sm font-medium text-zinc-900">
                      {formatCurrency(customerData.paymentInfo.balanceAmount)}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t-2 border-zinc-300">
                  <p className="text-xs text-zinc-500 leading-relaxed text-center">
                    입금 확인까지 영업일 기준 1-2일 소요됩니다<br />
                    입금자명이 다를 경우 연락 부탁드립니다
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 4: 사진 선택 */}
        {customerData.currentStep === 4 && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                사진 선택
              </h2>
              
              <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-zinc-600">
                    전체 {customerData.totalPhotos}장 중 {customerData.maxSelections}장 선택
                  </p>
                  <p className="text-2xl font-light text-zinc-900">
                    {customerData.selectedPhotos} / {customerData.maxSelections}
                  </p>
                </div>
                
                <Button
                  onClick={handlePhotoSelection}
                  className={cn(
                    "w-full h-12 text-base font-normal transition-all duration-300",
                    "bg-zinc-900 hover:bg-zinc-800 text-white",
                    "active:scale-[0.98]",
                    "shadow-md hover:shadow-lg"
                  )}
                >
                  사진 선택하러 가기
                </Button>
                
                <p className="text-xs text-zinc-500 leading-relaxed text-center pt-2">
                  선택 마감일까지 사진을 선택해 주세요<br />
                  선택된 사진은 세부 보정이 진행됩니다
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 4: 작가 평가 */}
        {customerData.currentStep === 4 && (
          <>
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-medium text-zinc-900">
                  작가님 평가
                </h2>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {customerData.photographerRating.rating > 0 
                    ? '소중한 평가 감사합니다 ❤️'
                    : '작가님의 노력은 여러분의 한마디에서 더 큰 힘을 얻습니다'}
                </p>
                {customerData.photographerRating.rating === 0 && (
                  <p className="text-xs text-zinc-500 leading-relaxed pt-1">
                    촬영이 완료된 후 언제든 평가를 남겨주세요<br />
                    여러분의 솔직한 의견은 작가님께 큰 도움이 됩니다
                  </p>
                )}
              </div>
              
              <div className="bg-zinc-50 border-2 border-zinc-200 p-6 space-y-6">
                {/* Star Rating */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-700 text-center">
                    {customerData.photographerRating.rating > 0 
                      ? '평가해 주신 별점'
                      : '별점을 선택해 주세요'}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled={customerData.photographerRating.rating > 0}
                        onMouseEnter={() => customerData.photographerRating.rating === 0 && setHoverRating(star)}
                        onMouseLeave={() => customerData.photographerRating.rating === 0 && setHoverRating(0)}
                        onClick={() => customerData.photographerRating.rating === 0 && setRating(star)}
                        className={cn(
                          "transition-all duration-200",
                          customerData.photographerRating.rating > 0 && "cursor-default"
                        )}
                      >
                        <Star
                          className={cn(
                            "h-10 w-10 transition-all duration-200",
                            (hoverRating >= star || rating >= star)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-300",
                            customerData.photographerRating.rating === 0 && "hover:scale-110"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && customerData.photographerRating.rating === 0 && (
                    <p className="text-center text-sm text-zinc-600 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {rating === 5 && '최고의 평가를 주셨네요! 🌟'}
                      {rating === 4 && '만족스러우셨다니 감사합니다! ✨'}
                      {rating === 3 && '평가해 주셔서 감사합니다'}
                      {rating === 2 && '아쉬운 점을 남겨주시면 개선하겠습니다'}
                      {rating === 1 && '불편하셨던 점을 자세히 알려주시면 감사하겠습니다'}
                    </p>
                  )}
                </div>

                {/* Review Text */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-700">
                    {customerData.photographerRating.rating > 0 
                      ? '남겨주신 한마디'
                      : '작가님께 한마디 (선택)'}
                  </p>
                  <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    disabled={customerData.photographerRating.rating > 0}
                    placeholder="작가님의 촬영, 소통, 편집에 대해 느낀 점을 자유롭게 적어주세요&#10;여러분의 따뜻한 한마디가 작가님께 큰 힘이 됩니다"
                    className={cn(
                      "min-h-[120px] resize-none bg-white border-zinc-300",
                      "focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
                      "text-sm leading-relaxed",
                      customerData.photographerRating.rating > 0 && "bg-zinc-100"
                    )}
                  />
                  <p className="text-xs text-zinc-500 text-right">
                    {review.length} / 500자
                  </p>
                </div>

                {/* Submit Button */}
                {customerData.photographerRating.rating === 0 && (
                  <Button
                    onClick={handleSubmitRating}
                    disabled={rating === 0}
                    className={cn(
                      "w-full h-12 text-base font-normal transition-all duration-300",
                      rating === 0
                        ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                        : "bg-zinc-900 hover:bg-zinc-800 text-white active:scale-[0.98] shadow-md hover:shadow-lg"
                    )}
                  >
                    평가 완료하기
                  </Button>
                )}

                {customerData.photographerRating.rating > 0 && (
                  <div className="text-center space-y-2 pt-2">
                    <p className="text-sm text-zinc-600">
                      {new Date(customerData.photographerRating.submittedAt!).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}에 평가를 남겨주셨습니다
                    </p>
                    <p className="text-xs text-zinc-500">
                      소중한 의견 진심으로 감사드립니다 🙏
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 5: 편집중 */}
        {customerData.currentStep === 5 && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                사진 편집 중
              </h2>
              
              <div className="bg-blue-50 border-2 border-blue-200 p-6 space-y-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-blue-900 font-medium">
                    선택하신 사진을 정성껏 보정하고 있습니다
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    아름다운 추억을 담은 앨범을 패키징하고 있으니<br />
                    조금만 더 기다려 주세요
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center space-x-2 text-xs text-blue-600">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                      <span>편집 진행 중...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 6: 배송완료 */}
        {customerData.currentStep === 6 && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                배송 완료
              </h2>
              
              <div className="bg-gradient-to-br from-zinc-50 to-white border-2 border-zinc-200 p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-base text-zinc-900 font-medium">
                      모든 작업이 완료되었습니다
                    </p>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      소중한 순간을 함께할 수 있어 영광이었습니다
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-200">
                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                      "특별한 날의 아름다운 기억이<br />
                      오래도록 행복한 추억으로 남기를 바랍니다"
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-sm text-zinc-700 font-light">
                      - 마인드그라피 올림 -
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Requests (모든 단계에서 표시) */}
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-zinc-900 text-center">
            요청사항
          </h2>
          
          {/* Request History */}
          {customerData.requestHistory.length > 0 && (
            <div className="space-y-3">
              {customerData.requestHistory.map((request) => {
                const date = new Date(request.createdAt)
                const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                
                return (
                  <div
                    key={request.id}
                    className="bg-zinc-50 border border-zinc-200 p-4 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <p className="text-xs text-zinc-400 font-mono">
                      {formattedDate}
                    </p>
                    <p className="text-sm text-zinc-900 leading-relaxed whitespace-pre-wrap">
                      {request.content}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
          
          {/* New Request Input */}
          <div className="space-y-4">
            <Textarea
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              placeholder="새로운 요청사항을 작성해 주세요"
              className="min-h-[120px] text-sm leading-relaxed border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0 resize-none"
            />
            
            <Button
              onClick={handleAddRequest}
              disabled={!newRequest.trim()}
              variant="outline"
              className={cn(
                "w-full h-12 text-base font-normal transition-all duration-300",
                "border-2 border-zinc-300 bg-white text-zinc-700",
                "hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
                "active:scale-[0.98]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-zinc-300 disabled:hover:bg-white disabled:hover:text-zinc-700"
              )}
            >
              요청사항 추가
            </Button>
            
            <p className="text-xs text-zinc-500 leading-relaxed text-center">
              작성한 내용은 날짜와 함께 기록됩니다<br />
              급한 문의는 전화나 카카오톡으로 부탁드립니다
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Logout Button */}
        <div className="pt-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-sm text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* Footer - 기존 ClientFooter 컴포넌트 사용 */}
      <div className="max-w-2xl mx-auto px-4 pb-12">
        <div className="border-t border-zinc-200 pt-8">
          <div className="space-y-6 text-center">
            {/* Contact Info */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-900">
                문의하기
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="tel:02-2202-9966"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  📞 02-2202-9966
                </a>
                <span className="text-zinc-300">|</span>
                <a
                  href="https://pf.kakao.com/_xjBxexj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  💬 카카오톡 문의
                </a>
              </div>
            </div>

            {/* Address */}
            <p className="text-xs text-zinc-400">
              서울 성동구 마조로15길 6 1층
            </p>

            {/* Instagram */}
            <div>
              <a
                href="https://www.instagram.com/studio.mind.graphy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @studio.mind.graphy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

