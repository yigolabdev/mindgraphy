# 🚀 S3 + CloudFront 배포 가이드

**작성일**: 2025년 12월 16일  
**목적**: 온라인 쇼핑몰 S3 배포 (토스페이먼츠 심사용)

---

## 📋 목차

1. [S3 vs Vercel 비교](#s3-vs-vercel-비교)
2. [사전 준비](#사전-준비)
3. [배포 방법](#배포-방법)
4. [비용 분석](#비용-분석)
5. [FAQ](#faq)

---

## 🤔 S3 vs Vercel 비교

### Vercel (추천 ⭐)

**장점**:
- ⚡ **즉시 배포** (5분 내)
- 💰 **완전 무료**
- 🔄 **자동 배포** (GitHub 푸시 시)
- 🎯 **환경변수 UI 관리**
- 📊 **분석 대시보드**
- 🔙 **원클릭 롤백**
- 🔍 **PR 미리보기**

**단점**:
- 없음 (무료 플랜으로 충분)

### S3 + CloudFront

**장점**:
- 💰 **저렴한 비용** ($3-5/월)
- 🏢 **기업 표준 인프라**
- 🌏 **글로벌 CDN**
- 🔧 **완전한 커스터마이징**

**단점**:
- 🔧 **초기 설정 복잡** (30분 소요)
- 📝 **수동 배포** (스크립트 실행)
- ❌ **자동 배포 없음**
- ⚠️ **AWS 지식 필요**

---

## 🎯 권장 사항

### 토스페이먼츠 심사 단계
→ **Vercel 사용** (즉시 배포 가능)

```bash
# 1. Vercel 프로젝트 생성 (5분)
# 2. 환경변수 설정
NEXT_PUBLIC_DEPLOY_MODE=shop

# 3. 배포 완료!
# URL: https://mindgraphy-shop.vercel.app
```

### 정식 운영 단계
→ **Vercel 또는 S3** (취향에 따라)

---

## 📦 사전 준비 (S3 사용 시)

### 1. AWS CLI 설치

```bash
# macOS
brew install awscli

# Windows
choco install awscli

# 확인
aws --version
```

### 2. AWS 인증 설정

```bash
aws configure

# 입력사항:
# AWS Access Key ID: [YOUR_KEY]
# AWS Secret Access Key: [YOUR_SECRET]
# Default region: ap-northeast-2  # 서울
# Default output format: json
```

### 3. 권한 확인

필요한 권한:
- `s3:CreateBucket`
- `s3:PutObject`
- `s3:PutBucketWebsite`
- `s3:PutBucketPolicy`
- `cloudfront:CreateInvalidation` (선택사항)

---

## 🚀 배포 방법

### 방법 A: 자동 스크립트 (추천)

#### Step 1: 인프라 구축 (최초 1회)

```bash
# 실행 권한 부여
chmod +x scripts/setup-s3.sh
chmod +x scripts/deploy-s3-shop.sh

# S3 버킷 생성 및 설정
export S3_BUCKET=mindgraphy-shop
export AWS_REGION=ap-northeast-2

./scripts/setup-s3.sh
```

#### Step 2: CloudFront 생성 (AWS Console)

1. **AWS Console 접속**
   - https://console.aws.amazon.com/cloudfront

2. **Create Distribution 클릭**

3. **Origin 설정**
   ```
   Origin Domain: mindgraphy-shop.s3-website.ap-northeast-2.amazonaws.com
   Protocol: HTTP only
   ```

4. **Viewer 설정**
   ```
   Viewer Protocol Policy: Redirect HTTP to HTTPS
   Allowed HTTP Methods: GET, HEAD
   ```

5. **Cache 설정**
   ```
   Cache Policy: CachingOptimized
   Origin Request Policy: CORS-S3Origin
   ```

6. **Distribution 설정**
   ```
   Price Class: Use Only North America, Europe, Asia
   Default Root Object: index.html
   ```

7. **에러 페이지 설정**
   ```
   Error Code: 404
   Response Page: /404.html
   Response Code: 404
   
   Error Code: 403
   Response Page: /404.html
   Response Code: 404
   ```

8. **생성 완료 후 Distribution ID 저장**
   ```bash
   export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC
   ```

#### Step 3: 배포 실행

```bash
# 환경변수 설정
export S3_BUCKET=mindgraphy-shop
export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC

# 배포 실행
./scripts/deploy-s3-shop.sh
```

#### Step 4: 확인

```bash
# CloudFront URL 접속
https://d111111abcdef8.cloudfront.net/shop

# 또는 커스텀 도메인 (설정한 경우)
https://shop.mindgraphy.com/shop
```

---

### 방법 B: 수동 배포

#### Step 1: 빌드

```bash
# 환경변수 설정
export NEXT_PUBLIC_DEPLOY_MODE=shop

# 빌드
npm run build

# out 폴더 확인
ls -la out/
```

#### Step 2: S3 업로드

```bash
# 정적 파일 업로드 (CSS, JS, 이미지)
aws s3 sync out/ s3://mindgraphy-shop \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"

# HTML 파일 업로드 (캐시 비활성화)
aws s3 sync out/ s3://mindgraphy-shop \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"
```

#### Step 3: CloudFront 캐시 무효화

```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

---

## 💰 비용 분석

### S3 비용

| 항목 | 월 사용량 | 단가 | 월 비용 |
|------|----------|------|---------|
| 스토리지 | 1GB | $0.025/GB | $0.03 |
| GET 요청 | 10,000건 | $0.0004/1,000건 | $0.004 |
| 데이터 전송 | 10GB | $0.126/GB | $1.26 |
| **총계** | - | - | **~$1.30** |

### CloudFront 비용

| 항목 | 월 사용량 | 단가 | 월 비용 |
|------|----------|------|---------|
| 데이터 전송 (한국) | 10GB | $0.126/GB | $1.26 |
| HTTPS 요청 | 10,000건 | $0.01/10,000건 | $0.01 |
| **총계** | - | - | **~$1.27** |

### 합계

- **월 $2.57** (약 3,000원)
- **무료 계층**: 첫 12개월 일부 무료
- **Vercel**: $0 (완전 무료)

---

## 🔐 보안 설정

### 1. S3 버킷 정책

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::mindgraphy-shop/*"
    }
  ]
}
```

### 2. CloudFront HTTPS 강제

```
Viewer Protocol Policy: Redirect HTTP to HTTPS
```

### 3. 커스텀 도메인 SSL

```bash
# AWS Certificate Manager (ACM)에서 인증서 발급
# 1. AWS Console > ACM
# 2. Request Certificate
# 3. Domain: shop.mindgraphy.com
# 4. DNS 검증
# 5. CloudFront에 연결
```

---

## 🎨 커스텀 도메인 설정

### Step 1: ACM 인증서 발급

1. **리전 변경**: us-east-1 (버지니아) - CloudFront용
2. **ACM Console 접속**
3. **Request Certificate**
4. **도메인 입력**: `shop.mindgraphy.com`
5. **DNS 검증**: CNAME 레코드 추가
6. **발급 완료 대기** (5-30분)

### Step 2: CloudFront 설정

```
Alternate Domain Names (CNAMEs):
  shop.mindgraphy.com

SSL Certificate:
  Custom SSL Certificate: [선택한 ACM 인증서]
```

### Step 3: DNS 설정

```
Type: CNAME
Name: shop
Value: d111111abcdef8.cloudfront.net
TTL: 300
```

---

## 🔄 CI/CD 자동화 (선택사항)

### GitHub Actions

```yaml
# .github/workflows/deploy-s3-shop.yml
name: Deploy Shop to S3

on:
  push:
    branches: [main]
    paths:
      - 'app/shop/**'
      - 'components/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          NEXT_PUBLIC_DEPLOY_MODE: shop
        run: npm run build
      
      - name: Deploy to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 sync out/ s3://mindgraphy-shop --delete
      
      - name: Invalidate CloudFront
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## 🐛 문제 해결

### 1. 403 Forbidden

**원인**: S3 버킷 정책 오류

**해결**:
```bash
# 버킷 정책 확인
aws s3api get-bucket-policy --bucket mindgraphy-shop

# 공개 액세스 차단 해제
aws s3api put-public-access-block \
  --bucket mindgraphy-shop \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
```

### 2. 404 Not Found (CloudFront)

**원인**: Error Pages 설정 누락

**해결**:
```
CloudFront > Error Pages 추가
- 404 → /404.html (404)
- 403 → /404.html (404)
```

### 3. 이전 버전 표시

**원인**: CloudFront 캐시

**해결**:
```bash
# 캐시 무효화
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

### 4. 느린 배포

**원인**: CloudFront 전파 시간

**대기 시간**:
- S3: 즉시
- CloudFront: 5-10분

---

## 📊 모니터링

### CloudWatch 알람 설정

```bash
# S3 요청 수 모니터링
aws cloudwatch put-metric-alarm \
  --alarm-name mindgraphy-shop-requests \
  --metric-name NumberOfObjects \
  --namespace AWS/S3 \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold
```

### 비용 알림

1. AWS Billing Console
2. Create Budget
3. Type: Cost Budget
4. Amount: $10
5. Alert: 80% threshold

---

## ❓ FAQ

### Q1: Vercel과 S3 중 어떤 것을 선택해야 하나요?

**A**: 토스페이먼츠 심사 단계에서는 **Vercel**을 추천합니다.
- 즉시 배포 가능 (5분)
- 완전 무료
- 설정 간단

정식 운영 후 S3로 이전 가능합니다.

### Q2: S3 배포 시 middleware가 작동하나요?

**A**: ❌ 아니요. S3는 정적 파일 호스팅만 가능합니다.
- Middleware는 서버 사이드 로직
- S3에서는 작동하지 않음
- 하지만 현재 프로젝트는 **정적 Export**이므로 문제 없음

### Q3: 동적 경로는 어떻게 되나요?

**A**: `next.config.ts`에 `output: 'export'`가 설정되어 있어:
- 모든 페이지가 **빌드 시 정적 생성**
- 동적 경로는 `fallback: false`로 처리
- S3 배포 가능

### Q4: 3개 시스템을 S3에 배포하려면?

**A**: 각각 별도 버킷 생성:
```bash
# 쇼핑몰
S3_BUCKET=mindgraphy-shop ./scripts/deploy-s3-shop.sh

# 고객용
S3_BUCKET=mindgraphy-client ./scripts/deploy-s3-client.sh

# 관리자
S3_BUCKET=mindgraphy-admin ./scripts/deploy-s3-admin.sh
```

### Q5: 배포 URL은 어떻게 되나요?

**S3 직접**:
```
http://mindgraphy-shop.s3-website.ap-northeast-2.amazonaws.com
```

**CloudFront**:
```
https://d111111abcdef8.cloudfront.net
```

**커스텀 도메인**:
```
https://shop.mindgraphy.com
```

---

## 🎯 최종 권장 사항

### 토스페이먼츠 심사용

```bash
# ✅ Vercel 배포 (5분)
1. Vercel 프로젝트 생성
2. NEXT_PUBLIC_DEPLOY_MODE=shop 설정
3. 배포 완료
4. URL 제출: https://mindgraphy-shop.vercel.app/shop
```

### 정식 운영용

**Option A: Vercel (무료)**
- 자동 배포
- 무료 SSL
- 커스텀 도메인
- 분석 대시보드

**Option B: S3 + CloudFront ($3/월)**
- 기업 표준 인프라
- 완전한 제어
- 글로벌 CDN

---

## 📞 지원

문제가 발생하면:
1. 로그 확인: `npm run build` 출력
2. S3 버킷 정책 확인
3. CloudFront 에러 페이지 확인
4. AWS CloudWatch 로그 확인

---

**작성일**: 2025년 12월 16일  
**업데이트**: 필요 시 수시 업데이트
