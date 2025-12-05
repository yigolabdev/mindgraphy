# 🔐 GitHub Actions AWS Credentials 설정 가이드

## 🐛 에러 메시지
```
Error: Credentials could not be loaded, please check your action inputs: 
Could not load credentials from any providers
```

---

## 🔍 원인

GitHub Actions에서 AWS에 접근하기 위한 **자격 증명(Credentials)**이 설정되지 않았습니다.

---

## ✅ 해결 방법: GitHub Secrets 설정

### 1️⃣ AWS 자격 증명 확인

다음 정보가 필요합니다:

#### 필수 정보
- **AWS_ACCESS_KEY_ID**: AWS IAM 사용자의 Access Key
- **AWS_SECRET_ACCESS_KEY**: AWS IAM 사용자의 Secret Key
- **AWS_REGION**: S3 버킷이 있는 리전 (예: `ap-northeast-2`)

#### 선택 정보
- **S3_BUCKET_NAME**: S3 버킷 이름 (예: `mindgraphy-frontend`)

---

### 2️⃣ AWS IAM 사용자 생성 (아직 없는 경우)

#### AWS Console에서:

1. **IAM 콘솔 접속**
   - https://console.aws.amazon.com/iam/

2. **사용자 생성**
   - 왼쪽 메뉴 → Users → Create user
   - 사용자 이름: `github-actions-deploy`

3. **권한 설정**
   - Attach policies directly
   - 정책: `AmazonS3FullAccess` 선택
   - (또는 특정 버킷만 접근하는 커스텀 정책)

4. **Access Key 생성**
   - 사용자 생성 후 → Security credentials 탭
   - Create access key
   - Use case: CLI/SDK 선택
   - **Access Key ID**와 **Secret Access Key** 복사 (한 번만 표시됨!)

---

### 3️⃣ GitHub Secrets 추가

#### GitHub Repository에서:

1. **Settings 메뉴로 이동**
   - https://github.com/yigolabdev/mindgraphy/settings

2. **Secrets and variables 클릭**
   - 왼쪽 메뉴 → Secrets and variables → Actions

3. **New repository secret 클릭**

4. **다음 Secrets 추가**:

   **Secret 1: AWS_ACCESS_KEY_ID**
   ```
   Name: AWS_ACCESS_KEY_ID
   Value: [AWS에서 받은 Access Key ID]
   ```
   → Add secret

   **Secret 2: AWS_SECRET_ACCESS_KEY**
   ```
   Name: AWS_SECRET_ACCESS_KEY
   Value: [AWS에서 받은 Secret Access Key]
   ```
   → Add secret

   **Secret 3: AWS_REGION**
   ```
   Name: AWS_REGION
   Value: ap-northeast-2
   ```
   → Add secret

   **Secret 4: S3_BUCKET_NAME** (선택)
   ```
   Name: S3_BUCKET_NAME
   Value: mindgraphy-frontend
   ```
   → Add secret

---

### 4️⃣ Secrets 확인

추가 후 다음과 같이 표시되어야 합니다:

```
Repository secrets:
- AWS_ACCESS_KEY_ID          Updated 1 minute ago
- AWS_SECRET_ACCESS_KEY      Updated 1 minute ago
- AWS_REGION                 Updated 1 minute ago
- S3_BUCKET_NAME             Updated 1 minute ago
```

---

## 🔒 보안 권장사항

### 1. 최소 권한 원칙
IAM 정책을 특정 버킷으로 제한:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::mindgraphy-frontend",
        "arn:aws:s3:::mindgraphy-frontend/*"
      ]
    }
  ]
}
```

### 2. Access Key 관리
- ✅ GitHub Secrets에만 저장 (절대 코드에 포함하지 않기)
- ✅ 정기적으로 키 교체 (90일마다)
- ✅ 사용하지 않는 키는 즉시 삭제

### 3. CloudFront 사용 권장
- S3 직접 노출보다 CloudFront 사용
- HTTPS 자동 제공
- 캐싱으로 성능 향상

---

## 🚀 설정 후 테스트

### 1. Actions 다시 실행
```
GitHub → Actions → 실패한 워크플로우 → Re-run jobs
```

### 2. 성공 확인
```
✓ Configure AWS Credentials
✓ Build Next.js
✓ Deploy to S3
✓ Invalidate CloudFront (선택)
```

---

## 📋 체크리스트

설정 전 확인:

- [ ] AWS IAM 사용자 생성됨
- [ ] S3 버킷 생성됨 (public access 설정)
- [ ] Access Key ID 복사함
- [ ] Secret Access Key 복사함 (재발급 불가!)
- [ ] GitHub Secrets 4개 추가 완료
- [ ] Actions 워크플로우 다시 실행

---

## 💡 필요한 정보 요약

다음 정보를 준비하세요:

1. **AWS_ACCESS_KEY_ID** - IAM 사용자의 Access Key
2. **AWS_SECRET_ACCESS_KEY** - IAM 사용자의 Secret Key
3. **AWS_REGION** - S3 버킷 리전 (예: `ap-northeast-2`)
4. **S3_BUCKET_NAME** - S3 버킷 이름 (예: `mindgraphy-frontend`)

이 4가지 정보를 GitHub Secrets에 추가하면 자동 배포가 작동합니다!

---

## 🆘 추가 도움이 필요하신가요?

AWS 계정이나 IAM 사용자가 없으시다면:
1. AWS 계정 생성 필요
2. IAM 사용자 생성 필요
3. S3 버킷 생성 필요

설정 방법을 더 자세히 안내해 드릴까요?

---

**작성일**: 2025-12-05  
**상태**: GitHub Secrets 설정 대기 중

