import { PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextResponse } from "next/server";

const db = new PrismaClient();

// GET: Dashboard statistics and chart data
export async function GET() {
  try {
    // Get total revenue
    const totalRevenueResult = await db.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: "COMPLETED",
      },
    });

    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    // Get total users count
    const usersCount = await db.user.count({
      where: {
        role: { in: ["USER", "SHIPPER"] },
      },
    });

    // Get total orders/sales count
    const ordersCount = await db.order.count();

    // Get active products count
    const productsCount = await db.product.count({
      where: {
        isPublish: true,
      },
    });

    // Get current month's revenue for comparison
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear =
      currentMonth === 0 ? currentYear - 1 : currentYear;

    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
    const startOfPreviousMonth = new Date(previousMonthYear, previousMonth, 1);

    const currentMonthRevenue = await db.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startOfCurrentMonth,
        },
        paymentStatus: "COMPLETED",
      },
    });

    const previousMonthRevenue = await db.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: startOfPreviousMonth,
          lt: startOfCurrentMonth,
        },
        paymentStatus: "COMPLETED",
      },
    });

    const currentMonthRevenueValue =
      Number(currentMonthRevenue._sum.totalAmount) || 0;
    const previousMonthRevenueValue =
      Number(previousMonthRevenue._sum.totalAmount) || 0;

    // Calculate revenue percentage change
    let revenuePercentChange = 0;
    if (previousMonthRevenueValue > 0) {
      revenuePercentChange = Number(
        (
          ((currentMonthRevenueValue - previousMonthRevenueValue) /
            previousMonthRevenueValue) *
          100
        ).toFixed(1),
      );
    }

    // Get monthly data for chart (last 6 months)
    const chartMonths = [];
    const monthNames = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      chartMonths.push({
        index: monthIndex,
        name: monthNames[monthIndex],
        year,
      });
    }

    // Process monthly data for all chart types simultaneously
    const monthlyDataPromises = chartMonths.map(async (month) => {
      const startDate = new Date(month.year, month.index, 1);
      const endDate = new Date(month.year, month.index + 1, 0);

      // 1. Get sales data - The sum of all ordered items for the month
      const orderItems = await db.orderItem.findMany({
        where: {
          order: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
            paymentStatus: "COMPLETED",
          },
        },
        select: {
          quantity: true,
        },
      });

      // Sum up the quantities
      const totalSoldItems = orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      // 2. Get revenue data for the month
      const revenueResult = await db.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          paymentStatus: "COMPLETED",
        },
      });

      const monthRevenue = Number(revenueResult._sum.totalAmount) || 0;

      // 3. Get user count for the month (newly registered users)
      const userCount = await db.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      // 4. Get order count for the month
      const orderCount = await db.order.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return {
        month: month.name,
        sales: totalSoldItems,
        revenue: monthRevenue,
        users: userCount,
        orders: orderCount,
      };
    });

    const chartData = await Promise.all(monthlyDataPromises);

    // Get current week's orders
    const startOfWeek = new Date();
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const currentWeekOrders = await db.order.count({
      where: {
        createdAt: {
          gte: startOfWeek,
        },
      },
    });

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const previousWeekOrders = await db.order.count({
      where: {
        createdAt: {
          gte: previousWeekStart,
          lt: startOfWeek,
        },
      },
    });

    // Calculate orders percentage change
    let ordersPercentChange = 0;
    if (previousWeekOrders > 0) {
      ordersPercentChange = Number(
        (
          ((currentWeekOrders - previousWeekOrders) / previousWeekOrders) *
          100
        ).toFixed(1),
      );
    }

    // Get yesterday's data for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayOrders = await db.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const yesterdayOrders = await db.order.count({
      where: {
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    // Calculate daily orders percentage change
    let dailyOrdersPercentChange = 0;
    if (yesterdayOrders > 0) {
      dailyOrdersPercentChange = Number(
        (((todayOrders - yesterdayOrders) / yesterdayOrders) * 100).toFixed(1),
      );
    }

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: {
          stats: {
            revenue: {
              total: totalRevenue,
              change: revenuePercentChange,
              isPositive: revenuePercentChange >= 0,
            },
            users: {
              total: usersCount,
              change: ordersPercentChange,
              isPositive: ordersPercentChange >= 0,
            },
            orders: {
              total: ordersCount,
              change: dailyOrdersPercentChange,
              isPositive: dailyOrdersPercentChange >= 0,
            },
            products: {
              total: productsCount,
            },
          },
          chartData,
        },
        message: "Dashboard data fetched successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Failed to fetch dashboard data",
      }),
      { status: 500 },
    );
  }
}
