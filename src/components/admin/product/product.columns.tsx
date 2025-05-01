import { DataTableActions } from "@/components/common/DatatableActions";
import { Prisma } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: { select: { name: true } } };
}>;

export const createProductColumns = (
  handleEdit: (product: ProductWithCategory) => void,
  handlePublish: (product: ProductWithCategory) => void,
): ColumnDef<ProductWithCategory>[] => [
  {
    accessorKey: "imageUrl",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return imageUrl ? (
        <div className="relative size-16">
          <Image src={imageUrl} alt="Product" fill objectFit="cover" />
        </div>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
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
    id: "category",
    accessorFn: (row) => row.category?.name,
    header: "Danh mục",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("category")}</span>
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
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions<ProductWithCategory>
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
