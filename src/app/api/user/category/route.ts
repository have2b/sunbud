import { db } from "@/db/db";
import { categories } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = Number(idParam);
    const category = await db.query.categories.findFirst({
      where: and(eq(categories.isPublish, true), eq(categories.id, id)),
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
    return NextResponse.json(
      makeResponse({
        status: 200,
        data: category,
        message: "Lấy danh mục thành công",
      }),
      { status: 200 },
    );
  }

  const allCategories = await db.query.categories.findMany({
    where: eq(categories.isPublish, true),
  });
  return NextResponse.json(
    makeResponse({
      status: 200,
      data: allCategories,
      message: "Lấy danh sách danh mục thành công",
    }),
    { status: 200 },
  );
}
