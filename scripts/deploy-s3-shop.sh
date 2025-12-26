#!/bin/bash

# 🛍️ 쇼핑몰 S3 배포 스크립트
# 사용법: ./scripts/deploy-s3-shop.sh

set -e  # 에러 발생 시 중단

echo "🛍️  Mindgraphy 쇼핑몰 S3 배포 시작..."
echo ""

# 환경변수 확인
if [ -z "$AWS_REGION" ]; then
  export AWS_REGION="ap-northeast-2"  # 서울 리전
fi

if [ -z "$S3_BUCKET" ]; then
  echo "❌ 오류: S3_BUCKET 환경변수가 설정되지 않았습니다."
  echo "   예시: export S3_BUCKET=mindgraphy-shop"
  exit 1
fi

if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "⚠️  경고: CLOUDFRONT_DISTRIBUTION_ID가 설정되지 않았습니다."
  echo "   CloudFront 캐시 무효화를 건너뜁니다."
  SKIP_CLOUDFRONT=true
fi

# 1단계: 쇼핑몰 전용 빌드
echo "📦 1단계: 쇼핑몰 전용 빌드 중..."
export NEXT_PUBLIC_DEPLOY_MODE=shop
export NEXT_PUBLIC_APP_URL=https://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com

npm run build

if [ ! -d "out" ]; then
  echo "❌ 오류: out 폴더가 생성되지 않았습니다."
  exit 1
fi

echo "✅ 빌드 완료!"
echo ""

# 2단계: S3 업로드
echo "☁️  2단계: S3 버킷에 업로드 중..."
echo "   버킷: s3://${S3_BUCKET}"

aws s3 sync out/ s3://${S3_BUCKET} \
  --region ${AWS_REGION} \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"

# HTML 파일은 캐시 비활성화
aws s3 sync out/ s3://${S3_BUCKET} \
  --region ${AWS_REGION} \
  --delete \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

echo "✅ S3 업로드 완료!"
echo ""

# 3단계: CloudFront 캐시 무효화
if [ "$SKIP_CLOUDFRONT" != "true" ]; then
  echo "🌐 3단계: CloudFront 캐시 무효화 중..."
  
  INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)
  
  echo "   무효화 ID: ${INVALIDATION_ID}"
  echo "✅ CloudFront 캐시 무효화 완료!"
  echo ""
fi

# 4단계: 배포 URL 출력
echo "🎉 배포 완료!"
echo ""
echo "📍 배포 URL:"
if [ "$SKIP_CLOUDFRONT" != "true" ]; then
  echo "   https://${S3_BUCKET}.cloudfront.net"
  echo "   (CloudFront 전파까지 5-10분 소요)"
else
  echo "   http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
fi
echo ""
echo "🔍 다음 URL에서 확인하세요:"
echo "   /shop"
echo "   /shop/products"
echo ""
echo "✅ 토스페이먼츠 심사 제출 준비 완료!"
