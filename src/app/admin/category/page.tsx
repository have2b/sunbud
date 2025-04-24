import CategoryDatatable from "@/components/admin/category/CategoryDatatable";
import InsertCategoryForm from "@/components/admin/category/InsertCategoryForm";

export default function AdminCategoryPage() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Quản lý Danh mục
        </h1>
        <InsertCategoryForm />
      </div>

      {/* Data Table Section */}
      <div className="rounded-lg border shadow-sm">
        <CategoryDatatable />
      </div>
    </div>
  );
}
