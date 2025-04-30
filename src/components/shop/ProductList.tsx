"use client";

import { useEffect, useState } from "react";
import { Product } from "@/generated/prisma";
import { ProductCard } from "./ProductCard";

interface ProductsResponse {
  status: number;
  data: {
    data: (Product & {
      category?: {
        id: number;
        name: string;
      } | null;
    })[];
    total: number;
  };
  message: string;
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 12; // Show 12 products per page (3 rows of 4)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/user/product?page=${page}&limit=${limit}`);
        const result = await response.json() as ProductsResponse;
        
        if (result.status === 200) {
          setProducts(result.data.data);
          setTotalItems(result.data.total);
        } else {
          setError(result.message || "Failed to fetch products");
        }
      } catch (err) {
        setError("An error occurred while fetching products");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={index} 
            className="h-[300px] animate-pulse rounded-lg bg-gray-200"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            setPage(1);
          }}
          className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-8 text-center">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalItems > limit && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {Math.ceil(totalItems / limit)}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= Math.ceil(totalItems / limit)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
