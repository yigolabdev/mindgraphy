/**
 * 토스페이먼츠 심사용 실제 상품 데이터
 * 기존 시스템의 product 데이터를 기반으로 구성
 */

export interface ProductOption {
  id: string;
  name: string;
  description: string;
  price: number;
  isRequired?: boolean;
}

export interface TossPayProduct {
  id: string;
  name: string;
  shortName: string; // 'new BASIC', 'BASIC' 등
  description: string;
  price: number;
  category: string;
  categoryLabel: string; // UI 표시용
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
  // 옵션 관련
  availableOptions?: ProductOption[];
  albumIncluded: boolean;
  photoCount: number;
  albumPages?: number;
  miniAlbums?: number;
}

// ============================================================
// 옵션 정의 (Option Products)
// ============================================================

export const productOptions: ProductOption[] = [
  {
    id: "option-1",
    name: "대표작가 지정",
    description: "대표작가 지정 촬영 상품",
    price: 440000,
  },
  {
    id: "option-s",
    name: "수석작가 지정",
    description: "수석작가 지정 촬영 상품",
    price: 220000,
  },
  {
    id: "option-y",
    name: "이사 지정",
    description: "이사 지정 작가 촬영 상품",
    price: 330000,
  },
  {
    id: "option-2",
    name: "2인 작가 진행",
    description: "기본상품에서 최종본 20장 업그레이드, 앨범 포함 시 각 20페이지씩 업그레이드",
    price: 330000,
  },
  {
    id: "option-3",
    name: "메이크업샵부터 촬영",
    description: "메이크업샵 촬영 포함",
    price: 250000,
  },
  {
    id: "option-iphone",
    name: "아이폰 스냅 촬영",
    description: "여성 작가 1인 진행, 예식 시작 1시간30분 전부터 원판 촬영 직후까지, 연회장 이후 30여 장 현장 베스트컷 제공, 작가셀렉 최종본 10장 (세부보정) 48시간 이내 제공",
    price: 330000,
  },
  {
    id: "option-early",
    name: "얼리 진행",
    description: "예식 시작시간 기준 1시간30분보다 일찍 시작하는 경우 적용 (1인 작가당)",
    price: 55000,
  },
];

// ============================================================
// BASE PRODUCTS (본식스냅 상품)
// ============================================================

export const mockTossPayProducts: TossPayProduct[] = [
  // === 본식스냅 앨범형 ===
  {
    id: "new-basic",
    name: "new BASIC - 본식스냅 앨범형 기본상품",
    shortName: "new BASIC",
    description: "1인 작가 진행, 13x10인치 합본 앨범 60페이지 + 11x8.5인치 미니합본 앨범 60페이지 2권 포함",
    price: 1210000,
    category: "wedding",
    categoryLabel: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
    ],
    stock: 50,
    isAvailable: true,
    albumIncluded: true,
    photoCount: 60,
    albumPages: 60,
    miniAlbums: 2,
    features: [
      "1인 작가 진행",
      "예식 시작시간 기준 1시간30분 전 시작, 연회장 촬영 1인 작가 진행 후 마무리",
      "13x10인치 합본(스냅·원판) 앨범 60페이지 1권",
      "11x8.5인치 미니합본(스냅·원판) 앨범 60페이지 2권",
      "최종본 60장 (고객셀렉, 세부보정 적용)",
      "웹갤러리 제공 (사진링크, 다운로드링크)",
      "전체원본 제공 (다운로드링크)",
    ],
    specifications: [
      { label: "촬영 시간", value: "예식 시작 1시간30분 전부터 연회장 마무리" },
      { label: "제공 사진", value: "보정 60장 + 원본 전체" },
      { label: "앨범", value: "13x10인치 60p + 미니 11x8.5인치 60p 2권" },
      { label: "촬영 인원", value: "메인 작가 1명" },
      { label: "배송", value: "웹갤러리 제공, 다운로드 링크" },
    ],
    tags: ["인기", "프리미엄", "추천"],
    createdAt: "2024-01-15",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y", "option-2", "option-3", "option-early"].includes(opt.id)
    ),
  },
  {
    id: "basic",
    name: "BASIC - 본식스냅 앨범형 기본상품",
    shortName: "BASIC",
    description: "1인 작가 진행, 13x10인치 합본 앨범 50페이지 + 11x8.5인치 미니합본 앨범 50페이지 2권 포함",
    price: 1020000,
    category: "wedding",
    categoryLabel: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    ],
    stock: 100,
    isAvailable: true,
    albumIncluded: true,
    photoCount: 50,
    albumPages: 50,
    miniAlbums: 2,
    features: [
      "1인 작가 진행",
      "예식 시작시간 기준 1시간30분 전 시작, 연회장 촬영 1인 작가 진행 후 마무리",
      "13x10인치 합본(스냅·원판) 앨범 50페이지 1권",
      "11x8.5인치 미니합본(스냅·원판) 앨범 50페이지 2권",
      "최종본 50장 (고객셀렉, 세부보정 적용)",
      "웹갤러리 제공 (사진링크, 다운로드링크)",
      "전체원본 제공 (다운로드링크)",
    ],
    specifications: [
      { label: "촬영 시간", value: "예식 시작 1시간30분 전부터 연회장 마무리" },
      { label: "제공 사진", value: "보정 50장 + 원본 전체" },
      { label: "앨범", value: "13x10인치 50p + 미니 11x8.5인치 50p 2권" },
      { label: "촬영 인원", value: "메인 작가 1명" },
    ],
    tags: ["추천", "베스트"],
    createdAt: "2024-01-20",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y", "option-2", "option-3", "option-early"].includes(opt.id)
    ),
  },

  // === 본식스냅 데이터형 ===
  {
    id: "new-data",
    name: "new DATA - 본식스냅 데이터형 기본상품",
    shortName: "new DATA",
    description: "1인 작가 진행, 앨범 없이 데이터만 제공하는 합리적인 가격의 패키지",
    price: 990000,
    category: "wedding",
    categoryLabel: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    ],
    stock: 80,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 65,
    features: [
      "1인 작가 진행",
      "예식 시작시간 기준 1시간30분 전 시작, 연회장 촬영 1인 작가 진행 후 마무리",
      "최종본 65장 (고객셀렉, 세부보정 적용)",
      "웹갤러리 제공 (사진링크, 다운로드링크)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "예식 시작 1시간30분 전부터 연회장 마무리" },
      { label: "제공 사진", value: "보정 65장 + 원본 전체" },
      { label: "앨범", value: "미포함 (데이터 전용)" },
      { label: "촬영 인원", value: "메인 작가 1명" },
    ],
    tags: ["인기", "합리적"],
    createdAt: "2024-02-01",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y", "option-2", "option-3", "option-early"].includes(opt.id)
    ),
  },
  {
    id: "data",
    name: "DATA - 본식스냅 데이터형 기본상품",
    shortName: "DATA",
    description: "1인 작가 진행, 앨범 없이 데이터만 제공하는 합리적인 가격의 패키지",
    price: 930000,
    category: "wedding",
    categoryLabel: "웨딩촬영",
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    images: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866",
    ],
    stock: 90,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 60,
    features: [
      "1인 작가 진행",
      "예식 시작시간 기준 1시간30분 전 시작, 연회장 촬영 1인 작가 진행 후 마무리",
      "최종본 60장 (고객셀렉, 세부보정 적용)",
      "웹갤러리 제공 (사진링크, 다운로드링크)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "예식 시작 1시간30분 전부터 연회장 마무리" },
      { label: "제공 사진", value: "보정 60장 + 원본 전체" },
      { label: "앨범", value: "미포함 (데이터 전용)" },
      { label: "촬영 인원", value: "메인 작가 1명" },
    ],
    tags: ["합리적"],
    createdAt: "2024-02-05",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y", "option-2", "option-3", "option-early"].includes(opt.id)
    ),
  },

  // === 한복/스냅 촬영 상품 ===
  {
    id: "hanbok-a1",
    name: "A-1 - 야외 촬영 기본",
    shortName: "A-1",
    description: "3시간 촬영 진행, 장소 한 곳, 의상 한 가지 컨셉",
    price: 800000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    images: [
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937",
    ],
    stock: 60,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 20,
    features: [
      "1인 작가 진행",
      "3시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 한 곳에서 촬영 진행 (장소 비용 별도)",
      "의상 한 가지 컨셉",
      "최종본 20장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "3시간 (이동, 준비 포함)" },
      { label: "촬영 장소", value: "야외 1곳 (장소 비용 별도)" },
      { label: "의상", value: "1벌" },
      { label: "제공 사진", value: "보정 20장 + 원본 전체" },
    ],
    tags: ["인기"],
    createdAt: "2024-02-10",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-a2",
    name: "A-2 - 야외 촬영 추가",
    shortName: "A-2",
    description: "4시간 촬영 진행, 장소 두 곳, 의상 두 가지 컨셉",
    price: 1150000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    images: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4",
    ],
    stock: 50,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 35,
    features: [
      "1인 작가 진행",
      "4시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 두 곳에서 촬영 진행 (장소 비용 별도)",
      "의상 두 가지 컨셉",
      "최종본 35장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "4시간 (이동, 준비 포함)" },
      { label: "촬영 장소", value: "야외 2곳 (장소 비용 별도)" },
      { label: "의상", value: "2벌" },
      { label: "제공 사진", value: "보정 35장 + 원본 전체" },
    ],
    tags: ["인기", "추천"],
    createdAt: "2024-02-12",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-b1",
    name: "B-1 - 야외 촬영 + 실내 스튜디오",
    shortName: "B-1",
    description: "4시간 촬영, 장소 한 곳 + 실내 스튜디오, 의상 두 가지",
    price: 1200000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    images: [
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    ],
    stock: 40,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 30,
    features: [
      "1인 작가 진행",
      "4시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 한 곳 + 실내 스튜디오 촬영",
      "의상 두 가지 컨셉",
      "최종본 30장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "4시간" },
      { label: "촬영 장소", value: "야외 1곳 + 실내 스튜디오" },
      { label: "의상", value: "2벌" },
      { label: "제공 사진", value: "보정 30장 + 원본 전체" },
    ],
    tags: ["프리미엄"],
    createdAt: "2024-02-15",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-b2",
    name: "B-2 - 야외 촬영 + 실내 스튜디오",
    shortName: "B-2",
    description: "5시간 촬영, 장소 두 곳 + 실내 스튜디오, 의상 세 가지",
    price: 1500000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
    images: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a",
    ],
    stock: 35,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 50,
    features: [
      "1인 작가 진행",
      "5시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 두 곳 + 실내 스튜디오 촬영",
      "의상 세 가지 컨셉",
      "최종본 50장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "5시간" },
      { label: "촬영 장소", value: "야외 2곳 + 실내 스튜디오" },
      { label: "의상", value: "3벌" },
      { label: "제공 사진", value: "보정 50장 + 원본 전체" },
    ],
    tags: ["프리미엄", "추천"],
    createdAt: "2024-02-18",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-c1",
    name: "C-1 - 야외 촬영만 + 추가 시간",
    shortName: "C-1",
    description: "5시간 촬영, 장소 두 곳, 의상 두 가지",
    price: 1300000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff",
    images: [
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff",
    ],
    stock: 45,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 40,
    features: [
      "1인 작가 진행",
      "5시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 두 곳에서 촬영 진행 (장소 비용 별도)",
      "의상 두 가지 컨셉",
      "최종본 40장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "5시간" },
      { label: "촬영 장소", value: "야외 2곳 (장소 비용 별도)" },
      { label: "의상", value: "2벌" },
      { label: "제공 사진", value: "보정 40장 + 원본 전체" },
    ],
    tags: [],
    createdAt: "2024-02-20",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-c2",
    name: "C-2 - 야외 촬영 + 실내 + 추가 시간",
    shortName: "C-2",
    description: "6시간 촬영, 장소 세 곳 + 실내 스튜디오, 의상 세 가지",
    price: 1700000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed",
    ],
    stock: 30,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 60,
    features: [
      "1인 작가 진행",
      "6시간 촬영 진행 (이동, 준비, 모니터링 시간 포함)",
      "장소 세 곳 + 실내 스튜디오 촬영",
      "의상 세 가지 컨셉",
      "최종본 60장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "6시간" },
      { label: "촬영 장소", value: "야외 3곳 + 실내 스튜디오" },
      { label: "의상", value: "3벌" },
      { label: "제공 사진", value: "보정 60장 + 원본 전체" },
    ],
    tags: ["프리미엄"],
    createdAt: "2024-02-22",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },
  {
    id: "hanbok-d1",
    name: "D-1 - 실내(흰색배경) 스튜디오",
    shortName: "D-1",
    description: "2시간 실내 촬영, 스튜디오 장소금액 포함",
    price: 500000,
    category: "snap",
    categoryLabel: "스냅촬영",
    image: "https://images.unsplash.com/photo-1600296226316-b7111518d8d8",
    images: [
      "https://images.unsplash.com/photo-1600296226316-b7111518d8d8",
    ],
    stock: 70,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 3,
    features: [
      "1인 작가 진행",
      "2시간 촬영 진행 (실내 촬영만 진행, 준비 및 모니터링 시간 포함)",
      "장소 한 곳에서 촬영 진행 (스튜디오 장소금액 포함)",
      "의상 한 가지 컨셉",
      "최종본 3장 (고객셀렉, 세부보정)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 시간", value: "2시간 (실내만)" },
      { label: "촬영 장소", value: "실내 스튜디오 (장소비 포함)" },
      { label: "의상", value: "1벌" },
      { label: "제공 사진", value: "보정 3장 + 원본 전체" },
    ],
    tags: ["합리적"],
    createdAt: "2024-02-25",
    availableOptions: productOptions.filter((opt) =>
      ["option-1", "option-s", "option-y"].includes(opt.id)
    ),
  },

  // === 특수 촬영 ===
  {
    id: "dress-shop-1",
    name: "DRESS SHOP - 가봉 스냅",
    shortName: "DRESS SHOP",
    description: "1인 대표작가 촬영, 20x16 아크릴 액자 포함",
    price: 550000,
    category: "special",
    categoryLabel: "특수촬영",
    image: "https://images.unsplash.com/photo-1594552072238-2d81b2a5c13c",
    images: [
      "https://images.unsplash.com/photo-1594552072238-2d81b2a5c13c",
    ],
    stock: 40,
    isAvailable: true,
    albumIncluded: false,
    photoCount: 10,
    features: [
      "1인 대표작가 촬영 진행",
      "최종본 10장 (고객셀렉, 세부보정)",
      "20x16 아크릴 액자 1개",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 작가", value: "대표작가 1명" },
      { label: "제공 사진", value: "보정 10장 + 원본 전체" },
      { label: "추가 제공", value: "20x16 아크릴 액자" },
    ],
    tags: ["프리미엄"],
    createdAt: "2024-03-01",
    availableOptions: [],
  },
  {
    id: "baby-1",
    name: "BABY - 돌스냅 행사 촬영",
    shortName: "BABY",
    description: "2인 작가 진행, 13x10인치 화보앨범 50페이지 + 14x14인치 액자 포함",
    price: 660000,
    category: "special",
    categoryLabel: "특수촬영",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
    images: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
    ],
    stock: 50,
    isAvailable: true,
    albumIncluded: true,
    photoCount: 50,
    albumPages: 50,
    features: [
      "2인 (작가 + 작가) 진행",
      "돌잔치 행사 촬영",
      "13x10인치 화보앨범 50페이지 1권",
      "14x14인치 액자 1개",
      "최종본 50장 (고객셀렉, 세부보정 적용)",
      "전체원본 제공",
    ],
    specifications: [
      { label: "촬영 인원", value: "작가 2명" },
      { label: "제공 사진", value: "보정 50장 + 원본 전체" },
      { label: "앨범", value: "13x10인치 화보앨범 50p" },
      { label: "추가 제공", value: "14x14인치 액자" },
    ],
    tags: ["인기"],
    createdAt: "2024-03-05",
    availableOptions: [],
  },
];

// 카테고리 목록
export const productCategories = [
  { id: "all", name: "전체", count: mockTossPayProducts.length },
  { 
    id: "wedding", 
    name: "웨딩촬영", 
    count: mockTossPayProducts.filter(p => p.category === "wedding").length 
  },
  { 
    id: "snap", 
    name: "스냅촬영", 
    count: mockTossPayProducts.filter(p => p.category === "snap").length 
  },
  { 
    id: "special", 
    name: "특수촬영", 
    count: mockTossPayProducts.filter(p => p.category === "special").length 
  },
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
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
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
