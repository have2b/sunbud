import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const product = await db.product.findFirst({
      where: { id: idParam },
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

  const conditions: Prisma.ProductWhereInput[] = [];

  if (name) {
    conditions.push({ name: { contains: name, mode: "insensitive" } });
  }

  if (description) {
    conditions.push({
      description: { contains: description, mode: "insensitive" },
    });
  }

  if (isPublish) {
    conditions.push({ isPublish: isPublish === "true" });
  }

  if (categoryId) {
    conditions.push({ categoryId: Number(categoryId) });
  }

  if (minPrice) {
    conditions.push({ price: { gte: Number(minPrice) } });
  }

  if (maxPrice) {
    conditions.push({ price: { lte: Number(maxPrice) } });
  }

  if (minQuantity) {
    conditions.push({ quantity: { gte: Number(minQuantity) } });
  }

  if (maxQuantity) {
    conditions.push({ quantity: { lte: Number(maxQuantity) } });
  }

  const whereCondition = conditions.length ? { AND: conditions } : undefined;

  const [total, products] = await Promise.all([
    db.product.count({ where: whereCondition }),
    db.product.findMany({
      where: whereCondition,
      orderBy: [{ isPublish: "desc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: products,
        total: total,
      },
      message: "Lấy danh sách sản phẩm thành công",
    }),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const {
    name,
    description,
    price,
    quantity,
    categoryId,
    isPublish,
    imageUrl,
  } = await request.json();

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

  const inserted = await db.product.create({
    data: {
      name,
      description,
      price: price.toString(),
      quantity: quantity ? Number(quantity) : 0,
      imageUrl,
      categoryId: Number(categoryId),
      isPublish,
    },
  });

  return NextResponse.json(
    makeResponse({
      status: 201,
      data: inserted,
      message: "Tạo sản phẩm thành công",
    }),
    { status: 201 },
  );
}

export async function PUT(request: NextRequest) {
  const {
    id,
    name,
    description,
    price,
    quantity,
    categoryId,
    isPublish,
    imageUrl,
  } = await request.json();

  if (!id || !name || !price || !categoryId) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID, tên, giá và danh mục là bắt buộc",
      }),
      { status: 400 },
    );
  }

  const updated = await db.product.update({
    data: {
      name,
      description,
      price: price.toString(),
      quantity: quantity ? Number(quantity) : 0,
      imageUrl,
      categoryId: Number(categoryId),
      isPublish,
    },
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
      message: "Cập nhật sản phẩm thành công",
    }),
    { status: 200 },
  );
}
