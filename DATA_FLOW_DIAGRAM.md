# 데이터 흐름도
**작성일**: 2025-11-25

---

## 📊 전체 시스템 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                         고객용 페이지                              │
│                    (Client-Facing Pages)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─ 1. 상품 선택
                              │  └─ /c/product-type
                              │     └─ PRODUCT_TYPE → sessionStorage
                              │
                              ├─ 2-A. 웨딩홀 제휴 고객
                              │  ├─ /c/ (client type 선택)
                              │  │  └─ CLIENT_TYPE: 'venue'
                              │  ├─ /c/venue-info (예식장 기본정보)
                              │  ├─ /c/venue-contact (신랑/신부 정보)
                              │  │  └─ GROOM_NAME, BRIDE_NAME, PHONE, EMAIL
                              │  ├─ /c/venue-details (예식장 상세)
                              │  │  └─ VENUE_NAME, VENUE_HALL
                              │  └─ /c/venue-date (특별 요청)
                              │     └─ VENUE_REQUEST
                              │
                              ├─ 2-B. 직접 문의 고객
                              │  ├─ /c/ (client type 선택)
                              │  │  └─ CLIENT_TYPE: 'direct'
                              │  ├─ /c/wedding-date (날짜/시간)
                              │  │  └─ WEDDING_DATE, WEDDING_TIME
                              │  ├─ /c/motto (브랜드 소개)
                              │  ├─ /c/process (프로세스 안내)
                              │  ├─ /c/packages (패키지 선택)
                              │  │  └─ PACKAGE_ID
                              │  └─ /c/options (옵션 선택)
                              │     └─ OPTION_IDS
                              │
                              └─ 3. 정보 제출 및 완료
                                 └─ /c/venue-complete
                                    ├─ getAllClientFormData()
                                    ├─ registerCustomerAndProject()
                                    ├─ → localStorage 저장
                                    └─ 포털 로그인 정보 안내
                              
                              
┌─────────────────────────────────────────────────────────────────┐
│                       내부 업무 시스템                             │
│                   (Internal Admin System)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─ 1. 로그인
                              │  └─ /admin/login
                              │     ├─ 관리자 (admin)
                              │     └─ 직원 (staff)
                              │
                              ├─ 2. 프로젝트 관리
                              │  └─ /admin/projects
                              │     ├─ getInquiryCustomers()
                              │     │  └─ 신규 문의 알림 카드 ✨
                              │     ├─ 전체 프로젝트 목록
                              │     └─ 필터 & 검색
                              │
                              ├─ 3. 신규 문의 처리
                              │  └─ InquiryDetailDialog
                              │     ├─ 고객 정보 확인
                              │     ├─ 촬영 정보 확인
                              │     └─ 상태 변경 (inquiry → consultation)
                              │
                              ├─ 4. 상담 및 제안
                              │  └─ CustomerStatusSelect
                              │     ├─ consultation → proposal
                              │     └─ 견적서 발송
                              │
                              ├─ 5. 계약 체결
                              │  └─ proposal → contracted
                              │     ├─ 계약서 생성
                              │     └─ 작가 배정 가능
                              │
                              ├─ 6. 촬영 진행
                              │  └─ contracted → in_progress
                              │     ├─ 작가 배정
                              │     ├─ 타임테이블 작성
                              │     └─ 웹갤러리 업로드
                              │
                              └─ 7. 완료
                                 └─ in_progress → completed
                                    ├─ 편집 완료
                                    ├─ 납품
                                    └─ 만족도 조사
```

---

## 🔄 고객 상태 전환 (Lead Status Transition)

```
inquiry (신규 문의)
  │
  ├─ 고객이 온라인 폼 제출
  ├─ 관리자가 직접 등록
  └─ 웨딩홀 제휴 고객 등록
  
  ↓ [담당자 배정]
  
consultation (상담중)
  │
  ├─ 전화 또는 대면 상담 진행
  ├─ 고객 요구사항 파악
  └─ 패키지 안내
  
  ↓ [견적서 발송]
  
proposal (제안)
  │
  ├─ 견적서 이메일 발송
  ├─ 계약서 초안 발송
  └─ 고객 검토 중
  
  ↓ [계약금 입금]
  
contracted (계약 완료)
  │
  ├─ 계약서 체결
  ├─ 계약금 입금 확인
  ├─ 작가 배정 가능
  └─ 촬영 일정 확정
  
  ↓ [촬영 완료]
  
in_progress (진행중) → editing (편집중) → proof_ready (시안 준비)
  │
  └─ [납품 완료]
  
completed (완료)
  │
  ├─ 최종 결과물 납품
  ├─ 만족도 조사
  └─ 후기 요청
  
  
cancelled (취소)
  │
  ├─ 고객 요청
  ├─ 환불 처리
  └─ 취소 사유 기록
```

---

## 💾 데이터 저장 위치

### SessionStorage (임시 저장)
**용도**: 고객이 폼을 작성하는 동안 데이터 유지

**저장 항목**:
- `mindgraphy_product_type`: 상품 타입
- `mindgraphy_client_type`: 고객 유형 (venue/direct)
- `mindgraphy_groom_name`: 신랑 이름 ✨ NEW
- `mindgraphy_bride_name`: 신부 이름 ✨ NEW
- `mindgraphy_groom_phone`: 신랑 전화번호
- `mindgraphy_bride_phone`: 신부 전화번호
- `mindgraphy_email`: 이메일
- `mindgraphy_main_contact`: 메인 연락처 (bride/groom)
- `mindgraphy_wedding_date`: 예식 날짜 (yyyy-MM-dd)
- `mindgraphy_wedding_time`: 예식 시간 (HH:MM)
- `mindgraphy_venue_name`: 예식장 이름
- `mindgraphy_venue_hall`: 홀명
- `mindgraphy_package`: 선택 패키지 ID
- `mindgraphy_options`: 선택 옵션 IDs (JSON)
- `mindgraphy_venue_request`: 특별 요청사항
- `mindgraphy_source_channel`: 유입 경로 ✨ NEW

**생명주기**: 브라우저 탭 닫으면 삭제

---

### LocalStorage (영구 저장)
**용도**: Mock 데이터 저장 (백엔드 연동 전까지)

**저장 항목**:
- `mindgraphy_mock_customers`: Customer[] (신규 문의 고객) ✨ NEW
- `mindgraphy_mock_projects`: Project[] (신규 프로젝트) ✨ NEW
- `mindgraphy_admin_user`: 관리자/직원 세션 정보

**생명주기**: 브라우저 캐시 삭제 전까지 유지

---

### Database (향후 백엔드 연동 시)
**용도**: 실제 데이터 영구 저장

**테이블**:
- `customers`: 고객 정보
- `projects`: 프로젝트 정보
- `contracts`: 계약 정보
- `project_options`: 프로젝트-옵션 연결
- `project_photographers`: 프로젝트-작가 배정
- `schedules`: 촬영 일정
- `web_galleries`: 웹갤러리
- `time_tables`: 타임테이블

---

## 🎯 데이터 변환 예시

### 고객용 페이지 입력 → Database 저장

#### 입력 데이터 (SessionStorage):
```json
{
  "productType": "wedding",
  "clientType": "venue",
  "groomName": "홍길동",
  "brideName": "김영희",
  "groomPhone": "010-1111-2222",
  "bridePhone": "010-3333-4444",
  "email": "couple@example.com",
  "mainContact": "groom",
  "weddingDate": "2026-06-20",
  "weddingTime": "14:00",
  "venueName": "서울 그랜드 웨딩홀",
  "venueHall": "그랜드홀",
  "packageId": "new-basic",
  "optionIds": ["option-1", "option-2"],
  "venueRequest": "야외 정원 촬영 희망",
  "sourceChannel": "Instagram"
}
```

#### 변환 후 (Database):

**customers 테이블**:
```json
{
  "id": "customer-1732521600000-123",
  "groomName": "홍길동",
  "brideName": "김영희",
  "groomPhone": "010-1111-2222",
  "bridePhone": "010-3333-4444",
  "email": "couple@example.com",
  "sourceChannel": "Instagram",
  "leadStatus": "inquiry",
  "assignedManagerId": "user-2",
  "notes": "야외 정원 촬영 희망",
  "createdAt": "2025-11-25T10:00:00Z"
}
```

**projects 테이블**:
```json
{
  "id": "project-1732521600000-456",
  "projectNumber": "PRJ-2025-4567",
  "customerId": "customer-1732521600000-123",
  "contractId": "",
  "projectType": "wedding",
  "projectStatus": "scheduled",
  "packageId": "new-basic",
  "weddingDate": "2026-06-20",
  "weddingTime": "14:00",
  "weddingVenue": "서울 그랜드 웨딩홀 그랜드홀",
  "specialRequests": "야외 정원 촬영 희망",
  "referralSource": "Instagram",
  "progress": 0,
  "createdAt": "2025-11-25T10:00:00Z",
  "updatedAt": "2025-11-25T10:00:00Z"
}
```

**project_options 테이블**:
```json
[
  { "projectId": "project-1732521600000-456", "optionId": "option-1" },
  { "projectId": "project-1732521600000-456", "optionId": "option-2" }
]
```

---

## 🔍 검증 로직

### 고객 등록 시 필수 검증

```typescript
// 1. 이름 검증
if (!groomName || groomName.length < 2) {
  throw new Error('신랑 이름을 입력해주세요 (최소 2글자)')
}
if (!brideName || brideName.length < 2) {
  throw new Error('신부 이름을 입력해주세요 (최소 2글자)')
}

// 2. 연락처 검증
if (!groomPhone && !bridePhone) {
  throw new Error('최소 한 분의 연락처를 입력해주세요')
}
if (groomPhone && !/^010-\d{4}-\d{4}$/.test(groomPhone)) {
  throw new Error('올바른 전화번호 형식이 아닙니다')
}

// 3. 이메일 검증
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  throw new Error('올바른 이메일 주소를 입력해주세요')
}

// 4. 날짜 검증
const weddingDate = new Date(formData.weddingDate)
const today = new Date()
if (weddingDate < today) {
  throw new Error('촬영 날짜는 오늘 이후여야 합니다')
}

// 5. 중복 검증 (백엔드에서)
const existingCustomer = await findCustomerByEmail(email)
if (existingCustomer) {
  throw new Error('이미 등록된 이메일입니다')
}
```

---

## 🌐 유입 경로 추적 상세

### 자동 추적되는 유입 경로

| 조건 | 결과 |
|------|------|
| `?utm_source=instagram` | "instagram" |
| `?utm_source=naver&utm_medium=blog` | "naver (blog)" |
| `?source=kakao` | "kakao" |
| Referrer: `https://www.instagram.com/...` | "Instagram" |
| Referrer: `https://www.facebook.com/...` | "Facebook" |
| Referrer: `https://search.naver.com/...` | "Naver" |
| Referrer: `https://www.google.com/...` | "Google" |
| Referrer: `https://talk.kakao.com/...` | "Kakao" |
| Client Type: `venue` | "웨딩홀 제휴" |
| Client Type: `direct` | "고객용 페이지 (직접 문의)" |
| 기타 | "직접 방문" |

### 추적 코드 위치
**파일**: `app/(public)/page.tsx`
```typescript
useEffect(() => {
  // UTM 파라미터 확인
  const utmSource = searchParams.get('utm_source')
  const utmMedium = searchParams.get('utm_medium')
  
  // Referrer 확인
  const referrer = document.referrer
  
  // sourceChannel 결정 및 저장
  sessionStorage.setItem('mindgraphy_source_channel', sourceChannel)
}, [searchParams])
```

---

## 📱 포털 계정 자동 생성

### 계정 정보 규칙

**아이디 (Username)**:
- 메인 연락처 전화번호 사용
- 예: `mainContact === 'groom'` → `groomPhone`
- 예: `010-1111-2222`

**비밀번호 (Password)**:
- 전화번호 뒤 4자리
- 예: `010-1111-2222` → `2222`
- **임시 비밀번호**이므로 첫 로그인 시 변경 유도

### 완료 페이지에서 안내

**파일**: `app/(client)/c/venue-complete/page.tsx`

고객에게 다음 정보를 표시:
```
마인드 포털 로그인 정보
━━━━━━━━━━━━━━━━━━━━━
아이디 (ID)
  → 010-1111-2222

비밀번호 (Password)
  → 대표 전화번호 뒤 4자리 (2222)
```

### 백엔드 구현 시 추가 사항

1. **비밀번호 해싱**:
   ```typescript
   const hashedPassword = await bcrypt.hash(tempPassword, 10)
   ```

2. **이메일 발송**:
   ```typescript
   await sendEmail({
     to: customer.email,
     subject: '마인드그라피 포털 로그인 정보',
     html: `
       <h2>환영합니다!</h2>
       <p>아이디: ${username}</p>
       <p>비밀번호: ${tempPassword}</p>
       <a href="https://mindgraphy.com/c/portal">포털 바로가기</a>
     `
   })
   ```

3. **SMS 발송** (선택):
   ```typescript
   await sendSMS({
     to: mainPhone,
     message: `[마인드그라피] 문의 접수 완료. 포털 로그인: ${username} / ${tempPassword}`
   })
   ```

---

## 🎨 UI/UX 개선 사항

### ✅ 완료된 개선

1. **신랑/신부 이름 필수 입력**
   - 위치: `/c/venue-contact`
   - 검증: 최소 2글자
   - 저장: `GROOM_NAME`, `BRIDE_NAME`

2. **유입 경로 자동 추적**
   - 위치: `/` (홈페이지)
   - UTM 파라미터, Referrer 자동 분석
   - 저장: `REFERRAL_SOURCE`

3. **고객 자동 등록**
   - 위치: `/c/venue-complete`
   - 함수: `registerCustomerAndProject()`
   - 상태: `leadStatus: 'inquiry'`

4. **신규 문의 알림**
   - 위치: `/admin/projects`
   - 실시간 카운트 표시
   - 미리보기 카드 (최대 3개)

5. **고객 상태 관리**
   - 컴포넌트: `CustomerStatusSelect`
   - 6단계 상태 전환
   - 색상 및 설명 표시

---

## 📄 페이지 플로우 맵

### 웨딩홀 제휴 고객
```
/ (홈) 
  → /c/product-type (상품 선택: 웨딩)
  → /c/ (고객 유형: 웨딩홀 제휴)
  → /c/venue-info (예식장 정보)
  → /c/venue-contact (신랑/신부 정보) ✨
  → /c/venue-details (예식장 상세)
  → /c/venue-date (특별 요청)
  → /c/venue-complete (완료 & 자동 등록) ✨
```

### 직접 문의 고객 (웨딩)
```
/ (홈)
  → /c/product-type (상품 선택: 웨딩)
  → /c/ (고객 유형: 직접 문의)
  → /c/wedding-date (날짜/시간)
  → /c/motto (브랜드 소개)
  → /c/process (프로세스)
  → /c/packages (패키지 선택)
  → /c/options (옵션 선택)
  → ... (추가 페이지들)
  → /c/venue-complete (완료 & 자동 등록) ✨
```

### 한복/가봉/돌스냅
```
/ (홈)
  → /c/product-type (상품 선택: hanbok/dress_shop/baby)
  → /c/wedding-date (날짜/시간)
  → /c/packages (패키지 선택)
  → ... (추가 페이지들)
  → /c/venue-complete (완료 & 자동 등록) ✨
```

---

## 🔒 보안 고려사항

### 1. 개인정보 보호
- [ ] SSL/TLS 필수 (HTTPS)
- [ ] 비밀번호 해싱 (bcrypt, 10 rounds 이상)
- [ ] 이메일/전화번호 마스킹 (UI에서)
- [ ] GDPR/개인정보보호법 준수

### 2. API 보안
- [ ] JWT 토큰 인증
- [ ] CSRF 토큰
- [ ] Rate Limiting (IP별, 계정별)
- [ ] Input Validation (서버사이드)
- [ ] SQL Injection 방어

### 3. 파일 업로드 보안
- [ ] 파일 타입 검증
- [ ] 파일 크기 제한
- [ ] 바이러스 스캔
- [ ] CDN/S3 서명된 URL

---

## 📊 모니터링 및 로그

### 필수 로그

1. **고객 등록 로그**:
   ```
   [2025-11-25 10:00:00] NEW_CUSTOMER | customer-123 | 홍길동 & 김영희 | Instagram
   ```

2. **상태 전환 로그**:
   ```
   [2025-11-25 11:30:00] STATUS_CHANGE | customer-123 | inquiry → consultation | user-2
   ```

3. **에러 로그**:
   ```
   [2025-11-25 12:00:00] ERROR | registerCustomer | Database connection failed
   ```

### 모니터링 지표

- 신규 문의 수 (일별, 주별, 월별)
- 유입 경로별 전환율
- 평균 응답 시간 (문의 → 첫 연락)
- 상태별 고객 분포
- 완료율 (inquiry → completed)

---

## 🛠️ 개발 팁

### Mock 데이터 → API 전환 체크리스트

- [ ] `lib/utils/customer-registration.ts` 모든 함수 async 변환
- [ ] `app/(client)/c/venue-complete/page.tsx` await 추가
- [ ] `app/(admin)/admin/projects/page.tsx` useEffect async 변환
- [ ] `components/customers/customer-status-select.tsx` await 추가
- [ ] Error Handling 추가 (try-catch)
- [ ] Loading States 추가
- [ ] Toast 알림 개선
- [ ] Retry 로직 구현

### 환경변수 설정

`.env.local`:
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mindgraphy

# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Email
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@mindgraphy.com

# SMS
SMS_API_KEY=your_sms_api_key

# Storage
AWS_S3_BUCKET=mindgraphy-photos
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

---

## 🎉 결론

**현재 상태**: 프론트엔드 완성 ✅
- 고객 정보 수집 완료
- Mock 데이터 저장 완료
- 관리자 UI 완료
- 상태 전환 UI 완료

**다음 단계**: 백엔드 개발
- API 엔드포인트 구현
- Database 설계 및 마이그레이션
- 이메일/SMS 발송
- 파일 업로드 시스템

**참고 문서**:
- `SYSTEM_REVIEW.md`: 시스템 전체 검토 보고서
- `BACKEND_INTEGRATION_GUIDE.md`: 백엔드 연동 가이드 (본 문서)
- `lib/types.ts`: 타입 정의
- `lib/utils/customer-registration.ts`: 교체 대상 함수들

---

**작성자**: AI Assistant  
**버전**: 1.0

