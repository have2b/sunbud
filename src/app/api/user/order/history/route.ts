import { PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies for authentication
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        makeResponse({
          status: 401,
          data: [],
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
          data: [],
          message: "Lỗi xác thực, người dùng không tồn tại",
        }),
        { status: 404 },
      );
    }

    // Get all orders for the user
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent orders first
      },
    });

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: orders,
        message: "Lấy lịch sử đơn hàng thành công",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: [],
        message: "Lấy lịch sử đơn hàng thất bại",
      }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
