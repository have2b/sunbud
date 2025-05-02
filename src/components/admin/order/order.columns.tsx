import { DataTableActions } from "@/components/common/DatatableActions";
import { Prisma } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

type OrderWithUser = Prisma.OrderGetPayload<{
  include: { user: { select: { firstName: true; lastName: true } } };
}>;

export const createOrderColumns = (
  handleEdit: (order: OrderWithUser) => void,
): ColumnDef<OrderWithUser>[] => [
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
    id: "user",
    accessorFn: (row) => `${row.user?.firstName} ${row.user?.lastName}`,
    header: "Khách hàng",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("user")}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions<OrderWithUser>
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
