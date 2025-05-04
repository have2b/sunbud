import {
  DeliveryMethod,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  PrismaClient,
} from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { format } from "date-fns";
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
  const user = searchParams.get("user");
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status")?.toUpperCase() as OrderStatus;
  const paymentStatus = searchParams
    .get("paymentStatus")
    ?.toUpperCase() as PaymentStatus;
  const paymentMethod = searchParams
    .get("paymentMethod")
    ?.toUpperCase() as PaymentMethod;
  const deliveryMethod = searchParams
    .get("deliveryMethod")
    ?.toUpperCase() as DeliveryMethod;
  const minTotal = searchParams.get("minTotal");
  const maxTotal = searchParams.get("maxTotal");

  const conditions: Prisma.OrderWhereInput[] = [];
  if (user)
    conditions.push({
      OR: [
        { user: { firstName: { contains: user } } },
        { user: { lastName: { contains: user } } },
      ],
    });
  if (orderCode) conditions.push({ orderCode: { contains: orderCode } });
  if (status) conditions.push({ status });
  if (paymentStatus) conditions.push({ paymentStatus });
  if (paymentMethod) conditions.push({ paymentMethod });
  if (deliveryMethod) conditions.push({ deliveryMethod });
  if (minTotal) conditions.push({ totalAmount: { gte: Number(minTotal) } });
  if (maxTotal) conditions.push({ totalAmount: { lte: Number(maxTotal) } });

  const whereCondition = conditions.length ? { AND: conditions } : undefined;

  const [total, orders] = await Promise.all([
    db.order.count({ where: whereCondition }),
    db.order.findMany({
      where: whereCondition,
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
      orderCode: format(new Date(), "yyMMddHHmmss"),
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
    status,
    paymentStatus,
    paymentMethod,
    deliveryMethod,
    address,
    phone,
  } = await request.json();
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

  // Get the current order to check for status change
  const currentOrder = await db.order.findUnique({
    where: { id: Number(id) },
    select: { status: true },
  });

  if (!currentOrder) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Đơn hàng không tồn tại",
      }),
      { status: 404 },
    );
  }

  // Check if status is changing from VERIFIED to SHIPPING
  const isChangingToShipping =
    currentOrder.status === OrderStatus.VERIFIED &&
    status === OrderStatus.SHIPPING;

  // Prepare data for update
  const updateData: Prisma.OrderUpdateInput = {
    status: status as OrderStatus,
    paymentStatus: paymentStatus as PaymentStatus,
    paymentMethod: paymentMethod as PaymentMethod,
    deliveryMethod: deliveryMethod as DeliveryMethod,
    address,
    phone,
  };

  // If status is changing to SHIPPING, assign a shipper
  if (isChangingToShipping) {
    // Find verified shippers with the count of their current assigned orders
    const shippersWithOrderCounts = await db.user.findMany({
      where: {
        role: "SHIPPER",
        isVerified: true,
      },
      select: {
        id: true,
        _count: {
          select: {
            shippedOrders: {
              where: {
                OR: [{ status: OrderStatus.SHIPPING }],
              },
            },
          },
        },
      },
      // Sort manually by order count since we can't directly orderBy _count in this version of Prisma
    });

    // Manually sort shippers by order count
    const sortedShippers = shippersWithOrderCounts.sort((a, b) => {
      // First sort by the number of ongoing shipping orders
      const aCount = a._count.shippedOrders;
      const bCount = b._count.shippedOrders;

      if (aCount !== bCount) {
        return aCount - bCount; // Sort ascending by count
      }

      // If counts are equal, sort by ID for consistency
      return a.id - b.id;
    });

    // Assign the first available shipper if any exists
    if (sortedShippers.length > 0) {
      updateData.shipper = { connect: { id: sortedShippers[0].id } };
    }
  }

  // Update the order
  let updated;
  try {
    updated = await db.order.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        shipper: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lỗi khi cập nhật đơn hàng",
      }),
      { status: 500 },
    );
  }

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message:
        updated.shipper && isChangingToShipping
          ? `Cập nhật đơn hàng thành công và đã giao cho shipper ${updated.shipper.firstName} ${updated.shipper.lastName}`
          : "Cập nhật đơn hàng thành công",
    }),
    { status: 200 },
  );
}
