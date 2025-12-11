# 🎬 MindGraphy

> 웨딩 스튜디오를 위한 종합 관리 시스템

Next.js 기반의 현대적인 웨딩 촬영 관리 플랫폼입니다. 고객 대면 포털과 내부 업무 시스템을 하나의 애플리케이션으로 제공합니다.

## ✨ 주요 기능

### 🎯 고객용 페이지 (`/c`)
- **상품 선택 플로우**: 웨딩, 한복&캐주얼, 드레스샵, 베이비 촬영
- **패키지 소개**: 대표 작가 직접 주관하는 프리미엄 서비스
- **일정 입력**: 예식 날짜, 시간, 장소 정보 수집
- **포트폴리오 갤러리**: 실제 촬영 작업물 확인
- **마인드 포털**: 기존 고객을 위한 진행 상황 확인
  - D-Day 카운터
  - 진행 단계 추적
  - 계약서 확인 및 전자서명
  - 입금 정보
  - 사진 셀렉 및 작가 평가
  - 요청사항 메모

### 🎛️ 관리자 페이지 (`/admin`)
- **대시보드**: KPI 및 주요 지표 모니터링
- **실시간 현황**: 오늘의 촬영 일정 추적
- **캘린더**: FullCalendar 기반 스케줄 관리
- **촬영 관리**: 작가 배정 및 일정 조정
- **고객 관리**: CRM 및 계약 정보
- **설정**: 상품, 옵션, 정책, 계약서 관리
- **My 페이지**: 작가별 개인 일정 관리
- **팀 관리**: 작가 성과 및 통계

## 🚀 시작하기

### 환경 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone [repository-url]
cd mindgraphy

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local

# 로컬 개발 환경에서는 .env.local에 다음과 같이 설정:
# NEXT_PUBLIC_ENVIRONMENT=development
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🔧 최근 리팩토링 (2025년 1월)

시스템 전반에 걸쳐 **전문가 수준의 리팩토링**이 완료되었습니다:

### ✅ 주요 개선사항
- **타입 안전성**: 완전한 TypeScript 활용 및 타입 정의 강화
- **재사용성**: Custom Hooks와 공통 컴포넌트 추출
- **유지보수성**: 명확한 구조와 관심사의 분리
- **성능**: 메모이제이션 및 최적화 기법 적용
- **접근성**: WCAG 2.1 AA 준수 유틸리티 추가
- **에러 핸들링**: 표준화된 API 서비스 레이어 구축

상세 내용은 [`REFACTORING_REPORT.md`](./REFACTORING_REPORT.md) 참조

### 🆕 새로 추가된 주요 파일
```
hooks/
└── use-portal-data.ts           # 포털 데이터 관리 훅

lib/
├── config/
│   └── portal.config.ts         # 설정 중앙화
├── hooks/
│   └── use-intersection-observer.ts  # 성능 최적화
├── services/
│   └── portal-api.service.ts    # API 서비스 레이어
└── utils/
    ├── portal.utils.ts          # 비즈니스 로직
    └── accessibility.utils.ts   # 접근성 유틸리티

components/
├── portal/
│   ├── d-day-counter.tsx        # D-Day 카운터
│   └── progress-section.tsx     # 진행 상황
└── common/
    └── error-boundary.tsx       # 에러 바운더리
```

## 📁 프로젝트 구조

```
mindgraphy/
├── app/                          # Next.js App Router
│   ├── (public)/                 # 공개 페이지
│   │   └── page.tsx             # 랜딩 페이지
│   ├── (client)/                 # 고객용 페이지
│   │   └── c/                   # 고객 포털
│   │       ├── product-type/    # 상품 선택
│   │       ├── packages/        # 패키지 소개
│   │       ├── options/         # 옵션 선택
│   │       ├── wedding-date/    # 예식 날짜
│   │       ├── venue-contact/   # 연락처 입력
│   │       ├── portfolio/       # 포트폴리오
│   │       └── portal/          # 마인드 포털
│   ├── (admin)/                  # 관리자 페이지
│   │   └── admin/               # 백오피스
│   │       ├── dashboard/       # 대시보드
│   │       ├── calendar/        # 캘린더
│   │       ├── schedule/        # 촬영 관리
│   │       ├── projects/        # 프로젝트 관리
│   │       ├── customers/       # 고객 관리
│   │       ├── settings/        # 설정
│   │       ├── my/              # My 페이지
│   │       └── team/            # 팀 관리
│   └── globals.css              # 전역 스타일
├── components/                   # React 컴포넌트
│   ├── ui/                      # shadcn/ui 컴포넌트
│   ├── layout/                  # 레이아웃 컴포넌트
│   ├── common/                  # 공통 컴포넌트
│   ├── client/                  # 고객용 컴포넌트
│   ├── calendar/                # 캘린더 컴포넌트
│   ├── customers/               # 고객 관리 컴포넌트
│   ├── projects/                # 프로젝트 관리 컴포넌트
│   └── my/                      # My 페이지 컴포넌트
├── lib/                          # 라이브러리 및 유틸리티
│   ├── config/                  # 설정 파일
│   ├── constants.ts             # 상수 정의
│   ├── types.ts                 # TypeScript 타입
│   ├── utils.ts                 # 유틸리티 함수
│   ├── mock/                    # Mock 데이터
│   │   ├── admin.ts            # 관리자 데이터
│   │   ├── schedules.ts        # 스케줄 데이터
│   │   ├── settings.ts         # 상품/정책 데이터
│   │   └── me.ts               # 작가 일정 데이터
│   ├── services/                # API 서비스
│   ├── store/                   # 상태 관리
│   └── utils/                   # 유틸리티 모듈
└── public/                       # 정적 파일

```

## 🛠 기술 스택

### Core
- **Framework**: Next.js 16.0 (App Router)
- **Language**: TypeScript 5
- **React**: 19.2

### Styling
- **TailwindCSS**: 3.4
- **shadcn/ui**: Radix UI 기반 컴포넌트
- **Lucide React**: 아이콘

### Libraries
- **FullCalendar**: 캘린더 UI
- **date-fns**: 날짜 처리
- **Recharts**: 차트 및 그래프
- **React Hook Form**: 폼 관리
- **Zod**: 스키마 검증
- **Zustand**: 상태 관리
- **Sonner**: 토스트 알림

## 🎨 디자인 시스템

### Color Palette
```css
/* Grayscale */
--zinc-50: #fafafa   /* Background */
--zinc-100: #f4f4f5  /* Card background */
--zinc-200: #e4e4e7  /* Border */
--zinc-600: #52525b  /* Muted text */
--zinc-900: #18181b  /* Primary text */

/* Product Types */
--blue-500: #3b82f6    /* Wedding */
--purple-500: #a855f7  /* Hanbok */
--pink-500: #ec4899    /* Dress Shop */
--green-500: #22c55e   /* Baby */
```

### Typography
- **Headings**: Bold, tracking-tight
- **Body**: Regular, line-height 1.5
- **Small**: 0.875rem (14px)

### Spacing
- 모바일 우선 (375px+)
- Tablet: 768px (md)
- Desktop: 1024px (lg)

## 📊 데이터 구조

### 고객 정보
```typescript
{
  groomName: string
  brideName: string
  groomPhone?: string
  bridePhone?: string
  email?: string
  mainContact: 'groom' | 'bride'
  productType: 'wedding' | 'hanbok' | 'dress_shop' | 'baby'
  packageId: string
  optionIds?: string[]
  weddingDate: string
  weddingTime: string
  venueName?: string
  referralSource?: string
  specialRequests?: string
}
```

### 상품 구조
```typescript
{
  id: string
  name: string
  category: 'SNAP'
  title: string
  description: string[]
  basePrice: number
  photoCount: number
  albumIncluded: boolean
  isActive: boolean
}
```

## 🔐 보안

- 모든 민감한 정보는 환경 변수로 관리
- Mock 데이터는 개발 목적으로만 사용
- API 통신 시 JWT 토큰 기반 인증 (구현 예정)
- XSS 및 CSRF 방어 (Next.js 기본 제공)

### 🔒 배포 환경 비밀번호 보호

S3 배포 환경에서 비밀번호 보호 기능이 제공됩니다:
- 로컬 개발 환경에서는 비활성화
- 프로덕션 배포 시에만 활성화
- 24시간 세션 유지

자세한 설정 방법은 [`DEPLOYMENT_PASSWORD_SETUP.md`](./DEPLOYMENT_PASSWORD_SETUP.md) 참조

## 📝 개발 가이드

### 코드 스타일
- TypeScript strict mode
- ESLint 설정 준수
- Prettier 포맷팅
- 컴포넌트는 함수형으로 작성
- Props 타입은 명시적으로 정의

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 설정 등
```

### 브랜치 전략
- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정

## 🚧 향후 계획

### Phase 1: Backend Integration
- [ ] RESTful API 연동
- [ ] 데이터베이스 설계 및 구축
- [ ] 사용자 인증 시스템
- [ ] 파일 업로드 (AWS S3)

### Phase 2: Advanced Features
- [ ] 실시간 알림 (WebSocket)
- [ ] 이메일/SMS 자동 발송
- [ ] 결제 시스템 연동
- [ ] 고급 검색 및 필터링

### Phase 3: Optimization
- [ ] 성능 최적화
- [ ] SEO 개선
- [ ] PWA 지원
- [ ] 다국어 지원

## 📄 라이선스

Proprietary - All rights reserved

## 👥 개발팀

**MindGraphy Development Team**

---

**Version**: 2.0.0  
**Last Updated**: 2025-01-18  
**Node Version**: 18.0+
