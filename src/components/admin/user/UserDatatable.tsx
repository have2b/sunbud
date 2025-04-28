"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import { User } from "@/generated/prisma";
import { useState } from "react";
import UpdateUserForm from "./UpdateUserForm";
import { createUserColumns } from "./user.columns";
import { userFilterFields } from "./user.filter";
import PublishUserForm from "./VerifyUserForm";

export default function UserDatatable() {
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
      />
    </>
  );
}
