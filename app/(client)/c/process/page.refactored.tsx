'use client'

/**
 * Process 페이지 (리팩토링)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ClientPageLayout, ClientPageDivider, useClientPageAnimation } from '@/components/layout/client-page-layout'
import { ChevronDown, Image, FileText } from 'lucide-react'

const processSteps = [
  { title: '사전미팅', description: '모든 촬영에 대해서 사전미팅을 진행해드리고 있습니다' },
  { title: '촬영', description: '한 순간도 놓치지 않으려 최선을 다합니다' },
  { title: '백업', description: '물리적인 공간과 클라우드 공간에 세번 같은 데이터를 보관하여, 데이터의 안정성을 추구합니다' },
  { title: '고객셀렉', description: '고객님께서 쉽게 셀렉하실 수 있도록. 전체원본과 웹갤러리를 제공합니다.' },
  { title: '리터칭', description: '색감과 세부수정은 대표작가 주관하에 진행됩니다' },
  { title: '컨펌', description: '모든 과정에서 고객님의 동의를 받아 진행합니다' },
  { title: '배송', description: '촬영과 사전미팅을 제외한 모든 과정은 비대면으로 진행합니다' }
]

export default function ProcessPage() {
  const router = useRouter()
  const [isWebGalleryOpen, setIsWebGalleryOpen] = useState(false)
  const { animationClasses, startAnimation } = useClientPageAnimation()

  return (
    <ClientPageLayout variant="minimal" showFooter={false}>
      <div className={animationClasses}>
        <div className="text-center">
          <h1 className="text-3xl font-light text-zinc-900 tracking-[0.3em]">process</h1>
        </div>

        <ClientPageDivider />

        <div className="space-y-8">
          {processSteps.map((step, index) => (
            <div key={index} className="space-y-3 text-center">
              <h3 className="text-base font-medium text-zinc-900">{step.title}</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <ClientPageDivider />

        {/* Web Gallery Info */}
        <Card
          className={cn(
            'overflow-hidden transition-all duration-300 cursor-pointer border-2',
            isWebGalleryOpen ? 'border-zinc-900 shadow-md' : 'border-zinc-200 hover:border-zinc-300'
          )}
          onClick={() => setIsWebGalleryOpen(!isWebGalleryOpen)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  isWebGalleryOpen ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
                )}>
                  <Image className="h-5 w-5" />
                </div>
                <h3 className="text-base font-medium text-zinc-900">웹 갤러리란?</h3>
              </div>
              <ChevronDown className={cn(
                'h-5 w-5 text-zinc-400 transition-transform duration-300 flex-shrink-0',
                isWebGalleryOpen && 'rotate-180'
              )} />
            </div>

            <div className={cn(
              'grid transition-all duration-300 ease-in-out',
              isWebGalleryOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
            )}>
              <div className="overflow-hidden">
                <div className="pt-4 border-t border-zinc-200 space-y-4 text-sm text-zinc-700 leading-relaxed">
                  <p>모든 촬영본을 웹 페이지로 만들어 제공하는 서비스입니다.</p>
                  
                  <div>
                    <h4 className="font-semibold text-zinc-900 mb-3">주요 특징</h4>
                    <div className="space-y-3">
                      {[
                        { num: 1, title: '언제 어디서나 접속 가능', desc: '웹으로 PC, 태블릿, 스마트폰 등 어디서든 접속해서 감상할 수 있습니다.' },
                        { num: 2, title: '간편한 공유', desc: '가족, 친구들에게 링크만 공유하면 함께 사진을 감상할 수 있습니다.' },
                        { num: 3, title: '전체 원본 다운로드', desc: '마음에 드는 사진만 골라서 다운받을 수 있으며, 전체 파일도 다운로드 가능합니다.' }
                      ].map((item) => (
                        <div key={item.num} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-zinc-900 text-sm font-semibold">{item.num}</span>
                          </div>
                          <div>
                            <p className="font-medium text-zinc-900">{item.title}</p>
                            <p className="text-zinc-600 text-sm mt-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <ClientPageDivider />

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/c/portfolio')}
            variant="outline"
            className="w-full h-11 border-zinc-300 text-zinc-900 hover:bg-zinc-50"
          >
            포트폴리오 보기
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => startAnimation(() => router.back())}
              variant="outline"
              className="flex-1 h-12 border-zinc-300"
            >
              이전
            </Button>
            
            <Button
              onClick={() => startAnimation(() => router.push('/c/packages'))}
              className="flex-1 h-12 bg-zinc-900 hover:bg-zinc-800"
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </ClientPageLayout>
  )
}

