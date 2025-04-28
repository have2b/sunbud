import { PrismaClient } from "@/generated/prisma";
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
        message: "ID sản phẩm là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const product = await db.product.findFirst({
    where: { id },
  });
  if (!product) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Sản phẩm không tồn tại",
      }),
      { status: 404 },
    );
  }
  const updated = await db.product.update({
    data: { isPublish: !product.isPublish },
    where: { id },
  });
  if (!updated) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Sản phẩm không tồn tại",
      }),
      { status: 404 },
    );
  }
  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message: !product.isPublish
        ? "Đã xuất bản sản phẩm thành công"
        : "Đã hủy xuất bản sản phẩm thành công",
    }),
    { status: 200 },
  );
}
