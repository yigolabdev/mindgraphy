/**
 * 토스페이먼츠 심사용 데모 상품 데이터
 */

export interface TossPayProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  images: string[];
  stock: number;
  isAvailable: boolean;
  features: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  tags: string[];
  createdAt: string;
}

export const mockTossPayProducts: TossPayProduct[] = [
  {
    id: "product-001",
    name: "프리미엄 웨딩 촬영 패키지",
    description: "본식 + 스냅 촬영이 포함된 프리미엄 웨딩 촬영 패키지입니다. 전문 포토그래퍼가 소중한 순간을 아름답게 담아드립니다.",
    price: 1500000,
    discountPrice: 1200000,
    category: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
    ],
    stock: 50,
    isAvailable: true,
    features: [
      "본식 촬영 4시간",
      "스냅 촬영 2시간",
      "보정 사진 100장 제공",
      "원본 파일 전체 제공",
      "프리미엄 앨범 1권 포함",
      "온라인 갤러리 6개월 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "본식 4시간 + 스냅 2시간" },
      { label: "제공 사진", value: "보정 100장 + 원본 전체" },
      { label: "앨범", value: "30x30cm 프리미엄 앨범 1권" },
      { label: "촬영 인원", value: "메인 작가 1명 + 보조 작가 1명" },
    ],
    tags: ["인기", "프리미엄", "추천"],
    createdAt: "2024-01-15",
  },
  {
    id: "product-002",
    name: "스탠다드 웨딩 촬영 패키지",
    description: "합리적인 가격의 기본 웨딩 촬영 패키지입니다. 필수 순간을 모두 담아드립니다.",
    price: 800000,
    category: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    ],
    stock: 100,
    isAvailable: true,
    features: [
      "본식 촬영 3시간",
      "보정 사진 60장 제공",
      "원본 파일 전체 제공",
      "온라인 갤러리 3개월 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "본식 3시간" },
      { label: "제공 사진", value: "보정 60장 + 원본 전체" },
      { label: "촬영 인원", value: "메인 작가 1명" },
    ],
    tags: ["추천", "베스트"],
    createdAt: "2024-01-20",
  },
  {
    id: "product-003",
    name: "스냅 촬영 패키지",
    description: "스튜디오 또는 야외에서 진행되는 웨딩 스냅 전문 촬영 패키지입니다.",
    price: 500000,
    discountPrice: 450000,
    category: "스냅촬영",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    ],
    stock: 80,
    isAvailable: true,
    features: [
      "스냅 촬영 2시간",
      "보정 사진 40장 제공",
      "원본 파일 전체 제공",
      "의상 2벌 촬영 가능",
    ],
    specifications: [
      { label: "촬영 시간", value: "2시간" },
      { label: "제공 사진", value: "보정 40장 + 원본 전체" },
      { label: "촬영 장소", value: "스튜디오 또는 야외 1곳" },
    ],
    tags: ["인기"],
    createdAt: "2024-02-01",
  },
  {
    id: "product-004",
    name: "프리미엄 앨범 제작",
    description: "고급 인화지와 특수 제본으로 제작되는 프리미엄 웨딩 앨범입니다.",
    price: 300000,
    category: "앨범",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    images: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    ],
    stock: 200,
    isAvailable: true,
    features: [
      "30x30cm 대형 사이즈",
      "고급 인화지 사용",
      "가죽 표지",
      "최대 60페이지 구성",
    ],
    specifications: [
      { label: "크기", value: "30x30cm" },
      { label: "페이지", value: "60페이지" },
      { label: "표지", value: "천연 가죽" },
      { label: "제작 기간", value: "2-3주" },
    ],
    tags: ["프리미엄"],
    createdAt: "2024-02-10",
  },
  {
    id: "product-005",
    name: "디지털 파일 추가 구매",
    description: "추가 보정 사진을 구매하실 수 있습니다. (10장 단위)",
    price: 50000,
    category: "디지털",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    images: [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    ],
    stock: 999,
    isAvailable: true,
    features: [
      "보정 사진 10장",
      "고해상도 파일 제공",
      "온라인 다운로드",
    ],
    specifications: [
      { label: "수량", value: "보정 사진 10장" },
      { label: "해상도", value: "최대 6000x4000px" },
      { label: "제공 방식", value: "온라인 다운로드" },
    ],
    tags: [],
    createdAt: "2024-02-15",
  },
  {
    id: "product-006",
    name: "본식 영상 촬영 패키지",
    description: "본식의 감동적인 순간을 영상으로 기록해드립니다.",
    price: 1200000,
    discountPrice: 1000000,
    category: "영상촬영",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    ],
    stock: 30,
    isAvailable: true,
    features: [
      "본식 영상 촬영 4시간",
      "하이라이트 영상 5분",
      "풀영상 제공",
      "드론 촬영 포함",
      "BGM 및 자막 편집",
    ],
    specifications: [
      { label: "촬영 시간", value: "4시간" },
      { label: "제공 영상", value: "하이라이트 5분 + 풀영상" },
      { label: "촬영 장비", value: "4K 시네마 카메라 + 드론" },
      { label: "제작 기간", value: "3-4주" },
    ],
    tags: ["인기", "프리미엄"],
    createdAt: "2024-02-20",
  },
];

// 카테고리 목록
export const productCategories = [
  { id: "all", name: "전체", count: mockTossPayProducts.length },
  { id: "웨딩촬영", name: "웨딩촬영", count: 2 },
  { id: "스냅촬영", name: "스냅촬영", count: 1 },
  { id: "영상촬영", name: "영상촬영", count: 1 },
  { id: "앨범", name: "앨범", count: 1 },
  { id: "디지털", name: "디지털", count: 1 },
];

// 상품 필터링 함수
export function filterProducts(
  products: TossPayProduct[],
  category: string,
  searchQuery?: string
): TossPayProduct[] {
  let filtered = products;

  // 카테고리 필터
  if (category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  // 검색어 필터
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  return filtered;
}

// 상품 정렬 함수
export function sortProducts(
  products: TossPayProduct[],
  sortBy: "popular" | "price-low" | "price-high" | "newest"
): TossPayProduct[] {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
    case "price-high":
      return sorted.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
    case "newest":
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "popular":
    default:
      return sorted.sort((a, b) => {
        const scoreA = a.tags.includes("인기") ? 100 : 0;
        const scoreB = b.tags.includes("인기") ? 100 : 0;
        return scoreB - scoreA;
      });
  }
}
