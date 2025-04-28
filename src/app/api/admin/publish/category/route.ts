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
        message: "ID là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const category = await db.category.findFirst({
    where: { id },
  });
  if (!category) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Danh mục không tồn tại",
      }),
      { status: 404 },
    );
  }
  const updated = await db.category.update({
    data: { isPublish: !category.isPublish },
    where: { id },
  });
  if (!updated) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Danh mục không tồn tại",
      }),
      { status: 404 },
    );
  }
  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message: !category.isPublish
        ? "Hiển thị danh mục thành công"
        : "Ẩn danh mục thành công",
    }),
    { status: 200 },
  );
}
