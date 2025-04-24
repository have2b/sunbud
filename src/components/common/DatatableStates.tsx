"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

export function DataTableLoading() {
  return (
    <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-primary"
      >
        <Loader2 className="size-12" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-500"
      >
        Đang tải dữ liệu...
      </motion.p>
    </div>
  );
}

export function DataTableEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-[400px] flex-col items-center justify-center space-y-6"
    >
      <div className="relative size-40">
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 size-full text-gray-200"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M40,100 Q100,40 160,100"
          />
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            fill="currentColor"
            d="M90,105 L110,105 L110,125 L90,125 Z"
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.path>
        </svg>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          Không tìm thấy dữ liệu
        </h3>
        <p className="text-gray-500">Không có mục nào để hiển thị</p>
      </div>
    </motion.div>
  );
}

export function DataTableError({
  error,
  retry,
}: {
  error: Error | string;
  retry?: () => void;
}) {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-[400px] flex-col items-center justify-center space-y-6"
    >
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -5, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="text-destructive"
        >
          <AlertTriangle className="size-16" />
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-destructive/10 absolute -inset-4 rounded-full"
        />
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-xl font-semibold text-gray-900">Đã xảy ra lỗi</h3>
        <p className="max-w-md text-gray-500">
          {errorMessage || "Không thể tải dữ liệu. Vui lòng thử lại sau."}
        </p>

        {retry && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={retry}
            className="bg-primary hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none"
          >
            Thử lại
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
