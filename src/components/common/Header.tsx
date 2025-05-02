"use client";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

  // Get cart items count
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  // Initialize cart store (needed for hydration)
  useEffect(() => {
    // Initialize the cart store and rehydrate from localStorage
    if (typeof window !== "undefined") {
      useCartStore.persist.rehydrate();
      setCartItemsCount(getTotalItems());
    }
  }, [getTotalItems]);

  // Update cart count when items change
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe(() => {
      setCartItemsCount(getTotalItems());
    });

    return () => unsubscribe();
  }, [getTotalItems]);

  useEffect(() => {
    if (expiresAt && expiresAt < Date.now()) {
      clearAuth();
    }
  }, [expiresAt, clearAuth]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error(error);
    }
    clearAuth();
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex w-full items-center justify-around bg-black py-2 text-white"
    >
      <span id="promotion" className="cursor-default text-sm underline">
        Miễn phí giao hàng cho đơn hàng từ 200k bán kính 3km
      </span>
      <div className="flex items-center justify-center gap-4">
        {/* For hotline */}
        <p id="hotline">
          Hotline:
          <span className="ms-1 font-semibold text-red-500">0559.901.869</span>
        </p>

        {/* Authentication links */}
        {user ? (
          <div className="flex items-center gap-2">
            <Button
              variant={"link"}
              onClick={() =>
                router.push(
                  user.role === "ADMIN"
                    ? "/admin"
                    : user.role === "SHIPPER"
                      ? "/shipper"
                      : "/profile",
                )
              }
              className="px-0 text-sm text-white"
            >
              Xin chào, {user.fullName}
            </Button>
            <span className="text-white">|</span>
            <Button
              variant={"link"}
              onClick={() => router.push("/orders")}
              className="px-0 text-sm text-white"
            >
              ĐƠN HÀNG
            </Button>
            <span className="text-white">|</span>
            <Button
              variant={"link"}
              onClick={handleLogout}
              className="px-0 text-sm text-white"
            >
              ĐĂNG XUẤT
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm">
              ĐĂNG NHẬP
            </Link>
            <span className="text-white">|</span>
            <Link href="/register" className="text-sm">
              ĐĂNG KÝ
            </Link>
          </div>
        )}

        {/* For cart */}
        <Link href="/cart" className="relative">
          <ShoppingCartIcon className="size-5" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {cartItemsCount > 99 ? "99+" : cartItemsCount}
            </span>
          )}
        </Link>
      </div>
    </motion.header>
  );
};

export default Header;
