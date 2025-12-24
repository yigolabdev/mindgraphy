import { mockShopProducts } from "@/lib/mock/shop-products";

export const dynamicParams = false;

export async function generateStaticParams() {
  return mockShopProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
