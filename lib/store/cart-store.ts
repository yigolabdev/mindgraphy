/**
 * 장바구니 상태 관리 (Zustand)
 * 옵션 선택 기능 포함
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShopProduct, ProductOption } from "@/lib/mock/shop-products";

export interface CartItem {
  product: ShopProduct;
  quantity: number;
  selectedOptions?: ProductOption[]; // 선택된 옵션들
}

interface CartStore {
  items: CartItem[];
  addItem: (product: ShopProduct, quantity?: number, selectedOptions?: ProductOption[]) => void;
  removeItem: (productId: string, optionsKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, optionsKey?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// 옵션 조합을 고유 키로 변환하는 helper 함수
function getOptionsKey(options?: ProductOption[]): string {
  if (!options || options.length === 0) return "";
  return options
    .map((opt) => opt.id)
    .sort()
    .join(",");
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, selectedOptions = []) => {
        set((state) => {
          const newOptionsKey = getOptionsKey(selectedOptions);
          
          // 동일한 상품 + 동일한 옵션 조합인 경우 수량만 증가
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              getOptionsKey(item.selectedOptions) === newOptionsKey
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id &&
                getOptionsKey(item.selectedOptions) === newOptionsKey
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // 새로운 조합이면 새 항목으로 추가
          return {
            items: [...state.items, { product, quantity, selectedOptions }],
          };
        });
      },

      removeItem: (productId, optionsKey = "") => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                getOptionsKey(item.selectedOptions) === optionsKey
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, optionsKey = "") => {
        if (quantity <= 0) {
          get().removeItem(productId, optionsKey);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            getOptionsKey(item.selectedOptions) === optionsKey
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          const optionsPrice = item.selectedOptions?.reduce(
            (sum, opt) => sum + opt.price,
            0
          ) || 0;
          return total + (item.product.price + optionsPrice) * item.quantity;
        }, 0);
      },

      getTotalItems: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "shop-cart-storage",
    }
  )
);

// 옵션 키 추출 helper 함수 export
export { getOptionsKey };
