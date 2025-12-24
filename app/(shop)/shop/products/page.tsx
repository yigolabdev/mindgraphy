"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  mockShopProducts,
  productCategories,
  filterProducts,
  sortProducts,
  type ShopProduct,
} from "@/lib/mock/shop-products";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high" | "newest">("popular");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 필터링 및 정렬된 상품 목록
  const filteredAndSortedProducts = useMemo(() => {
    let products = filterProducts(mockShopProducts, selectedCategory, searchQuery);
    return sortProducts(products, sortBy);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className={cn(
      "min-h-screen bg-white transition-all duration-1000 ease-out",
      isMounted ? "opacity-100" : "opacity-0"
    )}>
      {/* 페이지 헤더 */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-light text-zinc-900 tracking-tight">
              전체 상품
            </h1>
            <p className="text-sm text-zinc-600 font-light">
              총 <span className="font-medium text-zinc-900">{filteredAndSortedProducts.length}</span>개의 상품
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* 검색 및 필터 */}
          <div className="space-y-6 mb-12">
            {/* 검색 */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                type="text"
                placeholder="상품명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 h-12 border-2 border-zinc-200 focus:border-zinc-900 focus:ring-0"
              />
            </div>

            {/* 카테고리 */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-6 py-2.5 text-sm transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-200"
                  )}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-zinc-500 font-light">정렬:</span>
              {[
                { value: "popular", label: "인기순" },
                { value: "price-low", label: "낮은 가격" },
                { value: "price-high", label: "높은 가격" },
                { value: "newest", label: "최신순" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={cn(
                    "px-4 py-1.5 transition-all duration-200",
                    sortBy === option.value
                      ? "text-zinc-900 font-medium border-b-2 border-zinc-900"
                      : "text-zinc-500 font-light hover:text-zinc-900"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* 상품 목록 */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-24 space-y-6">
              <p className="text-zinc-500 font-light">검색 결과가 없습니다</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="h-12 px-6 border-2 border-zinc-300 hover:border-zinc-900"
              >
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 상품 카드 컴포넌트
function ProductCard({ product }: { product: ShopProduct }) {
  return (
    <Link href={`/shop/products/${product.id}`} className="group">
      <div className="bg-white border-2 border-zinc-200 hover:border-zinc-900 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          {product.tags.map((tag, idx) => (
            <div
              key={idx}
              className="absolute top-4 right-4 bg-zinc-900 text-white px-3 py-1 text-xs font-medium flex items-center gap-1"
            >
              {tag === "인기" && <Star className="w-3 h-3" />}
              {tag}
            </div>
          ))}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-medium">품절</span>
            </div>
          )}
        </div>
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <div className="flex-1 space-y-3">
            <p className="text-xs text-zinc-500 font-light">{product.categoryLabel}</p>
            <h3 className="font-medium text-lg text-zinc-900 group-hover:text-zinc-700 transition-colors">
              {product.shortName}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed font-light line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-end justify-between pt-4 border-t border-zinc-200">
            <span className="text-2xl font-light text-zinc-900">
              {product.price.toLocaleString()}원
            </span>
            {product.availableOptions && product.availableOptions.length > 0 && (
              <span className="text-xs text-zinc-500 font-light">
                + 옵션
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
