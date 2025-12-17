'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, 
  User, 
  MapPin, 
  Clock, 
  Package, 
  Camera, 
  Tag, 
  Users as UsersIcon, 
  CheckCircle, 
  Building2, 
  UserPlus, 
  CreditCard, 
  Wallet,
  ArrowLeft,
  Save
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { mockProducts } from '@/lib/mock/settings'
import { getActiveVenuePartners, getVenuePartnerTypeLabel } from '@/lib/mock/venue-partners'
import type { CreateProjectFormData } from '@/lib/types/forms'
import type { ProjectType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { validateCreateProjectForm } from '@/lib/utils/validation'
import { withErrorHandling } from '@/lib/utils/error-handling'
import { formatPhoneNumber, isValidPhoneNumber } from '@/lib/utils/phone.utils'

export default function CreateProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<CreateProjectFormData>({
    // 상품 정보
    productType: '',
    clientType: '',
    
    // 기본 정보
    groomName: '',
    brideName: '',
    groomPhone: '',
    bridePhone: '',
    mainContact: 'groom',
    email: '',
    
    // 패키지 & 옵션
    packageId: '',
    optionIds: [],
    
    // 촬영 상세
    weddingDate: '',
    weddingTime: '',
    weddingVenue: '',
    venueAddress: '',
    
    // 유입 경로
    sourceType: '',
    venuePartnerId: '',
    referralSource: '',
    specialRequests: '',

    // 결제 정보
    paymentStatus: 'unpaid',
    paymentMethod: '',
    paymentAmount: '',
  })

  // Get packages and options based on productType
  const availablePackages = mockProducts.filter(
    p => p.category === 'SNAP' && p.isActive &&
    (formData.productType === 'wedding' || formData.productType === 'dress_shop' || formData.productType === 'baby' 
      ? !p.id.startsWith('hanbok-') 
      : p.id.startsWith('hanbok-'))
  )
  
  const availableOptions = mockProducts.filter(p => p.category === 'OPTION' && p.isActive)

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleOptionToggle = (optionId: string) => {
    setFormData(prev => {
      const currentIds = prev.optionIds
      const isSelected = currentIds.includes(optionId)
      
      if (isSelected) {
        return { ...prev, optionIds: currentIds.filter(id => id !== optionId) }
      } else {
        return { ...prev, optionIds: [...currentIds, optionId] }
      }
    })
  }

  const validateForm = (): boolean => {
    if (!formData.productType) {
      toast.error('상품 타입을 선택해주세요')
      return false
    }
    if (!formData.clientType) {
      toast.error('고객 유형을 선택해주세요')
      return false
    }
    if (!formData.groomName || !formData.brideName) {
      toast.error('신랑과 신부 이름을 입력해주세요')
      return false
    }
    if (!formData.groomPhone && !formData.bridePhone) {
      toast.error('최소 한 명의 연락처를 입력해주세요')
      return false
    }
    // Validate main contact has a phone number
    if (formData.mainContact === 'groom' && !formData.groomPhone) {
      toast.error('신랑이 대표 연락처로 선택되었지만 연락처가 없습니다')
      return false
    }
    if (formData.mainContact === 'bride' && !formData.bridePhone) {
      toast.error('신부가 대표 연락처로 선택되었지만 연락처가 없습니다')
      return false
    }
    if (!formData.packageId) {
      toast.error('패키지를 선택해주세요')
      return false
    }
    if (!formData.weddingDate) {
      toast.error('촬영 날짜를 선택해주세요')
      return false
    }
    if (!formData.weddingVenue) {
      toast.error('촬영 장소를 입력해주세요')
      return false
    }
    if (!formData.sourceType) {
      toast.error('고객 유입 경로 타입을 선택해주세요')
      return false
    }
    if (formData.sourceType === 'venue-referral' && !formData.venuePartnerId) {
      toast.error('제휴처를 선택해주세요')
      return false
    }
    if (formData.sourceType === 'manual-registration') {
      if (!formData.paymentStatus) {
        toast.error('결제 상태를 선택해주세요')
        return false
      }
      if (formData.paymentStatus !== 'unpaid' && !formData.paymentMethod) {
        toast.error('결제 방식을 선택해주세요')
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // TODO: 실제 API 호출로 변경
      const leadStatus = formData.sourceType === 'manual-registration' ? 'contracted' : 'inquiry'
      
      let sourceChannel = formData.referralSource || ''
      if (formData.sourceType === 'venue-referral' && formData.venuePartnerId) {
        const partner = getActiveVenuePartners().find(p => p.id === formData.venuePartnerId)
        sourceChannel = partner?.name || formData.referralSource
      } else if (formData.sourceType === 'manual-registration') {
        sourceChannel = formData.referralSource || '수동 등록'
      }
      
      const shouldCreatePortalAccount = formData.sourceType === 'manual-registration' && 
                                       (formData.paymentStatus === 'paid' || formData.paymentStatus === 'partial')
      
      console.log('등록 데이터:', {
        ...formData,
        leadStatus,
        sourceChannel,
        portalAccountCreated: shouldCreatePortalAccount
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let message = '고객이 등록되었습니다!'
      if (formData.sourceType === 'manual-registration') {
        message = '고객이 등록되고 일정이 확정되었습니다!'
        if (shouldCreatePortalAccount) {
          message += ' (포털 계정 자동 생성됨)'
        }
      }
      
      toast.success(message)
      router.push('/admin/projects')
      
    } catch (error) {
      toast.error('촬영 등록에 실패했습니다')
      console.error('Failed to create project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProductTypeLabel = (type: ProjectType) => {
    const labels: Record<ProjectType, string> = {
      wedding: '웨딩',
      hanbok: '한복 & 캐주얼',
      dress_shop: '가봉 스냅',
      baby: '돌스냅',
      studio: '스튜디오',
      outdoor: '야외촬영',
      pre_wedding: '프리웨딩',
      family: '가족촬영'
    }
    return labels[type] || type
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">새 촬영 등록</h1>
          <p className="text-muted-foreground">
            고객 정보와 촬영 상세를 입력해주세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 상품 & 고객 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                상품 & 고객 기본 정보
              </CardTitle>
              <CardDescription>
                상품 타입과 고객의 기본 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">상품 타입 *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['wedding', 'hanbok', 'dress_shop', 'baby'] as ProjectType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('productType', type)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        formData.productType === type
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="font-semibold">{getProductTypeLabel(type)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">고객 유형 *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('clientType', 'direct')}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.clientType === 'direct'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-semibold">직접 문의</div>
                    <div className="text-xs text-muted-foreground mt-1">Instagram, 블로그 등</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('clientType', 'venue')}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.clientType === 'venue'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300"
                    )}
                  >
                    <div className="font-semibold">웨딩홀 제휴</div>
                    <div className="text-xs text-muted-foreground mt-1">웨딩홀 통한 유입</div>
                  </button>
                </div>
              </div>

              {/* Customer Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomName">
                    신랑 이름 *
                  </Label>
                  <Input
                    id="groomName"
                    placeholder="김철수"
                    value={formData.groomName}
                    onChange={(e) => handleChange('groomName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brideName">
                    신부 이름 *
                  </Label>
                  <Input
                    id="brideName"
                    placeholder="이영희"
                    value={formData.brideName}
                    onChange={(e) => handleChange('brideName', e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomPhone">신랑 연락처</Label>
                  <Input
                    id="groomPhone"
                    type="tel"
                    placeholder="010-0000-0000, 02-1234-5678 등"
                    value={formData.groomPhone}
                    onChange={(e) => handleChange('groomPhone', formatPhoneNumber(e.target.value))}
                    className={cn(
                      formData.groomPhone && !isValidPhoneNumber(formData.groomPhone) && "border-red-500"
                    )}
                  />
                  {formData.groomPhone && !isValidPhoneNumber(formData.groomPhone) && (
                    <p className="text-xs text-red-500">올바른 전화번호 형식이 아닙니다</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bridePhone">신부 연락처</Label>
                  <Input
                    id="bridePhone"
                    type="tel"
                    placeholder="010-0000-0000, 02-1234-5678 등"
                    value={formData.bridePhone}
                    onChange={(e) => handleChange('bridePhone', formatPhoneNumber(e.target.value))}
                    className={cn(
                      formData.bridePhone && !isValidPhoneNumber(formData.bridePhone) && "border-red-500"
                    )}
                  />
                  {formData.bridePhone && !isValidPhoneNumber(formData.bridePhone) && (
                    <p className="text-xs text-red-500">올바른 전화번호 형식이 아닙니다</p>
                  )}
                </div>
              </div>

              {/* Main Contact Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">대표 연락처 *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('mainContact', 'groom')}
                    disabled={!formData.groomPhone}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.mainContact === 'groom'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300",
                      !formData.groomPhone && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">신랑</span>
                    </div>
                    {formData.groomPhone && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formData.groomPhone}
                      </div>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('mainContact', 'bride')}
                    disabled={!formData.bridePhone}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      formData.mainContact === 'bride'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 hover:border-zinc-300",
                      !formData.bridePhone && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">신부</span>
                    </div>
                    {formData.bridePhone && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {formData.bridePhone}
                      </div>
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  주요 연락 및 포털 로그인에 사용될 번호를 선택해주세요
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일 (선택)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. 패키지 & 옵션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                패키지 & 옵션 선택
              </CardTitle>
              <CardDescription>
                촬영 패키지와 추가 옵션을 선택해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">패키지 선택 *</Label>
                <div className="space-y-3">
                  {availablePackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handleChange('packageId', pkg.id)}
                      className={cn(
                        "w-full p-4 rounded-lg border-2 transition-all text-left",
                        formData.packageId === pkg.id
                          ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900/20"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{pkg.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {pkg.description.slice(0, 3).join(' • ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatCurrency(pkg.basePrice)}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options Selection */}
              {availableOptions.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">추가 옵션 (선택)</Label>
                  <div className="space-y-2">
                    {availableOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleOptionToggle(option.id)}
                        className={cn(
                          "w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3",
                          formData.optionIds.includes(option.id)
                            ? "border-zinc-900 bg-zinc-50"
                            : "border-zinc-200 hover:border-zinc-300"
                        )}
                      >
                        <Checkbox
                          checked={formData.optionIds.includes(option.id)}
                          onCheckedChange={() => handleOptionToggle(option.id)}
                          className="pointer-events-none"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {option.description[0]}
                          </div>
                        </div>
                        <div className="font-semibold text-blue-600">
                          +{formatCurrency(option.basePrice)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. 촬영 상세 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                촬영 상세 정보
              </CardTitle>
              <CardDescription>
                촬영 날짜와 장소를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingDate">
                    촬영 날짜 *
                  </Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => handleChange('weddingDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weddingTime">
                    촬영 시간
                  </Label>
                  <Input
                    id="weddingTime"
                    type="time"
                    value={formData.weddingTime}
                    onChange={(e) => handleChange('weddingTime', e.target.value)}
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label htmlFor="weddingVenue">
                  촬영 장소 *
                </Label>
                <Input
                  id="weddingVenue"
                  placeholder="예: 더컨벤션웨딩홀"
                  value={formData.weddingVenue}
                  onChange={(e) => handleChange('weddingVenue', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueAddress">상세 주소 (선택)</Label>
                <Input
                  id="venueAddress"
                  placeholder="예: 서울시 강남구 테헤란로 123"
                  value={formData.venueAddress}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 4. 유입 경로 & 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                유입 경로 & 추가 정보
              </CardTitle>
              <CardDescription>
                고객 유입 경로와 특별 요청사항을 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Source Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">고객 유입 경로 타입 *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('sourceType', 'client-direct')
                      handleChange('venuePartnerId', '')
                    }}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all text-left hover:border-zinc-400",
                      formData.sourceType === 'client-direct'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 bg-white"
                    )}
                  >
                    <UserPlus className={cn(
                      "h-5 w-5 mb-2",
                      formData.sourceType === 'client-direct' ? "text-zinc-900" : "text-zinc-400"
                    )} />
                    <div className="font-semibold text-sm mb-1">고객 직접 문의</div>
                    <div className="text-xs text-zinc-500">고객용 페이지</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleChange('sourceType', 'venue-referral')}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all text-left hover:border-zinc-400",
                      formData.sourceType === 'venue-referral'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 bg-white"
                    )}
                  >
                    <Building2 className={cn(
                      "h-5 w-5 mb-2",
                      formData.sourceType === 'venue-referral' ? "text-zinc-900" : "text-zinc-400"
                    )} />
                    <div className="font-semibold text-sm mb-1">웨딩홀/플래너</div>
                    <div className="text-xs text-zinc-500">제휴처 소개</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      handleChange('sourceType', 'manual-registration')
                      handleChange('venuePartnerId', '')
                    }}
                    className={cn(
                      "p-4 border-2 rounded-lg transition-all text-left hover:border-zinc-400",
                      formData.sourceType === 'manual-registration'
                        ? "border-zinc-900 bg-zinc-50"
                        : "border-zinc-200 bg-white"
                    )}
                  >
                    <User className={cn(
                      "h-5 w-5 mb-2",
                      formData.sourceType === 'manual-registration' ? "text-zinc-900" : "text-zinc-400"
                    )} />
                    <div className="font-semibold text-sm mb-1">수동 등록</div>
                    <div className="text-xs text-zinc-500">관리자 직접 입력</div>
                  </button>
                </div>
              </div>

              {/* Venue Partner Selection */}
              {formData.sourceType === 'venue-referral' && (
                <div className="space-y-2">
                  <Label htmlFor="venuePartnerId">
                    제휴처 선택 *
                  </Label>
                  <Select value={formData.venuePartnerId} onValueChange={(v) => handleChange('venuePartnerId', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="제휴 웨딩홀/플래너를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {getActiveVenuePartners().map(partner => (
                        <SelectItem key={partner.id} value={partner.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {getVenuePartnerTypeLabel(partner.type)}
                            </Badge>
                            {partner.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Referral Source */}
              {formData.sourceType === 'client-direct' && (
                <div className="space-y-2">
                  <Label htmlFor="referralSource">
                    구체적인 유입 경로
                  </Label>
                  <Select value={formData.referralSource} onValueChange={(v) => handleChange('referralSource', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="유입 경로를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Naver Blog">Naver Blog</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="Google 검색">Google 검색</SelectItem>
                      <SelectItem value="Kakao">Kakao</SelectItem>
                      <SelectItem value="지인 추천">지인 추천</SelectItem>
                      <SelectItem value="고객용 페이지">고객용 페이지</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.sourceType === 'manual-registration' && (
                <div className="space-y-2">
                  <Label htmlFor="referralSource">등록 사유 (선택)</Label>
                  <Input
                    id="referralSource"
                    placeholder="예: 전화 문의, 오프라인 상담 등"
                    value={formData.referralSource}
                    onChange={(e) => handleChange('referralSource', e.target.value)}
                  />
                </div>
              )}

              {/* Special Requests */}
              <div className="space-y-2">
                <Label htmlFor="specialRequests">특별 요청사항 (선택)</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="특별히 요청하시거나 주의할 사항이 있다면 입력해주세요&#10;예: 야외 촬영 희망, 가족 단체 사진 중요 등"
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                  rows={5}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* 5. 결제 정보 (수동 등록 시만) */}
          {formData.sourceType === 'manual-registration' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  결제 정보
                </CardTitle>
                <CardDescription>
                  수동 등록 시 결제 상태를 입력해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-medium mb-1">💡 결제 정보 입력 안내</p>
                  <p>
                    '입금 완료' 또는 '예약금 입금' 상태로 저장 시 <strong>포털 계정이 자동으로 생성</strong>되며,<br/>
                    고객은 '촬영 대기' 상태부터 확인할 수 있습니다.
                  </p>
                </div>

                {/* Payment Status */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">결제 상태 *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('paymentStatus', 'paid')
                        if (!formData.paymentMethod) handleChange('paymentMethod', 'transfer')
                      }}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        formData.paymentStatus === 'paid'
                          ? "border-green-600 bg-green-50 ring-1 ring-green-600"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="font-semibold text-green-700">입금 완료</div>
                      <div className="text-xs text-green-600 mt-1">전액 결제됨</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleChange('paymentStatus', 'partial')}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        formData.paymentStatus === 'partial'
                          ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="font-semibold text-orange-700">예약금 입금</div>
                      <div className="text-xs text-orange-600 mt-1">일부 결제됨</div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('paymentStatus', 'unpaid')
                        handleChange('paymentMethod', '')
                        handleChange('paymentAmount', '')
                      }}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        formData.paymentStatus === 'unpaid'
                          ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <div className="font-semibold">미입금</div>
                      <div className="text-xs text-muted-foreground mt-1">추후 결제 예정</div>
                    </button>
                  </div>
                </div>

                {formData.paymentStatus !== 'unpaid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                    <div className="space-y-2">
                      <Label>결제 방식 *</Label>
                      <Select value={formData.paymentMethod} onValueChange={(v) => handleChange('paymentMethod', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="결제 방식 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="transfer">계좌 이체</SelectItem>
                          <SelectItem value="card">카드 결제</SelectItem>
                          <SelectItem value="cash">현금 (현장)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">결제 금액 (선택)</Label>
                      <Input
                        id="paymentAmount"
                        type="text"
                        placeholder="예: 500,000"
                        value={formData.paymentAmount}
                        onChange={(e) => handleChange('paymentAmount', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(formData.paymentStatus === 'paid' || formData.paymentStatus === 'partial') && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-green-900 mb-1">
                        포털 계정이 자동으로 생성됩니다
                      </p>
                      <p className="text-green-700">
                        고객은 로그인 후 "촬영 대기" 상태부터 확인 가능합니다.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 justify-end sticky bottom-4 bg-white/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-700 min-w-[120px]"
            >
              {isSubmitting ? (
                '등록 중...'
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  등록 완료
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

