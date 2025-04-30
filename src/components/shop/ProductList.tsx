"use client";

import { Product } from "@/generated/prisma";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const limit = 12;
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    setPage(1);
  }, [queryString]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams(queryString);
        params.delete("page");
        params.delete("limit");
        const apiQueryString = params.toString();

        const response = await fetch(
          `/api/user/product?page=${page}&limit=${limit}${apiQueryString ? `&${apiQueryString}` : ""}`,
        );
        const result = (await response.json()) as ProductsResponse;

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
  }, [page, limit, queryString]);

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
          Thử lại
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="my-8 text-center">
        <p className="text-gray-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="w-[70%] space-y-6">
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
              Trước
            </button>

            <div className="flex items-center gap-1">
              {(() => {
                const totalPages = Math.ceil(totalItems / limit);
                let pageNumbers: (number | string)[] = [];

                if (totalPages <= 5) {
                  pageNumbers = Array.from(
                    { length: totalPages },
                    (_, i) => i + 1,
                  );
                } else if (page <= 3) {
                  // Show first 3 pages, ..., and last page
                  pageNumbers = [1, 2, 3, 4, "...", totalPages];
                } else if (page >= totalPages - 2) {
                  // Show first page, ..., and last 3 pages
                  pageNumbers = [
                    1,
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages,
                  ];
                } else {
                  // Show first page, ..., current-1, current, current+1, ..., last page
                  pageNumbers = [
                    1,
                    "...",
                    page - 1,
                    page,
                    page + 1,
                    "...",
                    totalPages,
                  ];
                }

                return pageNumbers.map((pageNumber, index) => {
                  if (pageNumber === "...") {
                    return (
                      <span key={`ellipsis-${index}`} className="px-2 text-sm">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = page === pageNumber;
                  return (
                    <button
                      key={`page-${index}`}
                      className={`rounded-md border ${isCurrent ? "bg-emerald-600 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"} px-3 py-2 text-sm font-medium`}
                      onClick={() => setPage(pageNumber as number)}
                      disabled={isCurrent}
                    >
                      {pageNumber}
                    </button>
                  );
                });
              })()}
            </div>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= Math.ceil(totalItems / limit)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
