import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function PUT(request: NextRequest) {
  const { id } = await request.json();
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

  const user = await db.user.findUnique({
    where: { id },
    include: {
      shippedOrders: {
        where: {
          status: "SHIPPING",
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Người dùng không tồn tại",
      }),
      { status: 404 },
    );
  }

  if (user.role === "SHIPPER" && user.shippedOrders.length > 0) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message:
          "Tài khoản này đang có đơn hàng đang giao. Vui lòng hoàn tất hoặc chuyển giao đơn hàng trước khi thay đổi vai trò",
      }),
      { status: 400 },
    );
  }

  const updateData: Prisma.UserUpdateInput = {
    isVerified: !user.isVerified,
  };

  const updated = await db.user.update({
    data: updateData,
    where: { id },
  });
  if (!updated) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Người dùng không tồn tại",
      }),
      { status: 404 },
    );
  }

  const message = !user.isVerified
    ? "Kích hoạt người dùng thành công"
    : "Vô hiệu hóa người dùng thành công";

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message,
    }),
    { status: 200 },
  );
}
