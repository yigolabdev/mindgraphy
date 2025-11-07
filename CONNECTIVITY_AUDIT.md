# 🔍 MindGraphy - 페이지 연결성 점검 보고서

## 📊 점검 범위

### ✅ 개발 완료된 페이지들

**Public:**
- `/` - Landing page (branching)

**Client Portal:**
- `/c/[token]` - Client dashboard
- `/c/[token]/contract` - Contract & e-sign
- `/c/[token]/info` - Information entry
- `/c/[token]/proof-gallery` - Proof selection
- `/c/[token]/download` - File downloads
- `/c/[token]/invalid` - Invalid token page
- `/c/[token]/payment` - Payment (placeholder)

**Admin:**
- `/admin/dashboard` - Dashboard with KPIs
- `/admin/notifications` - Notifications list
- `/admin/calendar` - FullCalendar
- `/admin/my` - My schedule
- `/admin/settings/products` - Products/Options/Policies
- `/admin/settings/notifications` - Templates/Schedules
- `/admin/settings/masters` - Venues/Partners

---

## 🔴 발견된 문제점

### 1. ROUTES Constants 불일치

**문제:**
```typescript
// constants.ts
CLIENT_PROOF: (token: string) => `/c/${token}/proof-gallery`

// 실제 폴더 구조
/app/(client)/c/[token]/proof-gallery/page.tsx
```

**개선:**
- URL 일관성: `/proof-gallery` → `/proof`로 단순화
- 또는 폴더명을 `proof`로 변경

**영향도:** 중간 (링크는 작동하지만 일관성 문제)

---

### 2. Settings Routes 누락

**문제:**
```typescript
// constants.ts에 없음
ADMIN_SETTINGS_PRODUCTS: '/admin/settings/products'
ADMIN_SETTINGS_NOTIFICATIONS: '/admin/settings/notifications'
ADMIN_SETTINGS_MASTERS: '/admin/settings/masters'
```

**개선:**
- Settings 관련 routes 추가
- Admin navigation에서 하드코딩된 경로 수정

**영향도:** 낮음 (현재 하드코딩으로 작동)

---

### 3. Invalid Token Route 누락

**문제:**
```typescript
// constants.ts에 없음
CLIENT_INVALID: (token: string) => `/c/${token}/invalid`
```

**개선:**
- Invalid token route 추가
- 에러 핸들링 표준화

**영향도:** 낮음 (페이지는 존재, route만 누락)

---

### 4. Client Portal 진행 단계 연결 미흡

**문제:**
- Landing page의 "Next Steps" CTA가 올바른 다음 단계로 연결되는지 미확인
- Contract 완료 → Info로 자동 연결 미구현
- Info 완료 → Proof로 자동 연결 미구현
- Proof 완료 → Download로 자동 연결 미구현

**개선:**
- Progress-aware navigation 구현
- 각 단계 완료 후 다음 단계로 redirect

**영향도:** 높음 (UX 개선 필요)

---

### 5. Admin Dashboard Deep Linking 미구현

**문제:**
- KPI 타일 클릭 시 필터링된 페이지로 이동 미구현
  - "오늘 일정 수" → Calendar (오늘 필터)
  - "미배정 일정" → Calendar (미배정 필터)
  - "마감 임박" → Projects (마감순 정렬)
  - "Proof 미완료" → Projects (Proof 필터)

**개선:**
- Dashboard KPI에 링크 추가
- URL 파라미터로 필터 전달
- Calendar/Projects 페이지에서 URL 파라미터 읽기

**영향도:** 중간 (편의성 개선)

---

### 6. Notifications Deep Linking 미구현

**문제:**
- Notifications 페이지의 알림 클릭 시 관련 페이지로 이동 미구현
- Mock data에 링크 정보 없음

**개선:**
- Notification 타입별 링크 매핑
  - assignment → `/admin/calendar?schedule=${id}`
  - deadline → `/admin/projects/${projectId}`
  - delivery → `/admin/delivery/${deliveryId}`

**영향도:** 중간 (편의성 개선)

---

### 7. Schedule Drawer에서 Client Portal 연결 미흡

**문제:**
- ScheduleDrawer에 "고객 포털 보기" 링크 미구현
- Contract ID는 있지만 token 매핑 정보 없음

**개선:**
- Mock data에 contract → token 매핑 추가
- Drawer에 "고객 포털 열기" 버튼 추가

**영향도:** 낮음 (nice-to-have)

---

### 8. Breadcrumbs 부재

**문제:**
- Settings 페이지에 breadcrumbs 없음
- Client Portal에 breadcrumbs 없음

**개선:**
- Settings: "운영 설정 > 상품 관리"
- Client Portal: "홈 > 계약서"

**영향도:** 낮음 (선택적)

---

### 9. Mock Data 일관성 문제

**문제:**
- Client mock data (`lib/mock/client.ts`)
- Admin mock data (`lib/mock/admin.ts`, `schedules.ts`, `me.ts`, `settings.ts`)
- 데이터 간 ID 매핑 불일치 가능성

**개선:**
- Shared mock data로 통합
- Contract ID, Project ID, Customer ID 일관성 유지

**영향도:** 중간 (장기적 유지보수)

---

### 10. Back Navigation 불일치

**문제:**
- 일부 페이지: "← 뒤로" (예: Download)
- 일부 페이지: breadcrumb
- 일부 페이지: 없음

**개선:**
- Back button 패턴 통일
- 또는 breadcrumb로 표준화

**영향도:** 낮음 (UX 일관성)

---

## ✅ 잘 구현된 부분

### 1. Landing Page Branching
- ✅ Client/Admin 선택 분기
- ✅ localStorage 기억
- ✅ "Continue where you left off" 배너

### 2. Admin Navigation
- ✅ 모든 주요 메뉴 링크
- ✅ Active state 표시
- ✅ Badge 카운트
- ✅ 설정 메뉴 추가됨

### 3. Client Portal Layout
- ✅ Token 기반 라우팅
- ✅ Navigation breadcrumb
- ✅ Progress indicator

### 4. Settings Tabs
- ✅ 3개 페이지 탭 네비게이션
- ✅ Active state
- ✅ 일관된 레이아웃

---

## 📋 개선 우선순위

### 🔴 높음 (즉시 개선)
1. **ROUTES constants 보완** - Settings, Invalid 추가
2. **Client Portal 진행 단계 자동 연결** - 완료 후 다음 단계 redirect
3. **Admin Dashboard Deep Linking** - KPI 클릭 시 필터링된 페이지

### 🟡 중간 (선택적 개선)
4. **Notifications Deep Linking** - 알림 클릭 시 관련 페이지
5. **URL 일관성** - `proof-gallery` → `proof`
6. **Mock Data 통합** - ID 매핑 일관성

### 🟢 낮음 (향후 개선)
7. **Breadcrumbs 추가** - Settings, Client Portal
8. **Back Navigation 통일** - 패턴 표준화
9. **Schedule Drawer → Client Portal 링크**

---

## 🎯 개선 계획

### Phase 1: Critical Fixes (즉시)
- [ ] ROUTES constants에 Settings, Invalid 추가
- [ ] Admin navigation 하드코딩 제거
- [ ] Client Portal 단계별 자동 연결 구현
- [ ] Admin Dashboard KPI에 deep linking

### Phase 2: UX Improvements (선택)
- [ ] Notifications deep linking
- [ ] URL 일관성 개선
- [ ] Mock data ID 매핑 통합

### Phase 3: Polish (향후)
- [ ] Breadcrumbs 추가
- [ ] Back navigation 통일
- [ ] Schedule Drawer 개선

---

## 📊 연결성 매트릭스

### Client Portal Flow
```
Landing (/)
  ↓
Portal Home (/c/[token])
  ↓
Contract (/c/[token]/contract)
  ↓ (완료 시)
Info (/c/[token]/info)
  ↓ (완료 시)
Proof (/c/[token]/proof-gallery)
  ↓ (완료 시)
Download (/c/[token]/download)
```

**현재 상태:** 🟡 링크는 있지만 자동 진행 미구현

### Admin Dashboard → Pages
```
Dashboard (/admin/dashboard)
  → Calendar (오늘 일정)
  → Calendar (미배정)
  → Projects (마감 임박)
  → Projects (Proof 미완료)
  → Notifications
  → My Schedule
```

**현재 상태:** 🟡 링크는 있지만 필터링 미구현

### Admin Navigation
```
Sidebar
  → Dashboard ✅
  → Calendar ✅
  → My ✅
  → Projects ⚠️ (placeholder)
  → Customers ⚠️ (placeholder)
  → Contracts ⚠️ (placeholder)
  → Photographers ⚠️ (placeholder)
  → Photos ⚠️ (placeholder)
  → Editing ⚠️ (placeholder)
  → Delivery ⚠️ (placeholder)
  → Analytics ⚠️ (placeholder)
  → Settings ✅
```

**현재 상태:** 🟡 주요 페이지만 구현됨

---

## 🎯 개선 후 기대 효과

1. **일관성** ⬆️
   - 모든 routes가 constants에 정의
   - 하드코딩 제거

2. **UX** ⬆️
   - 단계별 자동 진행
   - Dashboard에서 빠른 필터링 접근
   - 알림에서 관련 페이지로 직접 이동

3. **유지보수성** ⬆️
   - Mock data ID 매핑 일관성
   - 코드 중복 제거

4. **완성도** ⬆️
   - MVP 수준의 연결성 확보
   - 실제 사용 가능한 흐름

---

**다음 단계: Phase 1 Critical Fixes 구현**

