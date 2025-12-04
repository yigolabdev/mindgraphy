# 🔧 Chrome isDragging 에러 완전 해결 가이드

## 🚨 현재 상황
```
Uncaught SyntaxError: Identifier 'isDragging' has already been declared (at autoinsert.js:1:1)
```

코드에서 `isDragging`은 `isGalleryDragActive`로 변경되었지만, Chrome이 오래된 번들을 캐싱하고 있습니다.

---

## ✅ 즉시 해결 방법

### 🔥 Step 1: Chrome 확장 프로그램 완전 비활성화 (가장 중요!)

**이 에러는 Chrome 확장 프로그램이 페이지에 스크립트를 주입해서 발생할 가능성이 90%입니다.**

#### 방법 A: 확장 프로그램 비활성화 후 테스트

1. Chrome 주소창에 입력: `chrome://extensions/`
2. **모든 확장 프로그램을 끕니다** (특히 번역기, 광고차단기, AI 도구 등)
3. Chrome 완전히 종료
4. Chrome 다시 열기
5. `http://localhost:3000` 테스트

#### 방법 B: 시크릿 모드 (확장 프로그램 없이)

1. Chrome 시크릿 모드: `Cmd + Shift + N` (Mac) / `Ctrl + Shift + N` (Windows)
2. `http://localhost:3000` 접속
3. **F12** → Console 확인

**→ 시크릿 모드에서 에러가 안 나면 = 100% 확장 프로그램 문제**

---

### 🧹 Step 2: Chrome 사이트 데이터 완전 삭제

1. `http://localhost:3000` 접속
2. **F12** → **Application** 탭
3. 왼쪽 사이드바에서 **"Storage"** 찾기
4. **"Clear site data"** 버튼 클릭 (상단)
5. 모든 항목 체크 확인 후 **"Clear site data"** 확정
6. Chrome 탭 완전히 닫기
7. 새 탭에서 `http://localhost:3000` 재접속

---

### 💾 Step 3: Chrome 전체 캐시 삭제

1. Chrome 주소창: `chrome://settings/clearBrowserData`
2. **"고급"** 탭
3. **시간 범위**: "전체 기간"
4. 체크:
   - ✅ 쿠키 및 기타 사이트 데이터
   - ✅ 캐시된 이미지 및 파일
   - ✅ 호스팅된 앱 데이터
5. **"데이터 삭제"**
6. Chrome **완전 종료** → 재시작

---

### 🔄 Step 4: 하드 리프레시

1. `http://localhost:3000` 접속
2. **F12** 눌러서 개발자 도구 열기
3. **개발자 도구가 열린 상태에서**:
   - 새로고침 버튼 **우클릭**
   - **"캐시 비우기 및 강력 새로고침"** 선택

또는 단축키:
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + F5`

---

## 🎯 권장 순서

1. ✅ **시크릿 모드 테스트** (Step 1-B)
   - 작동함 → 확장 프로그램 문제, Step 1-A 실행
   - 안 됨 → Step 2~4 순서대로 진행

2. ✅ **사이트 데이터 삭제** (Step 2)

3. ✅ **전체 캐시 삭제** (Step 3)

4. ✅ **하드 리프레시** (Step 4)

---

## 🔍 문제 확인 방법

### Chrome Console에서 확인:

1. `http://localhost:3000/admin/gallery/project-10/upload` 접속
2. **F12** → **Console** 탭
3. `isDragging` 에러 있는지 확인

### Network 탭에서 캐시 비활성화:

1. **F12** → **Network** 탭
2. **"Disable cache"** 체크 ✅
3. 개발자 도구 열린 상태에서는 캐시 비활성화됨

---

## 🛡️ 예방법

개발 중에는:
1. Chrome 개발자 도구 항상 열어두기 (**F12**)
2. **Network** 탭 → **"Disable cache"** 체크
3. 확장 프로그램 최소화

---

## ⚠️ 주의사항

- **반드시 개발 서버가 실행 중**이어야 합니다
- 시크릿 모드가 가장 확실한 테스트 환경입니다
- Chrome 확장 프로그램(특히 번역기, 광고차단기)이 가장 흔한 원인입니다

---

## 📊 로그인 문제 해결

로그인 후 다시 로그인 페이지로 돌아가는 문제는 **localStorage 사용**으로 해결되었습니다.

테스트:
1. Chrome에서 `http://localhost:3000/admin/login` 접속
2. 관리자 버튼 클릭
3. `/admin/projects`로 정상 이동하는지 확인
4. **F12** → **Application** → **Local Storage** → `http://localhost:3000`
5. `mindgraphy_admin_user` 키가 있는지 확인

---

## 🆘 그래도 안 되면?

1. **다른 브라우저 테스트** (Safari, Firefox)
2. **Chrome 프로필 새로 만들기**:
   - Chrome 우측 상단 프로필 아이콘
   - "추가" → 새 프로필 생성
   - 새 프로필에서 테스트

3. **Chrome 완전 재설치** (최후의 수단)

