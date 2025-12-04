# 백엔드 연동 가이드
**작성일**: 2025-11-25  
**목적**: 향후 백엔드 API 연동 시 참고 문서

---

## 📋 개요

현재 프론트엔드는 **백엔드 없이도 완전한 데이터 흐름**을 구현하고 있습니다.
- 고객용 페이지에서 정보 수집
- `localStorage`에 Mock 데이터로 저장
- 관리자 페이지에서 조회 및 상태 관리

**백엔드 연동 시 교체할 파일들과 함수들이 명확하게 표시되어 있습니다.**

---

## 🔄 데이터 흐름

### 현재 (Frontend Only)
```
[고객용 페이지]
  ↓ sessionStorage
[데이터 수집]
  ↓ registerCustomerAndProject()
[localStorage에 Mock 데이터 추가]
  ↓
[관리자 페이지에서 조회]
```

### 백엔드 연동 후 (Production)
```
[고객용 페이지]
  ↓ sessionStorage
[데이터 수집]
  ↓ POST /api/customers/register
[Database (PostgreSQL/MySQL)]
  ↓ GET /api/customers
[관리자 페이지에서 조회]
```

---

## 🎯 핵심 교체 포인트

### 1. 고객 등록 API

**교체 대상 파일**: `lib/utils/customer-registration.ts`

**현재 함수**:
```typescript
export function registerCustomerAndProject(formData: ClientFormData): {
  customer: Customer
  project: Project
  success: boolean
}
```

**백엔드 연동 버전**:
```typescript
export async function registerCustomerAndProject(
  formData: ClientFormData
): Promise<{
  customer: Customer
  project: Project
  success: boolean
}> {
  try {
    const response = await fetch('/api/customers/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to register customer')
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('[API Error]', error)
    return {
      customer: {} as Customer,
      project: {} as Project,
      success: false
    }
  }
}
```

**API 엔드포인트 사양**:
```
POST /api/customers/register

Request Body:
{
  // 고객 정보
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  email: string
  mainContact: 'bride' | 'groom'
  
  // 프로젝트 정보
  productType: 'wedding' | 'hanbok' | 'dress_shop' | 'baby'
  packageId: string
  optionIds: string[]
  weddingDate: string (yyyy-MM-dd)
  weddingTime: string (HH:MM)
  weddingVenue: string
  
  // 메타 정보
  clientType: 'venue' | 'direct'
  referralSource: string
  specialRequests?: string
}

Response:
{
  success: boolean
  customer: Customer
  project: Project
  portalCredentials: {
    username: string (전화번호)
    password: string (임시 비밀번호)
  }
}
```

---

### 2. 고객 목록 조회 API

**교체 대상 함수**:
- `getStoredCustomers()`
- `getStoredProjects()`
- `getInquiryCustomers()`

**백엔드 연동 버전**:
```typescript
// 모든 고객 조회
export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers')
  return await response.json()
}

// 모든 프로젝트 조회
export async function getProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects')
  return await response.json()
}

// 신규 문의 고객만 조회
export async function getInquiryCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers?leadStatus=inquiry')
  return await response.json()
}
```

**API 엔드포인트 사양**:
```
GET /api/customers
GET /api/customers?leadStatus=inquiry
GET /api/projects
GET /api/projects?customerId={customerId}
```

---

### 3. 고객 상태 업데이트 API

**교체 대상 파일**: `lib/utils/customer-registration.ts`

**현재 함수**:
```typescript
export function updateCustomerStatus(
  customerId: string,
  newStatus: Customer['leadStatus']
): boolean
```

**백엔드 연동 버전**:
```typescript
export async function updateCustomerStatus(
  customerId: string,
  newStatus: Customer['leadStatus']
): Promise<boolean> {
  try {
    const response = await fetch(`/api/customers/${customerId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadStatus: newStatus })
    })
    
    return response.ok
  } catch (error) {
    console.error('[API Error]', error)
    return false
  }
}
```

**API 엔드포인트 사양**:
```
PATCH /api/customers/{customerId}/status

Request Body:
{
  leadStatus: 'inquiry' | 'consultation' | 'proposal' | 'contracted' | 'completed' | 'cancelled'
}

Response:
{
  success: boolean
  customer: Customer
}
```

---

### 4. 컴포넌트 업데이트 포인트

**파일**: `app/(client)/c/venue-complete/page.tsx`

**현재 코드**:
```typescript
const result = registerCustomerAndProject(data)
```

**백엔드 연동 시**:
```typescript
const result = await registerCustomerAndProject(data)
```

**파일**: `app/(admin)/admin/projects/page.tsx`

**현재 코드**:
```typescript
useEffect(() => {
  const inquiryCustomers = getInquiryCustomers()
  const storedProjects = getStoredProjects()
  
  setNewInquiries(inquiryCustomers)
  setNewProjects(storedProjects)
}, [])
```

**백엔드 연동 시**:
```typescript
useEffect(() => {
  const fetchData = async () => {
    const inquiryCustomers = await getInquiryCustomers()
    const projects = await getProjects()
    
    setNewInquiries(inquiryCustomers)
    setNewProjects(projects)
  }
  
  fetchData()
}, [])
```

---

## 📦 데이터베이스 스키마

### customers 테이블
```sql
CREATE TABLE customers (
  id VARCHAR(255) PRIMARY KEY,
  groom_name VARCHAR(100) NOT NULL,
  bride_name VARCHAR(100) NOT NULL,
  groom_phone VARCHAR(20),
  bride_phone VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  source_channel VARCHAR(100),
  lead_status ENUM('inquiry', 'consultation', 'proposal', 'contracted', 'completed', 'cancelled') DEFAULT 'inquiry',
  assigned_manager_id VARCHAR(255),
  notes TEXT,
  satisfaction INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_lead_status (lead_status),
  INDEX idx_created_at (created_at),
  INDEX idx_email (email),
  FOREIGN KEY (assigned_manager_id) REFERENCES users(id)
);
```

### projects 테이블
```sql
CREATE TABLE projects (
  id VARCHAR(255) PRIMARY KEY,
  project_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id VARCHAR(255) NOT NULL,
  contract_id VARCHAR(255),
  project_type ENUM('wedding', 'hanbok', 'dress_shop', 'baby') NOT NULL,
  project_status ENUM('scheduled', 'in_progress', 'proof_ready', 'editing', 'completed', 'delivered', 'cancelled', 'archived') DEFAULT 'scheduled',
  package_id VARCHAR(255),
  wedding_date DATE,
  wedding_time VARCHAR(20),
  wedding_venue VARCHAR(255),
  makeup_info TEXT,
  special_requests TEXT,
  referral_source VARCHAR(100),
  assigned_editor_id VARCHAR(255),
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_customer_id (customer_id),
  INDEX idx_project_status (project_status),
  INDEX idx_wedding_date (wedding_date),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (assigned_editor_id) REFERENCES users(id)
);
```

### project_options 테이블 (Many-to-Many)
```sql
CREATE TABLE project_options (
  project_id VARCHAR(255) NOT NULL,
  option_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (project_id, option_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### project_photographers 테이블 (Many-to-Many)
```sql
CREATE TABLE project_photographers (
  project_id VARCHAR(255) NOT NULL,
  photographer_id VARCHAR(255) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (project_id, photographer_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (photographer_id) REFERENCES photographers(id) ON DELETE CASCADE
);
```

---

## 🔐 인증 및 권한

### 고객 포털 자동 계정 생성

**로직**:
1. 고객이 정보 제출 완료
2. 백엔드에서 자동으로 고객 포털 계정 생성
   - 아이디: 대표 전화번호
   - 비밀번호: 전화번호 뒤 4자리 (임시)
3. 이메일/SMS로 로그인 정보 발송

**API 엔드포인트**:
```
POST /api/customers/register
→ 자동으로 portal 계정 생성
→ 이메일/SMS 발송

POST /api/auth/portal/login
Request: { phone: string, password: string }
Response: { token: string, customer: Customer }
```

---

## 📧 알림 시스템

### 이메일 발송 시점

1. **고객 정보 제출 완료**
   - To: 고객
   - 제목: "마인드그라피 문의 접수 완료"
   - 내용: 포털 로그인 정보, 담당자 연락 예정 안내
   
2. **고객 정보 제출 완료**
   - To: 관리자
   - 제목: "신규 문의 접수 알림"
   - 내용: 고객 정보 요약, 바로가기 링크

3. **상태 변경**
   - To: 관리자
   - 제목: "{고객명} 상태 변경: {이전 상태} → {새 상태}"

### SMS 발송 시점

1. **고객 정보 제출 완료**
   - To: 고객 (메인 연락처)
   - 내용: "마인드그라피 문의 접수 완료. 담당자가 1-2일 이내 연락드립니다."

---

## 🧪 테스트 시나리오

### 고객 등록 플로우 테스트

1. **웨딩홀 제휴 고객**:
   - `/product-type` → `wedding` 선택
   - `/c/` → `venue` 선택
   - `/c/venue-info` → 예식장 정보 입력
   - `/c/venue-contact` → 신랑/신부 이름, 전화번호, 이메일 입력
   - `/c/venue-details` → 예식장명, 홀명 입력
   - `/c/venue-date` → 특별 요청사항 입력
   - `/c/venue-complete` → **자동 등록 완료** ✅
   - **결과**: `leadStatus: 'inquiry'`, `sourceChannel: '웨딩홀 제휴'`

2. **직접 문의 고객**:
   - `/product-type` → `wedding` 선택
   - `/c/` → `direct` 선택
   - `/c/wedding-date` → 날짜/시간 선택
   - `/c/packages` → 패키지 선택
   - `/c/options` → 옵션 선택
   - → (중간 페이지들)
   - `/c/venue-complete` → **자동 등록 완료** ✅
   - **결과**: `leadStatus: 'inquiry'`, `sourceChannel: '고객용 페이지 (직접 문의)'`

3. **Instagram 유입**:
   - 홈페이지 접속: `/?utm_source=instagram`
   - **자동 추적**: `sourceChannel: 'instagram'` ✅
   - (위와 동일한 플로우)
   - **결과**: `referralSource: 'instagram'`

### 관리자 플로우 테스트

1. **신규 문의 확인**:
   - 관리자 로그인
   - `/admin/projects` 접속
   - **신규 문의 알림 카드 표시** ✅
   - 상세보기 클릭 → 다이얼로그 열림

2. **고객 상태 전환**:
   - 신규 문의 상세보기
   - 상태 드롭다운에서 `'consultation'` 선택
   - **localStorage 업데이트** ✅
   - Toast 알림: "고객 상태가 변경되었습니다"

3. **작가 배정**:
   - 상태가 `'contracted'`인 고객만 작가 배정 가능
   - 작가 배정 후 캘린더에 자동 추가

---

## 📄 API 엔드포인트 명세

### Customer 관련

#### 1. 고객 등록
```
POST /api/customers/register

Request Body:
{
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  email: string
  mainContact: 'bride' | 'groom'
  productType: 'wedding' | 'hanbok' | 'dress_shop' | 'baby'
  packageId: string
  optionIds: string[]
  weddingDate: string (yyyy-MM-dd)
  weddingTime: string (HH:MM or '미정')
  weddingVenue: string
  clientType: 'venue' | 'direct'
  referralSource: string
  specialRequests?: string
}

Response: 200 OK
{
  success: true
  customer: {
    id: string
    groomName: string
    brideName: string
    groomPhone: string
    bridePhone: string
    email: string
    sourceChannel: string
    leadStatus: 'inquiry'
    assignedManagerId: string
    notes: string
    createdAt: string
  }
  project: {
    id: string
    projectNumber: string
    customerId: string
    contractId: ''
    projectType: string
    projectStatus: 'scheduled'
    packageId: string
    optionIds: string[]
    weddingDate: string
    weddingTime: string
    weddingVenue: string
    specialRequests: string
    referralSource: string
    progress: 0
    createdAt: string
    updatedAt: string
  }
  portalCredentials: {
    username: string
    password: string
  }
}

Error: 400 Bad Request / 500 Internal Server Error
{
  success: false
  error: string
  details?: string
}
```

#### 2. 고객 목록 조회
```
GET /api/customers
GET /api/customers?leadStatus=inquiry
GET /api/customers?leadStatus=contracted
GET /api/customers?assignedManagerId={userId}

Response: 200 OK
{
  customers: Customer[]
  total: number
  page: number
  pageSize: number
}
```

#### 3. 고객 상세 조회
```
GET /api/customers/{customerId}

Response: 200 OK
{
  customer: Customer
  projects: Project[]
  contracts: Contract[]
  notes: Note[]
}
```

#### 4. 고객 상태 업데이트
```
PATCH /api/customers/{customerId}/status

Request Body:
{
  leadStatus: 'inquiry' | 'consultation' | 'proposal' | 'contracted' | 'completed' | 'cancelled'
}

Response: 200 OK
{
  success: true
  customer: Customer
}
```

---

### Project 관련

#### 1. 프로젝트 목록 조회
```
GET /api/projects
GET /api/projects?customerId={customerId}
GET /api/projects?projectStatus=scheduled
GET /api/projects?assignedPhotographerId={photographerId}

Response: 200 OK
{
  projects: Project[]
  total: number
}
```

#### 2. 프로젝트 상세 조회
```
GET /api/projects/{projectId}

Response: 200 OK
{
  project: Project (with customer, photographers, editor)
  schedules: ShootingSchedule[]
  webGallery?: WebGallery
  timeTable?: TimeTable
}
```

#### 3. 작가 배정
```
PATCH /api/projects/{projectId}/photographers

Request Body:
{
  photographerIds: string[]
}

Response: 200 OK
{
  success: true
  project: Project
}
```

---

## 🔧 구현 우선순위

### Phase 1: 기본 CRUD (Critical)
- [ ] `POST /api/customers/register`
- [ ] `GET /api/customers`
- [ ] `GET /api/projects`
- [ ] `PATCH /api/customers/{id}/status`

### Phase 2: 상세 기능 (High)
- [ ] `GET /api/customers/{id}`
- [ ] `GET /api/projects/{id}`
- [ ] `PATCH /api/projects/{id}/photographers`
- [ ] 이메일 발송 기능

### Phase 3: 고급 기능 (Medium)
- [ ] SMS 발송 기능
- [ ] 파일 업로드 API (웹갤러리)
- [ ] 타임테이블 CRUD
- [ ] 계약서 생성 API

### Phase 4: 최적화 (Low)
- [ ] 페이지네이션
- [ ] 검색 최적화 (Full-text search)
- [ ] 캐싱
- [ ] 실시간 알림 (WebSocket)

---

## 📚 참고 파일

### 교체 대상 파일
1. `lib/utils/customer-registration.ts` → API 호출로 교체
2. `lib/mock-data.ts` → Database에서 조회로 교체
3. `lib/mock/admin.ts` → Database에서 조회로 교체
4. `lib/mock/settings.ts` → Database에서 조회로 교체

### 유지할 파일
1. `lib/types.ts` → 타입 정의는 그대로 사용
2. `lib/utils/session-storage.ts` → 프론트엔드 세션 관리
3. `lib/config/navigation.ts` → 네비게이션 설정
4. `lib/types/auth.ts` → 권한 타입 정의

### 수정 필요 파일
1. `app/(client)/c/venue-complete/page.tsx`
   - `registerCustomerAndProject()`를 `await`로 변경
   
2. `app/(admin)/admin/projects/page.tsx`
   - `getInquiryCustomers()`를 `await`로 변경
   - `useEffect`를 async 함수로 수정

3. `components/customers/customer-status-select.tsx`
   - `updateCustomerStatus()`를 `await`로 변경

---

## 🎨 프론트엔드 개선 사항 (완료)

### ✅ 1. 신랑/신부 이름 수집
**파일**: `app/(client)/c/venue-contact/page.tsx`
- 신부 이름, 신랑 이름 입력 필드 추가
- 필수 입력 (최소 2글자)
- `sessionStorage`에 저장

### ✅ 2. 유입 경로 자동 추적
**파일**: `app/(public)/page.tsx`
- UTM 파라미터 추적 (`?utm_source=instagram`)
- Referrer URL 분석 (Instagram, Facebook, Naver, Google, Kakao 자동 인식)
- `sessionStorage`에 저장 (`mindgraphy_source_channel`)

### ✅ 3. 고객 데이터 제출 로직
**파일**: `lib/utils/customer-registration.ts`
- `registerCustomerAndProject()` 함수 생성
- `localStorage`에 Mock 데이터 추가
- Customer + Project 동시 생성

### ✅ 4. 완료 페이지 개선
**파일**: `app/(client)/c/venue-complete/page.tsx`
- 입력한 정보 요약 표시
- 자동 등록 실행
- Toast 알림

### ✅ 5. 관리자 신규 문의 UI
**파일**: `app/(admin)/admin/projects/page.tsx`
- 신규 문의 알림 카드
- 신규 문의 목록 (최대 3개 미리보기)
- 상세보기 버튼

**파일**: `components/customers/inquiry-detail-dialog.tsx`
- 신규 문의 상세 다이얼로그
- 고객 정보, 촬영 정보, 유입 경로 표시
- 상태 변경 드롭다운 포함

### ✅ 6. 고객 상태 전환 UI
**파일**: `components/customers/customer-status-select.tsx`
- 상태 선택 드롭다운
- 6가지 상태: inquiry, consultation, proposal, contracted, completed, cancelled
- 상태별 색상 및 설명
- 실시간 업데이트 (localStorage)

### ✅ 7. 날짜/시간 포맷 통일
**파일**: `lib/utils/customer-registration.ts`
- `normalizeDateFormat()`: 모든 날짜를 `yyyy-MM-dd` 형식으로 변환
- `normalizeTimeFormat()`: 모든 시간을 `HH:MM` 형식으로 변환 (한복 제외)
- 한복 촬영: "오전 촬영", "일몰 촬영" 그대로 유지

---

## 🚀 배포 체크리스트

### 백엔드 연동 전
- [ ] 환경변수 설정 (`DATABASE_URL`, `EMAIL_API_KEY`, etc.)
- [ ] Database 마이그레이션 실행
- [ ] API 엔드포인트 테스트 (Postman/Insomnia)
- [ ] CORS 설정
- [ ] Rate Limiting 설정

### 백엔드 연동 후
- [ ] 프론트엔드 API 호출 코드 교체
- [ ] Error Handling 개선
- [ ] Loading States 추가
- [ ] Retry 로직 구현
- [ ] E2E 테스트 실행

### 프로덕션 배포 전
- [ ] localStorage → Database 마이그레이션 도구
- [ ] 기존 Mock 데이터 백업
- [ ] 실제 이메일/SMS 발송 테스트
- [ ] 보안 검토 (SQL Injection, XSS, CSRF)
- [ ] 성능 테스트 (Load Testing)

---

## 💡 추가 권장 사항

### 1. Real-time Updates
- WebSocket 또는 Server-Sent Events로 실시간 알림
- 관리자 대시보드에 신규 문의 즉시 표시

### 2. File Upload
- 웹갤러리 업로드 시 S3/Cloudinary 연동
- 이미지 리사이징 및 최적화

### 3. Analytics
- Google Analytics 연동
- 유입 경로별 전환율 추적
- 고객 행동 분석

### 4. Error Tracking
- Sentry 연동
- 에러 로그 모니터링
- 알림 설정

---

## 📞 문의

백엔드 개발자와 협업 시 이 문서를 공유하면 됩니다.
모든 타입 정의와 Mock 데이터가 실제 API 스펙의 참고 자료가 됩니다.

**작성자**: AI Assistant  
**버전**: 1.0  
**마지막 업데이트**: 2025-11-25

