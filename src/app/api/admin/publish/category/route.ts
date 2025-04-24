import { db } from "@/db/db";
import { categories } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

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
  const category = await db.query.categories.findFirst({
    where: eq(categories.id, id),
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
  const updated = await db
    .update(categories)
    .set({ isPublish: !category.isPublish })
    .where(eq(categories.id, id))
    .returning();
  if (updated.length === 0) {
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
      data: updated[0],
      message: !category.isPublish
        ? "Hiển thị danh mục thành công"
        : "Ẩn danh mục thành công",
    }),
    { status: 200 },
  );
}
