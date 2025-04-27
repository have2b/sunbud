import { db } from "@/db/db";
import { products } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const product = await db.query.products.findFirst({
      where: eq(products.id, idParam),
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

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: product,
        message: "Lấy sản phẩm thành công",
      }),
      { status: 200 },
    );
  }

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const isPublish = searchParams.get("isPublish");
  const categoryId = searchParams.get("categoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minQuantity = searchParams.get("minQuantity");
  const maxQuantity = searchParams.get("maxQuantity");

  const conditions = [];

  if (name) conditions.push(ilike(products.name, `%${name}%`));
  if (description)
    conditions.push(ilike(products.description, `%${description}%`));
  if (isPublish) conditions.push(eq(products.isPublish, isPublish === "true"));
  if (categoryId) conditions.push(eq(products.categoryId, Number(categoryId)));
  if (minPrice)
    conditions.push(sql`CAST(${products.price} AS DECIMAL) >= ${minPrice}`);
  if (maxPrice)
    conditions.push(sql`CAST(${products.price} AS DECIMAL) <= ${maxPrice}`);
  if (minQuantity)
    conditions.push(sql`${products.quantity} >= ${Number(minQuantity)}`);
  if (maxQuantity)
    conditions.push(sql`${products.quantity} <= ${Number(maxQuantity)}`);

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .where(conditions.length ? and(...conditions) : undefined);

  const total = totalResult[0].count;

  const productsList = await db.query.products.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(products.isPublish), asc(products.name)],
    offset: (page - 1) * limit,
    limit: limit,
  });

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: productsList,
        total: total,
      },
      message: "Lấy danh sách sản phẩm thành công",
    }),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    name,
    description,
    price,
    quantity,
    categoryId,
    isPublish,
    imageUrl,
  } = body;

  if (!name || !price || !categoryId) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "Tên, giá và danh mục là bắt buộc",
      }),
      { status: 400 },
    );
  }

  const inserted = await db
    .insert(products)
    .values({
      name,
      description,
      price: price.toString(),
      quantity: Number(quantity),
      imageUrl,
      categoryId: Number(categoryId),
      isPublish,
    })
    .returning();

  return NextResponse.json(
    makeResponse({
      status: 201,
      data: inserted[0],
      message: "Tạo sản phẩm thành công",
    }),
    { status: 201 },
  );
}

export async function PUT(request: NextRequest) {
  const { id, ...rest } = await request.json();

  if (!id || !rest.name || !rest.price || !rest.categoryId) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID, tên, giá và danh mục là bắt buộc",
      }),
      { status: 400 },
    );
  }

  const updated = await db
    .update(products)
    .set({
      ...rest,
      price: rest.price.toString(),
      quantity: Number(rest.quantity),
      imageUrl: rest.imageUrl,
      categoryId: Number(rest.categoryId),
    })
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
      message: "Cập nhật sản phẩm thành công",
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
    .update(products)
    .set({ isPublish: false })
    .where(eq(products.id, id))
    .returning();

  if (deleted.length === 0) {
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
    makeResponse({ status: 200, data: {}, message: "Ẩn sản phẩm thành công" }),
    { status: 200 },
  );
}
