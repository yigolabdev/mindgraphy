"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Star, Shield, Check } from "lucide-react";
import Link from "next/link";
import { mockShopProducts } from "@/lib/mock/shop-products";
import { cn } from "@/lib/utils";

export default function ShopHomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const featuredProducts = mockShopProducts
    .filter(p => p.tags.includes("인기") || p.tags.includes("추천"))
    .slice(0, 3);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className={cn(
        "relative py-24 transition-all duration-1000 ease-out",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-light text-zinc-900 tracking-tight leading-tight">
                당신의 특별한 순간을<br />
                아름답게 기록합니다
              </h1>
              <p className="text-lg text-zinc-600 leading-relaxed font-light">
                프리미엄 웨딩 촬영부터 감동적인 영상까지<br />
                MindGraphy와 함께 평생 간직할 추억을 만드세요
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/shop/products">
                <Button 
                  size="lg" 
                  className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
                >
                  상품 둘러보기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/shop/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-14 px-8 border-2 border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300 active:scale-[0.98]"
                >
                  회사소개
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="border-t border-zinc-200"></div>
      </div>

      {/* 주요 서비스 */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
              왜 MindGraphy를 선택해야 할까요?
            </h2>
            <p className="text-sm text-zinc-500 font-light">
              차별화된 서비스로 소중한 순간을 완벽하게 담아드립니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center space-y-4 p-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="font-medium text-zinc-900">전문 작가진</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                10년 이상 경력의<br />베테랑 작가들
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="font-medium text-zinc-900">프리미엄 품질</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                최신 장비와<br />전문 보정
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="font-medium text-zinc-900">고객 만족도 99%</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                5,000건 이상의<br />촬영 경험
              </p>
            </div>

            <div className="text-center space-y-4 p-6">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="font-medium text-zinc-900">안전한 결제</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                에스크로<br />구매 보호
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="border-t border-zinc-200"></div>
      </div>

      {/* 인기 상품 */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-light text-zinc-900 tracking-tight">인기 상품</h2>
            <p className="text-sm text-zinc-500 font-light">
              가장 많은 사랑을 받고 있는 촬영 패키지
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {featuredProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/shop/products/${product.id}`}
                className="group"
              >
                <div className="bg-white border-2 border-zinc-200 hover:border-zinc-900 transition-all duration-300 overflow-hidden">
                  <div
                    className="aspect-[4/3] bg-zinc-100 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-light">
                        {product.categoryLabel}
                      </span>
                      {product.tags.includes("인기") && (
                        <span className="text-xs bg-zinc-900 text-white px-2 py-0.5 rounded">
                          인기
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-lg text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {product.shortName}
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed font-light line-clamp-2">
                      {product.description}
                    </p>
                    <div className="pt-2">
                      <span className="text-2xl font-light text-zinc-900">
                        {product.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop/products">
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 border-2 border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 transition-all duration-300"
              >
                전체 상품 보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="border-t border-zinc-200"></div>
      </div>

      {/* CTA 섹션 */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed font-light">
                특별한 순간을 영원히 간직할 수 있도록 도와드립니다
              </p>
            </div>
            <Link href="/shop/products">
              <Button 
                size="lg"
                className="h-14 px-8 bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
              >
                상품 둘러보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="border-t border-zinc-200"></div>
      </div>

      {/* 서비스 안내 */}
      <section className="py-24 bg-zinc-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl font-light text-zinc-900">100+</div>
                <p className="text-sm text-zinc-600 font-light">매월 진행되는 촬영</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-light text-zinc-900">5,000+</div>
                <p className="text-sm text-zinc-600 font-light">누적 촬영 고객</p>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-light text-zinc-900">99%</div>
                <p className="text-sm text-zinc-600 font-light">고객 만족도</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
