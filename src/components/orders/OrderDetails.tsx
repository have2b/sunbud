"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface OrderDetailsProps {
  order: Order;
  onStatusChange?: () => void;
}

export default function OrderDetails({ order, onStatusChange }: OrderDetailsProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert payment method to display text
  const getPaymentMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      BANK: "Chuyển khoản ngân hàng",
      COD: "Thanh toán khi nhận hàng",
    };

    return methodMap[method] || method;
  };

  // Convert delivery method to display text
  const getDeliveryMethodText = (method: string) => {
    const methodMap: Record<string, string> = {
      SHIPPING: "Giao hàng tận nơi",
      PICKUP: "Nhận tại cửa hàng",
    };

    return methodMap[method] || method;
  };
  
  // Check if order can be cancelled (only PENDING or VERIFIED orders)
  const canBeCancelled = order.status === "PENDING" || order.status === "VERIFIED";
  
  // Handle order cancellation
  const handleCancelOrder = async () => {
    // Early return if already processing
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch("/api/user/order/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId: order.id }),
      });
      
      const result = await response.json();
      
      if (result.status !== 200) {
        throw new Error(result.message || "Hủy đơn hàng thất bại");
      }
      
      // Update order status in UI
      order.status = "CANCELLED";
      
      // Show success message
      toast.success("Đơn hàng đã được hủy thành công");
      
      // Notify parent component to refresh orders
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error instanceof Error ? error.message : "Hủy đơn hàng thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">
            Thông tin đơn hàng
          </h3>
          <ul className="mt-2 space-y-1">
            <li className="text-sm">
              <span className="font-medium">Phương thức thanh toán:</span>{" "}
              {getPaymentMethodText(order.paymentMethod)}
            </li>
            {order.status && (
              <li className="text-sm">
                <span className="font-medium">Trạng thái đơn hàng:</span>{" "}
                {order.status}
              </li>
            )}
            {order.deliveryMethod && (
              <li className="text-sm">
                <span className="font-medium">Phương thức giao hàng:</span>{" "}
                {getDeliveryMethodText(order.deliveryMethod)}
              </li>
            )}
          </ul>
        </div>

        {order.address && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Địa chỉ giao hàng
            </h3>
            <address className="mt-2 text-sm not-italic">
              {order.address}
              {order.phone && (
                <div className="mt-1">
                  <span className="font-medium">SĐT:</span> {order.phone}
                </div>
              )}
            </address>
          </div>
        )}
      </div>

      <h3 className="mb-3 border-b pb-2 font-medium">Chi tiết sản phẩm</h3>
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-start gap-4 py-2">
            {item.product.imageUrl ? (
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <div className="h-16 w-16 flex-shrink-0 rounded-md bg-gray-200" />
            )}

            <div className="flex min-w-0 flex-1 flex-col">
              <h4 className="truncate text-sm font-medium text-gray-900">
                {item.product.name}
              </h4>
              {item.product.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {item.product.description}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(item.price)} VNĐ
              </p>
              <p className="text-sm text-gray-500">x {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between">
          <span className="font-medium">Tổng cộng</span>
          <span className="text-primary font-medium">
            {formatCurrency(order.totalAmount)} VNĐ
          </span>
        </div>
        
        {canBeCancelled && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleCancelOrder}
              disabled={isLoading}
              className="font-medium text-xs"
              aria-label="Hủy đơn hàng"
              tabIndex={0}
            >
              {isLoading ? "Đang xử lý..." : "Hủy đơn hàng"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
