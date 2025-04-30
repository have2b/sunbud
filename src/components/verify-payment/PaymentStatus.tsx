import { useRouter } from "next/navigation";
import React from "react";

interface PaymentStatusProps {
  responseCode: string | null;
  isLoggedIn: boolean;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({
  responseCode,
  isLoggedIn,
}) => {
  const router = useRouter();

  return (
    <div>
      {responseCode === "00" && isLoggedIn ? (
        <div className="mb-4 text-green-500">
          <p className="text-xl font-semibold">Thanh toán thành công!</p>
          <p className="mt-2">Đơn hàng của bạn đang được xử lý.</p>
        </div>
      ) : responseCode === "24" ? (
        <div className="mb-4 text-red-500">
          <p className="text-xl font-semibold">Thanh toán đã bị hủy</p>
          <p className="mt-2">Bạn sẽ được chuyển về giỏ hàng.</p>
        </div>
      ) : (
        <div className="mb-4 text-yellow-500">
          <p className="text-xl font-semibold">Đang xác nhận thanh toán</p>
          <p className="mt-2">Mã phản hồi: {responseCode}</p>
        </div>
      )}

      <button
        onClick={() => router.replace("/cart")}
        className="mt-4 rounded-md bg-blue-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-blue-600"
      >
        Quay lại giỏ hàng
      </button>
    </div>
  );
};

export default PaymentStatus;
