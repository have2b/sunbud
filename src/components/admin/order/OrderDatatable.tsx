// components/admin/category/CategoryDatatable.tsx
"use client";
import { GenericDataTable } from "@/components/common/GenericDatatable";
import { Order } from "@/generated/prisma";
import { useState } from "react";
import { createOrderColumns } from "./order.columns";
import { orderFilterFields } from "./order.filter";
import UpdateOrderForm from "./UpdateOrderForm";

export default function OrderDatatable() {
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
          placeholder: "Tìm kiếm theo số đơn hàng...",
          onSearch: (input) => [{ field: "id", value: input }],
        }}
        initialPageSize={10}
      />
    </>
  );
}
