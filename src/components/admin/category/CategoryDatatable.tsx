// components/admin/category/CategoryDatatable.tsx
"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { Category } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { useState } from "react";
import { createCategoryColumns } from "./category.columns";
import { categoryFilterFields } from "./category.filter";
import PublishCategoryForm from "./PublishCategoryForm";
import UpdateCategoryForm from "./UpdateCategoryForm";

export default function CategoryDatatable() {
  const dialog = useDetailDialog<Category>();

  const detailFields: DetailField<Category>[] = [
    { label: "Tên danh mục", key: "name" },
    { label: "Mô tả", key: "description", className: "col-span-2" },
    {
      label: "Ngày tạo",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      label: "Ngày cập nhật",
      key: "updatedAt",
      render: (v) => new Date(v).toLocaleDateString(),
    },
  ];
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
        onRowClick={dialog.openDialog}
      />

      <ItemDetailDialog
        {...dialog.dialogProps}
        fields={detailFields}
        title="Chi tiết danh mục"
      />
    </>
  );
}
