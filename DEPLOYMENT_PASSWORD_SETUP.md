# 배포 환경 비밀번호 보호 설정 가이드

## 개요

S3에 배포된 프로덕션 환경에서만 비밀번호 보호 기능이 활성화되도록 구현되었습니다.
로컬 개발 환경에서는 비밀번호 입력 화면이 나타나지 않습니다.

## 환경 변수 설정

### 1. 로컬 개발 환경 (.env.local)

로컬 환경에서는 비밀번호 보호가 비활성화됩니다.

```bash
# .env.local 파일 생성
NEXT_PUBLIC_ENVIRONMENT=development
```

### 2. 프로덕션 빌드 환경 (.env.production 또는 빌드 시 설정)

배포 시 다음 환경 변수를 설정해야 합니다:

```bash
# 프로덕션 환경 플래그
NEXT_PUBLIC_ENVIRONMENT=production

# 사이트 접근 비밀번호 (원하는 비밀번호로 변경)
NEXT_PUBLIC_SITE_PASSWORD=your-secure-password-here
```

## 빌드 및 배포 방법

### 방법 1: .env.production 파일 사용

프로젝트 루트에 `.env.production` 파일을 생성합니다:

```bash
# .env.production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SITE_PASSWORD=mindgraphy2024!
```

빌드 명령어:

```bash
npm run build
```

### 방법 2: 빌드 시 환경 변수 직접 설정

```bash
NEXT_PUBLIC_ENVIRONMENT=production NEXT_PUBLIC_SITE_PASSWORD=mindgraphy2024! npm run build
```

### 방법 3: GitHub Actions를 통한 배포

`.github/workflows/deploy.yml` 파일에서 환경 변수를 설정합니다:

```yaml
env:
  NEXT_PUBLIC_ENVIRONMENT: production
  NEXT_PUBLIC_SITE_PASSWORD: ${{ secrets.SITE_PASSWORD }}
```

GitHub Secrets에 비밀번호를 등록:
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `SITE_PASSWORD`
4. Secret: 원하는 비밀번호 입력
5. "Add secret" 클릭

## 작동 방식

### 로컬 개발 환경
- `NEXT_PUBLIC_ENVIRONMENT`가 `production`이 아니면 비밀번호 화면이 표시되지 않음
- 즉시 애플리케이션 접근 가능

### 프로덕션 배포 환경
- `NEXT_PUBLIC_ENVIRONMENT=production`일 때만 비밀번호 보호 활성화
- 최초 접근 시 비밀번호 입력 화면 표시
- 올바른 비밀번호 입력 후 24시간 동안 세션 유지
- localStorage에 세션 정보 저장

## 세션 관리

- **세션 유효 기간**: 24시간
- **저장 위치**: 브라우저 localStorage
- **세션 만료 시**: 비밀번호 재입력 필요
- **다른 브라우저/디바이스**: 각각 별도 인증 필요

## 보안 참고사항

⚠️ **중요**: 이 방식은 클라이언트 사이드 보호입니다.

### 장점
- 간단한 구현
- 정적 사이트 배포에 적합
- 별도 인증 서버 불필요

### 한계
- 기술적으로 숙련된 사용자는 우회 가능
- 소스 코드에서 환경 변수 확인 가능
- 민감한 데이터 보호에는 부적합

### 더 강력한 보안이 필요한 경우

다음 방법을 고려하세요:

1. **CloudFront + Lambda@Edge**
   - AWS CloudFront를 S3 앞에 배치
   - Lambda@Edge에서 HTTP Basic Auth 구현
   - 서버 사이드 인증 제공

2. **S3 + CloudFront + Cognito**
   - AWS Cognito를 통한 사용자 인증
   - CloudFront에서 인증된 요청만 허용

3. **백엔드 API + JWT 인증**
   - 실제 백엔드 서버 구축
   - JWT 토큰 기반 인증 구현

## 문제 해결

### 비밀번호 화면이 로컬에서 나타남
- `.env.local` 파일 확인
- `NEXT_PUBLIC_ENVIRONMENT=development` 설정 확인
- 개발 서버 재시작 (`npm run dev`)

### 배포 후 비밀번호 화면이 나타나지 않음
- 빌드 시 환경 변수가 올바르게 설정되었는지 확인
- `out/_next/static/chunks/*.js` 파일에서 환경 변수 확인 가능
- 빌드 로그에서 환경 변수 주입 확인

### 세션이 유지되지 않음
- 브라우저 localStorage 지원 확인
- 시크릿/프라이빗 모드에서는 세션이 유지되지 않을 수 있음
- 브라우저 개발자 도구 → Application → Local Storage 확인

## 테스트 방법

### 로컬 개발 환경 테스트
```bash
# .env.local
NEXT_PUBLIC_ENVIRONMENT=development

npm run dev
# → 비밀번호 화면 없이 바로 접근 가능
```

### 프로덕션 빌드 테스트
```bash
# .env.production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SITE_PASSWORD=test1234

npm run build
npx serve out
# → 비밀번호 화면 표시됨
```

## 비밀번호 변경 방법

1. `.env.production` 파일 또는 GitHub Secrets의 `SITE_PASSWORD` 업데이트
2. 새로운 비밀번호로 재빌드
3. S3에 재배포
4. 기존 사용자는 자동으로 로그아웃되고 새 비밀번호 입력 필요

## 추가 커스터마이징

비밀번호 보호 UI를 변경하려면:

`components/auth/password-protection.tsx` 파일을 수정하세요.

```tsx
// 세션 유효 기간 변경 (기본: 24시간)
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 밀리초 단위

// UI 텍스트 변경
<CardTitle>보호된 페이지</CardTitle>
<CardDescription>비밀번호를 입력해주세요.</CardDescription>
```
