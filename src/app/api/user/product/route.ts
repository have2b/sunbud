import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // Filter parameters
    const searchTerm = searchParams.get("search");
    const categoryIds = searchParams.get("categories");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minQuantity = searchParams.get("minQuantity");
    const sortOption = searchParams.get("sort");

    // Build where object
    const where: Prisma.ProductWhereInput = {
      isPublish: true,
    };

    if (searchTerm && searchTerm.trim() !== "") {
      where.name = {
        contains: searchTerm,
        mode: "insensitive", // optional, for case-insensitive search
      };
    }

    if (categoryIds && categoryIds !== "") {
      const ids = categoryIds.split(",").map((id) => parseInt(id, 10));
      if (ids.length > 0) {
        where.categoryId = {
          in: ids,
        };
      }
    }

    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      };
    }

    if (minQuantity) {
      where.quantity = {
        gte: Number(minQuantity),
      };
    }

    // Setup orderBy for Prisma if possible
    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortOption === "price-asc"
        ? { price: "asc" }
        : sortOption === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" }; // Default sorting

    // Get total count and paginated data in parallel
    const [total, productsData] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: {
          data: productsData,
          total: total,
        },
        message: "Lấy sản phẩm thành công",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Lấy sản phẩm thất bại:", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lấy sản phẩm thất bại",
      }),
      { status: 500 },
    );
  }
}
