import { OrderStatus, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get JWT token from cookies for authentication
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        makeResponse({
          status: 401,
          data: {},
          message: "Lỗi xác thực, vui lòng đăng nhập",
        }),
        { status: 401 },
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = parseInt(payload.userId as string, 10);

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        makeResponse({
          status: 404,
          data: {},
          message: "Lỗi xác thực, người dùng không tồn tại",
        }),
        { status: 404 },
      );
    }

    // Parse request body to get the order ID
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "ID đơn hàng không hợp lệ",
        }),
        { status: 400 },
      );
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        makeResponse({
          status: 404,
          data: {},
          message: "Đơn hàng không tồn tại",
        }),
        { status: 404 },
      );
    }

    // Check if the order belongs to the current user
    if (order.userId !== userId) {
      return NextResponse.json(
        makeResponse({
          status: 403,
          data: {},
          message: "Bạn không có quyền hủy đơn hàng này",
        }),
        { status: 403 },
      );
    }

    // Check if the order is in a status that can be cancelled
    // Only PENDING or VERIFIED orders can be cancelled
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.VERIFIED) {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "Không thể hủy đơn hàng ở trạng thái hiện tại",
        }),
        { status: 400 },
      );
    }

    // Get order items to restore product quantities
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    // Update the order status to CANCELLED and restore product quantities in a transaction
    await prisma.$transaction(async (tx) => {
      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });

      // Restore product quantities
      for (const item of orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity,
            },
          },
        });
      }
    });

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: { orderId },
        message: "Hủy đơn hàng thành công",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Hủy đơn hàng thất bại",
      }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
