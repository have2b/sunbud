import { PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Function to get categories
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = searchParams.get("id");

  if (idParam) {
    const id = Number(idParam);
    const category = await prisma.category.findFirst({
      where: { id, isPublish: true },
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

  const allCategories = await prisma.category.findMany({
    where: { isPublish: true },
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
