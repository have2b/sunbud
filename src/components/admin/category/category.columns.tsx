// components/admin/category/columns.ts
import { DataTableActions } from "@/components/common/DatatableActions";
import { Category } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Pencil, Trash2 } from "lucide-react";

export const createCategoryColumns = (
  handleEdit: (category: Category) => void,
  handlePublish: (category: Category) => void,
): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Tên danh mục",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },

  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("description") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "isPublish",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm",
          row.getValue("isPublish")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800",
        )}
      >
        {row.getValue("isPublish") ? "Hiển thị" : "Ẩn"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Ngày cập nhật",
    cell: ({ row }) => (
      <div className="text-gray-500">
        {new Date(row.getValue("updatedAt")).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions<Category>
        row={row}
        actions={[
          {
            label: "Chỉnh sửa",
            icon: Pencil,
            onClick: handleEdit,
          },
          row.original.isPublish
            ? {
                label: "Ẩn",
                icon: Trash2,
                onClick: handlePublish,
                className: "text-red-600 focus:text-red-600",
                iconClassName: "text-red-600",
              }
            : {
                label: "Hiển thị",
                icon: Check,
                onClick: handlePublish,
                className: "text-green-600 focus:text-green-600",
                iconClassName: "text-green-600",
              },
        ]}
      />
    ),
  },
];
