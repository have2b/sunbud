"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import { Product } from "@/generated/prisma";
import { UpdateProductSchema } from "@/validations/product.validation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import PublishProductForm from "./PublishProductForm";
import UpdateProductForm from "./UpdateProductForm";
import { createProductColumns } from "./product.columns";
import { getProductFilterFields } from "./product.filter";

export default function ProductDatatable() {
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [publishProduct, setPublishProduct] = useState<Product | null>(null);

  // Fetch categories for displaying category names
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("/api/admin/category", {
        params: {
          limit: 100,
        },
      });
      return response.data.data.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = categoriesData || [];

  const transformToUpdateSchema = (product: Product): UpdateProductSchema => {
    return {
      id: product.id,
      name: product.name,
      description: product.description || "", // Convert null to empty string
      price:
        typeof product.price === "string"
          ? parseFloat(product.price)
          : Number(product.price), // Convert to number
      quantity: product.quantity,
      imageUrl: product.imageUrl || undefined, // Convert null to undefined
      categoryId: product.categoryId || 0, // Convert null to a default value (0)
    };
  };

  return (
    <>
      {editProduct && (
        <UpdateProductForm
          product={transformToUpdateSchema(editProduct)}
          onClose={() => setEditProduct(null)}
        />
      )}
      {publishProduct && (
        <PublishProductForm
          product={publishProduct}
          onClose={() => setPublishProduct(null)}
        />
      )}

      <GenericDataTable
        queryKey="products"
        apiPath="/api/admin/product"
        columns={createProductColumns(
          (product: Product) => setEditProduct(product),
          (product: Product) => setPublishProduct(product),
        )}
        filterFields={getProductFilterFields(categories)}
        searchableFields={{
          placeholder: "Tìm kiếm theo tên...",
          onSearch: (input) => [{ field: "name", value: input }],
        }}
        initialPageSize={10}
        meta={{ categories }}
      />
    </>
  );
}
