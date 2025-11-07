# ✅ My Schedule (작가 일정) - Complete

## 🎯 Acceptance Criteria - ALL COMPLETE

### ✅ Tabbed Layout

- [x] **My Day / My Week Tabs**:
  - ✅ Tabs 컴포넌트로 구현
  - ✅ "오늘" / "이번 주" 토글
  - ✅ URL 상태 동기화 없이 local state 관리
  - ✅ 탭 전환 시 부드러운 애니메이션

### ✅ My Day Section

- [x] **Today Timeline**:
  - ✅ 오늘 일정 카드 레이아웃
  - ✅ 시간 블록 표시 (시작-종료)
  - ✅ 이동시간 배지
  - ✅ D-Day 배지
  - ✅ 상태 배지 (예정/진행중/완료)
  - ✅ 예식 시간 표시
  - ✅ 예식장 정보 (이름, 주소)
  - ✅ 패키지 & 옵션 배지
  - ✅ 특이사항 하이라이트
  - ✅ 빠른 액션 버튼 (신랑/신부 전화, 지도)
  - ✅ 체크리스트 진행률

- [x] **My Checklist**:
  - ✅ 10개 항목 (장비/준비/이동/사후)
  - ✅ 체크/언체크 토글
  - ✅ 완료 시 취소선
  - ✅ 카테고리 배지
  - ✅ 진행률 표시 (3/10)
  - ✅ Toast 알림

### ✅ My Week Section

- [x] **Week Schedule List**:
  - ✅ 이번 주 일정 3건 표시
  - ✅ 날짜 및 요일
  - ✅ 시간 및 예식 시간
  - ✅ 예식장 정보
  - ✅ 이동시간 경고 (60분 이상)
  - ✅ 체크리스트 진행률 바
  - ✅ 상태 배지

- [x] **Weekly Availability Grid**:
  - ✅ 2주치 가용성 그리드
  - ✅ 3개 시간대 (오전/오후/저녁)
  - ✅ 7일 × 3 슬롯 테이블
  - ✅ 클릭으로 가능/불가능 토글
  - ✅ 예약된 슬롯은 비활성화
  - ✅ 색상 코딩 (초록/빨강/파랑)
  - ✅ 범례 표시
  - ✅ Toast 알림

### ✅ Actions

- [x] **휴가 등록**:
  - ✅ 모달 다이얼로그
  - ✅ 시작일/종료일 날짜 선택
  - ✅ 사유 입력 (textarea)
  - ✅ 안내사항 표시
  - ✅ Mock 데이터 생성
  - ✅ Toast 성공 알림

- [x] **교대 요청**:
  - ✅ 모달 다이얼로그
  - ✅ 일정 정보 표시
  - ✅ 대상 작가 선택 (전체/특정)
  - ✅ 사유 입력
  - ✅ Mock notification 생성
  - ✅ Toast 성공 알림

### ✅ Mobile Layout

- [x] **Bottom Tabs**:
  - ✅ Fixed bottom navigation (모바일 전용)
  - ✅ 4개 탭: 오늘/주간/휴가/교대
  - ✅ 아이콘 + 라벨
  - ✅ 활성 탭 하이라이트
  - ✅ 데스크톱에서는 숨김 (md:hidden)
  - ✅ 페이지 하단 여백 추가 (pb-20)

### ✅ Data & State

- [x] **Mock Data** (`lib/mock/me.ts`):
  - ✅ currentUser (박작가)
  - ✅ getTodaySchedule() - 오늘 1건
  - ✅ getWeekSchedule() - 주간 3건
  - ✅ getWeeklyAvailability() - 2주치
  - ✅ getMyChecklist() - 10개 항목
  - ✅ getShiftSwapRequests()
  - ✅ Helper functions (toggle, update, create)

- [x] **Local-only Writes**:
  - ✅ useState로 로컬 상태 관리
  - ✅ 체크리스트 토글
  - ✅ 가용성 슬롯 토글
  - ✅ 교대 요청 생성
  - ✅ 휴가 신청 생성
  - ✅ Toast 알림 (Sonner)

---

## 🎨 Implementation Details

### Page Structure

```
/admin/my
├─ Header
│  ├─ Title: "박작가님의 일정"
│  └─ Actions: [휴가 신청] [교대 요청]
├─ Tabs
│  ├─ [오늘] [이번 주]
│  ├─ Tab Content: My Day
│  │  ├─ Today's Schedule (1건)
│  │  └─ My Checklist (10개)
│  └─ Tab Content: My Week
│     ├─ Week Schedule List (3건)
│     └─ Weekly Availability Grid (2주)
└─ Mobile Bottom Tabs (모바일 전용)
   └─ [오늘] [주간] [휴가] [교대]
```

### My Day Component

#### Today's Schedule Card
```tsx
┌─────────────────────────────────────┐
│  홍길동 & 김영희             [진행중] │
│  서울 그랜드 호텔                    │
├─────────────────────────────────────┤
│  🕐 11:00 - 16:00  · 예식 14:00     │
│  🧭 이동시간: 30분  [D-0]           │
├─────────────────────────────────────┤
│  📍 서울 그랜드 호텔                │
│     서울시 강남구 테헤란로 123       │
├─────────────────────────────────────┤
│  📦 [프리미엄] [본식+스냅] [야외]   │
├─────────────────────────────────────┤
│  ⚠️ 야외 정원에서 가족 단체 사진    │
├─────────────────────────────────────┤
│  [신랑 전화] [신부 전화] [지도]     │
├─────────────────────────────────────┤
│  체크리스트               3 / 5      │
│  ▓▓▓▓▓▓░░░░░░░░░░░░░░ 60%          │
└─────────────────────────────────────┘
```

#### My Checklist
```tsx
┌─────────────────────────────────────┐
│  내 체크리스트                 3/10  │
├─────────────────────────────────────┤
│  ✓ 카메라 배터리 완충         [장비] │
│  ✓ 메모리 카드 포맷           [장비] │
│  ✓ 렌즈 청소                  [장비] │
│  ○ 플래시 배터리 확인         [장비] │
│  ○ 드론 배터리 2개 충전       [장비] │
│  ✓ 이동 경로 확인             [이동] │
│  ○ 예식장 주차 정보 확인      [이동] │
│  ✓ 고객 연락처 저장           [준비] │
│  ✓ 특이사항 메모 확인         [준비] │
│  ○ 날씨 확인 (야외 촬영)      [준비] │
└─────────────────────────────────────┘
```

### My Week Component

#### Week Schedule List
```tsx
┌─────────────────────────────────────┐
│  홍길동 & 김영희             [진행중] │
│  11월 3일 (일)                       │
├─────────────────────────────────────┤
│  🕐 11:00 - 16:00  · 예식 14:00     │
│  📍 서울 그랜드 호텔                 │
│  ✓ 준비 상태: 3/5  ▓▓▓▓▓▓░░░░      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  정우성 & 한가인               [예정] │
│  11월 5일 (화)                       │
├─────────────────────────────────────┤
│  🕐 14:00 - 18:00  · 예식 16:00     │
│  📍 부산 해운대 그랜드 호텔          │
│  🧭 이동시간 4시간 - 전날 출발 필요  │
│  ✓ 준비 상태: 0/5  ░░░░░░░░░░      │
└─────────────────────────────────────┘
```

#### Weekly Availability Grid
```
11월 3일 주간
┌─────────┬────┬────┬────┬────┬────┬────┬────┐
│ 시간대  │ 일 │ 월 │ 화 │ 수 │ 목 │ 금 │ 토 │
│         │ 3일│ 4일│ 5일│ 6일│ 7일│ 8일│ 9일│
├─────────┼────┼────┼────┼────┼────┼────┼────┤
│ 오전    │예약│ ✓ │예약│ ✓ │ ✓ │ ✓ │ ✓ │
│ (09-13) │    │    │    │    │    │    │    │
├─────────┼────┼────┼────┼────┼────┼────┼────┤
│ 오후    │예약│ ✓ │예약│ ✓ │ ✓ │ ✓ │ ✓ │
│ (13-18) │    │    │    │    │    │    │    │
├─────────┼────┼────┼────┼────┼────┼────┼────┤
│ 저녁    │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │
│ (18-22) │    │    │    │    │    │    │    │
└─────────┴────┴────┴────┴────┴────┴────┴────┘

범례: [✓ 가능] [✗ 불가능] [예약 예약됨]
```

### Shift Swap Modal

```tsx
┌─────────────────────────────────────┐
│  교대 요청                      [X]  │
│  다른 작가에게 일정 교대를 요청합니다│
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 정우성 & 한가인        [프리미엄] │
│  │ 부산 해운대 그랜드 호텔         │
│  │ 📅 11월 5일 (화)               │
│  │ 🕐 14:00 - 18:00               │
│  │ 📍 부산시 해운대구 우동         │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  👤 교대 요청 대상 (선택)           │
│  [전체 작가] [최작가] [김작가] [이작가] │
│  특정 작가를 선택하거나,             │
│  전체 작가에게 요청할 수 있습니다.   │
├─────────────────────────────────────┤
│  사유 *                             │
│  ┌───────────────────────────────┐  │
│  │ 개인 사정으로 부산 출장이      │  │
│  │ 어렵습니다.                    │  │
│  │                                │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│              [취소] [요청 보내기]    │
└─────────────────────────────────────┘
```

### Leave Request Modal

```tsx
┌─────────────────────────────────────┐
│  📅 휴가 신청                   [X]  │
│  휴가를 신청하면 관리자에게          │
│  승인 요청이 전송됩니다.             │
├─────────────────────────────────────┤
│  시작일 *                           │
│  [2025-11-10                    ▼]  │
├─────────────────────────────────────┤
│  종료일 *                           │
│  [2025-11-12                    ▼]  │
├─────────────────────────────────────┤
│  사유 *                             │
│  ┌───────────────────────────────┐  │
│  │ 가족 여행으로 인한 휴가 신청   │  │
│  │                                │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  ℹ️ 안내사항                        │
│  • 휴가 신청 후 관리자 승인이 필요   │
│  • 휴가 기간 중에는 일정이 배정 X    │
│  • 긴급한 경우 전화로 문의해주세요   │
├─────────────────────────────────────┤
│              [취소] [신청하기]       │
└─────────────────────────────────────┘
```

### Mobile Bottom Navigation

```
모바일 전용 (fixed bottom):

┌─────────────────────────────────────┐
│  [📅]    [📅]    [📅]    [🔄]      │
│  오늘    주간    휴가    교대        │
└─────────────────────────────────────┘

- Fixed bottom-0
- Grid cols-4
- 활성 탭: bg-primary + text-primary-foreground
- 비활성 탭: text-muted-foreground + hover:bg-accent
- 데스크톱: md:hidden
```

---

## 📊 Data Structure

### MySchedule

```typescript
{
  id: string
  eventId: string  // Link to ScheduleEvent
  date: string  // YYYY-MM-DD
  startTime: string  // HH:mm
  endTime: string
  title: string  // "홍길동 & 김영희"
  venueName: string
  venueAddress: string
  ceremonyTime: string
  packageType: string
  options: string[]
  groomPhone: string
  bridePhone: string
  travelTimeMinutes: number
  status: 'upcoming' | 'in_progress' | 'completed'
  checklistCompleted: number
  checklistTotal: number
  specialRequests?: string
}
```

### WeeklyAvailability

```typescript
{
  date: string  // YYYY-MM-DD
  dayOfWeek: number  // 0-6
  slots: {
    morning: boolean  // 09:00 - 13:00
    afternoon: boolean  // 13:00 - 18:00
    evening: boolean  // 18:00 - 22:00
  }
  status: 'available' | 'booked' | 'leave' | 'requested_swap'
  note?: string
}
```

### ChecklistItem

```typescript
{
  id: string
  text: string
  completed: boolean
  category: 'equipment' | 'preparation' | 'travel' | 'post'
}
```

### ShiftSwapRequest

```typescript
{
  id: string
  scheduleId: string
  scheduleName: string
  date: string
  reason: string
  targetPhotographerId?: string
  targetPhotographerName?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}
```

---

## 🎯 User Flows

### Flow 1: 작가의 오늘 일정 확인

1. `/admin/my` 접속
2. Default: "오늘" 탭 활성
3. 오늘 일정 카드 확인
4. 이동시간 30분 → 출발 시간 계획
5. 특이사항 확인 (야외 단체 사진)
6. 체크리스트 확인 (3/5 완료)
7. 미완료 항목 클릭 → 완료 처리
8. Toast: "체크리스트 항목 완료!"

### Flow 2: 이번 주 일정 확인 및 가용성 관리

1. "이번 주" 탭 클릭
2. 3건의 일정 확인
3. 부산 일정 (이동시간 4시간) 확인
4. 주간 가용성 그리드로 스크롤
5. 11월 6일 오전 슬롯 클릭
6. 초록 (가능) → 빨강 (불가능) 변경
7. Toast: "11월 6일 오전 시간대를 불가능으로 변경했습니다."

### Flow 3: 교대 요청

1. "교대 요청" 버튼 클릭
2. 모달 열림 (부산 일정 선택됨)
3. 대상: "최작가" 선택
4. 사유 입력: "개인 사정으로 부산 출장이 어렵습니다."
5. "요청 보내기" 클릭
6. Toast: "교대 요청이 전송되었습니다. 해당 작가에게 알림이 발송됩니다."
7. Mock notification 생성 (console.log)

### Flow 4: 휴가 신청

1. "휴가 신청" 버튼 클릭
2. 모달 열림
3. 시작일: 2025-11-10
4. 종료일: 2025-11-12
5. 사유: "가족 여행"
6. "신청하기" 클릭
7. Toast: "휴가 신청이 완료되었습니다. 관리자 승인을 기다려주세요."
8. Mock leave request 생성 (console.log)

### Flow 5: 모바일에서 빠른 탭 전환

1. 모바일 기기로 접속
2. 하단 고정 내비게이션 표시
3. [오늘] 탭 → My Day 뷰
4. [주간] 탭 → My Week 뷰
5. [휴가] 탭 → 휴가 신청 모달
6. [교대] 탭 → 교대 요청 모달

---

## 🚀 Live URLs

```bash
# My Schedule Page
http://localhost:3000/admin/my

# From Admin Dashboard
http://localhost:3000/admin/dashboard
→ Sidebar "내 일정" 클릭

# From Admin Calendar
http://localhost:3000/admin/calendar
→ "내 일정 (My)" Quick Link
```

---

## 📋 Testing Checklist

### My Day Tab

- [x] 오늘 일정 카드 표시
- [x] 시간 및 이동시간 표시
- [x] D-Day 배지 표시
- [x] 상태 배지 표시
- [x] 예식장 정보 표시
- [x] 패키지 & 옵션 배지
- [x] 특이사항 하이라이트
- [x] 전화 링크 동작 (tel:)
- [x] 지도 링크 동작 (Kakao)
- [x] 체크리스트 진행률 표시
- [x] 체크리스트 항목 10개
- [x] 체크리스트 토글 동작
- [x] Toast 알림 표시

### My Week Tab

- [x] 주간 일정 리스트 표시 (3건)
- [x] 날짜 및 요일 표시
- [x] 이동시간 경고 (60분 이상)
- [x] 체크리스트 진행률 바
- [x] 가용성 그리드 표시 (2주)
- [x] 3개 시간대 × 7일
- [x] 슬롯 클릭 토글 동작
- [x] 예약된 슬롯 비활성화
- [x] 색상 코딩 (초록/빨강/파랑)
- [x] Toast 알림 표시

### Actions & Modals

- [x] "휴가 신청" 버튼 클릭
- [x] 휴가 신청 모달 열림
- [x] 날짜 입력 (시작/종료)
- [x] 사유 입력
- [x] 신청하기 버튼 동작
- [x] Toast 알림
- [x] "교대 요청" 버튼 클릭
- [x] 교대 요청 모달 열림
- [x] 일정 정보 표시
- [x] 대상 작가 선택
- [x] 사유 입력
- [x] 요청 보내기 버튼 동작
- [x] Toast 알림

### Mobile Layout

- [x] 하단 고정 내비게이션 표시
- [x] 4개 탭 (오늘/주간/휴가/교대)
- [x] 탭 아이콘 표시
- [x] 활성 탭 하이라이트
- [x] 탭 클릭 시 뷰 전환
- [x] 데스크톱에서 숨김
- [x] 페이지 하단 여백 (pb-20)

### Navigation

- [x] Admin Sidebar "내 일정" 링크
- [x] 배지 표시 (3)
- [x] 활성 상태 하이라이트
- [x] Dashboard "내 일정 (My)" Quick Link

---

## 🎉 Summary

### What We Built

1. **My Day Section**:
   - 오늘 일정 타임라인 카드
   - 상세 정보 (시간, 장소, 패키지, 특이사항)
   - 빠른 액션 (전화, 지도)
   - 체크리스트 (10개 항목, 토글)

2. **My Week Section**:
   - 주간 일정 리스트 (3건)
   - 2주 가용성 그리드 (3 슬롯 × 7일)
   - 편집 가능한 가용성
   - 이동시간 경고

3. **Action Modals**:
   - 휴가 신청 모달
   - 교대 요청 모달
   - Mock data 생성
   - Toast 알림

4. **Mobile Optimization**:
   - 하단 고정 내비게이션
   - 4개 탭 (오늘/주간/휴가/교대)
   - 반응형 레이아웃

5. **Toast System**:
   - Sonner 통합
   - 모든 액션에 성공 알림
   - Root layout에 Toaster 추가

---

## 🎯 AC Achievement

| Requirement | Status | Notes |
|-------------|--------|-------|
| Tabbed layout (My Day/My Week) | ✅ | Tabs 컴포넌트 |
| Today timeline | ✅ | 시간 블록 + 배지 |
| Editable availability (mock) | ✅ | 그리드 토글 + toasts |
| Shift swap request modal | ✅ | Creates mock notification |
| Leave request modal | ✅ | Mock data + toast |
| Mobile bottom tabs | ✅ | 4탭 (오늘/주간/휴가/교대) |
| Checklist toggle | ✅ | 10개 항목 + toast |
| Mock data (me.ts) | ✅ | Schedule + availability |
| Local-only writes | ✅ | useState + toast |
| Toast success | ✅ | Sonner 통합 |

---

**모든 AC 100% 달성! 🎉**

작가를 위한 개인 일정 관리 기능이 완벽하게 구현되었습니다!

**Next Step**: My Notifications 탭 추가 또는 Calendar와 My Schedule 연동

