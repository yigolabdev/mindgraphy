# 비밀번호 "1051" 로컬 테스트 가이드

## ✅ 완료된 작업

- ✅ 비밀번호를 **1051**로 설정
- ✅ 숫자 입력에 최적화된 UI 개선
- ✅ GitHub에 푸시 완료

## 🧪 로컬에서 프로덕션 빌드 테스트

로컬 환경에서 비밀번호 입력 화면을 확인하려면:

### 1. 프로덕션 빌드 생성

```bash
npm run build
```

이 명령은 `.env.production` 파일을 읽어서 다음 환경 변수를 사용합니다:
- `NEXT_PUBLIC_ENVIRONMENT=production`
- `NEXT_PUBLIC_SITE_PASSWORD=1051`

### 2. 빌드된 파일 실행

```bash
npx serve out
```

또는:

```bash
npx http-server out -p 8080
```

### 3. 브라우저에서 접속

```
http://localhost:3000 (serve 사용 시)
http://localhost:8080 (http-server 사용 시)
```

### 4. 비밀번호 입력

- 비밀번호 입력 화면이 나타납니다
- **1051** 입력
- "확인" 버튼 클릭
- 메인 페이지로 이동

## 📱 UI 개선 사항

### 숫자 입력 최적화
- `type="number"` + `inputMode="numeric"`: 모바일에서 숫자 키패드 자동 표시
- 큰 글씨 + 중앙 정렬: 입력하기 쉬운 UI
- 4자리 숫자 입력 힌트

### 사용자 경험
- 입력 즉시 포커스
- 잘못된 비밀번호 시 에러 메시지 + 자동 초기화
- 24시간 세션 유지 (재입력 불필요)

## 🚀 GitHub Actions 배포

### GitHub Secrets 설정

1. https://github.com/yigolabdev/mindgraphy/settings/secrets/actions
2. "New repository secret" 클릭
3. Name: `SITE_PASSWORD`, Secret: `1051`
4. "Add secret" 클릭

### 자동 배포 확인

- 코드가 이미 푸시되었으므로 GitHub Actions가 자동 실행됩니다
- Actions 탭에서 배포 진행 상황 확인
- 배포 완료 후 S3 URL에서 비밀번호 "1051" 테스트

## 🔐 현재 비밀번호

```
1051
```

이 비밀번호는:
- ✅ 로컬 프로덕션 빌드에서 작동
- ✅ S3 배포 환경에서 작동 (GitHub Secret 설정 후)
- ❌ 로컬 개발 환경(npm run dev)에서는 표시 안 됨

## 📝 비밀번호 변경 방법

나중에 비밀번호를 변경하려면:

1. `.env.production` 파일 수정 (로컬 테스트용)
2. GitHub Secrets의 `SITE_PASSWORD` 업데이트 (배포용)
3. 재빌드 및 재배포

## 🎯 다음 단계

1. [ ] GitHub Actions → Actions 탭 확인
2. [ ] "Deploy to S3" 워크플로우 실행 확인
3. [ ] Settings → Secrets → `SITE_PASSWORD` = `1051` 설정
4. [ ] 배포 완료 후 S3 URL에서 테스트
5. [ ] 비밀번호 "1051" 입력하여 접근 확인

---

**모든 준비가 완료되었습니다!** 🎉
