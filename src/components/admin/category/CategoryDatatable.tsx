// components/admin/category/CategoryDatatable.tsx
"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import { Category } from "@/generated/prisma";
import { useState } from "react";
import { createCategoryColumns } from "./category.columns";
import { categoryFilterFields } from "./category.filter";
import PublishCategoryForm from "./PublishCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";

export default function CategoryDatatable() {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [publishCategory, setPublishCategory] = useState<Category | null>(null);

  return (
    <>
      {editCategory && (
        <UpdateCategoryForm
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {publishCategory && (
        <PublishCategoryForm
          category={publishCategory}
          onClose={() => setPublishCategory(null)}
        />
      )}

      <GenericDataTable<Category>
        queryKey="categories"
        apiPath="/api/admin/category"
        columns={createCategoryColumns(
          (category) => setEditCategory(category),
          (category) => setPublishCategory(category),
        )}
        filterFields={categoryFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo tên...",
          onSearch: (input) => [{ field: "name", value: input }],
        }}
        initialPageSize={10}
      />
    </>
  );
}
