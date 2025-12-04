# 🚀 배포 가이드

## ⚠️ 중요: 동적 라우트 이슈

이 프로젝트는 다음과 같은 **동적 라우트**를 사용합니다:
- `/admin/timetable/[projectId]` - 타임테이블 관리
- `/admin/gallery/[projectId]/upload` - 갤러리 업로드
- `/gallery/[galleryId]` - 고객용 갤러리

**Next.js 정적 빌드(`output: 'export'`)는 동적 라우트를 지원하지 않습니다.**

---

## 📋 배포 옵션

### ✅ **옵션 1: Vercel (권장)**

**장점:**
- ✅ 무료 플랜 제공
- ✅ 서버사이드 렌더링(SSR) 완벽 지원
- ✅ Git 연동으로 자동 배포
- ✅ 동적 라우트 완벽 지원
- ✅ 설정 불필요

**배포 방법:**
1. [Vercel 회원가입](https://vercel.com/signup)
2. GitHub 저장소 연결
3. 프로젝트 Import
4. 자동 배포 완료! 🎉

**환경 변수 설정 (필요 시):**
```bash
# Vercel Dashboard > Project > Settings > Environment Variables
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

### ✅ **옵션 2: AWS Amplify**

**장점:**
- ✅ AWS 생태계 통합
- ✅ SSR 지원
- ✅ 커스텀 도메인 쉬움

**배포 방법:**
1. AWS Amplify Console 접속
2. GitHub 저장소 연결
3. 빌드 설정:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

---

### ✅ **옵션 3: Netlify**

**장점:**
- ✅ 무료 플랜 제공
- ✅ Next.js 플러그인 지원
- ✅ Git 연동 자동 배포

**배포 방법:**
1. [Netlify 회원가입](https://app.netlify.com/signup)
2. GitHub 저장소 연결
3. 빌드 설정:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
4. **Next.js Plugin 설치** (자동 제안됨)

---

### ❌ **옵션 4: AWS S3 + CloudFront (정적 배포)**

**현재 불가능한 이유:**
- ❌ 동적 라우트(`[projectId]`)가 있어 정적 빌드 실패
- ❌ `generateStaticParams()` 구현이 복잡함
- ❌ 클라이언트 컴포넌트에서 사용 불가

**가능하게 하려면:**
1. 모든 동적 라우트를 쿼리 파라미터로 변경
   - `/admin/timetable/[projectId]` → `/admin/timetable?id=xxx`
2. 또는 `generateStaticParams()`로 모든 프로젝트 ID를 사전 생성
3. 또는 관리자 페이지를 별도 서버로 분리

---

## 🎯 **권장 배포 전략**

### **고객용 페이지 (Client Portal)**
- 정적 빌드 가능
- S3 + CloudFront 가능
- 경로: `/c/*`

### **관리자 페이지 (Admin Panel)**
- 서버사이드 렌더링 필요
- Vercel/Amplify/Netlify 필수
- 경로: `/admin/*`

### **분리 배포 구조 (선택)**
```
고객용 페이지 (정적)
└── S3 + CloudFront
    └── https://client.mindgraphy.com

관리자 페이지 (SSR)
└── Vercel/Netlify
    └── https://admin.mindgraphy.com
```

---

## 📝 **현재 GitHub Actions 상태**

`.github/workflows/deploy.yml` 파일은 **비활성화**되어 있습니다.

**이유:**
1. AWS 시크릿 키 미설정
2. 정적 빌드 불가능 (동적 라우트)

**해결 방법:**
- Vercel/Netlify Git Integration 사용 (권장)
- 또는 프로젝트 구조 변경 후 정적 빌드 활성화

---

## ✅ **빠른 시작: Vercel로 5분 안에 배포**

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 디렉토리에서 실행
cd /path/to/mindgraphy
vercel

# 3. 질문에 답변
# - Link to existing project? No
# - Project name? mindgraphy
# - Directory? ./
# - Build command? npm run build (자동 감지)
# - Output directory? .next (자동 감지)

# 4. 배포 완료!
# URL이 자동으로 생성됨 (예: https://mindgraphy-xxx.vercel.app)
```

---

## 🔧 **환경별 설정**

### **개발 환경**
```bash
npm run dev
# http://localhost:3000
```

### **프로덕션 빌드 (로컬 테스트)**
```bash
npm run build
npm run start
# http://localhost:3000
```

---

## 📞 **문제 해결**

### Q: "AWS_ACCESS_KEY_ID is not set" 오류
**A:** GitHub Actions를 사용하지 않고 Vercel을 사용하세요. (위 가이드 참고)

### Q: 정적 빌드가 필요합니다
**A:** 프로젝트 구조를 변경하거나, 동적 라우트를 쿼리 파라미터로 변경해야 합니다.

### Q: 관리자 페이지만 SSR이 필요합니다
**A:** 프로젝트를 두 개로 분리하는 것을 권장합니다.

---

## 🎉 **배포 체크리스트**

- [ ] Vercel/Netlify 계정 생성
- [ ] GitHub 저장소 연결
- [ ] 자동 배포 활성화
- [ ] 환경 변수 설정 (필요 시)
- [ ] 커스텀 도메인 연결 (선택)
- [ ] SSL 인증서 확인 (자동)

---

**추천: Vercel을 사용하면 모든 설정이 자동으로 완료됩니다!** 🚀

