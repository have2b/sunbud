"use client";

import { ShoppingCartIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const Header = () => {
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
        {/* For login */}
        <Link href={"/login"} className="text-sm">
          ĐĂNG NHẬP
        </Link>
        <Link href={"/register"} className="text-sm">
          ĐĂNG KÝ
        </Link>
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
