import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Target, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">회사소개</CardTitle>
            <p className="text-sm text-gray-600">MindGraphy - 당신의 특별한 순간을 아름답게 기록합니다</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* 회사 개요 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">회사 개요</h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                <p>
                  주식회사 마인드그래피는 2026년 설립된 프리미엄 웨딩 촬영 전문 기업입니다.
                  우리는 고객의 특별한 순간을 예술적이고 감동적으로 담아내는 것을 목표로 합니다.
                </p>
                <p className="mt-4">
                  최고의 장비와 전문 작가진, 그리고 철저한 사전 준비를 통해 
                  고객님의 소중한 추억을 완벽하게 보존해드립니다.
                </p>
              </div>
            </section>

            {/* 비전 & 미션 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold">비전 & 미션</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 text-blue-900">비전</h3>
                  <p className="text-sm text-blue-800">
                    대한민국 최고의 웨딩 촬영 브랜드로 성장하여, 
                    모든 커플의 특별한 순간을 아름답게 기록하는 
                    신뢰받는 파트너가 되겠습니다.
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg mb-3 text-purple-900">미션</h3>
                  <p className="text-sm text-purple-800">
                    최고의 기술과 예술적 감각으로 고객의 소중한 추억을 
                    영원히 간직할 수 있도록 돕고, 감동과 만족을 선사합니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 핵심 가치 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">핵심 가치</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">품질</h3>
                  <p className="text-sm text-gray-600">
                    최상의 품질을 위해 끊임없이 연구하고 발전합니다
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">신뢰</h3>
                  <p className="text-sm text-gray-600">
                    약속을 지키고 고객과의 신뢰를 최우선으로 합니다
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="font-bold mb-2">혁신</h3>
                  <p className="text-sm text-gray-600">
                    새로운 기술과 트렌드를 적극 도입합니다
                  </p>
                </div>
              </div>
            </section>

            {/* 팀 소개 */}
            <section className="border-t pt-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-pink-600" />
                <h2 className="text-2xl font-bold">우리 팀</h2>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>
                  마인드그래피는 10명 이상의 전문 작가진과 스태프로 구성되어 있습니다.
                  각 분야의 전문가들이 협력하여 최상의 결과물을 만들어냅니다.
                </p>
                <ul className="mt-4 space-y-2">
                  <li>• <strong>메인 포토그래퍼:</strong> 10년 이상 경력의 베테랑 작가진</li>
                  <li>• <strong>영상팀:</strong> 시네마틱 영상 전문 감독 및 편집자</li>
                  <li>• <strong>보정팀:</strong> 섬세한 후반 작업 전문가</li>
                  <li>• <strong>고객 관리팀:</strong> 친절하고 세심한 CS 전문가</li>
                </ul>
              </div>
            </section>

            {/* 연혁 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">연혁</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 font-bold text-blue-600">2026.09</div>
                  <div>
                    <p className="font-semibold">주식회사 마인드그래피 설립</p>
                    <p className="text-sm text-gray-600">웨딩 촬영 사업 시작</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 수상 및 인증 */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-6">수상 및 인증</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <p className="text-sm text-yellow-900">
                  고객 만족도 1위, 서비스 품질 인증 등 다양한 수상 경력을 보유하고 있습니다.
                  앞으로도 최고의 서비스로 고객님의 기대에 부응하겠습니다.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
