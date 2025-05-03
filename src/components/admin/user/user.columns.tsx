import { DataTableActions } from "@/components/common/DatatableActions";
import { User } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Pencil, Trash2 } from "lucide-react";

export const createUserColumns = (
  handleEdit: (user: User) => void,
  handlePublish: (user: User) => void,
): ColumnDef<User>[] => [
  {
    accessorKey: "username",
    header: "Tên người dùng",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("username")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("email") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "firstName",
    header: "Tên",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("firstName") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Họ",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("lastName") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("phone") || "-"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Vai trò",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-gray-600">
        {row.getValue("role") || "Khách hàng"}
      </span>
    ),
  },
  {
    accessorKey: "isVerified",
    header: "Trạng thái",
    cell: ({ row }) => (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-sm",
          row.getValue("isVerified")
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800",
        )}
      >
        {row.getValue("isVerified") ? "Đã kích hoạt" : "Vô hiệu hóa"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableActions<User>
        row={row}
        actions={[
          {
            label: "Chỉnh sửa",
            icon: Pencil,
            onClick: handleEdit,
          },
          row.original.isVerified
            ? {
                label: "Vô hiệu hóa",
                icon: Trash2,
                onClick: handlePublish,
                className: "text-red-600 focus:text-red-600",
                iconClassName: "text-red-600",
              }
            : {
                label: "Kích hoạt",
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
