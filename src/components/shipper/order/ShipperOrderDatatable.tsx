"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { Order, OrderItem } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { useState } from "react";
import { createShipperOrderColumns } from "./shipperOrder.columns";
import { shipperOrderFilterFields } from "./shipperOrder.filter";
import UpdateOrderForm from "./ShipperUpdateOrderForm";

interface ShipperOrderDatatableProps {
  initialShippingStatus?: string;
}

export default function ShipperOrderDatatable({
  initialShippingStatus,
}: ShipperOrderDatatableProps) {
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
    { label: "Trạng thái giao hàng", key: "shippingStatus" },
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
  const [editOrder, setEditOrder] = useState<Order | null>(null);

  return (
    <>
      {editOrder && (
        <UpdateOrderForm order={editOrder} onClose={() => setEditOrder(null)} />
      )}

      <GenericDataTable
        queryKey="shipperOrders"
        apiPath="/api/shipper/order"
        columns={createShipperOrderColumns((order) => setEditOrder(order))}
        filterFields={shipperOrderFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo số đơn hàng...",
          onSearch: (input) => [{ field: "id", value: input }],
        }}
        initialPageSize={10}
        initialParams={{
          shippingStatus: initialShippingStatus || "",
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
