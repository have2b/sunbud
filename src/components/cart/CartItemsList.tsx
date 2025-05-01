"use client";

import { Button } from "@/components/ui/button";
import { Product } from "@/generated/prisma";
import { useCartStore } from "@/hooks/useCartStore";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [productStock, setProductStock] = useState<Record<number, number>>({});

  // Fetch product stock information for all items in the cart
  useEffect(() => {
    const fetchProductStock = async () => {
      try {
        // Get all product IDs in the cart
        const productIds = items.map((item) => item.id);
        if (productIds.length === 0) return;

        // Fetch product stock information
        const response = await fetch(
          `/api/user/product/stock?ids=${productIds.join(",")}`,
        );
        if (!response.ok) throw new Error("Failed to fetch product stock");

        const data = await response.json();
        const stockMap: Record<number, number> = {};

        // Create a map of product ID to stock quantity
        data.products.forEach((product: Product) => {
          stockMap[product.id] = product.quantity || 0;
        });

        setProductStock(stockMap);
      } catch (error) {
        console.error("Error fetching product stock:", error);
      }
    };

    fetchProductStock();
  }, [items]);

  const handleClearCart = () => {
    if (parentHandleClearCart) {
      parentHandleClearCart();
    } else {
      clearCart();
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
    }
  };

  const handleIncreaseQuantity = (productId: number) => {
    // Find the product in cart
    const cartItem = items.find((item) => item.id === productId);
    if (!cartItem) return;

    // Get current stock quantity
    const stockQuantity = productStock[productId] || 0;

    // Check if increasing would exceed available stock
    if (cartItem.quantity >= stockQuantity) {
      toast.error(
        `Không thể thêm, chỉ còn ${stockQuantity} sản phẩm trong kho`,
      );
      return;
    }

    // Proceed with quantity increase
    if (parentHandleIncreaseQuantity) {
      parentHandleIncreaseQuantity(productId);
    } else if (cartItem) {
      updateQuantity(productId, cartItem.quantity + 1);
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
        {items.map((item) => {
          // Check if current quantity equals or exceeds stock
          const stockQuantity = productStock[item.id] || 0;
          const reachedStockLimit = item.quantity >= stockQuantity;

          return (
            <CartItem
              key={item.id}
              item={item}
              formatPrice={formatPrice}
              onIncrease={() => handleIncreaseQuantity(item.id)}
              onDecrease={() => handleDecreaseQuantity(item.id)}
              onRemove={() => handleRemove(item.id, item.name)}
              disableIncrease={reachedStockLimit}
              stockQuantity={stockQuantity}
            />
          );
        })}
      </div>
    </>
  );
};
