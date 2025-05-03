import DashboardContent from "@/components/admin/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">
          Tổng hợp các thông tin về doanh thu, người dùng, đơn hàng và sản phẩm
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}
