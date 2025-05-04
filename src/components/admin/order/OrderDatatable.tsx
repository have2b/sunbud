"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { Order, OrderItem } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { useState } from "react";
import { createOrderColumns } from "./order.columns";
import { orderFilterFields } from "./order.filter";
import UpdateOrderForm from "./UpdateOrderForm";

export default function OrderDatatable() {
  const dialog = useDetailDialog<Order>();

  const detailFields: DetailField<Order>[] = [
    { label: "ID", key: "id" },
    { label: "Mã đơn hàng", key: "orderCode" },
    {
      label: "Người mua",
      key: "user",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      label: "Shipper",
      key: "shipper",
      render: (shipper) =>
        `${shipper?.firstName || ""} ${shipper?.lastName || ""}`,
    },
    { label: "Trạng thái", key: "status" },
    { label: "Phương thức thanh toán", key: "paymentMethod" },
    { label: "Phương thức giao hàng", key: "deliveryMethod" },
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
      label: "Ngày cập nhật",
      key: "updatedAt",
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
        queryKey="orders"
        apiPath="/api/admin/order"
        columns={createOrderColumns((order) => setEditOrder(order))}
        filterFields={orderFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo mã đơn hàng...",
          onSearch: (input) => [{ field: "orderCode", value: input }],
        }}
        initialPageSize={10}
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
