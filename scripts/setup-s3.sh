#!/bin/bash

# 🔧 S3 + CloudFront 인프라 구축 스크립트
# 사용법: ./scripts/setup-s3.sh

set -e

echo "🔧 S3 + CloudFront 인프라 구축 시작..."
echo ""

# 환경변수 확인
if [ -z "$AWS_REGION" ]; then
  export AWS_REGION="ap-northeast-2"
fi

if [ -z "$S3_BUCKET" ]; then
  echo "버킷 이름을 입력하세요 (예: mindgraphy-shop):"
  read S3_BUCKET
  export S3_BUCKET
fi

echo "사용할 설정:"
echo "  리전: ${AWS_REGION}"
echo "  버킷: ${S3_BUCKET}"
echo ""

# 1단계: S3 버킷 생성
echo "📦 1단계: S3 버킷 생성..."

aws s3 mb s3://${S3_BUCKET} --region ${AWS_REGION} || echo "버킷이 이미 존재합니다."

# 2단계: 정적 웹사이트 호스팅 활성화
echo "🌐 2단계: 정적 웹사이트 호스팅 활성화..."

cat > /tmp/website-config.json <<EOF
{
  "IndexDocument": {
    "Suffix": "index.html"
  },
  "ErrorDocument": {
    "Key": "404.html"
  }
}
EOF

aws s3api put-bucket-website \
  --bucket ${S3_BUCKET} \
  --website-configuration file:///tmp/website-config.json

# 3단계: 버킷 정책 설정 (공개 읽기)
echo "🔓 3단계: 버킷 정책 설정..."

cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${S3_BUCKET}/*"
    }
  ]
}
EOF

# 공개 액세스 차단 비활성화
aws s3api put-public-access-block \
  --bucket ${S3_BUCKET} \
  --public-access-block-configuration \
  "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

aws s3api put-bucket-policy \
  --bucket ${S3_BUCKET} \
  --policy file:///tmp/bucket-policy.json

echo "✅ S3 설정 완료!"
echo ""

# 4단계: CloudFront 배포 생성
echo "☁️  4단계: CloudFront 배포 생성..."
echo ""
echo "CloudFront는 AWS Console에서 수동으로 생성하는 것을 권장합니다:"
echo ""
echo "1. AWS Console > CloudFront > Create Distribution"
echo "2. Origin Domain: ${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
echo "3. Protocol: HTTP only (S3 웹사이트 엔드포인트)"
echo "4. Viewer Protocol: Redirect HTTP to HTTPS"
echo "5. Price Class: Use Only North America, Europe, Asia (권장)"
echo "6. Alternate Domain Names (CNAME): shop.mindgraphy.com (선택사항)"
echo "7. SSL Certificate: Request ACM Certificate (선택사항)"
echo "8. Default Root Object: index.html"
echo "9. Error Pages:"
echo "   - 404 → /404.html (404)"
echo "   - 403 → /404.html (404)"
echo ""
echo "생성 후 Distribution ID를 저장하세요:"
echo "  export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC"
echo ""

# 5단계: 완료
echo "🎉 S3 인프라 구축 완료!"
echo ""
echo "📍 S3 웹사이트 URL:"
echo "   http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
echo ""
echo "다음 단계:"
echo "1. CloudFront 배포 생성 (위 가이드 참고)"
echo "2. 배포 스크립트 실행:"
echo "   export S3_BUCKET=${S3_BUCKET}"
echo "   export CLOUDFRONT_DISTRIBUTION_ID=E1234567890ABC"
echo "   ./scripts/deploy-s3-shop.sh"
echo ""
