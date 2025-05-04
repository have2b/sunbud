import {
  DeliveryMethod,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
} from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { format } from "date-fns";
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

    // Parse request body
    const {
      items,
      paymentMethod,
      address,
      phone,
      deliveryMethod,
      paymentStatus,
      totalAmount,
    } = await request.json();

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "Đơn hàng phải có ít nhất một sản phẩm",
        }),
        { status: 400 },
      );
    }

    // Verify products exist and have enough stock
    const productIds = items.map(
      (item: { productId: number }) => item.productId,
    );
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "Một hoặc nhiều sản phẩm không tồn tại",
        }),
        { status: 400 },
      );
    }

    // Check stock and prepare order items
    const orderItems: Array<{
      productId: number;
      quantity: number;
      price: (typeof products)[0]["price"]; // Using the same type as in the Product model
    }> = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        return NextResponse.json(
          makeResponse({
            status: 400,
            data: {},
            message: `Sản phẩm có ID ${item.productId} không tồn tại`,
          }),
          { status: 400 },
        );
      }

      if (product.quantity < item.quantity) {
        return NextResponse.json(
          makeResponse({
            status: 400,
            data: {},
            message: `Không đủ số lượng cho sản phẩm "${product.name}"`,
          }),
          { status: 400 },
        );
      }

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderCode: format(new Date(), "HHmmss"),
          totalAmount,
          paymentMethod: (paymentMethod as PaymentMethod) || PaymentMethod.BANK,
          paymentStatus:
            (paymentStatus as PaymentStatus) || PaymentStatus.PENDING,
          address,
          phone,
          deliveryMethod:
            (deliveryMethod as DeliveryMethod) || DeliveryMethod.SHIPPING,
          items: {
            create: orderItems,
          },
          user: {
            connect: { id: user.id },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product quantities
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: order,
        message: "Tạo đơn hàng thành công",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Tạo đơn hàng thất bại",
      }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
