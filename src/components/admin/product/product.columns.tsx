import { DataTableActions } from "@/components/common/DatatableActions";
import { Category, Product } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Pencil, Trash2 } from "lucide-react";

// Define the table meta type that includes categories
type ProductTableMeta = {
  categories: Category[];
};

export const createProductColumns = (
  handleEdit: (product: Product) => void,
  handlePublish: (product: Product) => void,
): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
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
    accessorKey: "price",
    header: "Giá",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {Number(row.getValue("price")).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </span>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Số lượng",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("quantity")}</span>
    ),
  },
  {
    accessorKey: "categoryId",
    header: "Danh mục",
    cell: ({ row, table }) => {
      const categoryId = row.getValue("categoryId") as number | null;
      // Access the categories data stored in the table meta
      const categories = (table.options.meta as ProductTableMeta)?.categories || [];
      const category = categories.find((cat) => cat.id === categoryId);
      
      return (
        <span className="text-gray-700">
          {category ? category.name : "-"}
        </span>
      );
    },
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
      <DataTableActions<Product>
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
