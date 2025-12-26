# 🎨 Mindgraphy

**웨딩 촬영 스튜디오 통합 관리 시스템**

---

## 📋 프로젝트 개요

Mindgraphy는 웨딩 촬영 스튜디오를 위한 올인원 솔루션입니다.

### 주요 시스템

```
┌─────────────────────────────────────────┐
│  🛍️ 온라인 쇼핑몰                        │
│  - 상품 판매                              │
│  - 토스페이먼츠 결제                      │
│  - 패키지 관리                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  👥 고객용 포털                          │
│  - 예약 관리                              │
│  - 갤러리 보기                            │
│  - 웨딩 정보 입력                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  🔐 관리자 시스템                        │
│  - 프로젝트 관리                          │
│  - 일정 관리                              │
│  - 작가 배정                              │
└─────────────────────────────────────────┘
```

---

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 설치

```bash
# 저장소 클론
git clone https://github.com/yigolabdev/mindgraphy.git
cd mindgraphy

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

### 접속

```
http://localhost:3000
```

---

## 🏗️ 기술 스택

### Frontend

- **Next.js 16.1.1** (App Router)
- **React 19.2.3**
- **TypeScript 5**
- **Tailwind CSS 3**

### UI 컴포넌트

- **shadcn/ui** (Radix UI 기반)
- **lucide-react** (아이콘)
- **FullCalendar** (일정 관리)
- **recharts** (차트)

### 상태 관리

- **Zustand** (전역 상태)
- **TanStack Query** (서버 상태)
- **React Hook Form** (폼 관리)

---

## 📁 프로젝트 구조

```
mindgraphy/
├── app/                    # Next.js App Router
│   ├── (client)/          # 고객용 페이지
│   │   └── c/
│   ├── (admin)/           # 관리자 페이지
│   │   └── admin/
│   └── shop/              # 쇼핑몰
│
├── components/            # 공통 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── ...
│
├── lib/                   # 유틸리티 & 설정
│   ├── hooks/            # 커스텀 훅
│   ├── services/         # API 서비스
│   ├── store/            # Zustand 스토어
│   ├── types/            # TypeScript 타입
│   └── utils/            # 유틸리티 함수
│
├── proxy.ts              # ⭐ 접근 제어 (중요!)
├── next.config.ts        # Next.js 설정
└── package.json          # 의존성
```

---

## 🔧 환경변수

### 필수 환경변수

```env
# 배포 모드 (시스템 분리)
NEXT_PUBLIC_DEPLOY_MODE=shop    # 또는 client, admin

# 앱 URL
NEXT_PUBLIC_APP_URL=https://mindgraphy-shop.vercel.app
```

### 선택적 환경변수

```env
# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=your_key
TOSS_SECRET_KEY=your_secret

# 기타
NEXT_PUBLIC_GA_ID=your_ga_id
```

---

## 🚢 배포

### Vercel 배포 (현재 운영) ✅

**추천 이유**:
- ⚡ 자동 배포
- 💰 무료
- 🔄 자동 SSL
- 📊 분석 대시보드

**배포 방법**:

```bash
# 1. Vercel 프로젝트 생성
# 2. GitHub 연동
# 3. 환경변수 설정
NEXT_PUBLIC_DEPLOY_MODE=shop

# 4. 자동 배포 완료!
```

**상세 가이드**: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

---

### S3 배포 (선택사항)

**주의사항**:
- ⚠️ proxy.ts (middleware) 작동 안 함
- ⚠️ 별도 브랜치 권장
- ⚠️ 수동 배포 필요

**상세 가이드**: [S3_DEPLOYMENT_GUIDE.md](./S3_DEPLOYMENT_GUIDE.md)

---

## 📖 문서

### 배포 관련

- [📘 DEPLOYMENT_STRUCTURE.md](./DEPLOYMENT_STRUCTURE.md) - **배포 구조 가이드** ⭐
- [📗 VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) - Vercel 배포 가이드
- [📙 S3_DEPLOYMENT_GUIDE.md](./S3_DEPLOYMENT_GUIDE.md) - S3 배포 가이드
- [📕 DEPLOYMENT_COMPARISON.md](./DEPLOYMENT_COMPARISON.md) - 배포 방법 비교
- [📔 DEPLOYMENT_STRATEGY.md](./DEPLOYMENT_STRATEGY.md) - 배포 전략

### 개발 관련

- [📘 REFACTORING_FINAL_COMPLETE.md](./REFACTORING_FINAL_COMPLETE.md) - 리팩토링 완료 보고서
- [📗 DESIGN_SYSTEM_IMPROVEMENTS.md](./DESIGN_SYSTEM_IMPROVEMENTS.md) - 디자인 시스템
- [📙 BEST_PRACTICES.md](./BEST_PRACTICES.md) - 베스트 프랙티스

---

## 🎯 주요 기능

### 🛍️ 쇼핑몰 (`/shop`)

- ✅ 상품 목록 & 상세
- ✅ 장바구니
- ✅ 토스페이먼츠 결제
- ✅ 주문 완료

### 👥 고객 포털 (`/c`)

- ✅ 예약 관리
- ✅ 웨딩 정보 입력
- ✅ 갤러리 보기
- ✅ 타임라인
- ✅ 파일 다운로드

### 🔐 관리자 (`/admin`)

- ✅ 대시보드
- ✅ 고객 관리
- ✅ 프로젝트 관리
- ✅ 일정 관리
- ✅ 캘린더
- ✅ 작가 배정
- ✅ 설정

---

## 🔐 접근 제어

### proxy.ts (중요!)

시스템 간 격리를 위한 접근 제어:

```typescript
// 환경변수에 따라 동작
NEXT_PUBLIC_DEPLOY_MODE=shop
→ /shop만 접근 가능
→ /admin, /c 자동 차단

NEXT_PUBLIC_DEPLOY_MODE=client
→ /c만 접근 가능
→ /shop, /admin 자동 차단

NEXT_PUBLIC_DEPLOY_MODE=admin
→ /admin만 접근 가능
→ /shop, /c 자동 차단
```

**⚠️ 주의**: `proxy.ts` 파일을 삭제하거나 수정하지 마세요!

---

## 🧪 테스트

```bash
# 타입 체크
npm run lint

# 빌드 테스트
npm run build

# 프로덕션 실행
npm start
```

---

## 📦 NPM 스크립트

```json
{
  "dev": "next dev --turbo",           // 개발 서버 (Turbopack)
  "dev:webpack": "...",                 // 개발 서버 (Webpack)
  "build": "next build",                // 프로덕션 빌드
  "start": "next start",                // 프로덕션 실행
  "lint": "eslint"                      // 린트
}
```

---

## 🐛 문제 해결

### 루트 경로가 리다이렉트 안 됨

**해결**:
1. `proxy.ts` 파일 확인
2. 환경변수 `NEXT_PUBLIC_DEPLOY_MODE` 확인
3. Vercel 환경변수 설정 확인

### 빌드 실패

**해결**:
1. `npm install` 재실행
2. `node_modules`, `.next` 삭제 후 재빌드
3. Next.js 16.1.1 이상 확인

### 배포 후 환경변수 미적용

**해결**:
1. Vercel에서 Redeploy
2. "Use Cache" 체크 해제
3. 재배포

**상세 가이드**: [DEPLOYMENT_STRUCTURE.md](./DEPLOYMENT_STRUCTURE.md)

---

## 🤝 기여

### 개발 워크플로우

1. 브랜치 생성
   ```bash
   git checkout -b feature/your-feature
   ```

2. 변경 및 커밋
   ```bash
   git commit -m "feat: add new feature"
   ```

3. 푸시 및 PR
   ```bash
   git push origin feature/your-feature
   ```

### 커밋 컨벤션

```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 업데이트
refactor: 리팩토링
style: 코드 스타일
test: 테스트
chore: 빌드/설정
```

---

## 📊 프로젝트 상태

### ✅ 완료

- [x] Next.js 16 마이그레이션
- [x] 보안 패치 적용
- [x] Vercel 배포 완료
- [x] 접근 제어 구현
- [x] 쇼핑몰 시스템
- [x] 고객 포털
- [x] 관리자 시스템

### 🚧 진행 중

- [ ] 고객용 Vercel 배포
- [ ] 관리자용 Vercel 배포
- [ ] 커스텀 도메인 연결

### 📝 계획

- [ ] API 백엔드 연동
- [ ] 데이터베이스 연동
- [ ] 이미지 업로드
- [ ] 이메일 알림

---

## 🔒 보안

### 현재 버전

- Next.js: **16.1.1** (보안 패치 적용)
- React: **19.2.3**
- 보안 취약점: **0개**

### 보안 업데이트

정기적으로 확인:
```bash
npm audit
npm audit fix
```

---

## 📞 지원

### 문서

- [배포 구조 가이드](./DEPLOYMENT_STRUCTURE.md) ⭐
- [Vercel 배포 가이드](./VERCEL_DEPLOYMENT_GUIDE.md)
- [문제 해결 가이드](./DEPLOYMENT_STRUCTURE.md#문제-해결)

### 문의

- GitHub Issues
- Email: support@mindgraphy.com

---

## 📜 라이선스

MIT License

---

## 🙏 감사의 말

Built with ❤️ by Mindgraphy Team

### 사용 기술

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vercel](https://vercel.com)

---

**마지막 업데이트**: 2025년 12월 26일  
**버전**: 1.0.0  
**상태**: 🟢 운영 중
