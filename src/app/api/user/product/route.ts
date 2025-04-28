import { db } from "@/db/db";
import { products } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { and, eq, gte, inArray, like, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");
    const categoryIds = searchParams.get("categories");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minQuantity = searchParams.get("minQuantity");
    const sortOption = searchParams.get("sort");

    // Build where conditions
    const whereConditions = [];

    // Add search condition if search term is provided
    if (searchTerm && searchTerm.trim() !== "") {
      whereConditions.push(like(products.name, `%${searchTerm}%`));
    }

    // Add category filter if categoryIds are provided
    if (categoryIds && categoryIds !== "") {
      const ids = categoryIds.split(",").map((id) => parseInt(id, 10));
      if (ids.length > 0) {
        whereConditions.push(inArray(products.categoryId, ids));
      }
    }

    // Add price range filter
    if (minPrice && minPrice !== "") {
      whereConditions.push(gte(products.price, minPrice));
    }

    if (maxPrice && maxPrice !== "") {
      whereConditions.push(lte(products.price, maxPrice));
    }

    // Add minimum quantity filter
    if (minQuantity && minQuantity !== "") {
      whereConditions.push(gte(products.quantity, parseInt(minQuantity, 10)));
    }

    // Only show published products
    whereConditions.push(eq(products.isPublish, true));

    // Create the where clause
    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Query the products
    const query = db.query.products.findMany({
      where: whereClause,
      with: {
        category: true,
      },
    });

    // Execute the query
    const productsData = await query;
    console.log(productsData);

    // Apply sorting after fetching data
    if (sortOption) {
      switch (sortOption) {
        case "price-asc":
          productsData.sort((a, b) => Number(a.price) - Number(b.price));
          break;
        case "price-desc":
          productsData.sort((a, b) => Number(b.price) - Number(a.price));
          break;
        case "popularity":
          // Placeholder for popularity (could be based on views/sales)
          break;
        case "newest":
        default:
          productsData.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
      }
    }

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: {
          products: productsData,
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
