"use client";

import OrderDetails from "@/components/orders/OrderDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Order } from "@/types/order";
import { formatCurrency } from "@/utils/format";

interface OrderHistoryListProps {
  orders: Order[];
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Chờ xác nhận",
      },
      VERIFIED: { color: "bg-blue-100 text-blue-800", label: "Đã xác nhận" },
      SHIPPING: {
        color: "bg-purple-100 text-purple-800",
        label: "Đang giao hàng",
      },
      DELIVERED: {
        color: "bg-green-100 text-green-800",
        label: "Đã giao hàng",
      },
      CANCELLED: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Hoàn thành" },
    };

    const statusInfo = statusMap[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-2">
      <Accordion type="single" collapsible className="w-full">
        {orders.map((order) => (
          <AccordionItem
            key={order.id}
            value={`order-${order.id}`}
            className="mb-4 overflow-hidden rounded-lg border border-gray-200"
          >
            <AccordionTrigger className="bg-gray-50 px-4 py-3 hover:bg-gray-100">
              <div className="grid w-full grid-cols-1 gap-y-2 text-left md:grid-cols-4">
                <div className="font-medium">Đơn hàng #{order.id}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(order.createdAt)}
                </div>
                <div className="text-primary font-medium">
                  {formatCurrency(order.totalAmount)} VNĐ
                </div>
                <div className="flex justify-start md:justify-end">
                  {getStatusBadge(order.status || "PENDING")}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <OrderDetails order={order} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
