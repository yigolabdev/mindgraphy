"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import {
  mockTossPayProducts,
  productCategories,
  filterProducts,
  sortProducts,
  type TossPayProduct,
} from "@/lib/mock/tosspay-products";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "newest">("popular");

  // 필터링 및 정렬된 상품 목록
  const filteredAndSortedProducts = useMemo(() => {
    let products = filterProducts(mockTossPayProducts, selectedCategory, searchQuery);
    return sortProducts(products, sortBy);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">전체 상품</h1>
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{filteredAndSortedProducts.length}</span>개의 상품
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 사이드바 필터 */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                {/* 검색 */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    상품 검색
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="상품명 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* 카테고리 */}
                <div className="mb-6">
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    카테고리
                  </label>
                  <div className="space-y-2">
                    {productCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-sm">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 정렬 */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    정렬 기준
                  </label>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">인기순</SelectItem>
                      <SelectItem value="price-low">가격 낮은순</SelectItem>
                      <SelectItem value="price-high">가격 높은순</SelectItem>
                      <SelectItem value="newest">최신순</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* 상품 그리드 */}
          <div className="flex-1">
            {/* 모바일 필터/정렬 */}
            <div className="lg:hidden mb-6 flex gap-3">
              <Button variant="outline" className="flex-1">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                필터
              </Button>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="price-low">가격 낮은순</SelectItem>
                  <SelectItem value="price-high">가격 높은순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 상품 목록 */}
            {filteredAndSortedProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 mb-4">검색 결과가 없습니다</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  필터 초기화
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 상품 카드 컴포넌트
function ProductCard({ product }: { product: TossPayProduct }) {
  const finalPrice = product.discountPrice || product.price;
  const discountRate = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <Link href={`/tosspay/products/${product.id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          {discountRate > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {discountRate}% OFF
            </div>
          )}
          {product.tags.map((tag, idx) => (
            <div
              key={idx}
              className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1"
            >
              {tag === "인기" && <Star className="w-4 h-4" />}
              {tag}
            </div>
          ))}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">품절</span>
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-end gap-2">
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                {product.price.toLocaleString()}원
              </span>
            )}
            <span className="text-2xl font-bold text-blue-600">
              {finalPrice.toLocaleString()}원
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
