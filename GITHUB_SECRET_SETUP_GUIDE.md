# GitHub Secrets 설정 가이드

## ✅ 완료된 작업
- ✅ 비밀번호 보호 기능 구현 완료
- ✅ GitHub에 푸시 완료
- ✅ GitHub Actions 워크플로우 업데이트 완료

## 🔑 다음 단계: GitHub Secrets 설정

배포 시 비밀번호 보호 기능을 활성화하려면 GitHub Secrets에 비밀번호를 등록해야 합니다.

### 1. GitHub 저장소 페이지 접속

```
https://github.com/yigolabdev/mindgraphy
```

### 2. Settings 메뉴로 이동

1. 저장소 상단의 **Settings** 탭 클릭
2. 왼쪽 사이드바에서 **Secrets and variables** 클릭
3. **Actions** 선택

### 3. 새 Secret 생성

1. **"New repository secret"** 버튼 클릭
2. 다음 정보 입력:
   - **Name**: `SITE_PASSWORD`
   - **Secret**: `1051`
3. **"Add secret"** 버튼 클릭

### 4. 배포 확인

Secret을 추가한 후:

1. **Actions** 탭으로 이동
2. 최신 워크플로우 실행 확인
3. 또는 수동으로 재배포:
   - **Actions** → **Deploy to S3** 워크플로우 선택
   - **"Run workflow"** 클릭
   - **"Run workflow"** 버튼 클릭

### 5. 배포 완료 후 테스트

배포가 완료되면:

1. S3 배포 URL 접속
2. 비밀번호 입력 화면이 나타나는지 확인
3. 설정한 비밀번호 입력
4. 24시간 동안 세션 유지 확인

## 📋 설정 체크리스트

- [ ] GitHub Repository → Settings → Secrets and variables → Actions 접속
- [ ] `SITE_PASSWORD` Secret 생성
- [ ] 원하는 비밀번호 입력 및 저장
- [ ] GitHub Actions 워크플로우 실행 확인
- [ ] 배포 완료 후 S3 URL에서 비밀번호 화면 테스트

## 🔒 보안 참고사항

### 비밀번호 권장사항
- 최소 8자 이상
- 영문, 숫자, 특수문자 조합
- 추측하기 어려운 문자열

### 예시
- ✅ `MindGraphy2024!`
- ✅ `WeddingStudio#2024`
- ✅ `Yigo@Snap2024`
- ❌ `1234` (너무 단순)
- ❌ `password` (추측 가능)

## 🎯 현재 상태

### 로컬 개발 환경
- `.env.local` 파일에 `NEXT_PUBLIC_ENVIRONMENT=development` 설정됨
- 비밀번호 화면 **나타나지 않음**
- 정상 작동 중

### GitHub Actions 배포 환경
- 환경 변수: `NEXT_PUBLIC_ENVIRONMENT=production`
- 비밀번호: `${{ secrets.SITE_PASSWORD }}` (설정 필요)
- Secret 설정 후 자동으로 비밀번호 보호 활성화

## 🆘 문제 해결

### Secret을 설정했는데도 비밀번호 화면이 나타나지 않는 경우

1. **GitHub Actions 로그 확인**
   - Actions 탭에서 최신 워크플로우 클릭
   - "Build Next.js" 단계 로그 확인
   - `NEXT_PUBLIC_SITE_PASSWORD`가 설정되었는지 확인

2. **Secret 이름 확인**
   - 정확히 `SITE_PASSWORD`로 설정했는지 확인
   - 대소문자 구분됨

3. **재배포 시도**
   - Actions → Deploy to S3 → Run workflow
   - 수동으로 워크플로우 실행

4. **브라우저 캐시 삭제**
   - 하드 리프레시 (Ctrl+Shift+R 또는 Cmd+Shift+R)
   - 시크릿 모드로 접속하여 테스트

## 📞 추가 지원

더 자세한 정보는 다음 문서를 참조하세요:
- `DEPLOYMENT_PASSWORD_SETUP.md`: 전체 설정 가이드
- `README.md`: 프로젝트 개요 및 설정

---

**다음 단계**: GitHub Secrets에 `SITE_PASSWORD`를 설정하세요! 🔐
