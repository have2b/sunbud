"use client";

import { CartItemsList } from "@/components/cart/CartItemsList";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCartStore } from "@/hooks/useCartStore";
import { useCartUtils } from "@/hooks/useCartUtils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const { formatPrice } = useCartUtils();

  // Handle hydration issues by only rendering client-side
  useEffect(() => {
    setIsClient(true);
    useCartStore.persist.rehydrate();
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen py-10 text-center">Loading cart...</div>
    );
  }

  const handleIncreaseQuantity = (productId: number) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      updateQuantity(productId, product.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    const product = items.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      updateQuantity(productId, product.quantity - 1);
    } else if (product) {
      removeItem(productId);
    }
  };

  const handleRemove = (productId: number, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} đã được xóa khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  return (
    <div className="container mx-auto min-h-screen py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Giỏ Hàng Của Bạn</h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <CartItemsList
                formatPrice={formatPrice}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleRemove={handleRemove}
                handleClearCart={handleClearCart}
              />
            </div>
            <div className="w-full lg:max-w-sm">
              <CartSummary formatPrice={formatPrice} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
