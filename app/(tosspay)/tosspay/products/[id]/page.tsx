"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { mockTossPayProducts } from "@/lib/mock/tosspay-products";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const product = mockTossPayProducts.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
        <Link href="/tosspay/products">
          <Button>상품 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const finalPrice = product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`장바구니에 ${product.name}이(가) 추가되었습니다`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = "/tosspay/cart";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/tosspay" className="hover:text-blue-600">
              홈
            </Link>
            <span>/</span>
            <Link href="/tosspay/products" className="hover:text-blue-600">
              상품
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* 이미지 갤러리 */}
          <div>
            <div className="sticky top-24">
              {/* 메인 이미지 */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.images[selectedImage]})` }}
                />
              </div>

              {/* 썸네일 */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === idx ? "border-blue-600" : "border-gray-200"
                      }`}
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
          <div>
            {/* 카테고리 & 태그 */}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              {product.tags.map((tag, idx) => (
                <Badge key={idx} className="bg-blue-600 text-white">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* 상품명 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {/* 가격 */}
            <div className="mb-6">
              <div className="text-4xl font-bold text-blue-600">
                {finalPrice.toLocaleString()}원
              </div>
            </div>

            {/* 설명 */}
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* 주요 특징 */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">포함 내역</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 상세 스펙 */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">상세 정보</h3>
              <div className="border rounded-lg overflow-hidden">
                {product.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className={`flex ${idx !== product.specifications.length - 1 ? "border-b" : ""}`}
                  >
                    <div className="w-32 bg-gray-50 p-4 font-medium text-gray-700">
                      {spec.label}
                    </div>
                    <div className="flex-1 p-4 text-gray-600">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 수량 선택 */}
            <div className="mb-8">
              <label className="font-semibold text-lg mb-4 block">수량</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border-0 focus-visible:ring-0"
                    min="1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 text-right">
                  <span className="text-sm text-gray-500">총 상품 금액</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {(finalPrice * quantity).toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>

            {/* 구매 버튼 */}
            <div className="flex gap-3 mb-8">
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                장바구니
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleBuyNow}
                disabled={!product.isAvailable}
              >
                바로 구매하기
              </Button>
            </div>

            {/* 안내 사항 */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium mb-1">안전한 결제</div>
                <div className="text-xs text-gray-600">토스페이먼츠 에스크로</div>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium mb-1">빠른 배송</div>
                <div className="text-xs text-gray-600">2-3주 이내 납품</div>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium mb-1">환불 보장</div>
                <div className="text-xs text-gray-600">7일 이내 환불 가능</div>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 정보 탭 */}
        <div className="mt-16 border-t pt-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">상품 상세 설명</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              
              <h3 className="text-xl font-bold mt-8 mb-4">포함 내역</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-gray-700">{feature}</li>
                ))}
              </ul>

              <h3 className="text-xl font-bold mt-8 mb-4">환불 및 교환 안내</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 구매 후 7일 이내 단순 변심에 의한 환불이 가능합니다</li>
                <li>• 촬영 진행 후에는 환불이 불가능합니다</li>
                <li>• 고객님의 사정으로 인한 일정 변경은 최대 2회까지 가능합니다</li>
                <li>• 기상 악화 등 불가항력적인 사유는 일정 조정이 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
