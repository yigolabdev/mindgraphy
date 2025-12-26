"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Camera, Target, Award, Users, TrendingUp, Calendar } from "lucide-react";

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* 페이지 헤더 */}
      <div className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-light text-zinc-900 tracking-tight">
              About Us
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed font-light">
              당신의 특별한 순간을 아름답게 기록합니다
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-24">
          {/* 회사 소개 */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                MindGraphy
              </h2>
              <p className="text-base text-zinc-600 leading-relaxed font-light max-w-2xl mx-auto">
                MindGraphy는 2026년 설립된 프리미엄 웨딩 촬영 전문 기업입니다.
                고객님의 소중한 순간을 가장 아름답고 감동적으로 담아내기 위해
                최선을 다하고 있습니다.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 비전 & 미션 */}
          <section className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center">
                <Target className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-light text-zinc-900 tracking-tight">비전</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                대한민국을 대표하는 웨딩 촬영 브랜드로 성장하여,
                모든 커플들이 평생 간직할 수 있는 아름다운 추억을 
                만들어드리는 것이 우리의 비전입니다.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center">
                <Camera className="w-7 h-7 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-light text-zinc-900 tracking-tight">미션</h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                최고의 기술력과 감성적인 접근으로 고객님의 특별한 순간을
                완벽하게 담아내며, 전문성과 진정성을 바탕으로 한
                최상의 서비스를 제공합니다.
              </p>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 핵심 가치 */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                핵심 가치
              </h2>
              <p className="text-sm text-zinc-500 font-light">
                우리가 가장 중요하게 생각하는 것들
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 p-6">
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-7 h-7 text-zinc-700" />
                </div>
                <h4 className="font-medium text-zinc-900">전문성</h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  10년 이상의 경력을 가진 전문 작가진이
                  최상의 결과물을 보장합니다
                </p>
              </div>

              <div className="text-center space-y-4 p-6">
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7 text-zinc-700" />
                </div>
                <h4 className="font-medium text-zinc-900">고객 중심</h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  고객님의 니즈를 최우선으로 생각하며
                  맞춤형 서비스를 제공합니다
                </p>
              </div>

              <div className="text-center space-y-4 p-6">
                <div className="w-14 h-14 bg-zinc-100 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-7 h-7 text-zinc-700" />
                </div>
                <h4 className="font-medium text-zinc-900">혁신</h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-light">
                  최신 트렌드와 기술을 끊임없이 연구하며
                  더 나은 서비스를 제공합니다
                </p>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 연혁 */}
          <section className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-zinc-900 tracking-tight">
                연혁
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-medium text-zinc-900">2026년</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="w-2 h-2 bg-zinc-900 rounded-full"></div>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed">
                    (주)마인드그라피 법인 설립<br />
                    온라인 웨딩 촬영 플랫폼 오픈
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-medium text-zinc-900">2025년</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed">
                    누적 고객 5,000명 돌파<br />
                    우수 웨딩 서비스 업체 선정
                  </p>
                </div>
              </div>

              <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-24">
                  <span className="text-sm font-medium text-zinc-900">2024년</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full"></div>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed">
                    서울 스튜디오 확장 이전<br />
                    프리미엄 웨딩 촬영 서비스 런칭
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-zinc-200"></div>

          {/* 통계 */}
          <section className="bg-zinc-50 border-2 border-zinc-200 p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-4xl font-light text-zinc-900">5,000+</div>
                <p className="text-sm text-zinc-600 font-light">누적 촬영 고객</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-light text-zinc-900">99%</div>
                <p className="text-sm text-zinc-600 font-light">고객 만족도</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-light text-zinc-900">100+</div>
                <p className="text-sm text-zinc-600 font-light">월간 촬영 건수</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-light text-zinc-900">10+</div>
                <p className="text-sm text-zinc-600 font-light">전문 작가진</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
