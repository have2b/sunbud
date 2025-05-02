import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
  ShippingStatus,
} from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

// GET: single or list with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

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
  const shipperId = parseInt(payload.userId as string, 10);

  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const order = await db.order.findFirst({
      where: { id: idParam, shipperId },
      include: { items: true },
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
    return NextResponse.json(
      makeResponse({
        status: 200,
        data: order,
        message: "Lấy đơn hàng thành công",
      }),
      { status: 200 },
    );
  }

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("paymentStatus");
  const shippingStatus = searchParams.get("shippingStatus");
  const paymentMethod = searchParams.get("paymentMethod");
  const minTotal = searchParams.get("minTotal");
  const maxTotal = searchParams.get("maxTotal");

  const conditions: Prisma.OrderWhereInput[] = [];
  if (userId) conditions.push({ userId: Number(userId) });
  if (status) conditions.push({ status: status as OrderStatus });
  if (paymentStatus)
    conditions.push({ paymentStatus: paymentStatus as PaymentStatus });
  if (paymentMethod)
    conditions.push({ paymentMethod: paymentMethod as PaymentMethod });
  if (shippingStatus)
    conditions.push({ shippingStatus: shippingStatus as ShippingStatus });
  if (minTotal) conditions.push({ totalAmount: { gte: Number(minTotal) } });
  if (maxTotal) conditions.push({ totalAmount: { lte: Number(maxTotal) } });

  const whereCondition = conditions.length ? { AND: conditions } : undefined;

  const [total, orders] = await Promise.all([
    db.order.count({ where: { ...whereCondition, shipperId } }),
    db.order.findMany({
      where: { ...whereCondition, shipperId },
      include: {
        items: true,
        user: { select: { firstName: true, lastName: true, phone: true } },
        shipper: { select: { firstName: true, lastName: true, phone: true } },
      },
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: { data: orders, total },
      message: "Lấy danh sách đơn hàng thành công",
    }),
    { status: 200 },
  );
}

// PUT: update existing order
export async function PUT(request: NextRequest) {
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
  const shipperId = parseInt(payload.userId as string, 10);
  const { id, shippingStatus } = await request.json();
  if (!id) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID là bắt buộc",
      }),
      { status: 400 },
    );
  }
  let updated;
  try {
    updated = await db.order.update({
      where: { id: Number(id), shipperId: Number(shipperId) },
      data: {
        shippingStatus: shippingStatus as ShippingStatus,
      },
    });
  } catch {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Đơn hàng không tồn tại",
      }),
      { status: 404 },
    );
  }
  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message: "Cập nhật đơn hàng thành công",
    }),
    { status: 200 },
  );
}
