import { Order } from "@/types/order";
import Link from "next/link";
import React from "react";

interface OrderCreatedSuccessProps {
  createdOrder: Order | null;
}

const OrderCreatedSuccess: React.FC<OrderCreatedSuccessProps> = ({
  createdOrder,
}) => {
  if (!createdOrder) return null;

  return (
    <div className="my-8">
      <div className="mb-6 text-green-500">
        <p className="text-xl font-semibold">
          Đơn hàng đã được tạo thành công!
        </p>
        <p className="mt-2">Cảm ơn bạn đã mua sắm tại Blossomy</p>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left">
        <h2 className="mb-3 text-lg font-semibold">Thông tin đơn hàng:</h2>
        <p className="mb-2">
          <span className="font-medium">Mã đơn hàng:</span> #{createdOrder.id}
        </p>
        <p className="mb-2">
          <span className="font-medium">Tổng tiền:</span>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(createdOrder.totalAmount)}
        </p>
        <p className="mb-2">
          <span className="font-medium">Phương thức thanh toán:</span> Chuyển
          khoản ngân hàng
        </p>
        <p className="mb-2">
          <span className="font-medium">Trạng thái thanh toán:</span>{" "}
          <span className="text-green-500">Đã thanh toán</span>
        </p>

        <div className="mt-4">
          <p className="mb-2 font-medium">Sản phẩm:</p>
          <ul className="list-disc pl-5">
            {createdOrder.items?.map((item) => (
              <li key={item.id} className="mb-1">
                {item.product.name} x{item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/orders"
          className="w-full rounded-md bg-blue-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600"
        >
          Xem tất cả đơn hàng
        </Link>
        <Link
          href="/shop"
          className="w-full rounded-md bg-green-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-green-600"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default OrderCreatedSuccess;
