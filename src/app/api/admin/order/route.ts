import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
} from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

// GET: single or list with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const order = await db.order.findFirst({
      where: { id: idParam },
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
  const paymentMethod = searchParams.get("paymentMethod");
  const deliveryMethod = searchParams.get("deliveryMethod");
  const minTotal = searchParams.get("minTotal");
  const maxTotal = searchParams.get("maxTotal");

  const conditions: Prisma.OrderWhereInput[] = [];
  if (userId) conditions.push({ userId: Number(userId) });
  if (status) conditions.push({ status: status as OrderStatus });
  if (paymentStatus)
    conditions.push({ paymentStatus: paymentStatus as PaymentStatus });
  if (paymentMethod)
    conditions.push({ paymentMethod: paymentMethod as PaymentMethod });
  if (deliveryMethod)
    conditions.push({ deliveryMethod: deliveryMethod as DeliveryMethod });
  if (minTotal) conditions.push({ totalAmount: { gte: Number(minTotal) } });
  if (maxTotal) conditions.push({ totalAmount: { lte: Number(maxTotal) } });

  const whereCondition = conditions.length ? { AND: conditions } : undefined;

  const [total, orders] = await Promise.all([
    db.order.count({ where: whereCondition }),
    db.order.findMany({
      where: whereCondition,
      include: { items: true },
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

// POST: create new order
export async function POST(request: NextRequest) {
  const {
    userId,
    status,
    paymentStatus,
    paymentMethod,
    deliveryMethod,
    address,
    phone,
    totalAmount,
  } = await request.json();
  if (!userId || !totalAmount) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "userId và totalAmount là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const inserted = await db.order.create({
    data: {
      userId: Number(userId),
      status: status as OrderStatus,
      paymentStatus: paymentStatus as PaymentStatus,
      paymentMethod: paymentMethod as PaymentMethod,
      deliveryMethod: deliveryMethod as DeliveryMethod,
      address,
      phone,
      totalAmount: totalAmount.toString(),
    },
  });
  return NextResponse.json(
    makeResponse({
      status: 201,
      data: inserted,
      message: "Tạo đơn hàng thành công",
    }),
    { status: 201 },
  );
}

// PUT: update existing order
export async function PUT(request: NextRequest) {
  const {
    id,
    userId,
    status,
    paymentStatus,
    paymentMethod,
    deliveryMethod,
    address,
    phone,
    totalAmount,
  } = await request.json();
  if (!id || !userId || !totalAmount) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID, userId và totalAmount là bắt buộc",
      }),
      { status: 400 },
    );
  }
  let updated;
  try {
    updated = await db.order.update({
      where: { id: Number(id) },
      data: {
        userId: Number(userId),
        status: status as OrderStatus,
        paymentStatus: paymentStatus as PaymentStatus,
        paymentMethod: paymentMethod as PaymentMethod,
        deliveryMethod: deliveryMethod as DeliveryMethod,
        address,
        phone,
        totalAmount: totalAmount.toString(),
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
