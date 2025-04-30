import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface LoginRequiredProps {
  show: boolean;
  pathname: string;
  searchParams: URLSearchParams;
}

const LoginRequired: React.FC<LoginRequiredProps> = ({ 
  show, 
  pathname, 
  searchParams 
}) => {
  const router = useRouter();
  
  if (!show) return null;
  
  return (
    <div className="my-8">
      <div className="mb-4 text-amber-500">
        <p className="text-xl font-semibold">Vui lòng đăng nhập</p>
        <p className="mt-2">
          Bạn cần đăng nhập để có thể hoàn tất đơn hàng
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button
          onClick={() => {
            const redirectUrl = encodeURIComponent(
              pathname + "?" + searchParams.toString()
            );
            router.push(`/login?redirect=${redirectUrl}`);
          }}
          className="w-full rounded-md bg-green-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-green-600"
        >
          Đăng nhập
        </Button>
        <Button
          onClick={() => router.replace("/cart")}
          className="w-full rounded-md bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition duration-300 hover:bg-gray-300"
        >
          Quay lại giỏ hàng
        </Button>
      </div>
    </div>
  );
};

export default LoginRequired;
