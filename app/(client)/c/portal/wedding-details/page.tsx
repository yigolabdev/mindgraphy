'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { Calendar, Clock, Users, Camera, Heart, Upload, ArrowLeft } from 'lucide-react'

export default function WeddingDetailsPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 촬영 시간 확인
  const [timeConfirmed, setTimeConfirmed] = useState(false)

  // 타임테이블
  const [makeupShop, setMakeupShop] = useState('')
  const [makeupStartTime, setMakeupStartTime] = useState('')
  const [makeupEndTime, setMakeupEndTime] = useState('')

  // 예식 내용
  const [hasPreCeremonyPhoto, setHasPreCeremonyPhoto] = useState<'yes' | 'no' | ''>('')
  const [hasOfficiant, setHasOfficiant] = useState<'yes' | 'no' | ''>('')
  const [hasMC, setHasMC] = useState<'yes' | 'no' | ''>('')
  const [mcType, setMcType] = useState<'professional' | 'friend' | ''>('')
  const [hasRingExchange, setHasRingExchange] = useState<'yes' | 'no' | ''>('')
  const [hasFlowerGirl, setHasFlowerGirl] = useState<'yes' | 'no' | ''>('')
  const [hasPaebaek, setHasPaebaek] = useState<'yes' | 'no' | ''>('')

  // 가족 구성원
  const [groomFamily, setGroomFamily] = useState('')
  const [brideFamily, setBrideFamily] = useState('')

  // 사진 방향
  const [preferredStyle, setPreferredStyle] = useState('')
  const [notPreferredStyle, setNotPreferredStyle] = useState('')

  // 스타일링
  const [mainDressColor, setMainDressColor] = useState('')
  const [mainDressStyle, setMainDressStyle] = useState('')
  const [receptionDressColor, setReceptionDressColor] = useState('')
  const [receptionDressStyle, setReceptionDressStyle] = useState('')
  const [groomSuitInfo, setGroomSuitInfo] = useState('')

  // 업체 정보
  const [dressShop, setDressShop] = useState('')
  const [suitShop, setSuitShop] = useState('')
  const [makeupShopName, setMakeupShopName] = useState('')
  const [planner, setPlanner] = useState('')
  const [videoTeam, setVideoTeam] = useState('')
  const [iphoneSnap, setIphoneSnap] = useState('')
  const [otherTeam, setOtherTeam] = useState('')
  const [specialEvents, setSpecialEvents] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')

  // 허니문 일정
  const [honeymoonDeparture, setHoneymoonDeparture] = useState('')
  const [honeymoonDestination, setHoneymoonDestination] = useState('')
  const [honeymoonReturn, setHoneymoonReturn] = useState('')

  // 미팅 방식
  const [meetingType, setMeetingType] = useState<'direct' | 'phone' | 'list' | ''>('')

  // 청첩장
  const [invitationUrl, setInvitationUrl] = useState('')

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async () => {
    if (!timeConfirmed) {
      alert('촬영 시간 안내를 확인해주세요.')
      return
    }

    setIsSubmitting(true)

    // TODO: API 호출하여 데이터 저장
    const formData = {
      timeConfirmed,
      timetable: {
        makeupShop,
        makeupStartTime,
        makeupEndTime,
      },
      ceremony: {
        hasPreCeremonyPhoto,
        hasOfficiant,
        hasMC,
        mcType,
        hasRingExchange,
        hasFlowerGirl,
        hasPaebaek,
      },
      family: {
        groomFamily,
        brideFamily,
      },
      photoStyle: {
        preferredStyle,
        notPreferredStyle,
      },
      styling: {
        mainDressColor,
        mainDressStyle,
        receptionDressColor,
        receptionDressStyle,
        groomSuitInfo,
      },
      vendors: {
        dressShop,
        suitShop,
        makeupShopName,
        planner,
        videoTeam,
        iphoneSnap,
        otherTeam,
        specialEvents,
        specialRequests,
      },
      honeymoon: {
        honeymoonDeparture,
        honeymoonDestination,
        honeymoonReturn,
      },
      meetingType,
      invitationUrl,
    }

    console.log('Form data:', formData)

    setTimeout(() => {
      alert('예식 정보가 저장되었습니다. 감사합니다!')
      router.push('/c/portal')
    }, 1000)
  }

  const RadioGroup = ({ 
    value, 
    onChange, 
    options 
  }: { 
    value: string, 
    onChange: (value: any) => void, 
    options: { value: string, label: string }[] 
  }) => (
    <div className="flex gap-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 text-zinc-900 focus:ring-zinc-900"
          />
          <span className="text-sm text-zinc-700">{option.label}</span>
        </label>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className={cn(
        "max-w-3xl mx-auto px-4 py-12 space-y-8 transition-all duration-700 ease-out",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/c/portal')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            포털로 돌아가기
          </Button>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-light text-zinc-900 tracking-tight">
              예식 상세 정보
            </h1>
            <p className="text-sm text-zinc-600">
              촬영 준비를 위해 필요한 정보를 입력해주세요
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-200"></div>

        {/* 촬영 시간 확인 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              촬영 시간 안내
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-blue-900 leading-relaxed">
                마인드그라피 본식 촬영의 기본 촬영시간은 총 3시간입니다.
              </p>
              <p className="text-sm text-blue-900 leading-relaxed">
                예식시간 기준으로 <strong>1시간 30분 전 시작</strong> ~ <strong>1시간 30분 후 마무리</strong>
              </p>
              <p className="text-xs text-blue-700 leading-relaxed mt-2">
                ※ 20분 이상 일찍 촬영 준비를 위해 대기해야 하는 경우 추가 금액이 발생할 수 있습니다.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="time-confirm"
                checked={timeConfirmed}
                onCheckedChange={(checked) => setTimeConfirmed(checked as boolean)}
              />
              <Label htmlFor="time-confirm" className="text-sm font-normal cursor-pointer">
                일정을 확인했습니다
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* 타임테이블 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              당일 타임테이블
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              당일 메이크업샵 위치와 일정을 알려주시면 촬영팀이 동선과 이동시간을 미리 파악할 수 있습니다.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="makeup-shop">메이크업샵 이름 및 위치</Label>
              <Input
                id="makeup-shop"
                value={makeupShop}
                onChange={(e) => setMakeupShop(e.target.value)}
                placeholder="예) OOO 메이크업샵 본점, 서울 강남구 ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="makeup-start">입실 시간</Label>
                <Input
                  id="makeup-start"
                  type="time"
                  value={makeupStartTime}
                  onChange={(e) => setMakeupStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="makeup-end">퇴실 시간</Label>
                <Input
                  id="makeup-end"
                  type="time"
                  value={makeupEndTime}
                  onChange={(e) => setMakeupEndTime(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 예식 내용 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5" />
              예식 내용
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>선원판 진행 여부</Label>
              <p className="text-xs text-zinc-500 mb-2">
                예식 시작 1시간 30분 전에 직계 가족들과 신랑·신부님만 먼저 촬영하는 기념사진
              </p>
              <RadioGroup
                value={hasPreCeremonyPhoto}
                onChange={setHasPreCeremonyPhoto}
                options={[
                  { value: 'yes', label: '진행합니다' },
                  { value: 'no', label: '진행하지 않습니다' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>주례 여부</Label>
              <RadioGroup
                value={hasOfficiant}
                onChange={setHasOfficiant}
                options={[
                  { value: 'yes', label: '있습니다' },
                  { value: 'no', label: '없습니다' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>사회자 진행 여부</Label>
              <RadioGroup
                value={hasMC}
                onChange={setHasMC}
                options={[
                  { value: 'yes', label: '있습니다' },
                  { value: 'no', label: '없습니다' },
                ]}
              />
            </div>

            {hasMC === 'yes' && (
              <div className="space-y-2 pl-6 border-l-2 border-zinc-200">
                <Label>사회자 유형</Label>
                <p className="text-xs text-zinc-500 mb-2">
                  전문가의 경우 뒷모습 위주, 지인의 경우 앞모습 위주로 촬영합니다
                </p>
                <RadioGroup
                  value={mcType}
                  onChange={setMcType}
                  options={[
                    { value: 'professional', label: '전문 사회자' },
                    { value: 'friend', label: '지인' },
                  ]}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>반지 교환 여부</Label>
              <RadioGroup
                value={hasRingExchange}
                onChange={setHasRingExchange}
                options={[
                  { value: 'yes', label: '진행합니다' },
                  { value: 'no', label: '진행하지 않습니다' },
                ]}
              />
            </div>

            {hasRingExchange === 'yes' && (
              <div className="space-y-2 pl-6 border-l-2 border-zinc-200">
                <Label>화동(링보이/링걸) 여부</Label>
                <RadioGroup
                  value={hasFlowerGirl}
                  onChange={setHasFlowerGirl}
                  options={[
                    { value: 'yes', label: '있습니다' },
                    { value: 'no', label: '없습니다' },
                  ]}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>폐백 진행 여부</Label>
              <RadioGroup
                value={hasPaebaek}
                onChange={setHasPaebaek}
                options={[
                  { value: 'yes', label: '진행합니다' },
                  { value: 'no', label: '진행하지 않습니다' },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* 가족 원판 사진 구성원 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              가족 단체사진 구성원
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              부모님과 형제자매까지의 가족 구성원을 알려주시면 촬영 시 빠짐없이 담을 수 있습니다.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="groom-family">신랑측 가족</Label>
              <Textarea
                id="groom-family"
                value={groomFamily}
                onChange={(e) => setGroomFamily(e.target.value)}
                placeholder="예) 아버님, 어머님, 누나, 매형, 조카 2명"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bride-family">신부측 가족</Label>
              <Textarea
                id="bride-family"
                value={brideFamily}
                onChange={(e) => setBrideFamily(e.target.value)}
                placeholder="예) 아버님, 어머님, 오빠, 올케, 조카 1명"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* 사진 방향 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              선호 사진 스타일
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              원하시는 사진 스타일이나 피하고 싶은 스타일을 자유롭게 설명해주세요.
              참고 이미지가 있다면 함께 첨부해주시면 더욱 도움이 됩니다.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="preferred-style">촬영하고 싶은 스타일 (선호)</Label>
              <Textarea
                id="preferred-style"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                placeholder="예) 밝고 자연스러운 느낌, 감성적이고 따뜻한 분위기 등"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="not-preferred-style">피하고 싶은 스타일 (비선호)</Label>
              <Textarea
                id="not-preferred-style"
                value={notPreferredStyle}
                onChange={(e) => setNotPreferredStyle(e.target.value)}
                placeholder="예) 너무 어두운 느낌, 과한 편집 등"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 스타일링 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" />
              의상 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-zinc-600 leading-relaxed">
              드레스와 예복 정보를 미리 알려주시면 촬영 준비에 큰 도움이 됩니다.
            </p>

            <div className="space-y-4 p-4 bg-zinc-50 rounded-lg">
              <h4 className="text-sm font-medium text-zinc-900">메인 드레스 (본식)</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-dress-color">색상</Label>
                  <Input
                    id="main-dress-color"
                    value={mainDressColor}
                    onChange={(e) => setMainDressColor(e.target.value)}
                    placeholder="예) 아이보리"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="main-dress-style">스타일</Label>
                  <Input
                    id="main-dress-style"
                    value={mainDressStyle}
                    onChange={(e) => setMainDressStyle(e.target.value)}
                    placeholder="예) 머메이드, A라인"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-zinc-50 rounded-lg">
              <h4 className="text-sm font-medium text-zinc-900">연회장 의상</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reception-dress-color">색상</Label>
                  <Input
                    id="reception-dress-color"
                    value={receptionDressColor}
                    onChange={(e) => setReceptionDressColor(e.target.value)}
                    placeholder="예) 핑크"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reception-dress-style">스타일</Label>
                  <Input
                    id="reception-dress-style"
                    value={receptionDressStyle}
                    onChange={(e) => setReceptionDressStyle(e.target.value)}
                    placeholder="예) 볼륨감 있는"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groom-suit">신랑 의상</Label>
              <p className="text-xs text-zinc-500 mb-2">
                일반적인 검정/남색 수트가 아닌 경우에만 작성해주세요
              </p>
              <Input
                id="groom-suit"
                value={groomSuitInfo}
                onChange={(e) => setGroomSuitInfo(e.target.value)}
                placeholder="예) 베이지 컬러 턱시도"
              />
            </div>
          </CardContent>
        </Card>

        {/* 업체 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">협력 업체 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dress-shop">드레스 샵</Label>
                <Input
                  id="dress-shop"
                  value={dressShop}
                  onChange={(e) => setDressShop(e.target.value)}
                  placeholder="업체 이름"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suit-shop">예복 샵</Label>
                <Input
                  id="suit-shop"
                  value={suitShop}
                  onChange={(e) => setSuitShop(e.target.value)}
                  placeholder="업체 이름"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="makeup-shop-name">헤어·메이크업 샵</Label>
                <Input
                  id="makeup-shop-name"
                  value={makeupShopName}
                  onChange={(e) => setMakeupShopName(e.target.value)}
                  placeholder="업체 이름"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planner">플래너</Label>
                <Input
                  id="planner"
                  value={planner}
                  onChange={(e) => setPlanner(e.target.value)}
                  placeholder="업체명 / 성함"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video-team">영상 촬영팀</Label>
                <Input
                  id="video-team"
                  value={videoTeam}
                  onChange={(e) => setVideoTeam(e.target.value)}
                  placeholder="업체명 / 인원수 (예: 2인3캠)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iphone-snap">아이폰 스냅</Label>
                <Input
                  id="iphone-snap"
                  value={iphoneSnap}
                  onChange={(e) => setIphoneSnap(e.target.value)}
                  placeholder="업체명 / 인원수"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="other-team">그 외 촬영팀</Label>
              <Input
                id="other-team"
                value={otherTeam}
                onChange={(e) => setOtherTeam(e.target.value)}
                placeholder="예) 지인 서브 포토그래퍼, 지인 영상감독 등"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-events">특별 이벤트 및 특이사항</Label>
              <Input
                id="special-events"
                value={specialEvents}
                onChange={(e) => setSpecialEvents(e.target.value)}
                placeholder="예) 뮤지컬 웨딩, 깜짝 이벤트 등"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="special-requests">특별히 부탁하실 내용</Label>
              <Textarea
                id="special-requests"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="촬영 관련 특별한 요청사항이 있으시면 자유롭게 작성해주세요"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* 허니문 일정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">신혼여행 일정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-600 leading-relaxed">
              귀중한 신혼여행 기간에 불필요한 연락을 드리지 않기 위해 미리 일정을 확인합니다.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="honeymoon-departure">출발 일시</Label>
              <Input
                id="honeymoon-departure"
                value={honeymoonDeparture}
                onChange={(e) => setHoneymoonDeparture(e.target.value)}
                placeholder="예) 12.25 밤 비행기"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="honeymoon-destination">목적지 (국가/도시)</Label>
              <Input
                id="honeymoon-destination"
                value={honeymoonDestination}
                onChange={(e) => setHoneymoonDestination(e.target.value)}
                placeholder="예) 몰디브"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="honeymoon-return">귀국 일자</Label>
              <Input
                id="honeymoon-return"
                value={honeymoonReturn}
                onChange={(e) => setHoneymoonReturn(e.target.value)}
                placeholder="예) 01.05"
              />
            </div>
          </CardContent>
        </Card>

        {/* 미팅 방식 선택 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">사전 미팅 방식</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-900 transition-all">
                <input
                  type="radio"
                  checked={meetingType === 'direct'}
                  onChange={() => setMeetingType('direct')}
                  className="mt-0.5 h-4 w-4 text-zinc-900 focus:ring-zinc-900"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">직접 미팅</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    서울 한양대학교 근처 마인드그라피 작업실에서 진행 (일정 조율 후)
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-900 transition-all">
                <input
                  type="radio"
                  checked={meetingType === 'phone'}
                  onChange={() => setMeetingType('phone')}
                  className="mt-0.5 h-4 w-4 text-zinc-900 focus:ring-zinc-900"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">전화 미팅</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    일정 조율 후 전화로 진행
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 border-zinc-200 rounded-lg cursor-pointer hover:border-zinc-900 transition-all">
                <input
                  type="radio"
                  checked={meetingType === 'list'}
                  onChange={() => setMeetingType('list')}
                  className="mt-0.5 h-4 w-4 text-zinc-900 focus:ring-zinc-900"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900">리스트로만 진행</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    상담팀에서 내용 검토 후 필요시 연락 드립니다
                  </p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 모바일 청첩장 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">모바일 청첩장</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="invitation-url">모바일 청첩장 링크 (선택)</Label>
            <Input
              id="invitation-url"
              type="url"
              value={invitationUrl}
              onChange={(e) => setInvitationUrl(e.target.value)}
              placeholder="https://"
            />
            <p className="text-xs text-zinc-500">
              있으시면 함께 공유 부탁드립니다
            </p>
          </CardContent>
        </Card>

        {/* 제출 버튼 */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!timeConfirmed || isSubmitting}
            className={cn(
              "w-full h-14 text-base font-normal transition-all duration-300",
              "bg-zinc-900 hover:bg-zinc-800 text-white",
              "disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
              timeConfirmed && !isSubmitting && "shadow-md hover:shadow-lg"
            )}
          >
            {isSubmitting ? '제출 중...' : '정보 제출하기'}
          </Button>

          <p className="text-xs text-center text-zinc-500 leading-relaxed">
            작성하신 정보는 촬영 준비에만 활용되며 안전하게 보관됩니다
          </p>
        </div>
      </div>
    </div>
  )
}

