import { mockTossPayProducts } from "@/lib/mock/tosspay-products";

export const dynamicParams = false;

export async function generateStaticParams() {
  return mockTossPayProducts.map((product) => ({
    id: product.id,
  }));
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
