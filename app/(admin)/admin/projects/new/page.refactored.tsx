'use client'

/**
 * 프로젝트 생성 페이지 (리팩토링 버전)
 * 
 * 개선사항:
 * - useForm hook 적용
 * - 컴포넌트 분리
 * - 타입 안전성 강화
 * - 성능 최적화
 * - 에러 처리 개선
 */

import { useMemo, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Calendar, User, MapPin, Clock, Package, Tag, 
  Users as UsersIcon, Building2, UserPlus, 
  CreditCard, ArrowLeft, Save
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from '@/hooks/use-form'
import { mockProducts } from '@/lib/mock/settings'
import { getActiveVenuePartners, getVenuePartnerTypeLabel } from '@/lib/mock/venue-partners'
import { validateCreateProjectForm } from '@/lib/utils/validation'
import { formatCurrency } from '@/lib/utils'
import { ButtonLoader } from '@/components/common/loading'
import type { CreateProjectFormData } from '@/lib/types/forms'
import type { ProjectType } from '@/lib/types'

// ============================================================================
// Sub Components (Memoized)
// ============================================================================

/**
 * 섹션 헤더
 */
const SectionHeader = memo(({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any
  title: string
  description?: string 
}) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="p-2 bg-zinc-900 text-white rounded-lg">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
      )}
    </div>
  </div>
))
SectionHeader.displayName = 'SectionHeader'

/**
 * 폼 필드 그룹
 */
const FormField = memo(({ 
  label, 
  required, 
  error, 
  children 
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) => (
  <div className="space-y-2">
    <Label>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-sm text-red-500">{error}</p>
    )}
  </div>
))
FormField.displayName = 'FormField'

/**
 * 제품 카드
 */
const ProductCard = memo(({ 
  product, 
  selected, 
  onSelect 
}: {
  product: any
  selected: boolean
  onSelect: () => void
}) => (
  <Card
    className={`cursor-pointer transition-all hover:shadow-md ${
      selected ? 'border-2 border-zinc-900 bg-zinc-50' : 'border-zinc-200'
    }`}
    onClick={onSelect}
  >
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <CardTitle className="text-base">{product.name}</CardTitle>
        {selected && (
          <Badge variant="default" className="bg-zinc-900">
            선택됨
          </Badge>
        )}
      </div>
      <CardDescription className="text-sm">
        {formatCurrency(product.basePrice)}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground space-y-1">
        <div>• 사진 {product.photoCount}장</div>
        {product.albumIncluded && <div>• 앨범 포함</div>}
      </div>
    </CardContent>
  </Card>
))
ProductCard.displayName = 'ProductCard'

/**
 * 옵션 체크박스
 */
const OptionCheckbox = memo(({
  option,
  checked,
  onToggle
}: {
  option: any
  checked: boolean
  onToggle: () => void
}) => (
  <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-zinc-50 transition-colors">
    <Checkbox
      id={option.id}
      checked={checked}
      onCheckedChange={onToggle}
    />
    <div className="flex-1">
      <label
        htmlFor={option.id}
        className="text-sm font-medium leading-none cursor-pointer"
      >
        {option.title}
      </label>
      <p className="text-sm text-muted-foreground mt-1">
        {formatCurrency(option.basePrice)}
      </p>
    </div>
  </div>
))
OptionCheckbox.displayName = 'OptionCheckbox'

// ============================================================================
// Main Component
// ============================================================================

export default function CreateProjectPage() {
  const router = useRouter()

  // Form Hook
  const {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
  } = useForm<CreateProjectFormData>({
    initialValues: {
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
      sourceType: '',
      venuePartnerId: '',
      referralSource: '',
      specialRequests: '',
      paymentStatus: 'unpaid',
      paymentMethod: '',
      paymentAmount: '',
    },
    validate: validateCreateProjectForm,
    onSubmit: async (data) => {
      // TODO: API 호출
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('프로젝트가 생성되었습니다', {
        description: `${data.groomName} & ${data.brideName}`
      })
      
      router.push('/admin/projects')
    }
  })

  // Computed Values
  const availablePackages = useMemo(() => 
    mockProducts.filter(
      p => p.category === 'SNAP' && p.isActive &&
      (values.productType === 'wedding' || values.productType === 'dress_shop' || values.productType === 'baby' 
        ? !p.id.startsWith('hanbok-') 
        : p.id.startsWith('hanbok-'))
    ),
    [values.productType]
  )

  const availableOptions = useMemo(() => 
    mockProducts.filter(p => p.category === 'OPTION' && p.isActive),
    []
  )

  const venuePartners = useMemo(() => getActiveVenuePartners(), [])

  const selectedPackage = useMemo(() => 
    availablePackages.find(p => p.id === values.packageId),
    [availablePackages, values.packageId]
  )

  const totalAmount = useMemo(() => {
    let total = selectedPackage?.basePrice || 0
    values.optionIds.forEach(optionId => {
      const option = availableOptions.find(o => o.id === optionId)
      if (option) total += option.basePrice
    })
    return total
  }, [selectedPackage, values.optionIds, availableOptions])

  // Handlers
  const handleOptionToggle = useCallback((optionId: string) => {
    setValue('optionIds', 
      values.optionIds.includes(optionId)
        ? values.optionIds.filter(id => id !== optionId)
        : [...values.optionIds, optionId]
    )
  }, [values.optionIds, setValue])

  // Reset 관련 필드
  const handleProductTypeChange = useCallback((value: string) => {
    setValue('productType', value as ProjectType)
    setValue('packageId', '')
    setValue('optionIds', [])
  }, [setValue])

  return (
    <AdminLayout align="left">
      <div className="max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>
          
          <h1 className="text-3xl font-bold tracking-tight">새 촬영 등록</h1>
          <p className="text-muted-foreground mt-2">
            신규 고객의 촬영 프로젝트를 등록합니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. 상품 정보 */}
          <Card>
            <CardHeader>
              <SectionHeader
                icon={Package}
                title="상품 정보"
                description="촬영 타입과 고객 유형을 선택하세요"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField label="촬영 타입" required error={errors.productType}>
                <Select
                  value={values.productType}
                  onValueChange={handleProductTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">웨딩 스냅</SelectItem>
                    <SelectItem value="hanbok">한복 & 캐주얼</SelectItem>
                    <SelectItem value="dress_shop">가봉 스냅</SelectItem>
                    <SelectItem value="baby">돌스냅</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="고객 유형" required error={errors.clientType}>
                <Select
                  value={values.clientType}
                  onValueChange={(v) => setValue('clientType', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">직접 문의</SelectItem>
                    <SelectItem value="venue">제휴처 소개</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </CardContent>
          </Card>

          {/* 2. 고객 정보 */}
          <Card>
            <CardHeader>
              <SectionHeader
                icon={User}
                title="고객 정보"
                description="신랑/신부 정보를 입력하세요"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="신랑 이름" required error={errors.groomName}>
                  <Input
                    value={values.groomName}
                    onChange={(e) => setValue('groomName', e.target.value)}
                    placeholder="홍길동"
                  />
                </FormField>

                <FormField label="신부 이름" required error={errors.brideName}>
                  <Input
                    value={values.brideName}
                    onChange={(e) => setValue('brideName', e.target.value)}
                    placeholder="김영희"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="신랑 연락처" error={errors.groomPhone}>
                  <Input
                    value={values.groomPhone}
                    onChange={(e) => setValue('groomPhone', e.target.value)}
                    placeholder="010-1234-5678"
                  />
                </FormField>

                <FormField label="신부 연락처" error={errors.bridePhone}>
                  <Input
                    value={values.bridePhone}
                    onChange={(e) => setValue('bridePhone', e.target.value)}
                    placeholder="010-8765-4321"
                  />
                </FormField>
              </div>

              <FormField label="이메일" error={errors.email}>
                <Input
                  type="email"
                  value={values.email}
                  onChange={(e) => setValue('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </FormField>
            </CardContent>
          </Card>

          {/* 3. 패키지 선택 */}
          {values.productType && (
            <Card>
              <CardHeader>
                <SectionHeader
                  icon={Package}
                  title="패키지 선택"
                  description="기본 촬영 패키지를 선택하세요"
                />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availablePackages.map(pkg => (
                    <ProductCard
                      key={pkg.id}
                      product={pkg}
                      selected={values.packageId === pkg.id}
                      onSelect={() => setValue('packageId', pkg.id)}
                    />
                  ))}
                </div>
                {errors.packageId && (
                  <p className="text-sm text-red-500 mt-2">{errors.packageId}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4. 추가 옵션 */}
          {values.packageId && (
            <Card>
              <CardHeader>
                <SectionHeader
                  icon={Tag}
                  title="추가 옵션"
                  description="필요한 옵션을 선택하세요 (선택사항)"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableOptions.map(option => (
                    <OptionCheckbox
                      key={option.id}
                      option={option}
                      checked={values.optionIds.includes(option.id)}
                      onToggle={() => handleOptionToggle(option.id)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. 촬영 정보 */}
          <Card>
            <CardHeader>
              <SectionHeader
                icon={Calendar}
                title="촬영 정보"
                description="촬영 날짜와 장소를 입력하세요"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="촬영 날짜" required error={errors.weddingDate}>
                  <Input
                    type="date"
                    value={values.weddingDate}
                    onChange={(e) => setValue('weddingDate', e.target.value)}
                  />
                </FormField>

                <FormField label="촬영 시간">
                  <Input
                    type="time"
                    value={values.weddingTime}
                    onChange={(e) => setValue('weddingTime', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="촬영 장소" required error={errors.weddingVenue}>
                <Input
                  value={values.weddingVenue}
                  onChange={(e) => setValue('weddingVenue', e.target.value)}
                  placeholder="서울 그랜드 웨딩홀"
                />
              </FormField>

              <FormField label="상세 주소">
                <Input
                  value={values.venueAddress}
                  onChange={(e) => setValue('venueAddress', e.target.value)}
                  placeholder="서울시 강남구..."
                />
              </FormField>
            </CardContent>
          </Card>

          {/* 6. 특이사항 */}
          <Card>
            <CardHeader>
              <SectionHeader
                icon={UserPlus}
                title="기타 정보"
                description="특이사항이나 요청사항을 입력하세요"
              />
            </CardHeader>
            <CardContent>
              <FormField label="특이사항">
                <Textarea
                  value={values.specialRequests}
                  onChange={(e) => setValue('specialRequests', e.target.value)}
                  placeholder="특별한 요청사항이나 주의사항을 입력하세요"
                  rows={4}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* 7. 가격 요약 */}
          {selectedPackage && (
            <Card className="border-2 border-zinc-900 bg-zinc-50">
              <CardHeader>
                <SectionHeader
                  icon={CreditCard}
                  title="가격 요약"
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>기본 패키지</span>
                    <span className="font-medium">
                      {formatCurrency(selectedPackage.basePrice)}
                    </span>
                  </div>
                  {values.optionIds.map(optionId => {
                    const option = availableOptions.find(o => o.id === optionId)
                    return option ? (
                      <div key={optionId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{option.title}</span>
                        <span>{formatCurrency(option.basePrice)}</span>
                      </div>
                    ) : null
                  })}
                  <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold">
                    <span>총 금액</span>
                    <span className="text-zinc-900">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800"
            >
              {isSubmitting ? (
                <ButtonLoader text="등록 중..." />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  프로젝트 등록
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

