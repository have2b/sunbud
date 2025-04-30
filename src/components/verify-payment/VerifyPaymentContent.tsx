"use client";

import LoadingState from "@/components/verify-payment/LoadingState";
import LoginRequired from "@/components/verify-payment/LoginRequired";
import OrderCreatedSuccess from "@/components/verify-payment/OrderCreatedSuccess";
import PaymentStatus from "@/components/verify-payment/PaymentStatus";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { Order } from "@/types/order";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const VerifyPaymentContent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [hasHandledResponse, setHasHandledResponse] = useState(false);

  // Get cart items and address info from cart store
  const items = useCartStore((state) => state.items);
  const address = useCartStore((state) => state.address);
  const phone = useCartStore((state) => state.phone);
  const deliveryMethod = useCartStore((state) => state.deliveryMethod);
  const clearCart = useCartStore((state) => state.clearCart);

  // Get user auth state from auth store
  const user = useAuthStore((state) => state.user);

  const createOrder = useCallback(async () => {
    try {
      // First check if user is logged in using auth store
      if (!user) {
        toast.info("Vui lòng đăng nhập để hoàn tất đơn hàng");

        // Create redirect URL with current path and search params
        const redirectUrl = encodeURIComponent(
          pathname + "?" + params.toString(),
        );
        router.push(`/login?redirect=${redirectUrl}`);
        setIsProcessing(false);
        return;
      }

      const loadingToastId = toast.loading("Đang xử lý đơn hàng...");
      setIsProcessing(true);

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post("/api/user/order", {
        items: orderItems,
        paymentMethod: "BANK",
        deliveryMethod,
        address: deliveryMethod === "SHIPPING" ? address : null,
        phone: deliveryMethod === "SHIPPING" ? phone : null,
      });

      toast.dismiss(loadingToastId);

      if (response.data.status === 200) {
        // Store the created order in state to display it
        setCreatedOrder(response.data.data);
        clearCart();
        toast.success("Đơn hàng đã được tạo thành công!");
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.");
      router.replace("/cart");
    } finally {
      setIsProcessing(false);
    }
  }, [
    items,
    address,
    deliveryMethod,
    phone,
    clearCart,
    router,
    pathname,
    user,
    params,
  ]);

  // Handle payment response when component mounts
  useEffect(() => {
    // Ensure the store is hydrated
    useCartStore.persist.rehydrate();

    // Prevent handling the response multiple times
    if (hasHandledResponse) return;

    const responseCode = params.get("vnp_ResponseCode");

    // Handle payment response
    if (responseCode === "24") {
      setHasHandledResponse(true);
      toast.error("Thanh toán đã bị hủy");
    } else if (
      responseCode === "00" &&
      items.length > 0 &&
      !isProcessing &&
      !createdOrder
    ) {
      setHasHandledResponse(true);
      toast.success("Thanh toán thành công!");
      createOrder();
    }
  }, [
    hasHandledResponse,
    params,
    items.length,
    isProcessing,
    createdOrder,
    createOrder,
    // Added createOrder as a dependency since it's used inside this effect
  ]);

  // Determine which component should be shown
  const showLoginRequired =
    !isProcessing && !user && params.get("vnp_ResponseCode") === "00";
  const showPaymentStatus = !isProcessing && !createdOrder;

  return (
    <>
      <LoadingState isProcessing={isProcessing} />
      <LoginRequired
        show={showLoginRequired}
        pathname={pathname}
        searchParams={params}
      />
      <OrderCreatedSuccess createdOrder={createdOrder} />
      {showPaymentStatus && (
        <PaymentStatus
          responseCode={params.get("vnp_ResponseCode")}
          isLoggedIn={!!user}
        />
      )}
    </>
  );
};

export default VerifyPaymentContent;
