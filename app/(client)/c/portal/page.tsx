'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Camera, Calendar, CreditCard, Image, FileText, CheckCircle2, Star, Share2, ExternalLink, Edit, Clock, MapPin, Home, User, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAllClientFormData } from '@/lib/utils/session-storage'
import { 
  getCustomerByPhone, 
  getProjectByCustomerId, 
  mapLeadStatusToCurrentStep 
} from '@/lib/utils/customer-registration'
import type { Customer, Project, Product } from '@/lib/types'

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
  // Mock으로 옵션 추가 (테스트용)
  optionIds: ['option-3', 'option-2'],
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
  },
  webGallery: {
    id: 'gallery-1',
    galleryId: 'abc123',
    title: '김철수 & 이영희 웨딩 갤러리',
    sharedUrl: '/gallery/abc123',
    photoCount: 12,
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z'
  },
  timeTable: {
    id: 'timetable-1',
    projectId: 'project-1',
    title: '2025.06.15 (토) 타임 테이블',
    isActive: true,
    entries: [
      {
        id: 'entry-1',
        time: '06:30',
        timeModifier: 'estimated',
        event: '헤어.메이크업 인',
        location: '겐그레아',
        notes: ''
      },
      {
        id: 'entry-2',
        time: '09:30',
        timeModifier: 'estimated',
        event: '헤어.메이크업 아웃',
        location: '겐그레아',
        notes: ''
      },
      {
        id: 'entry-3',
        time: '09:50',
        timeModifier: 'around',
        event: '식장 도착 예정',
        location: '',
        notes: '네이버 AI : 5분 이동시간 예측'
      },
      {
        id: 'entry-4',
        time: '10:00',
        timeModifier: 'exact',
        event: '신랑님 혼주 메이크업 완료후 도착',
        location: '플리페',
        notes: ''
      },
      {
        id: 'entry-5',
        time: '10:00',
        timeModifier: 'exact',
        event: '신부님 혼주 메이크업 완료후 도착',
        location: '(출장) 근처',
        notes: ''
      },
      {
        id: 'entry-6',
        time: '10:00',
        timeModifier: 'exact',
        event: '촬영자 도착 (원판선진행)',
        location: '',
        notes: ''
      },
      {
        id: 'entry-7',
        time: '10:30',
        timeModifier: 'exact',
        event: '하객맞이 시작',
        location: '',
        notes: ''
      },
      {
        id: 'entry-8',
        time: '11:30',
        timeModifier: 'exact',
        event: '예식 시작',
        location: '',
        notes: ''
      }
    ]
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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [realCustomer, setRealCustomer] = useState<Customer | null>(null)
  const [realProject, setRealProject] = useState<Project | null>(null)
  const [mockProducts, setMockProducts] = useState<Product[]>([])

  // Load mockProducts on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { mockProducts: products } = await import('@/lib/mock/settings')
        setMockProducts(products)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }
    loadProducts()
  }, [])
  
  // 앨범 수령 주소지 정보
  const [deliveryAddress, setDeliveryAddress] = useState({
    recipientName: '',
    recipientPhone: '',
    postalCode: '',
    address: '',
    detailAddress: '',
    deliveryRequest: ''
  })
  const [isAddressSaved, setIsAddressSaved] = useState(false)

  // 로그인 확인 및 실제 고객 데이터 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem('mindgraphy_client_logged_in')
      
      if (!isLoggedIn) {
        router.replace('/c/login')
        return
      }
      
      // 로그인한 전화번호로 고객 데이터 조회
      const phone = sessionStorage.getItem('mindgraphy_client_phone')
      if (phone) {
        const customer = getCustomerByPhone(phone)
        if (customer) {
          setRealCustomer(customer)
          
          // 고객의 프로젝트 조회
          const project = getProjectByCustomerId(customer.id)
          if (project) {
            setRealProject(project)
            
            // leadStatus와 projectStatus를 기반으로 currentStep 계산
            const calculatedStep = mapLeadStatusToCurrentStep(
              customer.leadStatus,
              project.projectStatus,
              false // TODO: 실제 결제 상태 확인
            )
            
            // Mock 데이터 업데이트
            setCustomerData(prev => ({
              ...prev,
              currentStep: calculatedStep,
              coupleName: `${customer.groomName} & ${customer.brideName}`,
              venue: project.weddingVenue || prev.venue,
              weddingDate: project.weddingDate || prev.weddingDate,
              packageName: project.packageId || prev.packageName
            }))
          }
        }
      }
      
      setIsCheckingAuth(false)
    }
  }, [router])

  useEffect(() => {
    if (isCheckingAuth) return
    
    setIsMounted(true)
    
    // Load selected options from real project, session storage, or mock data
    if (realProject && realProject.optionIds && realProject.optionIds.length > 0) {
      setSelectedOptions(realProject.optionIds)
    } else {
      const formData = getAllClientFormData()
      if (formData && formData.optionIds && formData.optionIds.length > 0) {
        setSelectedOptions(formData.optionIds)
      } else if (mockCustomerData.optionIds) {
        // Fallback to mock data
        setSelectedOptions(mockCustomerData.optionIds)
      }
    }
    
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
    
    // Load saved delivery address from localStorage
    const savedAddress = localStorage.getItem('mindgraphy_delivery_address')
    if (savedAddress) {
      try {
        const parsed = JSON.parse(savedAddress)
        setDeliveryAddress(parsed)
        setIsAddressSaved(true)
      } catch (e) {
        console.error('Failed to parse saved address:', e)
      }
    }
  }, [isCheckingAuth, realProject, customerData.weddingDate, customerData.photographerRating.rating, customerData.photographerRating.review])

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

  const handleSaveAddress = () => {
    console.log('[Portal] handleSaveAddress called with:', deliveryAddress)
    
    // Validation
    if (!deliveryAddress.recipientName.trim()) {
      console.log('[Portal] Validation failed: recipientName')
      alert('수령인 이름을 입력해 주세요')
      return
    }
    if (!deliveryAddress.recipientPhone.trim()) {
      console.log('[Portal] Validation failed: recipientPhone')
      alert('연락처를 입력해 주세요')
      return
    }
    if (!deliveryAddress.postalCode.trim()) {
      console.log('[Portal] Validation failed: postalCode')
      alert('우편번호를 입력해 주세요')
      return
    }
    if (!deliveryAddress.address.trim()) {
      console.log('[Portal] Validation failed: address')
      alert('주소를 입력해 주세요')
      return
    }
    if (!deliveryAddress.detailAddress.trim()) {
      console.log('[Portal] Validation failed: detailAddress')
      alert('상세주소를 입력해 주세요')
      return
    }
    
    console.log('[Portal] All validations passed, saving address...')
    
    // Save to localStorage
    localStorage.setItem('mindgraphy_delivery_address', JSON.stringify(deliveryAddress))
    setIsAddressSaved(true)
    
    console.log('[Portal] Address saved successfully:', deliveryAddress)
    alert('앨범 수령 주소가 저장되었습니다')
  }
  
  const handleEditAddress = () => {
    setIsAddressSaved(false)
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
    router.push('/c/login')
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

  // 로그인 확인 중
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          <p className="text-sm text-zinc-600">로그인 확인 중...</p>
        </div>
      </div>
    )
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
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-zinc-900 tracking-tight">
              {customerData.coupleName}
            </h1>
            <p className="text-sm text-zinc-500">
              Mind Portal
            </p>
          </div>
          
          {/* Terms Link */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/c/notification')}
              className="gap-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300"
            >
              <FileText className="h-3.5 w-3.5" />
              촬영 약관 및 안내
            </Button>
          </div>
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
          
          {/* 선택한 옵션 표시 */}
          {selectedOptions.length > 0 && (
            <>
              <div className="border-t border-zinc-200"></div>
              <div className="space-y-2">
                <span className="text-sm text-zinc-600">선택 옵션</span>
                <div className="space-y-1.5">
                  {selectedOptions.map((optionId) => {
                    const option = mockProducts.find(p => p.id === optionId)
                    return option ? (
                      <div key={optionId} className="flex items-start gap-2">
                        <span className="text-zinc-400 text-sm mt-0.5">•</span>
                        <span className="text-sm font-medium text-zinc-900">
                          {option.title}
                        </span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </>
          )}
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
              {customerData.currentStep === 2 && '결제를 기다리고 있습니다'}
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
                  
                  <div className="pt-6 space-y-4 max-w-sm mx-auto">
                    <Button
                      onClick={() => router.push('/c/portal/wedding-details')}
                      className={cn(
                        "w-full h-12 text-base font-normal transition-all duration-300",
                        "bg-purple-600 hover:bg-purple-700 text-white",
                        "active:scale-[0.98]",
                        "shadow-md hover:shadow-lg",
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <Edit className="h-5 w-5" />
                      예식 상세 정보 입력하기
                    </Button>
                    
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

        {/* Step 2: 입금 안내 (입금대기) */}
        {customerData.currentStep === 2 && !customerData.paymentInfo.isPaid && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                결제 안내
              </h2>
              
              {/* 결제 금액 정보 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 space-y-4 rounded-lg">
                <div className="text-center space-y-2">
                  <p className="text-sm text-zinc-600">결제하실 금액</p>
                  <p className="text-3xl font-bold text-zinc-900">
                    {formatCurrency(customerData.paymentInfo.depositAmount)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    계약금 ({formatCurrency(customerData.paymentInfo.amount)} 중)
                  </p>
                </div>
                
                <div className="bg-white/60 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2 text-xs text-zinc-600">
                    <div className="flex justify-between">
                      <span>총 계약금액</span>
                      <span className="font-medium text-zinc-900">
                        {formatCurrency(customerData.paymentInfo.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>계약금 (선불)</span>
                      <span className="font-semibold text-blue-700">
                        {formatCurrency(customerData.paymentInfo.depositAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>잔금 (촬영 후)</span>
                      <span className="font-medium text-zinc-600">
                        {formatCurrency(customerData.paymentInfo.balanceAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 결제 방법 선택 */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-700 mb-1">
                    결제 수단을 선택해 주세요
                  </p>
                  <p className="text-xs text-zinc-500">
                    토스페이먼츠로 안전하게 결제됩니다
                  </p>
                </div>

                {/* 토스페이먼츠 카드 결제 버튼 */}
                <Button
                  onClick={() => {
                    // TODO: 토스페이먼츠 카드 결제 연동
                    alert('토스페이먼츠 카드 결제가 곧 지원됩니다')
                  }}
                  className={cn(
                    "w-full h-14 text-base font-medium transition-all duration-300",
                    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                    "active:scale-[0.98]",
                    "shadow-lg hover:shadow-xl",
                    "flex items-center justify-between gap-3 px-6"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div className="text-left">
                      <p className="text-base font-semibold">카드 결제</p>
                      <p className="text-xs text-blue-100 font-normal">
                        모든 카드 / 간편결제
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-100">›</span>
                </Button>

                {/* 토스페이먼츠 계좌이체 버튼 */}
                <Button
                  onClick={() => {
                    // TODO: 토스페이먼츠 계좌이체 연동
                    alert('토스페이먼츠 계좌이체가 곧 지원됩니다')
                  }}
                  variant="outline"
                  className={cn(
                    "w-full h-14 text-base font-medium transition-all duration-300",
                    "border-2 border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900",
                    "active:scale-[0.98]",
                    "shadow-sm hover:shadow-md",
                    "flex items-center justify-between gap-3 px-6"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div className="text-left">
                      <p className="text-base font-semibold">계좌이체</p>
                      <p className="text-xs text-zinc-500 font-normal">
                        실시간 계좌이체
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400">›</span>
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-zinc-500">또는</span>
                  </div>
                </div>

                {/* 무통장입금 안내 */}
                <div className="bg-zinc-50 border border-zinc-200 p-5 space-y-3 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-700 mb-3">
                      무통장 입금 안내
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600">은행</span>
                      <span className="font-medium text-zinc-900">
                        {customerData.paymentInfo.bankName}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600">계좌번호</span>
                      <span className="font-medium text-zinc-900 font-mono">
                        {customerData.paymentInfo.accountNumber}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-600">예금주</span>
                      <span className="font-medium text-zinc-900">
                        {customerData.paymentInfo.accountHolder}
                      </span>
                    </div>
                    
                    <div className="border-t border-zinc-200 pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-600">입금액</span>
                        <span className="font-bold text-zinc-900">
                          {formatCurrency(customerData.paymentInfo.depositAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const accountInfo = `${customerData.paymentInfo.bankName} ${customerData.paymentInfo.accountNumber}`
                      try {
                        await navigator.clipboard.writeText(accountInfo)
                        alert('계좌번호가 복사되었습니다!')
                      } catch (err) {
                        const textArea = document.createElement('textarea')
                        textArea.value = accountInfo
                        document.body.appendChild(textArea)
                        textArea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textArea)
                        alert('계좌번호가 복사되었습니다!')
                      }
                    }}
                    className="w-full text-xs h-9"
                  >
                    계좌번호 복사하기
                  </Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-xs text-amber-800 leading-relaxed text-center">
                    💡 카드 결제 및 계좌이체는 즉시 확인됩니다<br />
                    무통장 입금은 영업일 기준 1-2일 소요되며,<br />
                    입금자명이 다를 경우 연락 부탁드립니다
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Web Gallery Link - Step 4에서 우선 표시 */}
        {customerData.currentStep === 4 && customerData.webGallery && customerData.webGallery.isActive && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                웹 갤러리
              </h2>
              
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 p-6 space-y-4 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Image className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {customerData.webGallery.title}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      총 {customerData.webGallery.photoCount}장의 사진이 업로드되었습니다
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => {
                      const url = typeof window !== 'undefined' 
                        ? window.location.origin + customerData.webGallery!.sharedUrl 
                        : customerData.webGallery!.sharedUrl
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                    className={cn(
                      "w-full h-12 text-base font-normal transition-all duration-300",
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
                      "active:scale-[0.98]",
                      "shadow-md hover:shadow-lg",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    <ExternalLink className="h-5 w-5" />
                    갤러리 보러가기
                  </Button>
                  
                  <div className="bg-white/60 border border-purple-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Share2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium text-zinc-700">
                          지인들과 공유하기
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          아래 링크를 복사하여 가족, 친구들에게 공유하실 수 있습니다
                        </p>
                        <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded text-xs font-mono text-zinc-700 break-all">
                          {typeof window !== 'undefined' ? window.location.origin + customerData.webGallery!.sharedUrl : customerData.webGallery!.sharedUrl}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const url = typeof window !== 'undefined' 
                              ? window.location.origin + customerData.webGallery!.sharedUrl 
                              : customerData.webGallery!.sharedUrl
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
                          }}
                          className="w-full mt-2 text-xs h-8"
                        >
                          링크 복사하기
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-500 text-center leading-relaxed">
                    💡 갤러리는 비밀번호(대표 번호 뒤 4자리)로 보호되어 있습니다
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Step 4: 사진 선택 - 제거됨 (사진 선택 기능 불필요) */}
        {customerData.currentStep === 4 && null}

        {customerData.currentStep === 4 && (
          <>
            {/* 앨범 수령 주소지 입력 */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-900">
                  앨범 수령 주소지
                </h2>
                {isAddressSaved && (
                  <Button
                    onClick={handleEditAddress}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    수정
                  </Button>
                )}
              </div>
              
              {isAddressSaved ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 space-y-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 mb-4">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">주소가 저장되었습니다</span>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-green-700 mt-0.5" />
                      <div>
                        <div className="text-xs text-green-700 mb-0.5">수령인</div>
                        <div className="font-medium text-green-900">{deliveryAddress.recipientName}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-green-700 mt-0.5" />
                      <div>
                        <div className="text-xs text-green-700 mb-0.5">연락처</div>
                        <div className="font-medium text-green-900">{deliveryAddress.recipientPhone}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-green-700 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-green-700 mb-0.5">배송 주소</div>
                        <div className="font-medium text-green-900">
                          [{deliveryAddress.postalCode}] {deliveryAddress.address}
                        </div>
                        <div className="font-medium text-green-900 mt-1">
                          {deliveryAddress.detailAddress}
                        </div>
                      </div>
                    </div>
                    
                    {deliveryAddress.deliveryRequest && (
                      <div className="flex items-start gap-3">
                        <FileText className="h-4 w-4 text-green-700 mt-0.5" />
                        <div>
                          <div className="text-xs text-green-700 mb-0.5">배송 요청사항</div>
                          <div className="text-green-900">{deliveryAddress.deliveryRequest}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-zinc-300 p-6 space-y-5 rounded-lg">
                  <p className="text-sm text-zinc-600 text-center leading-relaxed">
                    앨범을 수령하실 주소를 입력해 주세요
                  </p>
                  
                  <div className="space-y-4">
                    {/* 수령인 정보 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipientName" className="text-sm font-medium text-zinc-700 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          수령인 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="recipientName"
                          placeholder="이름을 입력하세요"
                          value={deliveryAddress.recipientName}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, recipientName: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientPhone" className="text-sm font-medium text-zinc-700 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          연락처 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="recipientPhone"
                          placeholder="010-0000-0000"
                          value={deliveryAddress.recipientPhone}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, recipientPhone: e.target.value }))}
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    {/* 주소 입력 */}
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-sm font-medium text-zinc-700 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        우편번호 <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="postalCode"
                          placeholder="우편번호"
                          value={deliveryAddress.postalCode}
                          onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          className="h-11 flex-1"
                          maxLength={5}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="h-11 px-6 whitespace-nowrap"
                          onClick={() => alert('우편번호 검색 기능은 추후 구현 예정입니다')}
                        >
                          우편번호 검색
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium text-zinc-700 flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        주소 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        placeholder="주소를 입력하세요"
                        value={deliveryAddress.address}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="detailAddress" className="text-sm font-medium text-zinc-700">
                        상세주소 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="detailAddress"
                        placeholder="상세주소를 입력하세요 (예: 101동 1001호)"
                        value={deliveryAddress.detailAddress}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, detailAddress: e.target.value }))}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryRequest" className="text-sm font-medium text-zinc-700">
                        배송 요청사항 <span className="text-zinc-400 text-xs font-normal">(선택)</span>
                      </Label>
                      <Textarea
                        id="deliveryRequest"
                        placeholder="배송 시 요청사항을 입력하세요 (예: 부재 시 경비실에 맡겨주세요)"
                        value={deliveryAddress.deliveryRequest}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, deliveryRequest: e.target.value }))}
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    
                    <Button
                      onClick={handleSaveAddress}
                      className={cn(
                        "w-full h-12 text-base font-normal transition-all duration-300",
                        "bg-green-600 hover:bg-green-700 text-white",
                        "active:scale-[0.98]",
                        "shadow-md hover:shadow-lg"
                      )}
                    >
                      <Home className="mr-2 h-5 w-5" />
                      주소 저장하기
                    </Button>
                    
                    <p className="text-xs text-zinc-500 text-center leading-relaxed pt-2">
                      앨범은 사진 선택 및 보정 완료 후<br />
                      등록하신 주소로 배송됩니다
                    </p>
                  </div>
                </div>
              )}
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

        {/* Time Table - 촬영 대기 중일 때 표시 */}
        {customerData.currentStep === 3 && customerData.timeTable && customerData.timeTable.isActive && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                당일 타임 테이블
              </h2>
              
              <div className="bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border-2 border-blue-200 p-6 space-y-5 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {customerData.timeTable.title}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      촬영 당일 일정표가 준비되었습니다
                    </p>
                  </div>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-5 space-y-4">
                  <div className="space-y-3">
                    {customerData.timeTable.entries.map((entry: any) => (
                      <div key={entry.id} className="flex gap-4 text-sm">
                        <div className="font-mono text-blue-700 font-semibold min-w-[100px] flex-shrink-0">
                          {entry.time}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium text-zinc-900">
                            {entry.event}
                          </p>
                          {entry.location && (
                            <p className="text-zinc-600 text-xs">
                              - 장소 : {entry.location}
                            </p>
                          )}
                          {entry.notes && (
                            <p className="text-zinc-500 text-xs italic">
                              ({entry.notes})
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/60 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-medium text-zinc-700">
                        안내사항
                      </p>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        • 상기 시간은 예상 시간으로 당일 상황에 따라 변경될 수 있습니다<br />
                        • 여유 있게 일정을 준비해 주시면 감사하겠습니다<br />
                        • 궁금하신 사항은 언제든지 문의해 주세요
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-zinc-500 text-center leading-relaxed">
                  💡 소중한 날을 위해 철저히 준비하겠습니다
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-200"></div>
          </>
        )}

        {/* Web Gallery Link - Step 5, 6에서 표시 (Step 4는 위에서 먼저 표시) */}
        {customerData.currentStep >= 5 && customerData.webGallery && customerData.webGallery.isActive && (
          <>
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-zinc-900 text-center">
                웹 갤러리
              </h2>
              
              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 p-6 space-y-4 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Image className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {customerData.webGallery.title}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      총 {customerData.webGallery.photoCount}장의 사진이 업로드되었습니다
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button
                    onClick={() => {
                      const url = typeof window !== 'undefined' 
                        ? window.location.origin + customerData.webGallery!.sharedUrl 
                        : customerData.webGallery!.sharedUrl
                      window.open(url, '_blank', 'noopener,noreferrer')
                    }}
                    className={cn(
                      "w-full h-12 text-base font-normal transition-all duration-300",
                      "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white",
                      "active:scale-[0.98]",
                      "shadow-md hover:shadow-lg",
                      "flex items-center justify-center gap-2"
                    )}
                  >
                    <ExternalLink className="h-5 w-5" />
                    갤러리 보러가기
                  </Button>
                  
                  <div className="bg-white/60 border border-purple-200 rounded-lg p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <Share2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 space-y-1">
                        <p className="text-xs font-medium text-zinc-700">
                          지인들과 공유하기
                        </p>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          아래 링크를 복사하여 가족, 친구들에게 공유하실 수 있습니다
                        </p>
                        <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded text-xs font-mono text-zinc-700 break-all">
                          {typeof window !== 'undefined' ? window.location.origin + customerData.webGallery!.sharedUrl : customerData.webGallery!.sharedUrl}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const url = typeof window !== 'undefined' 
                              ? window.location.origin + customerData.webGallery!.sharedUrl 
                              : customerData.webGallery!.sharedUrl
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
                          }}
                          className="w-full mt-2 text-xs h-8"
                        >
                          링크 복사하기
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-zinc-500 text-center leading-relaxed">
                    💡 갤러리는 비밀번호(대표 번호 뒤 4자리)로 보호되어 있습니다
                  </p>
                </div>
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

        {/* Requests (촬영 전까지만 표시 - Step 0~3) */}
        {customerData.currentStep <= 3 && (
          <>
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
          </>
        )}

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
    </div>
  )
}

