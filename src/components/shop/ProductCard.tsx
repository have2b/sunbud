import { Product } from "@/generated/prisma";
import { useCartStore } from "@/hooks/useCartStore";
import { PlusCircleIcon, CheckCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product & {
    category?: {
      id: number;
      name: string;
    } | null;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, price, imageUrl, category, quantity, description } =
    product;

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const [addedToCart, setAddedToCart] = useState(false);

  // Check if product is already in cart
  const isInCart = items.some((item) => item.id === id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if product is already in cart and would exceed available stock
    const existingItem = items.find((item) => item.id === id);
    if (existingItem) {
      // Check if adding one more would exceed stock
      if (existingItem.quantity >= quantity) {
        toast.error(`Không thể thêm, chỉ còn ${quantity} sản phẩm trong kho`);
        return;
      }
    }
    
    // Add or update item in cart
    addItem({
      id,
      name,
      price: Number(price) || 0,
      imageUrl,
      quantity: 1
    });
    
    // Show added animation
    setAddedToCart(true);
    toast.success(`${name} đã được thêm vào giỏ hàng`);
    
    // Reset animation after 1 second
    setTimeout(() => {
      setAddedToCart(false);
    }, 1000);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
      <Link
        href={`/shop/product/${id}`}
        className="relative block aspect-square overflow-hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-50">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Stock indicator overlay */}
        {quantity <= 10 && (
          <div className="absolute top-2 left-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
            Chỉ còn {quantity} sản phẩm
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            {category && (
              <span className="mb-1 block text-xs font-medium text-gray-500">
                {category.name}
              </span>
            )}
            <Link href={`/shop/product/${id}`}>
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 hover:text-emerald-600">
                {name}
              </h3>
            </Link>
          </div>

          <Button
            onClick={handleAddToCart}
            className={`ml-4 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${addedToCart || isInCart ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
            aria-label="Add to cart"
            disabled={!quantity || (quantity === 1 && isInCart)}
          >
            {addedToCart || isInCart ? (
              <CheckCircleIcon className="size-5" />
            ) : (
              <PlusCircleIcon className="size-5" />
            )}
          </Button>
        </div>

        {description && (
          <p className="mb-4 line-clamp-3 text-sm text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-emerald-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(price) || 0)}
            </p>
            {quantity > 0 ? (
              <p className="text-sm text-gray-500">
                Còn hàng • {quantity} sản phẩm
              </p>
            ) : (
              <p className="text-sm text-rose-600">Hết hàng</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
