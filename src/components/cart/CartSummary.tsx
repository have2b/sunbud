"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CartSummaryProps {
  formatPrice: (price: number) => string;
}

export const CartSummary = ({ formatPrice }: CartSummaryProps) => {
  const router = useRouter();
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  // Get cart state and actions from cart store
  const setCartAddress = useCartStore((state) => state.setAddress);
  const setCartPhone = useCartStore((state) => state.setPhone);
  const savedPhone = useCartStore((state) => state.phone);
  const setCartDeliveryMethod = useCartStore(
    (state) => state.setDeliveryMethod,
  );
  const savedAddress = useCartStore((state) => state.address);
  const savedDeliveryMethod = useCartStore((state) => state.deliveryMethod);

  // Shipping fee constant (in VND)
  const SHIPPING_FEE = 30000;

  // State for payment, delivery, and address options
  const [paymentMethod, setPaymentMethod] = useState<"BANK" | "CASH">("BANK");
  const [deliveryMethod, setDeliveryMethod] = useState<"SHIPPING" | "PICKUP">(
    savedDeliveryMethod || "SHIPPING",
  );
  const [address, setAddress] = useState(savedAddress || "");
  const [phone, setPhone] = useState(savedPhone || "");

  // Check if address is valid
  const isAddressValid = () => {
    // Only require address for shipping delivery method
    if (deliveryMethod === "PICKUP") return true;
    return String(address).trim() !== "" && String(phone).trim() !== "";
  };

  // Create order for cash payment method
  const createCashOrder = async () => {
    try {
      const loadingToastId = toast.loading("Đang xử lý đơn hàng...");

      const orderItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post("/api/user/order", {
        items: orderItems,
        paymentMethod: "CASH",
        deliveryMethod,
        address: deliveryMethod === "SHIPPING" ? address : null,
        phone: deliveryMethod === "SHIPPING" ? phone : null,
        totalAmount:
          getTotalPrice() +
          Number(deliveryMethod === "SHIPPING" ? SHIPPING_FEE : 0),
      });

      toast.dismiss(loadingToastId);

      if (response.data.status === 200) {
        // Order created successfully
        clearCart();
        toast.success("Đơn hàng đã được tạo thành công!");
        router.push("/orders");
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.");
    }
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
      if (paymentMethod === "CASH") {
        // For cash payment, create the order directly
        await createCashOrder();
      } else {
        // For bank payment, proceed with the VNPay gateway
        const loadingToast = toast.loading(
          "Đang kết nối đến cổng thanh toán...",
        );

        const totalAmount =
          getTotalPrice() +
          Number(deliveryMethod === "SHIPPING" ? SHIPPING_FEE : 0);
        const response = await axios.post("api/user/checkout/bank", {
          amount: totalAmount,
          paymentMethod,
          deliveryMethod,
          address: deliveryMethod === "SHIPPING" ? String(address) : null,
          phone: deliveryMethod === "SHIPPING" ? String(phone) : null,
          shippingFee: deliveryMethod === "SHIPPING" ? SHIPPING_FEE : 0,
        });

        toast.dismiss(loadingToast);

        const { paymentUrl } = response.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast.error(
            "Không thể kết nối đến cổng thanh toán. Vui lòng thử lại sau.",
          );
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium">Tóm Tắt Đơn Hàng</h2>

      <div className="space-y-2">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600">Tạm tính</span>
          <span>{formatPrice(getTotalPrice())}</span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600">Phí vận chuyển</span>
          {deliveryMethod === "SHIPPING" ? (
            <span>{formatPrice(SHIPPING_FEE)}</span>
          ) : (
            <span className="text-emerald-600">Miễn phí</span>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <span className="font-medium">Tổng cộng</span>
          <span className="font-medium">
            {formatPrice(
              getTotalPrice() +
                (deliveryMethod === "SHIPPING" ? SHIPPING_FEE : 0),
            )}
          </span>
        </div>
      </div>

      {/* Payment Method Options */}
      <div className="mt-6 border-t border-gray-100 pt-4">
        <h3 className="mb-2 text-sm font-medium">Phương thức thanh toán</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as "BANK" | "CASH")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="BANK" id="payment-bank" />
            <label
              htmlFor="payment-bank"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Thanh toán qua ngân hàng
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CASH" id="payment-cash" />
            <label
              htmlFor="payment-cash"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Thanh toán bằng tiền mặt khi nhận hàng
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Delivery Method Options */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <h3 className="mb-2 text-sm font-medium">Phương thức nhận hàng</h3>
        <RadioGroup
          value={deliveryMethod}
          onValueChange={(value) => {
            const method = value as "SHIPPING" | "PICKUP";
            setDeliveryMethod(method);
            setCartDeliveryMethod(method);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="SHIPPING" id="delivery-ship" />
            <label
              htmlFor="delivery-ship"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Giao hàng tận nơi
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="PICKUP" id="delivery-pickup" />
            <label
              htmlFor="delivery-pickup"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Nhận hàng tại cửa hàng
            </label>
          </div>
        </RadioGroup>
      </div>

      {/* Address Fields - Only show for shipping */}
      {deliveryMethod === "SHIPPING" && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <h3 className="mb-2 text-sm font-medium">Thông tin giao hàng</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="address">Địa chỉ giao hàng</Label>
              <Input
                id="address"
                placeholder="Nhập địa chỉ giao hàng"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setCartAddress(e.target.value);
                }}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="Số điện thoại liên hệ"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setCartPhone(e.target.value);
                }}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>
      )}

      <Button
        className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={handleCheckout}
        disabled={!isAddressValid()}
      >
        {!isAddressValid() && deliveryMethod === "SHIPPING"
          ? "Vui lòng nhập thông tin giao hàng"
          : "Thanh Toán"}
      </Button>
    </div>
  );
};
