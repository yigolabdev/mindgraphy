# 🚀 Vercel 배포 가이드 (토스페이먼츠 심사용)

**작성일**: 2025년 12월 16일  
**목적**: 온라인 쇼핑몰만 독립 배포하여 토스페이먼츠 심사 제출

---

## 📋 전체 프로세스 (10분 소요)

```
1️⃣ Vercel 회원가입/로그인 (2분)
      ↓
2️⃣ GitHub 저장소 연동 (1분)
      ↓
3️⃣ 프로젝트 임포트 (1분)
      ↓
4️⃣ 환경변수 설정 (2분) ⭐ 중요!
      ↓
5️⃣ 배포 실행 (3분 - 자동)
      ↓
6️⃣ 배포 확인 및 테스트 (1분)
      ↓
7️⃣ 토스페이먼츠 제출 ✅
```

---

## 1️⃣ Vercel 회원가입/로그인

### Step 1-1: Vercel 접속

```
https://vercel.com
```

브라우저에서 위 URL 접속

### Step 1-2: 회원가입 또는 로그인

**신규 사용자**:
1. 우측 상단 **"Sign Up"** 클릭
2. **"Continue with GitHub"** 선택 (추천)
3. GitHub 계정으로 로그인
4. Vercel 권한 승인

**기존 사용자**:
1. 우측 상단 **"Log In"** 클릭
2. GitHub 계정으로 로그인

✅ **완료**: Vercel 대시보드 접속

---

## 2️⃣ GitHub 저장소 연동

### Step 2-1: 새 프로젝트 생성

Vercel 대시보드에서:

1. **"Add New..."** 버튼 클릭
2. **"Project"** 선택

또는

1. **"New Project"** 버튼 클릭 (중앙 또는 우측 상단)

### Step 2-2: GitHub 저장소 선택

**저장소가 목록에 보이는 경우**:
1. `mindgraphy` 저장소 찾기
2. **"Import"** 버튼 클릭

**저장소가 목록에 없는 경우**:
1. **"Adjust GitHub App Permissions"** 클릭
2. GitHub 권한 설정 페이지로 이동
3. **"Repository access"** 섹션에서:
   - "Only select repositories" 선택
   - `mindgraphy` 저장소 추가
4. **"Save"** 클릭
5. Vercel로 돌아가서 새로고침
6. `mindgraphy` 저장소의 **"Import"** 클릭

✅ **완료**: 프로젝트 설정 페이지로 이동

---

## 3️⃣ 프로젝트 설정

### Step 3-1: 프로젝트명 설정

**Configure Project** 화면에서:

```
Project Name: mindgraphy-shop
```

> 💡 팁: 프로젝트명은 URL의 일부가 됩니다
> `https://mindgraphy-shop.vercel.app`

### Step 3-2: Framework Preset 확인

자동 감지되어야 합니다:

```
Framework Preset: Next.js
```

만약 자동 감지 안 되면:
- 드롭다운에서 **"Next.js"** 선택

### Step 3-3: Root Directory 확인

```
Root Directory: ./  (기본값 유지)
```

변경하지 마세요!

### Step 3-4: Build & Output Settings

**펼쳐서 확인** (기본값 그대로 두세요):

```
Build Command: npm run build (또는 자동)
Output Directory: out (또는 자동)
Install Command: npm install (또는 자동)
```

✅ **완료**: 다음 단계로

---

## 4️⃣ 환경변수 설정 ⭐ 가장 중요!

### Step 4-1: Environment Variables 섹션 펼치기

**Configure Project** 화면에서:

1. **"Environment Variables"** 섹션 찾기
2. 섹션 펼치기 (접혀있으면)

### Step 4-2: 환경변수 추가

#### 환경변수 1: 배포 모드 설정

```
Key:   NEXT_PUBLIC_DEPLOY_MODE
Value: shop
```

**입력 방법**:
1. "KEY" 입력란: `NEXT_PUBLIC_DEPLOY_MODE`
2. "VALUE" 입력란: `shop`
3. Environment 선택: **"Production"** 체크 (기본값)
4. **"Add"** 버튼 클릭

#### 환경변수 2: 앱 URL (선택사항)

```
Key:   NEXT_PUBLIC_APP_URL
Value: https://mindgraphy-shop.vercel.app
```

**입력 방법**:
1. "KEY" 입력란: `NEXT_PUBLIC_APP_URL`
2. "VALUE" 입력란: `https://mindgraphy-shop.vercel.app`
3. **"Add"** 버튼 클릭

### Step 4-3: 환경변수 확인

추가된 환경변수 목록 확인:

```
✅ NEXT_PUBLIC_DEPLOY_MODE = shop
✅ NEXT_PUBLIC_APP_URL = https://mindgraphy-shop.vercel.app
```

> ⚠️ **매우 중요!**  
> `NEXT_PUBLIC_DEPLOY_MODE=shop` 이 **반드시** 설정되어야 합니다!  
> 이 설정이 없으면 모든 페이지가 공개됩니다!

✅ **완료**: 배포 준비 완료

---

## 5️⃣ 배포 실행

### Step 5-1: 배포 시작

**Configure Project** 화면 하단:

1. 모든 설정 최종 확인
2. **"Deploy"** 버튼 클릭 (파란색 큰 버튼)

### Step 5-2: 배포 진행 상황 확인

배포 화면으로 자동 이동:

```
Building...
┌ Initializing...
├ Installing dependencies...
├ Building application...
├ Generating static pages...
└ Finalizing...
```

**예상 소요 시간**: 2-4분

### Step 5-3: 배포 완료 대기

화면에 표시되는 내용:
- 로그 실시간 출력
- 진행 상황 표시
- 예상 완료 시간

**성공 시 표시**:
```
✓ Build Completed
✓ Deployed to Production
```

🎉 **배포 완료!**

✅ **완료**: 배포 URL 자동 생성

---

## 6️⃣ 배포 확인 및 테스트

### Step 6-1: 배포 URL 확인

배포 완료 화면에서:

```
Production Deployment
https://mindgraphy-shop.vercel.app
```

**URL 복사**:
1. URL 옆 **복사 아이콘** 클릭
또는
2. **"Visit"** 버튼 클릭 → 새 탭에서 열림

### Step 6-2: 쇼핑몰 페이지 접속 테스트

다음 URL들을 **반드시** 테스트하세요:

#### ✅ 정상 접근 (허용)

```
https://mindgraphy-shop.vercel.app/shop
→ 쇼핑몰 홈 페이지 표시 ✅

https://mindgraphy-shop.vercel.app/shop/products
→ 상품 목록 페이지 표시 ✅

https://mindgraphy-shop.vercel.app/shop/products/basic
→ 상품 상세 페이지 표시 ✅
```

#### ❌ 차단 (리다이렉트)

```
https://mindgraphy-shop.vercel.app/admin
→ /shop으로 자동 리다이렉트 ✅

https://mindgraphy-shop.vercel.app/c
→ /shop으로 자동 리다이렉트 ✅

https://mindgraphy-shop.vercel.app/c/portal
→ /shop으로 자동 리다이렉트 ✅
```

### Step 6-3: 결제 테스트 (중요!)

토스페이먼츠 심사를 위한 확인:

```
1. /shop/products 접속
2. 상품 선택
3. 장바구니 담기
4. 결제 프로세스 진행
5. 토스페이먼츠 결제 창 표시 확인
```

**모든 테스트 통과 시**: ✅ 심사 제출 가능!

✅ **완료**: 배포 검증 완료

---

## 7️⃣ 토스페이먼츠 제출

### Step 7-1: 제출 URL 준비

**제출할 URL**:
```
https://mindgraphy-shop.vercel.app/shop
```

또는 메인 페이지부터:
```
https://mindgraphy-shop.vercel.app
```

### Step 7-2: 토스페이먼츠 개발자 센터 접속

1. 토스페이먼츠 개발자 센터 로그인
2. 내 애플리케이션 선택
3. 심사 요청 또는 상점 정보 입력

### Step 7-3: URL 제출

**상점 URL** 입력란에:
```
https://mindgraphy-shop.vercel.app/shop
```

**테스트 결제 정보** 입력:
- 테스트 카드 번호
- 결제 흐름 설명
- 스크린샷 첨부

### Step 7-4: 심사 제출

모든 정보 입력 후:
1. 최종 확인
2. **"심사 요청"** 또는 **"제출"** 클릭

✅ **완료**: 토스페이먼츠 심사 대기

---

## 8️⃣ 추가 설정 (선택사항)

### 커스텀 도메인 연결

**무료로 가능합니다!**

#### Step 8-1: Vercel 도메인 설정

1. Vercel 프로젝트 대시보드
2. **"Settings"** 탭
3. **"Domains"** 메뉴
4. **"Add"** 버튼 클릭

#### Step 8-2: 도메인 입력

```
예시: shop.mindgraphy.com
```

#### Step 8-3: DNS 설정

Vercel이 제공하는 DNS 레코드 추가:

```
Type: CNAME
Name: shop
Value: cname.vercel-dns.com
```

도메인 등록 업체(가비아, 후이즈 등)에서 설정

#### Step 8-4: 확인

Vercel이 자동으로 SSL 인증서 발급 (무료)

**완료 후**:
```
https://shop.mindgraphy.com
```

---

## 9️⃣ 자동 배포 설정 (이미 활성화)

### GitHub Push 시 자동 배포

**이미 설정되어 있습니다!**

```
main 브랜치에 푸시 → 자동 배포
```

**확인 방법**:
1. 코드 수정
2. GitHub에 푸시
3. Vercel 대시보드에서 자동 배포 시작 확인

### PR 미리보기

**자동으로 활성화됩니다!**

```
Pull Request 생성 → 미리보기 URL 자동 생성
```

---

## 🔟 다중 시스템 배포 (향후)

### 고객용 페이지 배포

**동일한 방법으로 2개 더 생성**:

```
프로젝트명: mindgraphy-client
환경변수: NEXT_PUBLIC_DEPLOY_MODE=client
URL: https://mindgraphy-client.vercel.app
```

### 관리자 페이지 배포

```
프로젝트명: mindgraphy-admin
환경변수: NEXT_PUBLIC_DEPLOY_MODE=admin
URL: https://mindgraphy-admin.vercel.app
```

---

## 📊 배포 후 관리

### Vercel 대시보드 주요 기능

#### 1. Deployments (배포 이력)

```
- 모든 배포 이력 확인
- 롤백 가능 (이전 버전으로 복원)
- 로그 확인
```

#### 2. Analytics (분석)

```
- 방문자 수
- 페이지 로딩 속도
- 에러 추적
```

#### 3. Logs (로그)

```
- 실시간 로그
- 에러 로그
- 빌드 로그
```

#### 4. Settings (설정)

```
- 환경변수 수정
- 도메인 관리
- 빌드 설정 변경
```

---

## 🐛 문제 해결

### 문제 1: 빌드 실패

**증상**:
```
Build Error: Failed to compile
```

**해결**:
1. 로컬에서 `npm run build` 실행
2. 에러 확인 및 수정
3. GitHub에 푸시
4. Vercel 자동 재배포

### 문제 2: 환경변수 미적용

**증상**:
```
/admin 페이지가 접근됨 (차단되어야 함)
```

**해결**:
1. Vercel 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_DEPLOY_MODE=shop` 확인
3. 없으면 추가
4. **"Redeploy"** 버튼 클릭 (수동 재배포)

### 문제 3: 404 Not Found

**증상**:
```
/shop 접속 시 404 오류
```

**해결**:
1. 로컬에서 `npm run build` 확인
2. `out/shop/index.html` 파일 존재 확인
3. `next.config.ts`에서 `output: 'export'` 확인

### 문제 4: 느린 배포

**증상**:
```
배포가 5분 이상 소요
```

**정상입니다**:
- 첫 배포: 3-5분
- 이후 배포: 2-3분
- 캐시 활용으로 점차 빨라짐

---

## 📞 체크리스트

### 배포 전 체크리스트

- [ ] GitHub에 최신 코드 푸시 완료
- [ ] 로컬에서 `npm run build` 성공 확인
- [ ] Vercel 계정 준비 (GitHub 연동)

### 배포 중 체크리스트

- [ ] 프로젝트명 설정: `mindgraphy-shop`
- [ ] 환경변수 설정: `NEXT_PUBLIC_DEPLOY_MODE=shop`
- [ ] Framework Preset: Next.js 선택

### 배포 후 체크리스트

- [ ] `/shop` 정상 접근 확인
- [ ] `/admin` 차단 확인 (리다이렉트)
- [ ] `/c` 차단 확인 (리다이렉트)
- [ ] 결제 테스트 완료
- [ ] 토스페이먼츠 URL 제출

---

## 🎯 요약

### 핵심 단계 (10분)

```bash
1. Vercel 접속 및 로그인
2. GitHub 저장소 연동
3. 프로젝트 설정
   - 프로젝트명: mindgraphy-shop
   - 환경변수: NEXT_PUBLIC_DEPLOY_MODE=shop
4. Deploy 버튼 클릭
5. 배포 완료 대기 (3분)
6. URL 테스트
7. 토스페이먼츠 제출
```

### 제출할 URL

```
https://mindgraphy-shop.vercel.app/shop
```

### 비용

```
💰 완전 무료!
- 무료 플랜으로 충분
- 커스텀 도메인 무료
- SSL 인증서 무료
- 무제한 대역폭
```

---

## 🎉 완료!

이제 토스페이먼츠 심사를 위한 쇼핑몰 배포가 완료되었습니다!

**다음 단계**:
1. ✅ 배포 URL 테스트
2. ✅ 토스페이먼츠 제출
3. ⏳ 심사 대기
4. 🎉 승인 후 정식 오픈!

---

**작성자 노트**:
문제가 발생하면 Vercel 배포 로그를 확인하고,
필요시 로컬에서 `npm run build`를 먼저 테스트하세요.

**지원**: 문제 발생 시 언제든 질문해주세요!
