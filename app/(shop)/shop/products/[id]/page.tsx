"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { mockShopProducts, type ProductOption } from "@/lib/mock/shop-products";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const product = mockShopProducts.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<ProductOption[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-light text-zinc-900">상품을 찾을 수 없습니다</h1>
          <Link href="/shop/products">
            <Button className="h-12 px-6 bg-zinc-900 hover:bg-zinc-800">
              상품 목록으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 옵션 토글 핸들러
  const toggleOption = (option: ProductOption) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.some((opt) => opt.id === option.id);
      if (isSelected) {
        return prev.filter((opt) => opt.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  };

  // 옵션 포함 총 가격 계산
  const getTotalPrice = () => {
    const basePrice = product.price;
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (basePrice + optionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedOptions);
    const optionsText = selectedOptions.length > 0 
      ? ` (옵션: ${selectedOptions.map(opt => opt.name).join(', ')})`
      : '';
    toast.success(`장바구니에 ${product.shortName}${optionsText}이(가) 추가되었습니다`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedOptions);
    router.push("/shop/cart");
  };

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500 font-light">
            <Link href="/shop" className="hover:text-zinc-900 transition-colors">
              홈
            </Link>
            <span>/</span>
            <Link href="/shop/products" className="hover:text-zinc-900 transition-colors">
              상품
            </Link>
            <span>/</span>
            <span className="text-zinc-900">{product.shortName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* 이미지 갤러리 */}
            <div>
              <div className="sticky top-24 space-y-4">
                {/* 메인 이미지 */}
                <div className="aspect-square bg-zinc-100 overflow-hidden border-2 border-zinc-200">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                    style={{ backgroundImage: `url(${product.images[selectedImage]})` }}
                  />
                </div>

                {/* 썸네일 */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={cn(
                          "aspect-square overflow-hidden border-2 transition-all duration-200",
                          selectedImage === idx 
                            ? "border-zinc-900" 
                            : "border-zinc-200 hover:border-zinc-400"
                        )}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="space-y-8">
              {/* 카테고리 & 태그 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500 font-light">{product.categoryLabel}</span>
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-zinc-900 text-white px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              {/* 상품명 */}
              <div className="space-y-2">
                <h1 className="text-3xl font-light text-zinc-900 tracking-tight">{product.shortName}</h1>
                <p className="text-base text-zinc-600 leading-relaxed font-light">{product.description}</p>
              </div>

              {/* 가격 */}
              <div className="py-6 border-y border-zinc-200">
                <div className="text-4xl font-light text-zinc-900">
                  {product.price.toLocaleString()}원
                </div>
              </div>

              {/* 주요 특징 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-zinc-900">포함 내역</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-700 leading-relaxed font-light">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 상세 스펙 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-zinc-900">상세 정보</h3>
                <div className="border border-zinc-200">
                  {product.specifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex",
                        idx !== product.specifications.length - 1 && "border-b border-zinc-200"
                      )}
                    >
                      <div className="w-32 bg-zinc-50 p-4 text-sm font-light text-zinc-600 border-r border-zinc-200">
                        {spec.label}
                      </div>
                      <div className="flex-1 p-4 text-sm text-zinc-900 font-light">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 옵션 선택 */}
              {product.availableOptions && product.availableOptions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-zinc-900">추가 옵션</h3>
                  <div className="border-2 border-zinc-200 p-5 space-y-3">
                    {product.availableOptions.map((option) => {
                      const isSelected = selectedOptions.some((opt) => opt.id === option.id);
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "flex items-start gap-3 p-4 border-2 cursor-pointer transition-all duration-200",
                            isSelected
                              ? "border-zinc-900 bg-zinc-50"
                              : "border-zinc-200 hover:border-zinc-400"
                          )}
                          onClick={() => toggleOption(option)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleOption(option)}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-zinc-900">{option.name}</span>
                              <span className="text-sm font-medium text-zinc-700">
                                +{option.price.toLocaleString()}원
                              </span>
                            </div>
                            <p className="text-sm text-zinc-600 font-light">{option.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedOptions.length > 0 && (
                    <div className="bg-zinc-900 text-white p-4 space-y-1">
                      <div className="text-sm font-light">
                        선택된 옵션: {selectedOptions.map((opt) => opt.name).join(", ")}
                      </div>
                      <div className="text-sm font-medium">
                        옵션 금액: +{selectedOptions.reduce((sum, opt) => sum + opt.price, 0).toLocaleString()}원
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 수량 선택 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 font-light">수량</span>
                  <div className="flex items-center border-2 border-zinc-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="hover:bg-zinc-100"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus-visible:ring-0 font-light"
                      min="1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="hover:bg-zinc-100"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-zinc-50 border-2 border-zinc-200 p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-600 font-light">총 상품 금액</span>
                    <div className="text-right">
                      <div className="text-3xl font-light text-zinc-900">
                        {getTotalPrice().toLocaleString()}원
                      </div>
                      {selectedOptions.length > 0 && (
                        <div className="text-xs text-zinc-500 mt-1 font-light">
                          (상품 {(product.price * quantity).toLocaleString()}원 + 옵션 {(selectedOptions.reduce((sum, opt) => sum + opt.price, 0) * quantity).toLocaleString()}원)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 구매 버튼 */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-base font-normal border-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-300 active:scale-[0.98]"
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-normal bg-zinc-900 hover:bg-zinc-800 text-white transition-all duration-300 active:scale-[0.98] shadow-md hover:shadow-lg"
                  onClick={handleBuyNow}
                  disabled={!product.isAvailable}
                >
                  바로 구매하기
                </Button>
              </div>

              {/* 안내 사항 */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-zinc-50 border border-zinc-200">
                <div className="text-center space-y-2">
                  <Package className="w-6 h-6 text-zinc-600 mx-auto" />
                  <div className="text-xs font-light text-zinc-600">안전한 결제</div>
                </div>
                <div className="text-center space-y-2">
                  <Truck className="w-6 h-6 text-zinc-600 mx-auto" />
                  <div className="text-xs font-light text-zinc-600">빠른 배송</div>
                </div>
                <div className="text-center space-y-2">
                  <RefreshCw className="w-6 h-6 text-zinc-600 mx-auto" />
                  <div className="text-xs font-light text-zinc-600">환불 보장</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="border-t border-zinc-200 mt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-light text-zinc-900 tracking-tight">상품 상세 설명</h2>
              <p className="text-base text-zinc-600 leading-relaxed font-light">{product.description}</p>
            </div>
            
            <div className="border-t border-zinc-200 pt-12 space-y-6">
              <h3 className="text-xl font-light text-zinc-900 tracking-tight">포함 내역</h3>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-700 leading-relaxed font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-zinc-200 pt-12 space-y-6">
              <h3 className="text-xl font-light text-zinc-900 tracking-tight">환불 및 교환 안내</h3>
              <ul className="space-y-2 text-sm text-zinc-700 font-light leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>구매 후 7일 이내 단순 변심에 의한 환불이 가능합니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>촬영 진행 후에는 환불이 불가능합니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>고객님의 사정으로 인한 일정 변경은 최대 2회까지 가능합니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-400">•</span>
                  <span>기상 악화 등 불가항력적인 사유는 일정 조정이 가능합니다</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
