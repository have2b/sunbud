"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import axios from "axios";
import {
  CheckIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const user = useAuthStore((state) => state.user);

  // Handle hydration issues by only rendering client-side
  useEffect(() => {
    setIsClient(true);
    useCartStore.persist.rehydrate();
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen py-10 text-center">Loading cart...</div>
    );
  }

  // Format price with Vietnamese currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle quantity changes
  const handleIncreaseQuantity = (productId: number) => {
    const product = items.find((item) => item.id === productId);
    if (product) {
      updateQuantity(productId, product.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (productId: number) => {
    const product = items.find((item) => item.id === productId);
    if (product && product.quantity > 1) {
      updateQuantity(productId, product.quantity - 1);
    } else if (product) {
      removeItem(productId);
    }
  };

  const handleRemove = (productId: number, productName: string) => {
    removeItem(productId);
    toast.success(`${productName} đã được xóa khỏi giỏ hàng`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
  };

  const handleCheckout = async () => {
    // Check if user is logged in
    if (!user) {
      toast.info("Vui lòng đăng nhập để tiếp tục thanh toán");

      const redirectUrl = encodeURIComponent("/cart");
      router.push(`/login?redirect=${redirectUrl}`);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Đang kết nối đến cổng thanh toán...");

      // Make request to checkout API
      const response = await axios.post("api/user/checkout", {
        amount: getTotalPrice(),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Extract payment URL from response
      const { paymentUrl } = response.data;

      if (paymentUrl) {
        // Navigate to the payment gateway URL
        window.location.href = paymentUrl;
      } else {
        toast.error(
          "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.",
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "Có lỗi xảy ra khi kết nối đến cổng thanh toán. Vui lòng thử lại sau.",
      );
    }
  };

  return (
    <div className="container mx-auto min-h-screen py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">Giỏ Hàng Của Bạn</h1>

      {items.length === 0 ? (
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
      ) : (
        <>
          <div className="mb-6 flex justify-end">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-rose-600"
              onClick={handleClearCart}
            >
              <TrashIcon className="h-4 w-4" />
              Xóa Tất Cả
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center border-b border-gray-100 p-4 last:border-b-0"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-50">
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="ml-4 flex-1">
                      <Link
                        href={`/shop/product/${item.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-emerald-600"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleDecreaseQuantity(item.id)}
                      >
                        <MinusCircleIcon className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        <PlusCircleIcon className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="ml-4 min-w-[100px] text-right">
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-gray-400 hover:text-rose-600"
                      onClick={() => handleRemove(item.id, item.name)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Tóm Tắt Đơn Hàng</h3>

                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>Miễn phí</span>
                  </div>
                </div>

                <div className="mb-6 border-t border-gray-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium">Tổng:</span>
                    <span className="text-xl font-semibold text-emerald-600">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleCheckout}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Thanh Toán
                </Button>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/shop")}
                  >
                    Tiếp Tục Mua Sắm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
