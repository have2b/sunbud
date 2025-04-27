import InsertProductForm from "@/components/admin/product/InsertProductForm";
import ProductDatatable from "@/components/admin/product/ProductDatatable";

export default function AdminProductPage() {
  return (
    <div className="p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Quản lý Sản phẩm
        </h1>
        <InsertProductForm />
      </div>

      {/* Data Table Section */}
      <div className="rounded-lg border shadow-sm">
        <ProductDatatable />
      </div>
    </div>
  );
}
