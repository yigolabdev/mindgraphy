'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
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
import { Calendar, User, MapPin, Clock, Package, Camera, Tag, Users as UsersIcon, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { mockPhotographers } from '@/lib/mock-data'
import { mockProducts } from '@/lib/mock/settings'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { ProjectType } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  title?: string
}

type Step = 'product' | 'package' | 'details' | 'additional' | 'confirm'

export function CreateProjectDialog({
  open,
  onOpenChange,
  onSuccess,
  title = '새 촬영 등록'
}: CreateProjectDialogProps) {
  const [step, setStep] = useState<Step>('product')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    // 상품 정보 (고객용 페이지와 동일)
    productType: '' as ProjectType | '',
    clientType: '', // 'direct' or 'venue'
    
    // 기본 정보
    groomName: '',
    brideName: '',
    groomPhone: '',
    bridePhone: '',
    mainContact: 'groom' as 'groom' | 'bride',
    email: '',
    
    // 패키지 & 옵션 (고객용 페이지와 동일)
    packageId: '',
    optionIds: [] as string[],
    
    // 촬영 상세
    weddingDate: '',
    weddingTime: '',
    weddingVenue: '',
    venueAddress: '',
    photographerIds: [] as string[],
    
    // 유입 경로 & 추가 정보 (고객용 페이지와 동일)
    referralSource: '',
    specialRequests: ''
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

  const handlePhotographerToggle = (photographerId: string) => {
    setFormData(prev => {
      const currentIds = prev.photographerIds
      const isSelected = currentIds.includes(photographerId)
      
      if (isSelected) {
        return { ...prev, photographerIds: currentIds.filter(id => id !== photographerId) }
      } else {
        if (currentIds.length >= 3) {
          toast.warning('작가는 최대 3명까지 선택할 수 있습니다')
          return prev
        }
        return { ...prev, photographerIds: [...currentIds, photographerId] }
      }
    })
  }

  const validateStep = (currentStep: Step): boolean => {
    switch (currentStep) {
      case 'product':
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
        return true
      
      case 'package':
        if (!formData.packageId) {
          toast.error('패키지를 선택해주세요')
          return false
        }
        return true
      
      case 'details':
        if (!formData.weddingDate) {
          toast.error('촬영 날짜를 선택해주세요')
          return false
        }
        if (!formData.weddingVenue) {
          toast.error('촬영 장소를 입력해주세요')
          return false
        }
        if (formData.photographerIds.length === 0) {
          toast.error('최소 1명의 작가를 선택해주세요')
          return false
        }
        return true
      
      case 'additional':
        if (!formData.referralSource) {
          toast.error('유입 경로를 선택해주세요')
          return false
        }
        return true
      
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!validateStep(step)) return
    
    const steps: Step[] = ['product', 'package', 'details', 'additional', 'confirm']
    const currentIndex = steps.indexOf(step)
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1])
    }
  }

  const handleBack = () => {
    const steps: Step[] = ['product', 'package', 'details', 'additional', 'confirm']
    const currentIndex = steps.indexOf(step)
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // TODO: 실제 API 호출로 변경
      // 관리자 직접 등록 시 leadStatus는 'contracted' (바로 확정)
      // sourceChannel은 '관리자 직접 등록'
      console.log('등록 데이터:', {
        ...formData,
        leadStatus: 'contracted', // 관리자 직접 등록은 바로 확정
        sourceChannel: '관리자 직접 등록'
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('고객이 등록되고 일정이 확정되었습니다!')
      
      // Reset form
      setFormData({
        productType: '',
        clientType: '',
        groomName: '',
        brideName: '',
        groomPhone: '',
        bridePhone: '',
        mainContact: 'groom',
        email: '',
        packageId: '',
        optionIds: [],
        weddingDate: '',
        weddingTime: '',
        weddingVenue: '',
        venueAddress: '',
        photographerIds: [],
        referralSource: '',
        specialRequests: ''
      })
      setStep('product')
      
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error) {
      toast.error('촬영 등록에 실패했습니다')
      console.error('Failed to create project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case 'product': return '상품 타입과 고객 기본 정보를 입력해주세요 (고객용 페이지와 동일)'
      case 'package': return '패키지와 추가 옵션을 선택해주세요'
      case 'details': return '촬영 날짜, 장소, 담당 작가를 선택해주세요'
      case 'additional': return '유입 경로와 특별 요청사항을 입력해주세요'
      case 'confirm': return '입력한 정보를 확인해주세요'
    }
  }

  const getProductTypeLabel = (type: ProjectType) => {
    const labels: Record<ProjectType, string> = {
      wedding: '일반 웨딩',
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{getStepDescription()}</DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {(['product', 'package', 'details', 'additional', 'confirm'] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                step === s 
                  ? "bg-zinc-900 text-white scale-110" 
                  : idx < (['product', 'package', 'details', 'additional', 'confirm'] as Step[]).indexOf(step)
                  ? "bg-green-600 text-white"
                  : "bg-zinc-200 text-zinc-500"
              )}>
                {idx + 1}
              </div>
              {idx < 4 && (
                <div className={cn(
                  "flex-1 h-1 mx-2 transition-all",
                  idx < (['product', 'package', 'details', 'additional', 'confirm'] as Step[]).indexOf(step)
                    ? "bg-green-600"
                    : "bg-zinc-200"
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {/* Step 1: Product & Customer Info */}
          {step === 'product' && (
            <div className="space-y-6">
              {/* Product Type Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  상품 타입 *
                </Label>
                <div className="grid grid-cols-2 gap-3">
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

              {/* Client Type Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  고객 유형 *
                </Label>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
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
                  <Label htmlFor="brideName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="groomPhone">신랑 연락처</Label>
                  <Input
                    id="groomPhone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.groomPhone}
                    onChange={(e) => handleChange('groomPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bridePhone">신부 연락처</Label>
                  <Input
                    id="bridePhone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.bridePhone}
                    onChange={(e) => handleChange('bridePhone', e.target.value)}
                  />
                </div>
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
            </div>
          )}

          {/* Step 2: Package & Options */}
          {step === 'package' && (
            <div className="space-y-6">
              {/* Package Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  패키지 선택 *
                </Label>
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
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    추가 옵션 (선택)
                  </Label>
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
                  {formData.optionIds.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {formData.optionIds.length}개의 옵션이 선택되었습니다
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Shooting Details */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingDate" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
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
                  <Label htmlFor="weddingTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
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
                <Label htmlFor="weddingVenue" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
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

              {/* Photographer Selection */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  담당 작가 선택 * <span className="text-xs text-muted-foreground">(최소 1명, 최대 3명)</span>
                </Label>
                <div className="space-y-2">
                  {mockPhotographers.map((photographer) => (
                    <button
                      key={photographer.id}
                      type="button"
                      onClick={() => handlePhotographerToggle(photographer.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3",
                        formData.photographerIds.includes(photographer.id)
                          ? "border-zinc-900 bg-zinc-50"
                          : "border-zinc-200 hover:border-zinc-300"
                      )}
                    >
                      <Checkbox
                        checked={formData.photographerIds.includes(photographer.id)}
                        onCheckedChange={() => handlePhotographerToggle(photographer.id)}
                        className="pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {photographer.user?.lastName}{photographer.user?.firstName}
                          </span>
                          <Badge variant={photographer.availabilityStatus === 'available' ? 'default' : 'secondary'} className="text-xs">
                            {photographer.availabilityStatus === 'available' ? '가능' : 
                             photographer.availabilityStatus === 'busy' ? '촬영중' : '휴가'}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          경력 {photographer.experienceYears}년 • ⭐ {photographer.rating} • {photographer.totalProjects}건
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {formData.photographerIds.length > 0 && (
                  <p className="text-sm text-blue-600">
                    {formData.photographerIds.length}명의 작가가 선택되었습니다
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Additional Info */}
          {step === 'additional' && (
            <div className="space-y-6">
              {/* Referral Source */}
              <div className="space-y-2">
                <Label htmlFor="referralSource" className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4" />
                  유입 경로 *
                </Label>
                <Select value={formData.referralSource} onValueChange={(v) => handleChange('referralSource', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="유입 경로를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Naver Blog">Naver Blog</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="웨딩홀 제휴">웨딩홀 제휴</SelectItem>
                    <SelectItem value="지인 추천">지인 추천</SelectItem>
                    <SelectItem value="Google 검색">Google 검색</SelectItem>
                    <SelectItem value="기타">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="bg-zinc-50 rounded-lg p-6 space-y-6">
                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-sm text-zinc-500 mb-3">상품 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">상품 타입:</span>
                      <Badge variant="outline">{formData.productType && getProductTypeLabel(formData.productType)}</Badge>
                    </div>
                    <div>
                      <span className="text-zinc-500">고객 유형:</span>
                      <span className="ml-2 font-medium">
                        {formData.clientType === 'direct' ? '직접 문의' : '웨딩홀 제휴'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm text-zinc-500 mb-3">고객 정보</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-zinc-500">신랑:</span>
                      <span className="ml-2 font-medium">{formData.groomName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">신부:</span>
                      <span className="ml-2 font-medium">{formData.brideName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">신랑 연락처:</span>
                      <span className="ml-2">{formData.groomPhone || '-'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">신부 연락처:</span>
                      <span className="ml-2">{formData.bridePhone || '-'}</span>
                    </div>
                    {formData.email && (
                      <div className="col-span-2">
                        <span className="text-zinc-500">이메일:</span>
                        <span className="ml-2">{formData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm text-zinc-500 mb-3">패키지 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-zinc-500">선택 패키지:</span>
                      <span className="ml-2 font-medium">
                        {mockProducts.find(p => p.id === formData.packageId)?.name}
                      </span>
                    </div>
                    {formData.optionIds.length > 0 && (
                      <div>
                        <span className="text-zinc-500">추가 옵션:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {formData.optionIds.map(id => {
                            const option = mockProducts.find(p => p.id === id)
                            return option ? (
                              <Badge key={id} variant="secondary" className="text-xs">
                                {option.name}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shooting Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm text-zinc-500 mb-3">촬영 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-zinc-500">날짜:</span>
                      <span className="ml-2 font-medium">{formData.weddingDate}</span>
                      {formData.weddingTime && <span className="ml-2">{formData.weddingTime}</span>}
                    </div>
                    <div>
                      <span className="text-zinc-500">장소:</span>
                      <span className="ml-2">{formData.weddingVenue}</span>
                    </div>
                    {formData.venueAddress && (
                      <div>
                        <span className="text-zinc-500">주소:</span>
                        <span className="ml-2 text-xs">{formData.venueAddress}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-zinc-500">담당 작가:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {formData.photographerIds.map(id => {
                          const photographer = mockPhotographers.find(p => p.id === id)
                          return photographer ? (
                            <Badge key={id} variant="secondary" className="text-xs">
                              {photographer.user?.lastName}{photographer.user?.firstName}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-sm text-zinc-500 mb-3">추가 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-zinc-500">유입 경로:</span>
                      <span className="ml-2 font-medium">{formData.referralSource}</span>
                    </div>
                    {formData.specialRequests && (
                      <div>
                        <span className="text-zinc-500">특별 요청사항:</span>
                        <p className="mt-1 text-xs bg-white rounded p-2 border whitespace-pre-wrap">{formData.specialRequests}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {step !== 'product' && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              이전
            </Button>
          )}
          
          {step !== 'confirm' ? (
            <Button onClick={handleNext}>
              다음
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? '등록 중...' : '등록 완료'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

