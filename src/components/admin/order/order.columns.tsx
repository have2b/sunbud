import { DataTableActions } from "@/components/common/DatatableActions";
import { Order } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

export const createOrderColumns = (
  handleEdit: (order: Order) => void,
): ColumnDef<Order>[] => [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("status")}</span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => (
      <span className="text-gray-700">
        {Number(row.getValue("totalAmount")).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </span>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Phương thức thanh toán",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("paymentMethod")}</span>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm",
          row.getValue("paymentStatus")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800",
        )}
      >
        {row.getValue("paymentStatus") ? "Hiển thị" : "Ẩn"}
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
    accessorKey: "deliveryMethod",
    header: "Phương thức giao hàng",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("deliveryMethod")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions<Order>
        row={row}
        actions={[
          {
            label: "Chỉnh sửa",
            icon: Pencil,
            onClick: handleEdit,
          },
        ]}
      />
    ),
  },
];
