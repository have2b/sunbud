import { db } from "@/db/db";
import { products } from "@/db/schema";
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
        message: "ID sản phẩm là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
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
  const updated = await db
    .update(products)
    .set({ isPublish: !product.isPublish })
    .where(eq(products.id, id))
    .returning();
  if (updated.length === 0) {
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
      data: updated[0],
      message: !product.isPublish
        ? "Đã xuất bản sản phẩm thành công"
        : "Đã hủy xuất bản sản phẩm thành công",
    }),
    { status: 200 },
  );
}
