"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { Order, OrderItem } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { createShipperOrderHistoryColumns } from "./shipperOrderHistory.columns";
import { shipperOrderFilterFields } from "./shipperOrder.filter";

interface ShipperOrderHistoryDatatableProps {
  initialStatus?: string;
}

export default function ShipperOrderHistoryDatatable({
  initialStatus,
}: ShipperOrderHistoryDatatableProps) {
  const dialog = useDetailDialog<Order>();

  const detailFields: DetailField<Order>[] = [
    { label: "ID", key: "id" },
    {
      label: "Người mua",
      key: "user",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    { label: "Trạng thái", key: "status" },
    { label: "Phương thức thanh toán", key: "paymentMethod" },
    { label: "Trạng thái thanh toán", key: "paymentStatus" },
    { label: "Địa chỉ", key: "address" },
    { label: "Số điện thoại", key: "phone" },
    { label: "Tổng tiền", key: "totalAmount" },
    {
      label: "Ngày tạo",
      key: "createdAt",
      render: (v) => new Date(v).toLocaleDateString(),
    },
    {
      label: "Sản phẩm",
      key: "items",
      render: (items: OrderItem[]) => (
        <div className="space-y-2">
          {items?.map((item) => (
            <div key={item.id} className="rounded-md border p-2">
              <div className="font-medium">ID sản phẩm: {item.productId}</div>
              <div>Số lượng: {item.quantity}</div>
              <div>Giá: {Number(item.price).toLocaleString("vi-VN")}₫</div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <>
      <GenericDataTable
        queryKey="shipperOrders"
        apiPath="/api/shipper/order"
        columns={createShipperOrderHistoryColumns()}
        filterFields={shipperOrderFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo số đơn hàng...",
          onSearch: (input) => [{ field: "id", value: input }],
        }}
        initialPageSize={10}
        initialParams={{
          status: initialStatus || "",
        }}
        onRowClick={dialog.openDialog}
      />

      <ItemDetailDialog
        {...dialog.dialogProps}
        fields={detailFields}
        title="Chi tiết đơn hàng"
      />
    </>
  );
}
