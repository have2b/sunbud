import InsertUserForm from "@/components/admin/user/InsertUserForm";
import UserDatatable from "@/components/admin/user/UserDatatable";

export default function AdminUserPage() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Quản lý người dùng
        </h1>
        <InsertUserForm />
      </div>

      {/* Data Table Section */}
      <div className="rounded-lg border shadow-sm">
        <UserDatatable />
      </div>
    </div>
  );
}
