import { db } from "@/db/db";
import { categories } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Handle single category request
  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const category = await db.query.categories.findFirst({
      where: eq(categories.id, idParam),
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

  // Handle list request with pagination and filters
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const isPublish = searchParams.get("isPublish");

  // Build filter conditions
  const conditions = [];

  if (name) {
    conditions.push(ilike(categories.name, `%${name}%`));
  }

  if (description) {
    conditions.push(ilike(categories.description, `%${description}%`));
  }

  if (isPublish) {
    conditions.push(eq(categories.isPublish, isPublish === "true"));
  }

  // Get total count
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories)
    .where(conditions.length ? and(...conditions) : undefined);

  const total = totalResult[0].count;

  // Get paginated results
  const categoriesList = await db.query.categories.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(categories.isPublish), asc(categories.name)],
    offset: (page - 1) * limit,
    limit: limit,
  });

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: categoriesList,
        total: total,
      },
      message: "Lấy danh sách danh mục thành công",
    }),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const { name, description, isPublish } = await request.json();
  if (!name) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "Tên danh mục là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const inserted = await db
    .insert(categories)
    .values({ name, description, isPublish })
    .returning();
  const created = inserted[0];
  return NextResponse.json(
    makeResponse({
      status: 201,
      data: created,
      message: "Tạo danh mục thành công",
    }),
    { status: 201 },
  );
}

export async function PUT(request: NextRequest) {
  const { id, name, description, isPublish } = await request.json();
  if (!id || !name) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID và tên danh mục là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const updated = await db
    .update(categories)
    .set({ name, description, isPublish })
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
      message: "Cập nhật danh mục thành công",
    }),
    { status: 200 },
  );
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "ID là bắt buộc" }),
      { status: 400 },
    );
  }
  const deleted = await db
    .update(categories)
    .set({ isPublish: false })
    .where(eq(categories.id, id))
    .returning();
  if (deleted.length === 0) {
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
    makeResponse({ status: 200, data: {}, message: "Ẩn danh mục thành công" }),
    { status: 200 },
  );
}
