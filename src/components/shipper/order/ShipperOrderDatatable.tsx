"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import {
  DetailField,
  ItemDetailDialog,
} from "@/components/common/ItemDetailDialog";
import { Order, OrderItem, ShippingStatus } from "@/generated/prisma";
import { useDetailDialog } from "@/hooks/useDetailDialog";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createShipperOrderColumns } from "./shipperOrder.columns";
import { shipperOrderFilterFields } from "./shipperOrder.filter";
import UpdateOrderForm from "./ShipperUpdateOrderForm";

interface ShipperOrderDatatableProps {
  initialShippingStatus?: ShippingStatus;
}

export default function ShipperOrderDatatable({ 
  initialShippingStatus 
}: ShipperOrderDatatableProps = {}) {
  const dialog = useDetailDialog<Order>();
  const queryClient = useQueryClient();
  
  // Set up the shipping status filter when the component mounts
  useEffect(() => {
    if (initialShippingStatus) {
      // Force a refetch with the shipping status parameter by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["shipperOrders"] });
    }
  }, [initialShippingStatus, queryClient]);

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
        apiPath={initialShippingStatus ? `/api/shipper/order?shippingStatus=${initialShippingStatus}` : "/api/shipper/order"}
        columns={createShipperOrderColumns((order) => setEditOrder(order))}
        filterFields={shipperOrderFilterFields}
        searchableFields={{
          placeholder: "Tìm kiếm theo số đơn hàng...",
          onSearch: (input) => [{ field: "id", value: input }],
        }}
        initialPageSize={10}
        onRowClick={dialog.openDialog}
        meta={{ shippingStatus: initialShippingStatus }}
      />

      <ItemDetailDialog
        {...dialog.dialogProps}
        fields={detailFields}
        title="Chi tiết đơn hàng"
      />
    </>
  );
}
