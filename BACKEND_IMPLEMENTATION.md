# 백엔드 구현 가이드

마인드그라피 시스템의 백엔드 구현을 위한 상세 가이드입니다.

## 📋 목차

1. [자동 계정 생성 플로우](#자동-계정-생성-플로우)
2. [데이터베이스 스키마](#데이터베이스-스키마)
3. [API 엔드포인트](#api-엔드포인트)
4. [인증 및 보안](#인증-및-보안)
5. [상태 관리 플로우](#상태-관리-플로우)

---

## 🔐 자동 계정 생성 플로우

### 개요
고객이 `/c/venue-complete/` 페이지에 도달하면 자동으로 마인드 포털 계정이 생성됩니다.

### 계정 정보
- **아이디(Username)**: 대표 전화번호 (신랑 또는 신부)
- **비밀번호(Password)**: 대표 전화번호 뒤 4자리
- **초기 상태**: `leadStatus = 'inquiry'` (일정 미확정)

### 구현 위치
- **파일**: `app/(client)/c/venue-complete/page.tsx`
- **함수**: `useEffect` 내부 (line 28-68)

### 수집되는 데이터

```typescript
interface CustomerRegistrationData {
  // 상품 정보
  productType: 'wedding' | 'hanbok' | 'dress_shop' | 'baby'
  packageId: string
  optionIds: string[]
  
  // 고객 정보
  groomName: string
  brideName: string
  groomPhone: string
  bridePhone: string
  mainContact: 'groom' | 'bride' // 대표 연락처
  email?: string
  
  // 촬영 정보
  weddingDate: string // ISO 8601 format
  weddingTime: string // HH:mm format
  weddingVenue: string
  venueAddress?: string
  
  // 추가 정보
  referralSource?: string // 유입 경로
  specialRequests?: string // 특별 요청사항
  
  // 시스템 정보
  leadStatus: 'inquiry' // 초기 상태는 항상 'inquiry'
  sourceChannel: '고객용 페이지'
  createdAt: string // ISO 8601 timestamp
}
```

---

## 🗄️ 데이터베이스 스키마

### Customers 테이블

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  groom_name VARCHAR(50) NOT NULL,
  bride_name VARCHAR(50) NOT NULL,
  groom_phone VARCHAR(20) NOT NULL,
  bride_phone VARCHAR(20) NOT NULL,
  main_contact VARCHAR(10) NOT NULL CHECK (main_contact IN ('groom', 'bride')),
  email VARCHAR(255),
  source_channel VARCHAR(50) NOT NULL,
  lead_status VARCHAR(20) NOT NULL CHECK (lead_status IN ('inquiry', 'consultation', 'proposal', 'contracted', 'completed', 'cancelled')),
  assigned_manager_id UUID REFERENCES users(id),
  notes TEXT,
  satisfaction INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_customers_phones ON customers(groom_phone, bride_phone);
CREATE INDEX idx_customers_lead_status ON customers(lead_status);
CREATE INDEX idx_customers_created_at ON customers(created_at DESC);
```

### Projects 테이블

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id),
  project_type VARCHAR(20) NOT NULL CHECK (project_type IN ('wedding', 'hanbok', 'dress_shop', 'baby')),
  package_id VARCHAR(50) NOT NULL,
  option_ids TEXT[], -- Array of option IDs
  project_status VARCHAR(20) NOT NULL CHECK (project_status IN ('scheduled', 'shooting', 'proof_ready', 'editing', 'completed', 'delivered')),
  wedding_date DATE,
  wedding_time TIME,
  wedding_venue VARCHAR(255),
  venue_address TEXT,
  special_requests TEXT,
  referral_source VARCHAR(100),
  assigned_photographer_ids UUID[], -- Array of photographer IDs
  assigned_editor_id UUID REFERENCES users(id),
  progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_wedding_date ON projects(wedding_date);
CREATE INDEX idx_projects_project_status ON projects(project_status);
```

### Portal_Accounts 테이블

```sql
CREATE TABLE portal_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID UNIQUE NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  username VARCHAR(20) NOT NULL UNIQUE, -- 전화번호
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash of 전화번호 뒤 4자리
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_portal_accounts_username ON portal_accounts(username);
CREATE INDEX idx_portal_accounts_customer_id ON portal_accounts(customer_id);
```

---

## 🔌 API 엔드포인트

### 1. 자동 계정 생성 및 고객 등록

**POST** `/api/customers/auto-register`

#### Request Body

```json
{
  "productType": "wedding",
  "groomName": "홍길동",
  "brideName": "김영희",
  "groomPhone": "010-1234-5678",
  "bridePhone": "010-2345-6789",
  "mainContact": "bride",
  "email": "couple@example.com",
  "packageId": "new-basic",
  "optionIds": ["option-1", "option-2"],
  "weddingDate": "2025-12-25",
  "weddingTime": "14:00",
  "weddingVenue": "서울 그랜드 웨딩홀",
  "venueAddress": "서울시 강남구...",
  "referralSource": "Instagram",
  "specialRequests": "야외 촬영 희망"
}
```

#### Response (Success - 201 Created)

```json
{
  "success": true,
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "projectId": "660e8400-e29b-41d4-a716-446655440001",
  "portalCredentials": {
    "username": "010-2345-6789",
    "tempPassword": "6789",
    "portalUrl": "/c/portal"
  },
  "message": "계정이 성공적으로 생성되었습니다."
}
```

#### Response (Error - 400 Bad Request)

```json
{
  "success": false,
  "error": "ACCOUNT_EXISTS",
  "message": "이미 등록된 전화번호입니다.",
  "existingCustomerId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### 처리 로직

```typescript
// 1. 전화번호 중복 체크
const existingCustomer = await checkPhoneExists(groomPhone, bridePhone)
if (existingCustomer) {
  return { error: 'ACCOUNT_EXISTS', existingCustomerId: existingCustomer.id }
}

// 2. Customer 생성
const customer = await createCustomer({
  groomName,
  brideName,
  groomPhone,
  bridePhone,
  mainContact,
  email,
  sourceChannel: '고객용 페이지',
  leadStatus: 'inquiry',
  assignedManagerId: getDefaultManagerId()
})

// 3. Project 생성
const project = await createProject({
  customerId: customer.id,
  projectNumber: generateProjectNumber(), // 예: PRJ-2025-001
  projectType: productType,
  packageId,
  optionIds,
  projectStatus: 'scheduled',
  weddingDate,
  weddingTime,
  weddingVenue,
  venueAddress,
  specialRequests,
  referralSource,
  progress: 0
})

// 4. Portal Account 생성
const mainPhone = mainContact === 'groom' ? groomPhone : bridePhone
const password = mainPhone.slice(-4) // 뒤 4자리
const passwordHash = await bcrypt.hash(password, 10)

const portalAccount = await createPortalAccount({
  customerId: customer.id,
  username: mainPhone,
  passwordHash,
  isActive: true
})

// 5. 관리자에게 알림 전송 (새 고객 등록, 일정 미확정)
await sendAdminNotification({
  type: 'NEW_INQUIRY',
  customerId: customer.id,
  customerName: `${groomName} & ${brideName}`,
  weddingDate
})

// 6. 고객에게 SMS 발송 (선택사항)
await sendWelcomeSMS({
  phone: mainPhone,
  username: mainPhone,
  tempPassword: password,
  portalUrl: process.env.APP_URL + '/c/portal'
})

return {
  success: true,
  customerId: customer.id,
  projectId: project.id,
  portalCredentials: {
    username: mainPhone,
    tempPassword: password,
    portalUrl: '/c/portal'
  }
}
```

---

### 2. 마인드 포털 로그인

**POST** `/api/auth/portal-login`

#### Request Body

```json
{
  "username": "010-1234-5678",
  "password": "5678"
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "groomName": "홍길동",
    "brideName": "김영희",
    "email": "couple@example.com"
  },
  "project": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "weddingDate": "2025-12-25",
    "weddingTime": "14:00",
    "weddingVenue": "서울 그랜드 웨딩홀",
    "projectStatus": "scheduled",
    "progress": 0
  }
}
```

#### Response (Error - 401 Unauthorized)

```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "아이디 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 3. 일정 확정 (관리자 전용)

**POST** `/api/admin/customers/:customerId/confirm-schedule`

#### Request Body

```json
{
  "weddingDate": "2025-12-25",
  "weddingTime": "14:00",
  "weddingVenue": "서울 그랜드 웨딩홀",
  "venueAddress": "서울시 강남구...",
  "assignedPhotographerIds": ["photo-1", "photo-2"]
}
```

#### Response (Success - 200 OK)

```json
{
  "success": true,
  "message": "일정이 확정되었습니다.",
  "customer": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "leadStatus": "contracted"
  },
  "scheduleEvent": {
    "id": "schedule-001",
    "start": "2025-12-25T14:00:00",
    "end": "2025-12-25T18:00:00"
  }
}
```

#### 처리 로직

```typescript
// 1. Customer leadStatus를 'contracted'로 업데이트
await updateCustomer(customerId, {
  leadStatus: 'contracted'
})

// 2. Project 정보 업데이트
await updateProject(projectId, {
  weddingDate,
  weddingTime,
  weddingVenue,
  venueAddress,
  assignedPhotographerIds,
  projectStatus: 'scheduled'
})

// 3. Schedule Event 생성 (캘린더에 표시)
const scheduleEvent = await createScheduleEvent({
  customerId,
  projectId,
  start: `${weddingDate}T${weddingTime}:00`,
  end: calculateEndTime(weddingDate, weddingTime, packageInfo),
  photographerIds: assignedPhotographerIds,
  status: 'reserved'
})

// 4. 고객에게 알림 전송 (일정 확정 안내)
await sendCustomerNotification({
  type: 'SCHEDULE_CONFIRMED',
  customerId,
  weddingDate,
  weddingTime,
  weddingVenue
})

return {
  success: true,
  customer: { leadStatus: 'contracted' },
  scheduleEvent
}
```

---

## 🔒 인증 및 보안

### 비밀번호 해싱

```typescript
import bcrypt from 'bcrypt'

// 비밀번호 생성 시
const password = mainPhone.slice(-4) // "1234"
const saltRounds = 10
const passwordHash = await bcrypt.hash(password, saltRounds)

// 비밀번호 검증 시
const isValid = await bcrypt.compare(inputPassword, storedPasswordHash)
```

### JWT 토큰 발급

```typescript
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  {
    customerId: customer.id,
    username: portalAccount.username,
    role: 'customer'
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // 7일 유효
)
```

### 환경 변수

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindgraphy

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# SMS (선택사항)
SMS_API_KEY=your-sms-api-key
SMS_SENDER=02-2202-9966

# App
APP_URL=https://mindgraphy.com
NODE_ENV=production
```

---

## 📊 상태 관리 플로우

### Customer Lead Status

```
inquiry → consultation → proposal → contracted → completed
  ↓                                                    ↓
cancelled ←──────────────────────────────────────── cancelled
```

#### 상태별 의미

| Status | 한글 | 설명 |
|--------|------|------|
| `inquiry` | 문의 | 고객이 신청서를 제출했으나 일정 미확정 |
| `consultation` | 상담중 | 관리자가 고객과 상담 진행중 |
| `proposal` | 제안 | 견적서/제안서 발송 완료 |
| `contracted` | 계약 완료 | 일정 확정 및 계약 완료 |
| `completed` | 촬영 완료 | 모든 촬영 및 후반작업 완료 |
| `cancelled` | 취소 | 고객 또는 업체 사정으로 취소 |

### Project Status

```
scheduled → shooting → proof_ready → editing → completed → delivered
```

#### 상태별 의미

| Status | 한글 | 설명 |
|--------|------|------|
| `scheduled` | 일정 확정 | 촬영 일정이 확정됨 |
| `shooting` | 촬영중 | 현재 촬영 진행중 |
| `proof_ready` | 프루프 준비 완료 | 고객 선택을 위한 프루프 준비 완료 |
| `editing` | 편집중 | 최종 편집 작업 진행중 |
| `completed` | 완료 | 모든 작업 완료 |
| `delivered` | 배송 완료 | 앨범/USB 등 배송 완료 |

---

## 📝 구현 체크리스트

### Phase 1: 기본 계정 생성
- [ ] Customers 테이블 생성
- [ ] Projects 테이블 생성
- [ ] Portal_Accounts 테이블 생성
- [ ] `/api/customers/auto-register` API 구현
- [ ] 전화번호 중복 체크 로직
- [ ] bcrypt 비밀번호 해싱

### Phase 2: 인증
- [ ] `/api/auth/portal-login` API 구현
- [ ] JWT 토큰 발급
- [ ] 토큰 검증 미들웨어
- [ ] 세션 관리

### Phase 3: 일정 확정
- [ ] `/api/admin/customers/:id/confirm-schedule` API 구현
- [ ] Schedule_Events 테이블 생성
- [ ] leadStatus 업데이트 로직
- [ ] 캘린더 연동

### Phase 4: 알림
- [ ] 관리자 알림 시스템 (새 고객 등록)
- [ ] 고객 SMS 알림 (선택사항)
- [ ] 이메일 알림 (선택사항)

### Phase 5: 보안
- [ ] Rate limiting (API 호출 제한)
- [ ] CORS 설정
- [ ] SQL Injection 방어
- [ ] XSS 방어
- [ ] HTTPS 강제

---

## 🧪 테스트 케이스

### 자동 계정 생성 테스트

```typescript
describe('POST /api/customers/auto-register', () => {
  it('should create customer, project, and portal account', async () => {
    const data = {
      productType: 'wedding',
      groomName: '홍길동',
      brideName: '김영희',
      groomPhone: '010-1234-5678',
      bridePhone: '010-2345-6789',
      mainContact: 'bride',
      email: 'test@example.com',
      packageId: 'new-basic',
      optionIds: ['option-1'],
      weddingDate: '2025-12-25',
      weddingTime: '14:00',
      weddingVenue: '서울 그랜드 웨딩홀'
    }

    const response = await request(app)
      .post('/api/customers/auto-register')
      .send(data)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.customerId).toBeDefined()
    expect(response.body.portalCredentials.username).toBe('010-2345-6789')
    expect(response.body.portalCredentials.tempPassword).toBe('6789')
  })

  it('should return error if phone already exists', async () => {
    // First registration
    await createTestCustomer({ groomPhone: '010-1234-5678' })

    // Duplicate registration
    const data = {
      groomPhone: '010-1234-5678',
      // ... other fields
    }

    const response = await request(app)
      .post('/api/customers/auto-register')
      .send(data)
      .expect(400)

    expect(response.body.error).toBe('ACCOUNT_EXISTS')
  })
})
```

---

## 📞 문의

구현 중 궁금한 사항이 있으면 개발팀에 문의하세요.

- **프론트엔드**: `app/(client)/c/venue-complete/page.tsx` 참조
- **타입 정의**: `lib/types.ts` 참조
- **목업 데이터**: `lib/mock-data.ts` 참조

---

**마지막 업데이트**: 2025-11-19

