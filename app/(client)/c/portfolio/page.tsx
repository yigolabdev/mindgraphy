'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeft, X } from 'lucide-react'

export default function PortfolioPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      router.back()
    }, 200)
  }

  const handleContinue = () => {
    setIsAnimating(true)
    setTimeout(() => {
      // 이전 페이지로 돌아가거나, 첫 페이지로 이동
      if (window.history.length > 1) {
        router.back()
      } else {
        router.push('/c/product-type')
      }
    }, 200)
  }

  // Mock portfolio images - 실제로는 서버에서 가져온 이미지 URL 사용
  const portfolioImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', alt: '웨딩 포트폴리오 1' },
    { id: 2, src: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800', alt: '웨딩 포트폴리오 2' },
    { id: 3, src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800', alt: '웨딩 포트폴리오 3' },
    { id: 4, src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800', alt: '웨딩 포트폴리오 4' },
    { id: 5, src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800', alt: '웨딩 포트폴리오 5' },
    { id: 6, src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', alt: '웨딩 포트폴리오 6' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 bg-white border-b border-zinc-200",
        "transition-all duration-700 ease-out",
        isMounted ? "opacity-100" : "opacity-0"
      )}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={cn(
              "flex items-center gap-2 text-zinc-600 hover:text-zinc-900",
              "transition-all duration-200",
              "active:scale-[0.98]"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">이전</span>
          </button>

          <h1 className="text-lg font-light text-zinc-900 tracking-tight">
            Portfolio
          </h1>

          <Button
            onClick={handleContinue}
            variant="outline"
            className={cn(
              "text-sm font-normal",
              "border-zinc-300 hover:border-zinc-900",
              "hover:bg-zinc-50"
            )}
          >
            계속 진행하기
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className={cn(
        "max-w-6xl mx-auto p-4 transition-all duration-700 ease-out",
        isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        isAnimating && "opacity-0 -translate-y-8"
      )}>
        <div className="space-y-8">
          {/* Intro */}
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl font-light text-zinc-900 tracking-tight">
              마인드그라피의 작업
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              소중한 순간을 담은 우리의 포트폴리오입니다
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolioImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-[3/4] overflow-hidden bg-zinc-100",
                  "transition-all duration-300",
                  "hover:shadow-lg hover:scale-[1.02]",
                  "active:scale-[0.98]",
                  "group"
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Instagram Link */}
          <div className="text-center space-y-4 py-8 border-t border-zinc-200">
            <p className="text-sm text-zinc-600">
              더 많은 작업이 궁금하신가요?
            </p>
            <a
              href="https://www.instagram.com/studio.mind.graphy"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3",
                "border-2 border-zinc-200 bg-white",
                "hover:border-zinc-900 hover:bg-zinc-50",
                "transition-all duration-200",
                "active:scale-[0.98]",
                "text-sm font-medium text-zinc-900"
              )}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
              </svg>
              <span>인스타그램에서 더 보기</span>
            </a>
          </div>

          {/* Bottom CTA */}
          <div className="text-center space-y-4 py-8 border-t border-zinc-200">
            <p className="text-sm text-zinc-600 leading-relaxed">
              마음에 드셨나요?<br />
              이제 다음 단계로 넘어가볼까요?
            </p>
            <Button
              onClick={handleContinue}
              className={cn(
                "h-14 px-8 text-base font-normal",
                "bg-zinc-900 hover:bg-zinc-800 text-white",
                "active:scale-[0.98]",
                "shadow-md hover:shadow-lg"
              )}
            >
              계속 진행하기
            </Button>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={portfolioImages[selectedImage].src}
            alt={portfolioImages[selectedImage].alt}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {selectedImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(selectedImage - 1)
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                이전
              </button>
            )}
            {selectedImage < portfolioImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(selectedImage + 1)
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                다음
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

