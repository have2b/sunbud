"use client";
import { Prisma } from "@/generated/prisma";
import { ColumnDef } from "@tanstack/react-table";

type OrderWithUser = Prisma.OrderGetPayload<{
  include: {
    user: { select: { firstName: true; lastName: true } };
  };
}>;

export const createShipperOrderHistoryColumns = (): ColumnDef<OrderWithUser>[] => [
  {
    accessorKey: "id",
    header: "Mã đơn hàng",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái giao hàng",
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
    id: "user",
    accessorFn: (row) => `${row.user?.firstName} ${row.user?.lastName}`,
    header: "Khách hàng",
    cell: ({ row }) => (
      <span className="text-gray-700">{row.getValue("user")}</span>
    ),
  },
];
