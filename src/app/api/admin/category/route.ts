import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
const db = new PrismaClient();

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Handle single category request
  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const category = await db.category.findFirst({
      where: { id: idParam },
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
  const conditions: Prisma.CategoryWhereInput[] = [];

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

  const [total, categories] = await Promise.all([
    db.category.count({
      where: conditions.length ? { AND: conditions } : undefined,
    }),
    db.category.findMany({
      where: conditions.length ? { AND: conditions } : undefined,
      orderBy: [{ isPublish: "desc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: categories,
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
  const inserted = await db.category.create({
    data: { name, description, isPublish },
  });
  return NextResponse.json(
    makeResponse({
      status: 201,
      data: inserted,
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
  const updated = await db.category.update({
    data: { name, description, isPublish },
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
      message: "Cập nhật danh mục thành công",
    }),
    { status: 200 },
  );
}
