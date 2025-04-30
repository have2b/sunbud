import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  address: string | null;
  phone: string | null;
  deliveryMethod: "SHIPPING" | "PICKUP";
  addItem: (product: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setAddress: (address: string) => void;
  setPhone: (phone: string) => void;
  setDeliveryMethod: (method: "SHIPPING" | "PICKUP") => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      address: null,
      phone: null,
      deliveryMethod: "SHIPPING",

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id,
          );

          if (existingItem) {
            // If item already exists, increment quantity
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            // Add new item with quantity of 1
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setAddress: (address) => {
        set({ address });
      },
      setPhone: (phone) => {
        set({ phone });
      },

      setDeliveryMethod: (deliveryMethod) => {
        set({ deliveryMethod });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "sunbud-cart",
      skipHydration: true,
    },
  ),
);
