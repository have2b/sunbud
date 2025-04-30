"use client";

import VerifyPaymentContent from "@/components/verify-payment/VerifyPaymentContent";
import { Suspense } from "react";

const VerifyPaymentPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Xác nhận thanh toán</h1>
        <Suspense fallback={<div>Đang tải...</div>}>
          <VerifyPaymentContent />
        </Suspense>
      </div>
    </div>
  );
};

export default VerifyPaymentPage;
