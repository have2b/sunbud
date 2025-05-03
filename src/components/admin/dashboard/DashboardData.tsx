"use client";

import { ChartConfig } from "@/components/ui/chart";

// Cấu hình biểu đồ sản phẩm bán ra
export const getSalesChartConfig = (): ChartConfig => {
  return {
    sales: {
      label: "Sản Phẩm Bán Ra",
      color: "hsl(var(--chart-1))",
    },
  };
};

// Cấu hình biểu đồ doanh thu
export const getRevenueChartConfig = (): ChartConfig => {
  return {
    sales: {
      label: "Doanh Thu",
      color: "hsl(var(--chart-2))",
    },
  };
};

// Cấu hình biểu đồ người dùng
export const getUsersChartConfig = (): ChartConfig => {
  return {
    sales: {
      label: "Người Dùng",
      color: "hsl(var(--chart-3))",
    },
  };
};

// Cấu hình biểu đồ đơn hàng
export const getOrdersChartConfig = (): ChartConfig => {
  return {
    sales: {
      label: "Đơn Hàng",
      color: "hsl(var(--chart-4))",
    },
  };
};
