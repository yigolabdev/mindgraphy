# 🎯 배포 방법 비교 & 추천 (토스페이먼츠 심사용)

**작성일**: 2025년 12월 16일  
**최종 업데이트**: 2025년 12월 16일

---

## 📊 한눈에 보는 비교표

| 항목 | Vercel ⭐ | S3 + CloudFront |
|------|----------|-----------------|
| **배포 시간** | ⚡ **10분** | 🔧 30분 |
| **난이도** | 😊 쉬움 | 😰 중급 |
| **비용** | 💰 **무료** | 💰 월 $3-5 |
| **자동 배포** | ✅ GitHub 푸시 시 | ❌ 수동 스크립트 |
| **환경변수** | ✅ UI 관리 | ⚠️ 빌드 시 주입 |
| **HTTPS** | ✅ 자동 | ✅ CloudFront |
| **커스텀 도메인** | ✅ 무료 | ✅ 무료 |
| **롤백** | ✅ 원클릭 | ❌ 수동 재배포 |
| **PR 미리보기** | ✅ 자동 | ❌ 없음 |
| **분석 대시보드** | ✅ 제공 | ⚠️ CloudWatch 설정 필요 |
| **AWS 지식** | ❌ 불필요 | ✅ 필수 |
| **추천 용도** | 🎯 **모든 단계** | 🏢 기업 인프라 |

---

## 🎯 최종 추천

### 🥇 1순위: Vercel (강력 추천!)

```
✅ 토스페이먼츠 심사용
✅ 정식 운영
✅ 3개 시스템 모두
```

**이유**:
- ⚡ **10분 만에 배포 완료**
- 💰 **완전 무료**
- 🔄 **자동화**로 시간 절약
- 🛡️ **안정성** 검증됨

### 🥈 2순위: S3 + CloudFront (특수한 경우)

```
⚠️ 다음과 같은 경우만 고려
```

**고려 상황**:
- 🏢 회사 정책으로 AWS만 사용 가능
- 🔧 이미 AWS 인프라가 구축됨
- 💼 AWS 전문가가 있음
- 📊 CloudWatch 통합 모니터링 필요

---

## 🚀 빠른 시작 가이드

### Vercel 배포 (10분 완성)

#### 1단계: Vercel 접속 (2분)
```
https://vercel.com
→ GitHub 계정으로 로그인
```

#### 2단계: 프로젝트 생성 (3분)
```
New Project
→ mindgraphy 저장소 선택
→ Import
```

#### 3단계: 설정 (2분)
```
프로젝트명: mindgraphy-shop

환경변수 추가:
  Key:   NEXT_PUBLIC_DEPLOY_MODE
  Value: shop
```

#### 4단계: 배포 (3분)
```
Deploy 버튼 클릭
→ 자동 빌드 및 배포
→ 완료!
```

#### 5단계: 확인 및 제출
```
https://mindgraphy-shop.vercel.app/shop
→ 토스페이먼츠 심사 제출
```

**상세 가이드**: `VERCEL_DEPLOYMENT_GUIDE.md` 참고

---

### S3 배포 (30분 설정)

#### 1단계: AWS CLI 설정 (5분)
```bash
brew install awscli
aws configure
```

#### 2단계: 인프라 구축 (10분)
```bash
export S3_BUCKET=mindgraphy-shop
./scripts/setup-s3.sh
```

#### 3단계: CloudFront 생성 (10분)
```
AWS Console에서 수동 생성
→ DEPLOYMENT_STRATEGY.md 참고
```

#### 4단계: 배포 (5분)
```bash
export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
./scripts/deploy-s3-shop.sh
```

**상세 가이드**: `S3_DEPLOYMENT_GUIDE.md` 참고

---

## 💰 비용 비교

### Vercel

```
월 비용: $0 (무료)

무료 플랜 포함:
- 무제한 배포
- 100GB 대역폭
- 무제한 프로젝트
- 커스텀 도메인
- SSL 인증서
- 분석 대시보드
```

**연 비용**: **$0**

### S3 + CloudFront

```
월 비용: 약 $3-5

비용 구성:
- S3 스토리지: $0.03/GB
- S3 요청: $0.0004/1,000건
- CloudFront 전송: $0.126/GB
- CloudFront 요청: $0.01/10,000건

트래픽이 증가하면:
- 월 $10-50 (중간 트래픽)
- 월 $100-500 (높은 트래픽)
```

**연 비용**: **$36-60** (최소)

### 비용 절감

```
Vercel 선택 시:
연간 약 5만원 절약 ✅
```

---

## ⚡ 속도 비교

### 배포 속도

| 단계 | Vercel | S3 + CloudFront |
|------|--------|-----------------|
| **초기 설정** | 5분 | 20분 |
| **첫 배포** | 3분 | 10분 |
| **이후 배포** | 2분 | 5분 |
| **자동화** | ✅ 자동 | ⚠️ 스크립트 |

### 글로벌 성능

**Vercel**:
- 🌏 전 세계 100+ 엣지 로케이션
- ⚡ 자동 CDN
- 🔄 Smart Caching

**CloudFront**:
- 🌏 전 세계 400+ 엣지 로케이션
- ⚡ 수동 캐시 설정
- 🔄 커스텀 캐싱

**결론**: 성능은 거의 동일

---

## 🔐 보안 비교

### Vercel

```
✅ DDoS 보호 (자동)
✅ SSL 인증서 (자동 발급/갱신)
✅ Edge Firewall
✅ 자동 보안 헤더
```

### S3 + CloudFront

```
✅ DDoS 보호 (CloudFront)
✅ SSL 인증서 (ACM)
⚠️ WAF 추가 비용
⚠️ 보안 헤더 수동 설정
```

**결론**: Vercel이 더 간편

---

## 🛠️ 유지보수 비교

### Vercel

```
✅ 자동 배포 (GitHub 푸시 시)
✅ 원클릭 롤백
✅ PR 미리보기
✅ 분석 대시보드
✅ 실시간 로그
✅ 이슈 알림
```

**개발자 시간**: 거의 0

### S3 + CloudFront

```
❌ 수동 배포 (스크립트 실행)
❌ 수동 롤백 (재배포)
❌ 미리보기 없음
⚠️ CloudWatch 설정 필요
⚠️ 로그 분석 복잡
⚠️ 알림 수동 설정
```

**개발자 시간**: 주 1-2시간

---

## 🎨 3개 시스템 배포 방법

### 시나리오: 독립적인 3개 URL

```
1. 쇼핑몰: shop.mindgraphy.com
2. 고객용: booking.mindgraphy.com
3. 관리자: admin.mindgraphy.com
```

### Vercel 방식 (추천)

```bash
# 1. 쇼핑몰
프로젝트: mindgraphy-shop
환경변수: NEXT_PUBLIC_DEPLOY_MODE=shop
도메인: shop.mindgraphy.com

# 2. 고객용
프로젝트: mindgraphy-client
환경변수: NEXT_PUBLIC_DEPLOY_MODE=client
도메인: booking.mindgraphy.com

# 3. 관리자
프로젝트: mindgraphy-admin
환경변수: NEXT_PUBLIC_DEPLOY_MODE=admin
도메인: admin.mindgraphy.com
```

**소요 시간**: 30분 (10분 × 3)  
**비용**: $0

### S3 방식

```bash
# 1. 쇼핑몰
버킷: mindgraphy-shop
CloudFront: E1111111111111
도메인: shop.mindgraphy.com

# 2. 고객용
버킷: mindgraphy-client
CloudFront: E2222222222222
도메인: booking.mindgraphy.com

# 3. 관리자
버킷: mindgraphy-admin
CloudFront: E3333333333333
도메인: admin.mindgraphy.com
```

**소요 시간**: 90분 (30분 × 3)  
**비용**: $9-15/월

---

## 📝 체크리스트

### 토스페이먼츠 심사 전

#### Vercel 사용 시

- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] 프로젝트 생성: `mindgraphy-shop`
- [ ] 환경변수 설정: `NEXT_PUBLIC_DEPLOY_MODE=shop`
- [ ] 배포 완료
- [ ] `/shop` 접근 확인
- [ ] `/admin`, `/c` 차단 확인
- [ ] 결제 테스트 완료
- [ ] URL 제출: `https://mindgraphy-shop.vercel.app/shop`

#### S3 사용 시

- [ ] AWS 계정 준비
- [ ] AWS CLI 설치 및 설정
- [ ] S3 버킷 생성
- [ ] CloudFront 배포 생성
- [ ] SSL 인증서 발급 (ACM)
- [ ] 배포 스크립트 실행
- [ ] 도메인 연결
- [ ] 접근 테스트
- [ ] 결제 테스트 완료
- [ ] URL 제출

---

## 🎯 최종 결론

### 토스페이먼츠 심사용

```
→ Vercel 사용 (강력 추천!)
```

**이유**:
1. ⚡ **10분 만에 완료**
2. 💰 **완전 무료**
3. 😊 **설정 간단**
4. 🔄 **자동 배포**
5. 🛡️ **안정적**

### 정식 운영

```
→ Vercel 계속 사용 (추천)
```

**이유**:
- 무료 플랜으로 충분
- 트래픽 증가해도 무료
- 유지보수 시간 0
- 개발에 집중 가능

### S3 고려 시점

```
→ 다음 상황에만 고려
```

1. 회사 정책으로 AWS만 가능
2. 이미 AWS 인프라 존재
3. 월 트래픽 1TB 이상 (Vercel 유료 플랜 필요 시)
4. 특수한 커스터마이징 필요

---

## 📚 관련 문서

### Vercel 배포

- **VERCEL_DEPLOYMENT_GUIDE.md**: 상세한 단계별 가이드
  * 10분 완성 배포 가이드
  * 스크린샷처럼 상세한 설명
  * 문제 해결 FAQ

### S3 배포

- **S3_DEPLOYMENT_GUIDE.md**: S3 + CloudFront 가이드
  * 인프라 구축 방법
  * 배포 스크립트 사용법
  * 비용 분석

### 다중 시스템 배포

- **DEPLOYMENT_STRATEGY.md**: 배포 전략 문서
  * 3가지 배포 방안 비교
  * 장기 로드맵
  * 모노레포 마이그레이션

---

## 🚀 바로 시작하기

### Vercel로 시작 (10분)

```bash
# 1. Vercel 접속
https://vercel.com

# 2. GitHub 로그인

# 3. New Project → mindgraphy 저장소

# 4. 환경변수 추가
NEXT_PUBLIC_DEPLOY_MODE=shop

# 5. Deploy 클릭

# 6. 완료!
https://mindgraphy-shop.vercel.app/shop
```

### 다음 단계

1. ✅ 배포 확인
2. ✅ 결제 테스트
3. ✅ 토스페이먼츠 제출
4. ⏳ 심사 대기
5. 🎉 승인 후 정식 오픈

---

## 💬 FAQ

### Q1: Vercel이 정말 무료인가요?

**A**: 네! 개인 및 소규모 프로젝트는 영구 무료입니다.

무료 플랜 포함 내용:
- 무제한 배포
- 100GB 대역폭/월
- 1억 Edge 요청/월
- 커스텀 도메인
- SSL 인증서

**충분히 사용 가능합니다!**

### Q2: 나중에 S3로 이전할 수 있나요?

**A**: 네, 언제든지 가능합니다.

```bash
# 동일한 코드로 S3 배포 가능
./scripts/deploy-s3-shop.sh
```

현재 코드는 `output: 'export'`로 설정되어
Vercel과 S3 모두 호환됩니다.

### Q3: 3개 시스템 모두 Vercel 무료인가요?

**A**: 네! 3개 프로젝트 모두 무료입니다.

```
✅ mindgraphy-shop (무료)
✅ mindgraphy-client (무료)
✅ mindgraphy-admin (무료)
```

### Q4: 토스페이먼츠 심사에 Vercel URL로 제출 가능한가요?

**A**: 네, 가능합니다!

토스페이먼츠는 테스트 가능한 URL만 있으면 됩니다.
Vercel URL로 제출 후, 승인 후 커스텀 도메인 연결 가능.

### Q5: Vercel이 느리지 않나요?

**A**: 아니요, 매우 빠릅니다!

- 글로벌 CDN
- Edge 캐싱
- 자동 최적화
- CloudFront와 동등한 성능

---

## 📞 지원

### 문제 발생 시

1. **VERCEL_DEPLOYMENT_GUIDE.md** 확인
2. 빌드 로그 확인: `npm run build`
3. Vercel 대시보드 로그 확인
4. 질문: 언제든 문의하세요!

---

**최종 업데이트**: 2025년 12월 16일  
**권장 사항**: Vercel 사용 ⭐

🎉 **행운을 빕니다!**
