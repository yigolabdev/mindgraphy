# 🏗️ 배포 구조 가이드

**최종 업데이트**: 2025년 12월 26일  
**현재 상태**: Vercel 배포 완료 ✅

---

## 📋 목차

1. [현재 배포 구조](#현재-배포-구조)
2. [핵심 파일 설명](#핵심-파일-설명)
3. [Vercel 배포](#vercel-배포)
4. [향후 S3 배포](#향후-s3-배포)
5. [유지보수 가이드](#유지보수-가이드)

---

## 🎯 현재 배포 구조

### 배포 플랫폼: Vercel

```
프로젝트: mindgraphy-shop
URL: https://mindgraphy-shop.vercel.app
환경: Production
브랜치: main
```

### 시스템 분리 방식

```
같은 코드베이스에서 환경변수로 분리:

┌─────────────────────────────────────┐
│ GitHub Repository: mindgraphy        │
│ Branch: main                         │
└─────────────────────────────────────┘
           │
           ├─→ Vercel Project 1: mindgraphy-shop
           │   ENV: NEXT_PUBLIC_DEPLOY_MODE=shop
           │   URL: shop.mindgraphy.com
           │
           ├─→ Vercel Project 2: mindgraphy-client
           │   ENV: NEXT_PUBLIC_DEPLOY_MODE=client
           │   URL: booking.mindgraphy.com
           │
           └─→ Vercel Project 3: mindgraphy-admin
               ENV: NEXT_PUBLIC_DEPLOY_MODE=admin
               URL: admin.mindgraphy.com
```

---

## 📁 핵심 파일 설명

### 1. `proxy.ts` (이전 middleware.ts) ⭐ 가장 중요!

**위치**: `/proxy.ts` (루트)

**역할**: 
- 환경변수에 따라 접근 제어
- 라우팅 리다이렉트
- 시스템 간 격리

**핵심 로직**:

```typescript
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isShopOnly = process.env.NEXT_PUBLIC_DEPLOY_MODE === 'shop'
  
  if (isShopOnly) {
    // /shop만 허용
    if (pathname.startsWith('/shop')) return NextResponse.next()
    
    // 루트는 /shop으로 리다이렉트
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/shop', request.url))
    }
    
    // /admin, /c 차단
    return NextResponse.redirect(new URL('/shop', request.url))
  }
}
```

**⚠️ 주의사항**:
- **절대 삭제하지 마세요!**
- 파일명 변경하지 마세요 (`proxy.ts` 고정)
- 함수명 변경하지 마세요 (`export function proxy` 고정)

---

### 2. `next.config.ts`

**위치**: `/next.config.ts` (루트)

**현재 설정 (Vercel용)**:

```typescript
const nextConfig: NextConfig = {
  // ✅ output: 'export' 없음 (Vercel은 동적 빌드)
  
  images: {
    unoptimized: true,
  },
};
```

**⚠️ 중요**:
- `output: 'export'`가 **없어야** proxy.ts가 작동함
- Vercel 배포에서는 **절대 추가하지 마세요**

---

### 3. `package.json`

**핵심 의존성**:

```json
{
  "dependencies": {
    "next": "^16.1.1",      // 보안 패치 적용
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  }
}
```

**⚠️ 버전 고정**:
- Next.js 16.1.1 이상 유지 (보안)
- React 19.2.3 이상 유지

---

## 🚀 Vercel 배포

### 현재 설정 (운영 중)

#### 환경변수

```env
NEXT_PUBLIC_DEPLOY_MODE=shop
```

#### 배포 프로세스

```
1. GitHub main 브랜치 푸시
   ↓
2. Vercel 자동 감지
   ↓
3. 빌드 시작
   - proxy.ts 컴파일
   - 환경변수 주입
   ↓
4. 배포 완료 (3-5분)
```

#### 확인 사항

빌드 로그에서 확인:
```
✓ Compiled successfully
ƒ Proxy (Middleware)  ← 이게 보여야 함!
```

---

### 추가 시스템 배포 방법

#### 고객용 페이지 추가

```
1. Vercel에서 New Project
2. mindgraphy 저장소 선택
3. 프로젝트명: mindgraphy-client
4. 환경변수:
   NEXT_PUBLIC_DEPLOY_MODE=client
5. Deploy
```

#### 관리자 페이지 추가

```
1. Vercel에서 New Project
2. mindgraphy 저장소 선택
3. 프로젝트명: mindgraphy-admin
4. 환경변수:
   NEXT_PUBLIC_DEPLOY_MODE=admin
5. Deploy
```

---

## 📦 향후 S3 배포

### S3는 정적 배포만 가능

**제약사항**:
- ❌ proxy.ts (middleware) 작동 안 함
- ❌ 서버 사이드 로직 불가
- ✅ 정적 HTML/CSS/JS만 가능

### S3 배포 방법 (선택사항)

#### 옵션 1: 별도 브랜치 사용 (추천)

```bash
# S3 전용 브랜치 생성
git checkout -b s3-deploy

# next.config.ts 수정
output: 'export',  // 추가

# 커밋
git commit -am "chore: S3 배포용 설정"
git push origin s3-deploy

# S3 배포 스크립트 실행
export NEXT_PUBLIC_DEPLOY_MODE=shop
./scripts/deploy-s3-shop.sh
```

#### 옵션 2: 환경변수로 분기 (고급)

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // S3 배포 시에만 export 모드 활성화
  ...(process.env.DEPLOY_TARGET === 's3' && {
    output: 'export',
  }),
};
```

**사용법**:
```bash
# Vercel 배포 (기본)
npm run build

# S3 배포
DEPLOY_TARGET=s3 npm run build
```

---

### S3 배포의 한계

**proxy.ts가 작동하지 않으므로**:

```
문제:
- / 접근 시 리다이렉트 안 됨
- /admin 접근 차단 안 됨
- /c 접근 차단 안 됨

해결:
- CloudFront Routing Rules로 대체
- 또는 각 시스템을 별도 버킷에 배포
```

---

## 🔧 유지보수 가이드

### 절대 하지 말아야 할 것 ⚠️

```
❌ proxy.ts 파일 삭제
❌ proxy.ts 파일명 변경
❌ export function proxy 함수명 변경
❌ next.config.ts에 output: 'export' 추가
❌ NEXT_PUBLIC_DEPLOY_MODE 환경변수 삭제
```

### 반드시 해야 하는 것 ✅

```
✅ Next.js 보안 업데이트 적용
✅ package-lock.json 유지
✅ Vercel 환경변수 확인
✅ 배포 후 기능 테스트
```

---

## 🐛 문제 해결

### 문제 1: 루트 경로가 /shop으로 안 감

**원인**:
- proxy.ts가 비활성화됨
- next.config.ts에 output: 'export' 있음

**해결**:
```typescript
// next.config.ts
// output: 'export', ← 이 줄 제거!
```

---

### 문제 2: "middleware deprecated" 경고

**원인**:
- middleware.ts 파일명 사용

**해결**:
```bash
mv middleware.ts proxy.ts
# 그리고 함수명도 변경
export function proxy(request: NextRequest) {
```

---

### 문제 3: 환경변수가 적용 안 됨

**원인**:
- Vercel 빌드 캐시

**해결**:
```
Vercel Dashboard
→ Deployments
→ 최신 배포 [...] 메뉴
→ Redeploy
→ "Use Cache" 체크 해제 ⭐
→ Redeploy
```

---

## 📊 현재 상태 체크리스트

### ✅ 완료된 것

- [x] Next.js 16.1.1 (보안 패치)
- [x] proxy.ts 마이그레이션
- [x] 환경변수 설정
- [x] Vercel 배포 완료
- [x] 루트 경로 리다이렉트
- [x] 접근 제어 작동
- [x] 모든 경고 제거

### 📝 향후 할 일

- [ ] 고객용 페이지 Vercel 배포
- [ ] 관리자 페이지 Vercel 배포
- [ ] 커스텀 도메인 연결
- [ ] S3 배포 (필요 시)

---

## 🔄 업데이트 이력

### 2025-12-26
- ✅ Next.js 16.0.1 → 16.1.1 보안 업데이트
- ✅ middleware.ts → proxy.ts 마이그레이션
- ✅ output: 'export' 제거 (Vercel용)
- ✅ 환경변수 설정 완료
- ✅ 쇼핑몰 배포 완료

---

## 📞 지원

### 문제 발생 시

1. **빌드 로그 확인**
   ```
   Vercel Dashboard → Deployments → 최신 배포 → Build Logs
   ```

2. **로컬 테스트**
   ```bash
   export NEXT_PUBLIC_DEPLOY_MODE=shop
   npm run build
   npm start
   ```

3. **관련 문서**
   - `VERCEL_DEPLOYMENT_GUIDE.md`: Vercel 배포 가이드
   - `S3_DEPLOYMENT_GUIDE.md`: S3 배포 가이드
   - `DEPLOYMENT_COMPARISON.md`: 배포 방법 비교

---

## 🎯 핵심 요약

### Vercel 배포 (현재 운영)

```
✅ proxy.ts 사용 (middleware)
✅ output: 'export' 없음
✅ 환경변수로 시스템 분리
✅ 자동 배포
✅ 무료
```

### S3 배포 (향후 필요 시)

```
⚠️ 별도 브랜치 권장
⚠️ output: 'export' 필요
⚠️ proxy.ts 작동 안 함
⚠️ 수동 배포
⚠️ 월 $3-5
```

### 권장사항

```
→ Vercel 계속 사용 (추천)
→ S3는 특별한 경우만
→ 현재 구조 유지
```

---

**작성일**: 2025년 12월 26일  
**작성자**: AI Assistant  
**검증**: 배포 완료 및 테스트 통과
