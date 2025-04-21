"use client";
import { useAuthStore } from "@/hooks/useAuthStore";
import axios from "axios";
import { ShoppingCartIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "../ui/button";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();

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
          <>
            <Button
              variant={"link"}
              onClick={() => router.push("/profile")}
              className="text-sm text-white"
            >
              Xin chào, {user.fullName}
            </Button>
            <Button
              variant={"link"}
              onClick={handleLogout}
              className="text-sm text-white"
            >
              ĐĂNG XUẤT
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm">
              ĐĂNG NHẬP
            </Link>
            <Link href="/register" className="text-sm">
              ĐĂNG KÝ
            </Link>
          </>
        )}

        {/* For cart */}
        {/* TODO: Cart function */}
        <div className="relative">
          <ShoppingCartIcon className="size-5" />
          <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            0
          </span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
