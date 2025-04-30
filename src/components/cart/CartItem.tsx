"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { MinusCircleIcon, PlusCircleIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface CartItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string | null;
  };
  formatPrice: (price: number) => string;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export const CartItem = ({
  item,
  formatPrice,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleIncreaseQuantity = () => {
    if (onIncrease) {
      onIncrease();
    } else {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = () => {
    if (onDecrease) {
      onDecrease();
    } else if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      removeItem(item.id);
      toast.success(`${item.name} đã được xóa khỏi giỏ hàng`);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-100 p-4 last:border-b-0">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="ml-4 flex-1">
        <Link
          href={`/shop/product/${item.id}`}
          className="text-lg font-medium text-gray-900 hover:text-emerald-600"
        >
          {item.name}
        </Link>
        <p className="mt-1 text-sm text-gray-500">
          {formatPrice(item.price)} × {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleDecreaseQuantity}
        >
          <MinusCircleIcon className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleIncreaseQuantity}
        >
          <PlusCircleIcon className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="ml-4 text-gray-500 hover:text-rose-600"
        onClick={handleRemove}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};
