import { ProductWithCategory } from "./types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductWithCategory[];
  isLoading: boolean;
}

export const ProductGrid = ({ products, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
