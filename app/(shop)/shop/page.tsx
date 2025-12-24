"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Heart, Camera, Shield, Package, Truck, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { mockShopProducts } from "@/lib/mock/shop-products";

/**
 * 토스페이먼츠 심사용 메인 홈페이지
 * 실제 커머스 사이트 형태
 */
export default function ShopHomePage() {
  const featuredProducts = mockShopProducts.filter(p => p.tags.includes("인기") || p.tags.includes("추천")).slice(0, 3);

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              당신의 특별한 순간을<br />아름답게 기록합니다
            </h1>
            <p className="text-xl mb-8 text-white/90">
              프리미엄 웨딩 촬영부터 감동적인 영상까지<br />
              MindGraphy와 함께 평생 간직할 추억을 만드세요
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/shop/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  상품 둘러보기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/shop/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  회사소개
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* 스크롤 표시 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* 주요 서비스 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">왜 MindGraphy를 선택해야 할까요?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">전문 작가진</h3>
                <p className="text-sm text-gray-600">
                  10년 이상 경력의 베테랑 작가들이 직접 촬영합니다
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">프리미엄 품질</h3>
                <p className="text-sm text-gray-600">
                  최신 장비와 전문 보정으로 최상의 결과물 제공
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">고객 만족도 99%</h3>
                <p className="text-sm text-gray-600">
                  5,000건 이상의 촬영 경험과 높은 고객 만족도
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">안전한 결제</h3>
                <p className="text-sm text-gray-600">
                  전자결제 에스크로로 안전하게 거래하세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 인기 상품 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">인기 상품</h2>
            <p className="text-gray-600">가장 많은 사랑을 받고 있는 촬영 패키지</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => {
              const finalPrice = product.price;

              return (
                <Link key={product.id} href={`/shop/products/${product.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <div 
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      {product.tags.includes("인기") && (
                        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          인기
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-gray-500 mb-2">{product.categoryLabel}</p>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {product.shortName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          {finalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/shop/products">
              <Button size="lg" variant="outline">
                전체 상품 보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 text-white/90">
            특별한 순간을 영원히 간직할 수 있도록 도와드립니다
          </p>
          <Link href="/shop/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              상품 둘러보기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 서비스 안내 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">다양한 패키지</h3>
                <p className="text-sm text-gray-600">
                  예산과 필요에 맞는 다양한 촬영 패키지를 제공합니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">빠른 납품</h3>
                <p className="text-sm text-gray-600">
                  촬영 후 2-3주 내 모든 결과물을 받아보실 수 있습니다
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">전문 상담</h3>
                <p className="text-sm text-gray-600">
                  1:1 맞춤 상담으로 최적의 촬영 플랜을 제안해드립니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
