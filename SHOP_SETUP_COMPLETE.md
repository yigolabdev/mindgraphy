# 결제 시스템 심사용 사이트 초기 셋팅 완료

## 📋 개요

결제 시스템 PG 연동 심사를 위한 별도 사이트가 성공적으로 생성되었습니다.  
기존 Mindgraphy 프로젝트와 완전히 분리되어 독립적으로 배포 가능합니다.

---

## 🏗️ 생성된 파일 구조

```
mindgraphy/
├── app/
│   └── (shop)/                    # 결제 시스템 전용 라우트 그룹
│       ├── layout.tsx                # 독립 레이아웃
│       └── shop/
│           └── page.tsx              # 메인 홈페이지
│
├── lib/
│   └── config/
│       └── shop.config.ts         # 결제 시스템 설정
│
├── scripts/
│   └── deploy-split.sh               # 배포 스크립트 (shop 추가)
│
└── package.json                      # deploy:shop 스크립트 추가
```

---

## 🎯 사이트 구성

### 1. 홈페이지 (`/shop`)
- **위치**: `app/(shop)/shop/page.tsx`
- **기능**: 3개 사이트 구분 소개
  - 🛍️ **고객용 페이지**: 일반 고객 결제 페이지
  - 🔐 **내부업무 시스템**: 관리자 대시보드
  - 💳 **결제 시스템 데모**: 현재 페이지 (심사용)

### 2. 특징
- ✅ 독립된 레이아웃 (기존 사이트와 분리)
- ✅ 검색 엔진 노출 방지 (`noindex, nofollow`)
- ✅ 반응형 디자인
- ✅ 3개 사이트 구분 카드 UI
- ✅ 심사 목적 명시

---

## 🚀 배포 방법

### 1. 독립 배포
```bash
# 결제 시스템 사이트만 배포
npm run deploy:shop
```

### 2. 전체 배포
```bash
# 모든 사이트 동시 배포 (www, portal, admin, shop)
npm run deploy
```

### 3. S3 배포 설정
```bash
# 환경 변수 설정 필요
export SHOP_BUCKET=mindgraphy-shop
export SHOP_DISTRIBUTION=your-cloudfront-id  # 선택
```

---

## 🔧 환경 변수 설정

`.env.local` 파일 생성 후 다음 변수 추가:

```bash
# 결제 시스템 테스트 키
NEXT_PUBLIC_TOSS_CLIENT_KEY_TEST=test_ck_XXX
TOSS_SECRET_KEY_TEST=test_sk_XXX

# 결제 시스템 실제 키 (심사 승인 후)
NEXT_PUBLIC_TOSS_CLIENT_KEY_LIVE=live_ck_XXX
TOSS_SECRET_KEY_LIVE=live_sk_XXX

# 환경 설정
NEXT_PUBLIC_TOSS_ENV=test

# 사이트 URL
NEXT_PUBLIC_SHOP_URL=https://shop.mindgraphy.com

# S3 버킷
SHOP_BUCKET=mindgraphy-shop
```

---

## 📍 접속 URL

### 로컬 개발 환경
```
http://localhost:3000/shop
```

### 프로덕션 환경 (배포 후)
```
https://shop.mindgraphy.com/shop
또는
https://your-s3-bucket.s3-website.region.amazonaws.com/shop
```

---

## 🎨 디자인 시스템

### 색상 구성
- **블루** (`blue-600`): 고객용 페이지
- **퍼플** (`purple-600`): 내부업무 시스템
- **그린** (`green-600`): 결제 시스템 데모 (현재)

### UI 컴포넌트
- `shadcn/ui` 기반 Card, Button
- `lucide-react` 아이콘
- Tailwind CSS 반응형

---

## 📦 다음 단계

### 1. 추가 페이지 개발 (사용자 정보 제공 후)
```
/shop/public       → 고객용 쇼핑몰
/shop/admin        → 관리자 대시보드
/shop/checkout     → 결제 페이지
/shop/success      → 결제 성공
/shop/fail         → 결제 실패
```

### 2. 결제 시스템 SDK 연동
- Checkout SDK 설치
- 결제 위젯 구현
- 웹훅 처리

### 3. AWS 인프라 구축
- S3 버킷 생성: `mindgraphy-shop`
- CloudFront 배포 (선택)
- Route 53 도메인 연결

---

## ✅ 완료된 작업

- [x] 디렉토리 구조 생성
- [x] 기본 레이아웃 구현
- [x] 홈페이지 UI 개발
- [x] 독립 배포 스크립트 설정
- [x] NPM 스크립트 추가
- [x] 설정 파일 생성
- [x] 라우팅 구조 확립

---

## 🔗 관련 파일

| 파일 | 설명 |
|------|------|
| `app/(shop)/layout.tsx` | 결제 시스템 전용 레이아웃 |
| `app/(shop)/shop/page.tsx` | 메인 홈페이지 |
| `lib/config/shop.config.ts` | 설정 파일 |
| `scripts/deploy-split.sh` | 배포 스크립트 |
| `package.json` | NPM 스크립트 |

---

## 📞 현재 상태

✅ **초기 셋팅 완료**  
🎯 **다음 정보 필요**: 사이트 구체적인 요구사항, 상품 정보, 디자인 가이드

---

**생성일**: 2024-12-24  
**버전**: 1.0.0  
**상태**: 준비 완료 ✅
