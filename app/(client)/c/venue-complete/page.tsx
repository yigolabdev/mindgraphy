'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getAllClientFormData, type ClientFormData } from '@/lib/utils/session-storage'
import { mockProducts } from '@/lib/mock/settings'
import { User, Lock, Info } from 'lucide-react'

export default function VenueCompletePage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [formData, setFormData] = useState<ClientFormData | null>(null)
  const [packageName, setPackageName] = useState('')

  useEffect(() => {
    // Load form data from session using utility function
    const data = getAllClientFormData()
    setFormData(data)
    
    // Get package name from product data
    if (data.packageId) {
      const product = mockProducts.find(p => p.id === data.packageId)
      setPackageName(product ? product.name : data.packageId)
    }

    // TODO: [BACKEND] 자동 계정 생성 플로우
    // 모든 고객 정보 입력이 완료되면 자동으로 마인드 포털 계정을 생성합니다.
    // 
    // 계정 정보:
    // - 아이디(ID): 대표 전화번호 (data.mainContact === 'groom' ? data.groomPhone : data.bridePhone)
    // - 비밀번호(PW): 대표 전화번호 뒤 4자리
    // - 고객 데이터: getAllClientFormData()로 수집된 모든 정보
    //
    // API 엔드포인트 예시:
    // POST /api/customers/auto-register
    // Body: {
    //   productType: data.productType,
    //   groomName: data.groomName,
    //   brideName: data.brideName,
    //   groomPhone: data.groomPhone,
    //   bridePhone: data.bridePhone,
    //   mainContact: data.mainContact,
    //   email: data.email,
    //   packageId: data.packageId,
    //   optionIds: data.optionIds,
    //   weddingDate: data.weddingDate,
    //   weddingTime: data.weddingTime,
    //   weddingVenue: data.weddingVenue,
    //   venueAddress: data.venueAddress,
    //   referralSource: data.referralSource,
    //   specialRequests: data.specialRequests,
    //   leadStatus: 'inquiry', // 초기 상태는 'inquiry' (일정 미확정)
    //   sourceChannel: '고객용 페이지'
    // }
    //
    // Response: {
    //   success: boolean,
    //   customerId: string,
    //   portalCredentials: {
    //     username: string (전화번호),
    //     tempPassword: string (뒤 4자리),
    //     portalUrl: string ('/c/portal')
    //   }
    // }
    //
    // 참고: BACKEND_IMPLEMENTATION.md 파일 참조

    // Fade in on mount
    setTimeout(() => {
      setIsMounted(true)
    }, 100)
  }, [])

  const formatWeddingDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dayNames = ['일', '월', '화', '수', '목', '금', '토']
    const dayName = dayNames[date.getDay()]
    
    return `${year}년 ${month}월 ${day}일 (${dayName})`
  }

  const formatWeddingTime = (timeString: string) => {
    if (!timeString) return ''
    
    // "undecided" 체크
    if (timeString === 'undecided') {
      return '미정'
    }
    
    // HH:MM 형식을 오전/오후 형식으로 변환
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const min = minutes || '00'
    
    if (hour < 12) {
      return `오전 ${hour}시 ${min}분`
    } else if (hour === 12) {
      return `오후 12시 ${min}분`
    } else {
      return `오후 ${hour - 12}시 ${min}분`
    }
  }

  const handleGoHome = () => {
    // Clear session storage and go to home
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    router.push('/')
  }

  const handleGoToPortal = () => {
    // Clear session storage and go to portal
    if (typeof window !== 'undefined') {
      sessionStorage.clear()
    }
    router.push('/c/portal')
  }

  // 대표 연락처 가져오기
  const getMainPhone = () => {
    if (!formData) return ''
    if (formData.mainContact === 'groom') {
      return formData.groomPhone || formData.phone || ''
    } else {
      return formData.bridePhone || formData.phone || ''
    }
  }

  // 비밀번호 (대표 전화번호 뒤 4자리)
  const getPasswordHint = () => {
    const mainPhone = getMainPhone()
    if (!mainPhone) return '****'
    const digits = mainPhone.replace(/\D/g, '')
    return digits.slice(-4) || '****'
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 overflow-hidden">
      <div 
        className={cn(
          "max-w-md w-full space-y-12 transition-all duration-1000 ease-out",
          isMounted 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        )}
      >
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-zinc-900 flex items-center justify-center animate-in zoom-in duration-700">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>

        {/* Header */}
        <div className="space-y-6 text-center">
          <h1 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            소중한 순간을
          </h1>
          <h2 className="text-2xl font-light text-zinc-900 tracking-tight leading-relaxed">
            함께하게 되어 영광입니다
          </h2>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Summary */}
        {formData && (
          <div className="space-y-4 bg-zinc-50 p-6 border border-zinc-200">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">신랑 신부</span>
                <span className="text-zinc-900 font-medium">
                  {formData.groomName} · {formData.brideName}
                </span>
              </div>
              
              <div className="border-t border-zinc-200"></div>
              
              <div className="flex justify-between">
                <span className="text-zinc-600">대표 연락처</span>
                <span className="text-zinc-900 font-medium">
                  {getMainPhone()}
                </span>
              </div>
              
              <div className="border-t border-zinc-200"></div>
              
              {formData.email && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">이메일</span>
                    <span className="text-zinc-900 font-medium">
                      {formData.email}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                </>
              )}
              
              {packageName && (
                <>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">선택 패키지</span>
                    <span className="text-zinc-900 font-medium">
                      {packageName}
                    </span>
                  </div>
                  
                  <div className="border-t border-zinc-200"></div>
                </>
              )}
              
              <div className="flex justify-between items-start">
                <span className="text-zinc-600">예식 일정</span>
                <div className="text-right">
                  <p className="text-zinc-900 font-medium">
                    {formatWeddingDate(formData.weddingDate || '')}
                  </p>
                  {formData.weddingTime && (
                    <p className="text-zinc-700 text-xs mt-1">
                      {formatWeddingTime(formData.weddingTime)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="border-t border-zinc-200"></div>
              
              <div className="flex justify-between">
                <span className="text-zinc-600">예식장</span>
                <span className="text-zinc-900 font-medium">
                  {formData.venue}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Message */}
        <div className="space-y-4 text-center">
          <p className="text-sm text-zinc-600 leading-relaxed">
            입력하신 정보는 안전하게 전달되었으며<br />
            담당자가 확인 후 영업일 기준 1-2일 이내에<br />
            연락드릴 예정입니다
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            여러분의 특별한 날을<br />
            마인드그라피가 함께하겠습니다
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* 마인드 포털 계정 정보 */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 p-6 space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold text-blue-900">
                마인드 포털 로그인 정보
              </h3>
            </div>
            
            <div className="space-y-3 bg-white p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-600 mb-1">아이디 (ID)</p>
                  <p className="text-sm font-medium text-zinc-900">
                    {getMainPhone() || '대표 전화번호'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-blue-100"></div>
              
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-600 mb-1">비밀번호 (Password)</p>
                  <p className="text-sm font-medium text-zinc-900">
                    대표 전화번호 뒤 4자리 ({getPasswordHint()})
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-blue-800 leading-relaxed font-medium">
              ⚠️ 위 로그인 정보를 꼭 기억해 주세요!<br />
              마인드 포털에서 촬영 일정, 사진 선택 등<br />
              다양한 서비스를 이용하실 수 있습니다
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoToPortal}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "active:scale-[0.98]",
              "shadow-md hover:shadow-lg focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
            )}
          >
            마인드 포털로 이동
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "border-2 border-zinc-300 bg-white text-zinc-700",
              "hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900",
              "active:scale-[0.98]",
              "shadow-sm hover:shadow-md"
            )}
          >
            홈으로 이동
          </Button>

          <p className="text-xs text-center text-zinc-400 leading-relaxed pt-4">
            문의사항이 있으시면 언제든지<br />
            전화 또는 카카오톡으로 연락 주세요
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200"></div>

        {/* Signature */}
        <div className="text-center">
          <p className="text-sm text-zinc-500 leading-relaxed">
            마인드그라피 올림
          </p>
        </div>

      </div>
    </div>
  )
}
