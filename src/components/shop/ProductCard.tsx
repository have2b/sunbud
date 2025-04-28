import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/db/schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductWithCategory = Product & { category?: { name: string } };

export const ProductCard = ({ product }: { product: ProductWithCategory }) => (
  <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:shadow-lg">
    <div className="bg-muted relative aspect-square overflow-hidden">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          width={500}
          height={500}
        />
      ) : (
        <div className="bg-secondary/30 flex h-full items-center justify-center">
          <p className="text-muted-foreground">No image</p>
        </div>
      )}
    </div>

    <CardHeader className="p-4 pb-0">
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          {product.category?.name || "Uncategorized"}
        </div>
        <div className="flex items-center text-amber-500">
          <Star className="h-3 w-3 fill-current" />
          <span className="ml-1 text-xs">4.5</span>
        </div>
      </div>
      <CardTitle className="mt-2 line-clamp-1 text-base">
        {product.name}
      </CardTitle>
    </CardHeader>

    <CardContent className="flex-grow p-4 pt-2">
      <p className="text-muted-foreground line-clamp-2 text-sm">
        {product.description || "No description available"}
      </p>
      <div className="mt-2 text-sm">
        <span className="text-muted-foreground">Stock:</span>{" "}
        <span
          className={cn(
            "font-medium",
            product.quantity > 10
              ? "text-green-500"
              : product.quantity > 0
                ? "text-amber-500"
                : "text-red-500",
          )}
        >
          {product.quantity > 0
            ? `${product.quantity} available`
            : "Out of stock"}
        </span>
      </div>
    </CardContent>

    <CardFooter className="flex items-center justify-between p-4 pt-0">
      <div className="text-lg font-bold">
        ${Number(product.price).toFixed(2)}
      </div>
      <Button size="sm" disabled={product.quantity <= 0}>
        <ShoppingCart className="mr-1 h-4 w-4" />
        Add
      </Button>
    </CardFooter>
  </Card>
);

export type { ProductWithCategory };
