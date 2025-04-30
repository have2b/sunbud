"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export const EmptyCart = () => {
  const router = useRouter();
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gray-50">
        <ShoppingCartIcon className="h-20 w-20 text-gray-300" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="mb-6 text-gray-600">
        Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
      </p>
      <Button
        onClick={() => router.push("/shop")}
        className="bg-emerald-600 hover:bg-emerald-700"
      >
        Tiếp Tục Mua Sắm
      </Button>
    </div>
  );
};
