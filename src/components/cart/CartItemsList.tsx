"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { CartItem } from "./CartItem";

interface CartItemsListProps {
  formatPrice: (price: number) => string;
  handleIncreaseQuantity?: (productId: number) => void;
  handleDecreaseQuantity?: (productId: number) => void;
  handleRemove?: (productId: number, productName: string) => void;
  handleClearCart?: () => void;
}

export const CartItemsList = ({
  formatPrice,
  handleIncreaseQuantity: parentHandleIncreaseQuantity,
  handleDecreaseQuantity: parentHandleDecreaseQuantity,
  handleRemove: parentHandleRemove,
  handleClearCart: parentHandleClearCart,
}: CartItemsListProps) => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleClearCart = () => {
    if (parentHandleClearCart) {
      parentHandleClearCart();
    } else {
      clearCart();
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    if (parentHandleIncreaseQuantity) {
      parentHandleIncreaseQuantity(productId);
    } else {
      const product = items.find((item) => item.id === productId);
      if (product) {
        updateQuantity(productId, product.quantity + 1);
      }
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    if (parentHandleDecreaseQuantity) {
      parentHandleDecreaseQuantity(productId);
    } else {
      const product = items.find((item) => item.id === productId);
      if (product && product.quantity > 1) {
        updateQuantity(productId, product.quantity - 1);
      } else if (product) {
        removeItem(productId);
      }
    }
  };

  const handleRemove = (productId: number, productName: string) => {
    if (parentHandleRemove) {
      parentHandleRemove(productId, productName);
    } else {
      removeItem(productId);
      toast.success(`${productName} đã được xóa khỏi giỏ hàng`);
    }
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-rose-600"
          onClick={handleClearCart}
        >
          <TrashIcon className="h-4 w-4" />
          Xóa Tất Cả
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            formatPrice={formatPrice}
            onIncrease={() => handleIncreaseQuantity(item.id)}
            onDecrease={() => handleDecreaseQuantity(item.id)}
            onRemove={() => handleRemove(item.id, item.name)}
          />
        ))}
      </div>
    </>
  );
};
