"use client";

// No icons needed for chart-only view
import { useEffect, useState } from "react";
import { toast } from "sonner";

import AreaChartCard from "./AreaChartCard";
import BarChartCard from "./BarChartCard";
import {
  getOrdersChartConfig,
  getRevenueChartConfig,
  getSalesChartConfig,
  getUsersChartConfig,
} from "./DashboardData";
import LineChartCard, { ChartDataPoint } from "./LineChartCard";
// Using chart components only

type DashboardStats = {
  revenue: {
    total: number;
    change: number;
    isPositive: boolean;
  };
  users: {
    total: number;
    change: number;
    isPositive: boolean;
  };
  orders: {
    total: number;
    change: number;
    isPositive: boolean;
  };
  products: {
    total: number;
  };
};

type DashboardData = {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
};

const DashboardContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  // Get all chart configs
  const salesChartConfig = getSalesChartConfig();
  const revenueChartConfig = getRevenueChartConfig();
  const usersChartConfig = getUsersChartConfig();
  const ordersChartConfig = getOrdersChartConfig();

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      if (result.status === 200 && result.data) {
        setData(result.data);
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // No currency formatting needed for chart-only view

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  // Common date range description for charts in Vietnamese
  const dateRangeDescription = data?.chartData
    ? `${data.chartData[0]?.month || ""} - ${data.chartData[data.chartData.length - 1]?.month || ""} ${new Date().getFullYear()}`
    : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Product Sales Chart - Line Chart */}
        {data?.chartData && (
          <div className="col-span-1 md:col-span-1">
            <LineChartCard
              title="Sản Phẩm Bán Ra"
              description={dateRangeDescription}
              data={data.chartData}
              config={salesChartConfig}
              trendingValue={
                data.stats?.orders ? `${data.stats.orders.change}%` : undefined
              }
              footerText="Tổng số sản phẩm đã bán trong 6 tháng qua"
            />
          </div>
        )}

        {/* Revenue Chart - Area Chart */}
        {data?.chartData && (
          <div className="col-span-1 md:col-span-1">
            <AreaChartCard
              title="Doanh Thu Hàng Tháng"
              description={dateRangeDescription}
              data={data.chartData}
              config={revenueChartConfig}
              dataKey="revenue"
              footerText="Xu hướng doanh thu trong 6 tháng qua"
            />
          </div>
        )}

        {/* Users Chart - Bar Chart */}
        {data?.chartData && (
          <div className="col-span-1 md:col-span-1">
            <BarChartCard
              title="Người Dùng Hoạt Động"
              description={dateRangeDescription}
              data={data.chartData}
              config={usersChartConfig}
              dataKey="users"
              footerText="Tăng trưởng người dùng trong 6 tháng qua"
            />
          </div>
        )}

        {/* Orders Chart - Line Chart (different style) */}
        {data?.chartData && (
          <div className="col-span-1 md:col-span-1">
            <LineChartCard
              title="Số Đơn Hàng"
              description={dateRangeDescription}
              data={data.chartData}
              config={ordersChartConfig}
              trendingValue={
                data.stats?.orders ? `${data.stats.orders.change}%` : undefined
              }
              footerText="Số lượng đơn hàng hàng tháng trong 6 tháng qua"
              dataKey="orders"
            />
          </div>
        )}
      </div>

      <div className="text-muted-foreground text-right text-xs">
        <button
          onClick={() => fetchDashboardData()}
          className="text-primary focus:ring-primary rounded px-2 py-1 hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Refresh dashboard data"
        >
          Làm Mới Dữ Liệu
        </button>
      </div>
    </div>
  );
};

export default DashboardContent;
