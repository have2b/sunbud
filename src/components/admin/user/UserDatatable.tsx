"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { User } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { useState } from "react";
import UpdateUserForm from "./UpdateUserForm";
import { createUserColumns } from "./user.columns";
import { userFilterFields } from "./user.filter";
import PublishUserForm from "./VerifyUserForm";

export default function UserDatatable() {
  const dialog = useDetailDialog<User>();

  const detailFields: DetailField<User>[] = [
    { label: "Tên người dùng", key: "username" },
    { label: "Email", key: "email" },
    { label: "Tên", key: "firstName" },
    { label: "Họ", key: "lastName" },
    { label: "Số điện thoại", key: "phone" },
    {
      label: "Trạng thái",
      key: "isVerified",
      render: (v) => (v ? "Đã kích hoạt" : "Vô hiệu hóa"),
    },
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
  const [editUser, setEditUser] = useState<User | null>(null);
  const [publishUser, setPublishUser] = useState<User | null>(null);

  return (
    <>
      {editUser && (
        <UpdateUserForm user={editUser} onClose={() => setEditUser(null)} />
      )}
      {publishUser && (
        <PublishUserForm
          user={publishUser}
          onClose={() => setPublishUser(null)}
        />
      )}

      <GenericDataTable<User>
        queryKey="users"
        apiPath="/api/admin/user"
        columns={createUserColumns(
          (user) => setEditUser(user),
          (user) => setPublishUser(user),
        )}
        filterFields={userFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo tên...",
          onSearch: (input) => [{ field: "username", value: input }],
        }}
        initialPageSize={10}
        onRowClick={dialog.openDialog}
      />

      <ItemDetailDialog
        {...dialog.dialogProps}
        fields={detailFields}
        title="Chi tiết người dùng"
      />
    </>
  );
}
