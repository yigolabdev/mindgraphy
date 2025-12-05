# 🔐 AWS IAM 사용자 생성 완벽 가이드

## 📋 목차
1. [AWS Console 접속](#1-aws-console-접속)
2. [IAM 사용자 생성](#2-iam-사용자-생성)
3. [권한 설정](#3-권한-설정)
4. [Access Key 생성](#4-access-key-생성)
5. [GitHub Secrets 추가](#5-github-secrets-추가)
6. [테스트](#6-테스트)

---

## 1️⃣ AWS Console 접속

### Step 1: AWS Console 로그인
1. 브라우저에서 접속: https://console.aws.amazon.com/
2. AWS 계정으로 로그인

### Step 2: IAM 서비스 이동
1. 상단 검색창에 `IAM` 입력
2. **IAM** 클릭
3. 또는 직접 접속: https://console.aws.amazon.com/iam/

---

## 2️⃣ IAM 사용자 생성

### Step 1: Users 메뉴
1. 왼쪽 메뉴에서 **Users** 클릭
2. 오른쪽 상단 **Create user** 버튼 클릭

### Step 2: 사용자 정보 입력
```
User name: github-actions-deploy
```

### Step 3: AWS access 설정
- ☑️ **Provide user access to the AWS Management Console** - 체크 해제
  (콘솔 접근 불필요, API만 사용)

### Step 4: Next 클릭

---

## 3️⃣ 권한 설정

### Option 1: 간단한 방법 (전체 S3 권한)

1. **Attach policies directly** 선택
2. 검색창에 `S3` 입력
3. **AmazonS3FullAccess** 체크
4. Next 클릭

### Option 2: 보안 권장 (특정 버킷만)

1. **Attach policies directly** 선택
2. **Create policy** 버튼 클릭 (새 탭 열림)
3. JSON 탭 클릭
4. 다음 정책 붙여넣기:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "MindgraphyS3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::wedding-yigo",
        "arn:aws:s3:::wedding-yigo/*"
      ]
    }
  ]
}
```

5. Next → Review policy
6. Policy name: `MindgraphyS3DeployPolicy`
7. Create policy
8. 원래 탭으로 돌아가서 새로고침
9. `MindgraphyS3DeployPolicy` 검색하여 선택

### Step 5: Next → Create user

---

## 4️⃣ Access Key 생성

### Step 1: 사용자 클릭
1. Users 목록에서 **github-actions-deploy** 클릭

### Step 2: Security credentials 탭
1. **Security credentials** 탭 클릭
2. 아래로 스크롤하여 **Access keys** 섹션 찾기

### Step 3: Create access key
1. **Create access key** 버튼 클릭

### Step 4: Use case 선택
- ☑️ **Command Line Interface (CLI)** 선택
- ☑️ 하단 체크박스: "I understand..." 체크
- Next 클릭

### Step 5: 설명 추가 (선택)
```
Description: GitHub Actions deployment for Mindgraphy
```

### Step 6: Create access key 클릭

### Step 7: ⚠️ 중요! 키 정보 복사

**이 화면은 단 한 번만 표시됩니다!**

```
Access key ID: AKIAIOSFODNN7EXAMPLE
Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

✅ **Access key ID** 복사 → 메모장에 저장  
✅ **Secret access key** 복사 → 메모장에 저장

**또는** Download .csv file 클릭하여 저장

### Step 8: Done 클릭

---

## 5️⃣ GitHub Secrets 추가

### Step 1: GitHub 저장소 Settings
1. 브라우저에서 접속:
   ```
   https://github.com/yigolabdev/mindgraphy/settings/secrets/actions
   ```

2. 또는:
   - GitHub 저장소 → Settings 탭
   - 왼쪽 메뉴 → Secrets and variables → Actions

### Step 2: Secret 추가

#### Secret 1: AWS_ACCESS_KEY_ID
1. **New repository secret** 클릭
2. 입력:
   ```
   Name: AWS_ACCESS_KEY_ID
   Secret: [복사한 Access Key ID 붙여넣기]
   ```
3. **Add secret** 클릭

#### Secret 2: AWS_SECRET_ACCESS_KEY
1. **New repository secret** 클릭
2. 입력:
   ```
   Name: AWS_SECRET_ACCESS_KEY
   Secret: [복사한 Secret Access Key 붙여넣기]
   ```
3. **Add secret** 클릭

### Step 3: 확인
Secrets 목록에 다음이 표시되어야 합니다:
```
✅ AWS_ACCESS_KEY_ID          Updated now
✅ AWS_SECRET_ACCESS_KEY      Updated now
```

---

## 6️⃣ Actions 재실행 및 테스트

### Step 1: Actions 탭 이동
```
https://github.com/yigolabdev/mindgraphy/actions
```

### Step 2: 실패한 워크플로우 클릭
- 가장 최근의 "Deploy to S3 (Debug)" 클릭

### Step 3: Re-run jobs
- 오른쪽 상단 **Re-run jobs** 버튼 클릭
- **Re-run failed jobs** 선택

### Step 4: 진행 상황 모니터링
다음 단계들이 순서대로 성공해야 합니다:
```
✓ Checkout repository
✓ Check secrets (디버그)
✓ Setup Node.js
✓ Install dependencies
✓ Build Next.js
✓ Prepare deployment files
✓ Configure AWS credentials  ← 여기서 성공해야 함!
✓ Verify AWS credentials
✓ Deploy to S3
✓ Deployment Summary
```

---

## 📸 스크린샷 가이드

### AWS IAM - Create user
```
┌─────────────────────────────────────┐
│ Create user                         │
├─────────────────────────────────────┤
│ User name: github-actions-deploy    │
│ ☐ Provide user access to the AWS   │
│   Management Console                │
│                                     │
│ [Next]                              │
└─────────────────────────────────────┘
```

### AWS IAM - Access Key 생성
```
┌─────────────────────────────────────┐
│ Access key best practices           │
├─────────────────────────────────────┤
│ ☑ Command Line Interface (CLI)     │
│ ☐ Application running outside AWS   │
│ ☐ Local code                        │
│                                     │
│ ☑ I understand...                  │
│ [Next]                              │
└─────────────────────────────────────┘
```

### GitHub - New secret
```
┌─────────────────────────────────────┐
│ New secret                          │
├─────────────────────────────────────┤
│ Name: AWS_ACCESS_KEY_ID             │
│                                     │
│ Secret: AKIAIOSFODNN7EXAMPLE        │
│                                     │
│ [Add secret]                        │
└─────────────────────────────────────┘
```

---

## 🔒 보안 주의사항

### ⚠️ 절대 하지 말아야 할 것
- ❌ Access Key를 코드에 포함
- ❌ Access Key를 커밋
- ❌ Access Key를 팀 채팅에 공유
- ❌ 스크린샷에 키 노출

### ✅ 안전하게 관리하는 방법
- ✅ GitHub Secrets에만 저장
- ✅ .csv 파일을 안전한 곳에 백업
- ✅ 정기적으로 키 교체 (90일마다)
- ✅ 불필요한 키는 즉시 삭제

---

## 🆘 문제 해결

### Q: Access Key 생성 버튼이 비활성화됨
A: IAM 사용자 생성 시 콘솔 접근을 활성화했을 수 있습니다. Security credentials 탭에서 생성 가능합니다.

### Q: Secret을 잘못 입력했어요
A: GitHub Secrets → 해당 Secret 클릭 → Update secret으로 수정

### Q: Access Key를 잃어버렸어요
A: Secret Access Key는 재발급 불가! 새 Access Key를 생성하고 기존 키는 삭제하세요.

---

## ✅ 완료 체크리스트

설정 완료 확인:

- [ ] AWS Console 로그인 완료
- [ ] IAM 사용자 `github-actions-deploy` 생성 완료
- [ ] S3 권한 부여 완료
- [ ] Access Key 생성 완료
- [ ] **Access Key ID 복사** (메모장에 저장)
- [ ] **Secret Access Key 복사** (메모장에 저장)
- [ ] GitHub → Settings → Secrets 이동
- [ ] `AWS_ACCESS_KEY_ID` Secret 추가 완료
- [ ] `AWS_SECRET_ACCESS_KEY` Secret 추가 완료
- [ ] Actions 워크플로우 재실행

---

**다음**: 위 체크리스트를 완료하시면 자동 배포가 작동합니다! 🚀

필요하신 부분이 있으면 언제든 말씀해 주세요!

