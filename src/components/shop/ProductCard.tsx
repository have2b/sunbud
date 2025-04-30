import Image from "next/image";
import Link from "next/link";
import { Product } from "@/generated/prisma";

interface ProductCardProps {
  product: Product & {
    category?: {
      id: number;
      name: string;
    } | null;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, price, imageUrl, category } = product;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/shop/product/${id}`} className="block aspect-square overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        {category && (
          <span className="mb-1 inline-block text-xs font-medium text-gray-500">
            {category.name}
          </span>
        )}
        <Link href={`/shop/product/${id}`}>
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">{name}</h3>
        </Link>
        <p className="text-base font-semibold text-emerald-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(price) || 0)}
        </p>
      </div>
    </div>
  );
};
