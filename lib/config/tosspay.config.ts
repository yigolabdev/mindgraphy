/**
 * 토스페이먼츠 심사용 설정
 * 
 * 실제 서비스와 분리된 독립 사이트 설정
 */

export const TOSSPAY_CONFIG = {
  // 사이트 정보
  site: {
    name: "토스페이먼츠 심사용 데모",
    description: "토스페이먼츠 PG 연동 심사를 위한 데모 사이트",
    url: process.env.NEXT_PUBLIC_TOSSPAY_URL || "https://tosspay.mindgraphy.com",
  },

  // 토스페이먼츠 설정
  tossPayments: {
    // 테스트 환경
    clientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY_TEST || "",
    secretKey: process.env.TOSS_SECRET_KEY_TEST || "",
    
    // 실제 환경 (심사 후)
    clientKeyLive: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY_LIVE || "",
    secretKeyLive: process.env.TOSS_SECRET_KEY_LIVE || "",
    
    // 현재 환경
    isLive: process.env.NEXT_PUBLIC_TOSS_ENV === "live",
  },

  // 결제 설정
  payment: {
    currency: "KRW",
    country: "KR",
    locale: "ko_KR",
    
    // 결제 방법
    methods: [
      { id: "card", name: "카드 결제", enabled: true },
      { id: "transfer", name: "계좌이체", enabled: true },
      { id: "virtualAccount", name: "가상계좌", enabled: true },
      { id: "mobilePhone", name: "휴대폰 결제", enabled: true },
      { id: "cultureCoupon", name: "문화상품권", enabled: false },
      { id: "bookCoupon", name: "도서문화상품권", enabled: false },
    ],

    // 결제 금액 범위
    minAmount: 1000, // 최소 1,000원
    maxAmount: 10000000, // 최대 10,000,000원
  },

  // 페이지 경로
  routes: {
    home: "/tosspay",
    publicStore: "/tosspay/public",
    adminDashboard: "/tosspay/admin",
    checkout: "/tosspay/checkout",
    success: "/tosspay/success",
    fail: "/tosspay/fail",
  },

  // 데모 상품
  demoProducts: [
    {
      id: "demo-product-1",
      name: "데모 상품 A",
      description: "토스페이먼츠 결제 테스트용 샘플 상품",
      price: 50000,
      image: "/images/demo-product-1.jpg",
      category: "sample",
    },
    {
      id: "demo-product-2",
      name: "데모 상품 B",
      description: "다양한 결제 수단 테스트용 상품",
      price: 100000,
      image: "/images/demo-product-2.jpg",
      category: "sample",
    },
    {
      id: "demo-product-3",
      name: "데모 상품 C",
      description: "고액 결제 테스트용 상품",
      price: 500000,
      image: "/images/demo-product-3.jpg",
      category: "premium",
    },
  ],
} as const;

// 타입 추출
export type TossPayConfig = typeof TOSSPAY_CONFIG;
export type PaymentMethod = typeof TOSSPAY_CONFIG.payment.methods[number];
export type DemoProduct = typeof TOSSPAY_CONFIG.demoProducts[number];
