import { Product } from "@/generated/prisma";

export type SortOption = "price-asc" | "price-desc" | "popularity" | "newest";

export type FilterState = {
  search: string;
  categories: number[];
  priceRange: [number, number];
  minQuantity: number;
  sort: SortOption;
};

export type ProductWithCategory = Product & { category?: { name: string } };
