'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientPortalLayout } from '@/components/layout/client-portal-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { getClientDataByToken } from '@/lib/mock/client'
import { ROUTES } from '@/lib/constants'
import {
  clientInfoSchema,
  defaultClientInfoValues,
  stepSchemas,
  type ClientInfoFormData
} from '@/lib/schemas/client-info'
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Users,
  Building2,
  Palette,
  Package,
  CheckCircle2,
  AlertCircle,
  Save
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface InfoPageProps {
  params: Promise<{ token: string }>
}

export default function InfoPage({ params }: InfoPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const clientData = getClientDataByToken(token)

  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
    setValue,
  } = useForm<ClientInfoFormData>({
    resolver: zodResolver(clientInfoSchema),
    defaultValues: defaultClientInfoValues,
    mode: 'onBlur',
  })

  // Watch all form values for autosave
  const formValues = watch()

  // Autosave logic (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formValues).length > 0) {
        autoSave(formValues)
      }
    }, 2000) // 2 second debounce

    return () => clearTimeout(timeoutId)
  }, [formValues])

  const autoSave = async (data: Partial<ClientInfoFormData>) => {
    setIsAutoSaving(true)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setLastSaved(new Date())
    setIsAutoSaving(false)
    toast.success('자동 저장되었습니다', { duration: 2000 })
  }

  if (!clientData) {
    router.push(`/c/${token}/invalid`)
    return null
  }

  const steps = [
    { title: '신랑·신부', icon: Users },
    { title: '예식장', icon: Building2 },
    { title: '메이크업', icon: Palette },
    { title: '배송지', icon: Package },
  ]

  const totalSteps = steps.length

  const handleNext = async () => {
    // Validate current step
    const currentSchema = stepSchemas[currentStep]
    const fieldNames = Object.keys(currentSchema.shape) as (keyof ClientInfoFormData)[]
    const isValid = await trigger(fieldNames)

    if (!isValid) {
      toast.error('필수 항목을 모두 입력해주세요')
      return
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const onSubmit = async (data: ClientInfoFormData) => {
    console.log('Form submitted:', data)
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('정보가 저장되었습니다!')
    
    // Redirect to next step: Proof
    setTimeout(() => {
      router.push(ROUTES.CLIENT_PROOF(token))
    }, 1000)
  }

  return (
    <ClientPortalLayout token={token}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">촬영 정보 입력</h1>
          <p className="text-muted-foreground">
            원활한 촬영을 위해 필요한 정보를 입력해주세요
          </p>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
                        index < currentStep && "bg-green-500 border-green-500 text-white",
                        index === currentStep && "bg-blue-500 border-blue-500 text-white",
                        index > currentStep && "bg-gray-200 border-gray-300 text-gray-500"
                      )}
                    >
                      {index < currentStep ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <step.icon className="h-6 w-6" />
                      )}
                    </div>
                    <p className={cn(
                      "mt-2 text-sm font-medium hidden sm:block",
                      index === currentStep && "text-blue-700",
                      index < currentStep && "text-green-700",
                      index > currentStep && "text-gray-500"
                    )}>
                      {step.title}
                    </p>
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2 rounded transition-all",
                        index < currentStep ? "bg-green-500" : "bg-gray-300"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">진행률</span>
                <span className="font-semibold">
                  {Math.round((currentStep / (totalSteps - 1)) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Autosave Status */}
            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-muted-foreground">
              {isAutoSaving ? (
                <>
                  <Save className="h-3 w-3 animate-pulse" />
                  <span>저장 중...</span>
                </>
              ) : lastSaved ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span>
                    {lastSaved.toLocaleTimeString('ko-KR')} 자동 저장됨
                  </span>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Couple Information */}
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  신랑·신부 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Groom */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">신랑 정보</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="groomName">
                        이름 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="groomName"
                        {...register('groomName')}
                        placeholder="홍길동"
                      />
                      {errors.groomName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.groomName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groomPhone">
                        전화번호 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="groomPhone"
                        {...register('groomPhone')}
                        placeholder="010-1234-5678"
                      />
                      {errors.groomPhone && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.groomPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="groomEmail">이메일</Label>
                      <Input
                        id="groomEmail"
                        type="email"
                        {...register('groomEmail')}
                        placeholder="groom@example.com"
                      />
                      {errors.groomEmail && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.groomEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bride */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">신부 정보</h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="brideName">
                        이름 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="brideName"
                        {...register('brideName')}
                        placeholder="김영희"
                      />
                      {errors.brideName && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.brideName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bridePhone">
                        전화번호 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="bridePhone"
                        {...register('bridePhone')}
                        placeholder="010-5678-9012"
                      />
                      {errors.bridePhone && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.bridePhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="brideEmail">이메일</Label>
                      <Input
                        id="brideEmail"
                        type="email"
                        {...register('brideEmail')}
                        placeholder="bride@example.com"
                      />
                      {errors.brideEmail && (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.brideEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Venue Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  예식장 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">
                    예식장 이름 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="venueName"
                    {...register('venueName')}
                    placeholder="서울 그랜드 호텔"
                  />
                  {errors.venueName && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.venueName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venueAddress">
                    주소 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="venueAddress"
                    {...register('venueAddress')}
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                  {errors.venueAddress && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.venueAddress.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="venuePhone">전화번호</Label>
                    <Input
                      id="venuePhone"
                      {...register('venuePhone')}
                      placeholder="02-1234-5678"
                    />
                    {errors.venuePhone && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.venuePhone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venueUrl">웹사이트</Label>
                    <Input
                      id="venueUrl"
                      {...register('venueUrl')}
                      placeholder="https://example.com"
                    />
                    {errors.venueUrl && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.venueUrl.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ballroom">
                    볼룸 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ballroom"
                    {...register('ballroom')}
                    placeholder="그랜드 볼룸 3층"
                  />
                  {errors.ballroom && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.ballroom.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Makeup Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  메이크업 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    메이크업 유형 <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      { value: 'in-house', label: '예식장 내부' },
                      { value: 'external', label: '외부 샵' },
                      { value: 'none', label: '없음' }
                    ].map(option => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all",
                          watch('makeupType') === option.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <input
                          type="radio"
                          {...register('makeupType')}
                          value={option.value}
                          className="sr-only"
                        />
                        <span className="font-medium">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.makeupType && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.makeupType.message}
                    </p>
                  )}
                </div>

                {watch('makeupType') !== 'none' && (
                  <div className="space-y-2">
                    <Label htmlFor="makeupLocation">메이크업 장소</Label>
                    <Input
                      id="makeupLocation"
                      {...register('makeupLocation')}
                      placeholder="예: 3층 신부대기실"
                    />
                    {errors.makeupLocation && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.makeupLocation.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="makeupNotes">메이크업 관련 메모</Label>
                  <Textarea
                    id="makeupNotes"
                    {...register('makeupNotes')}
                    placeholder="특별한 요청사항이나 참고사항을 입력해주세요"
                    rows={3}
                  />
                  {errors.makeupNotes && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.makeupNotes.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Delivery Information */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  배송 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryName">
                      수령인 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryName"
                      {...register('deliveryName')}
                      placeholder="홍길동"
                    />
                    {errors.deliveryName && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.deliveryName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryPhone">
                      연락처 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="deliveryPhone"
                      {...register('deliveryPhone')}
                      placeholder="010-1234-5678"
                    />
                    {errors.deliveryPhone && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.deliveryPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAddress">
                    주소 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="deliveryAddress"
                    {...register('deliveryAddress')}
                    placeholder="서울시 강남구 테헤란로 123"
                  />
                  {errors.deliveryAddress && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddressDetail">상세 주소</Label>
                    <Input
                      id="deliveryAddressDetail"
                      {...register('deliveryAddressDetail')}
                      placeholder="101동 1001호"
                    />
                    {errors.deliveryAddressDetail && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.deliveryAddressDetail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryPostalCode">우편번호</Label>
                    <Input
                      id="deliveryPostalCode"
                      {...register('deliveryPostalCode')}
                      placeholder="12345"
                    />
                    {errors.deliveryPostalCode && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.deliveryPostalCode.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryNotes">배송 메모</Label>
                  <Textarea
                    id="deliveryNotes"
                    {...register('deliveryNotes')}
                    placeholder="배송 시 참고사항을 입력해주세요 (예: 부재 시 경비실에 맡겨주세요)"
                    rows={3}
                  />
                  {errors.deliveryNotes && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.deliveryNotes.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  이전
                </Button>

                {currentStep < totalSteps - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    다음
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? '처리중...' : '완료'}
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </ClientPortalLayout>
  )
}

