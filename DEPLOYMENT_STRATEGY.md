# 🚀 다중 시스템 배포 전략

**날짜**: 2025년 12월 16일  
**목표**: 3개 시스템을 독립적으로 배포 및 운영

---

## 📋 시스템 구성

### 1. 🛍️ 온라인 쇼핑몰 (Shop)
- **경로**: `/shop/*`
- **용도**: 상품 판매, 결제 처리
- **도메인 예시**: `shop.mindgraphy.com`
- **배포**: Vercel (Production)

### 2. 👥 고객용 페이지 (Client Portal)
- **경로**: `/c/*`
- **용도**: 예약, 포털, 갤러리
- **도메인 예시**: `booking.mindgraphy.com`
- **배포**: Vercel (Production)

### 3. 🔐 내부 업무 시스템 (Admin)
- **경로**: `/admin/*`
- **용도**: 관리자 대시보드, 프로젝트 관리
- **도메인 예시**: `admin.mindgraphy.com`
- **배포**: Vercel (Private)

---

## 🎯 방안 1: Middleware + 환경변수 (빠른 구현 ⚡ - 추천)

### 장점
- ✅ 즉시 배포 가능 (10분 소요)
- ✅ 코드베이스 하나로 관리
- ✅ 환경변수만 변경하면 됨
- ✅ 토스페이먼츠 심사에 이상적

### 단계별 설정

#### 1️⃣ Vercel 프로젝트 3개 생성

```bash
# 같은 GitHub 저장소를 3번 연결
1. mindgraphy-shop (쇼핑몰)
2. mindgraphy-client (고객용)
3. mindgraphy-admin (관리자용)
```

#### 2️⃣ 각 프로젝트별 환경변수 설정

**쇼핑몰 배포 (토스페이먼츠 심사용)**
```env
NEXT_PUBLIC_DEPLOY_MODE=shop
NEXT_PUBLIC_APP_URL=https://shop.mindgraphy.com
```

**고객용 배포**
```env
NEXT_PUBLIC_DEPLOY_MODE=client
NEXT_PUBLIC_APP_URL=https://booking.mindgraphy.com
```

**관리자 배포**
```env
NEXT_PUBLIC_DEPLOY_MODE=admin
NEXT_PUBLIC_APP_URL=https://admin.mindgraphy.com
```

#### 3️⃣ Vercel 도메인 설정

각 프로젝트의 Settings > Domains에서:
- 쇼핑몰: `shop.mindgraphy.com` 또는 커스텀 도메인
- 고객용: `booking.mindgraphy.com`
- 관리자: `admin.mindgraphy.com`

#### 4️⃣ 배포 테스트

```bash
# 로컬에서 테스트
# .env.local 파일 생성
NEXT_PUBLIC_DEPLOY_MODE=shop

npm run build
npm start

# /admin, /c 접근 시 /shop으로 리다이렉트 확인
```

---

## 🎯 방안 2: 별도 브랜치 (중기 전략)

### 장점
- ✅ 각 시스템 독립적 배포
- ✅ 불필요한 코드 제거 가능
- ✅ 빌드 크기 최적화

### 구조

```
main (전체 코드)
├── shop-only (쇼핑몰만)
├── client-only (고객용만)
└── admin-only (관리자만)
```

### 설정 방법

```bash
# 쇼핑몰 전용 브랜치 생성
git checkout -b shop-only

# 불필요한 폴더 제거
rm -rf app/(admin)
rm -rf app/(client)

# 커밋 및 푸시
git add .
git commit -m "shop: 쇼핑몰 전용 브랜치"
git push origin shop-only
```

---

## 🎯 방안 3: 모노레포 (장기 전략)

### 장점
- ✅ 완전히 독립된 앱
- ✅ 공통 컴포넌트 공유
- ✅ 각 앱의 의존성 분리

### 구조

```
mindgraphy-monorepo/
├── apps/
│   ├── shop/          # 쇼핑몰
│   ├── client-portal/ # 고객용
│   └── admin/         # 관리자용
├── packages/
│   ├── ui/            # 공통 UI 컴포넌트
│   ├── utils/         # 공통 유틸리티
│   └── types/         # 공통 타입 정의
└── package.json
```

---

## 📝 토스페이먼츠 심사를 위한 즉시 배포 가이드

### Step 1: Vercel 프로젝트 생성 (5분)

1. Vercel 대시보드 접속
2. "New Project" 클릭
3. GitHub 저장소 연결: `mindgraphy`
4. 프로젝트명: `mindgraphy-shop`

### Step 2: 환경변수 설정 (2분)

Vercel Project Settings > Environment Variables:

```env
NEXT_PUBLIC_DEPLOY_MODE=shop
NEXT_PUBLIC_APP_URL=https://mindgraphy-shop.vercel.app
```

### Step 3: 배포 (3분)

1. "Deploy" 클릭
2. 배포 완료 대기
3. URL 확인: `https://mindgraphy-shop.vercel.app`

### Step 4: 검증

다음 URL 접속 테스트:
- ✅ `/shop` → 정상 접근
- ✅ `/shop/products` → 정상 접근
- ❌ `/admin` → `/shop`으로 리다이렉트
- ❌ `/c` → `/shop`으로 리다이렉트

### Step 5: 토스페이먼츠에 제출

심사 링크: `https://mindgraphy-shop.vercel.app/shop`

---

## 🔒 보안 고려사항

### 1. 관리자 페이지 보호
```typescript
// middleware.ts에 IP 화이트리스트 추가
const allowedIPs = ['123.456.789.0'] // 사무실 IP

if (isAdminOnly && !allowedIPs.includes(clientIP)) {
  return NextResponse.redirect(new URL('/403', request.url))
}
```

### 2. API 엔드포인트 보호
```typescript
// app/api/route.ts
export async function GET(request: Request) {
  const deployMode = process.env.NEXT_PUBLIC_DEPLOY_MODE
  
  if (deployMode === 'shop') {
    // 쇼핑몰 관련 API만 허용
  }
}
```

### 3. 환경변수 분리
- 각 배포 환경마다 다른 API 키 사용
- 결제 키는 쇼핑몰 배포에만 설정

---

## 📊 비용 최적화

### Vercel 무료 플랜 활용
- ✅ 3개 프로젝트 모두 무료
- ✅ 커스텀 도메인 무료
- ✅ 자동 SSL 인증서

### 대안: AWS S3 + CloudFront
```bash
# 정적 빌드 후 S3 업로드
npm run build
aws s3 sync out/ s3://shop.mindgraphy.com
```

---

## 🚀 최종 추천 방안

### 토스페이먼츠 심사 (즉시)
→ **방안 1: Middleware + 환경변수**
- 10분 내 배포 가능
- 별도 작업 불필요
- 심사 통과 후 정식 도메인 연결

### 정식 운영 (1-2주 후)
→ **방안 1 + 커스텀 도메인**
- `shop.mindgraphy.com`
- `booking.mindgraphy.com`
- `admin.mindgraphy.com`

### 장기 운영 (3개월 후)
→ **방안 3: 모노레포**
- 완전한 독립성
- 최적의 확장성

---

## 📞 다음 단계

1. ✅ middleware.ts 적용 (완료)
2. ⏳ Vercel 프로젝트 생성
3. ⏳ 환경변수 설정
4. ⏳ 배포 및 테스트
5. ⏳ 토스페이먼츠 제출

---

**작성자 노트**:
이 문서는 실제 프로덕션 배포를 위한 가이드입니다.
단계별로 진행하며, 각 단계에서 충분한 테스트를 거쳐주세요.
