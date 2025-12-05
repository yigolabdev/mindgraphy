# ⚠️ S3 배포 문제 분석 및 해결 방안

## 🔍 문제 원인

### 현재 상황
- GitHub Actions에서 S3로 배포를 시도했지만, **업데이트가 반영되지 않음**
- 확인한 결과: **정적 파일이 생성되지 않아서 배포할 파일이 없었음**

### 근본 원인
Next.js `output: 'export'` (정적 export)를 사용하려면:
- ✅ 모든 페이지가 정적이어야 함
- ❌ **동적 라우트**가 있으면 빌드 실패

#### 현재 동적 라우트 페이지들:
```
1. /admin/gallery/[projectId]/upload
2. /admin/timetable/[projectId]
3. /gallery/[galleryId]
```

이 페이지들은 **런타임에 params를 받아야** 하므로 정적 export 불가능!

---

## 💡 해결 방안 (3가지)

### 방안 1: Vercel 배포 (✅ 추천)

**장점**:
- ✅ GitHub 연동 자동 배포
- ✅ 동적 라우트 완벽 지원
- ✅ 빌드 캐싱 및 최적화
- ✅ 자동 HTTPS
- ✅ 글로벌 CDN
- ✅ 무료 (Hobby Plan)

**단점**:
- 없음!

**설정 방법** (3분):
```
1. https://vercel.com 가입
2. GitHub 연동
3. 'mindgraphy' 저장소 import
4. Deploy 클릭
5. 완료! 🎉
```

**배포 URL**:
```
https://mindgraphy.vercel.app
또는
https://your-domain.com (커스텀 도메인 무료)
```

---

### 방안 2: S3 + Lambda@Edge (복잡)

**개요**: S3에 정적 파일 + Lambda로 동적 라우트 처리

**장점**:
- ✅ AWS 생태계 활용
- ✅ 완전한 제어

**단점**:
- ❌ 설정 복잡 (Lambda, CloudFront 필요)
- ❌ 비용 증가
- ❌ 유지보수 어려움

**추천하지 않음** ⚠️

---

### 방안 3: 동적 라우트 제거 후 S3 (간단하지만 제한적)

**개요**: 동적 라우트 페이지 제거 또는 쿼리 파라미터로 변경

**변경 예시**:
```
Before: /admin/gallery/[projectId]/upload
After:  /admin/gallery/upload?projectId=xxx

Before: /gallery/[galleryId]
After:  /gallery?id=xxx
```

**장점**:
- ✅ S3만으로 배포 가능
- ✅ 현재 설정 활용

**단점**:
- ❌ URL이 덜 깔끔함
- ❌ SEO 불리
- ❌ 사용자 경험 저하

---

## 🎯 최종 추천

### ✨ Vercel 사용 (방안 1)

**이유**:
1. **즉시 배포 가능** - GitHub 연동만 하면 끝
2. **무료** - Hobby Plan으로 충분
3. **동적 라우트 완벽 지원**
4. **자동 HTTPS + CDN**
5. **Next.js 최적화** - Vercel이 Next.js 제작사

**설정 시간**: 3분  
**유지보수**: 거의 없음  
**비용**: 무료

---

## 📋 Vercel 배포 단계별 가이드

### 1️⃣ Vercel 가입
```
https://vercel.com/signup
```
- GitHub 계정으로 로그인

### 2️⃣ 프로젝트 Import
```
1. "Add New" → "Project" 클릭
2. GitHub 저장소 검색: "mindgraphy"
3. Import 클릭
```

### 3️⃣ 설정 (자동 감지)
```
Framework Preset: Next.js (자동 선택됨)
Build Command: npm run build (자동)
Output Directory: .next (자동)
```

### 4️⃣ Deploy
```
"Deploy" 버튼 클릭
→ 2-3분 대기
→ 완료! 🎉
```

### 5️⃣ 자동 배포 설정
```
이제부터 main 브랜치에 푸시하면:
→ Vercel이 자동으로 빌드 & 배포
→ 미리보기 URL 자동 생성
→ Production 배포 완료
```

---

## 🔄 S3 vs Vercel 비교

| 항목 | S3 | Vercel |
|------|-----|--------|
| 정적 페이지 | ✅ | ✅ |
| 동적 라우트 | ❌ | ✅ |
| 자동 배포 | GitHub Actions 필요 | 내장 |
| HTTPS | CloudFront 필요 | 자동 |
| CDN | CloudFront 설정 필요 | 자동 |
| 커스텀 도메인 | Route53 설정 필요 | 간단 설정 |
| 빌드 캐싱 | 없음 | 자동 |
| 비용 | $1-5/월 | 무료 |
| 설정 복잡도 | 높음 ⚠️ | 낮음 ✅ |

---

## ❓ 어떻게 진행할까요?

### Option A: Vercel 배포 (추천)
```
1. 위 가이드대로 Vercel 설정
2. 기존 S3 배포 워크플로우 삭제
3. 끝!
```

### Option B: S3 유지 + 동적 라우트 제거
```
1. 동적 라우트 페이지를 쿼리 파라미터로 변경
2. output: 'export' 활성화
3. S3 배포 계속 사용
```

### Option C: 둘 다 사용
```
- Vercel: Production 배포
- S3: 백업 또는 정적 에셋 서빙
```

---

## 💬 제 의견

**Vercel을 사용하세요!**

이유:
1. ✅ 3분이면 배포 완료
2. ✅ 무료
3. ✅ 동적 라우트 문제 해결
4. ✅ 더 빠르고 안정적
5. ✅ Next.js에 최적화

S3는 좋은 선택이지만, Next.js처럼 **동적 기능이 필요한 앱**에는 Vercel이 훨씬 적합합니다.

---

**어떤 방안으로 진행하시겠습니까?** 🤔

1. Vercel 배포 (추천)
2. S3 + 동적 라우트 제거
3. 다른 방법

알려주시면 바로 진행하겠습니다!

