import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    // If no IDs provided, return an error
    if (!idsParam) {
      return NextResponse.json(
        { error: "Missing product IDs" },
        { status: 400 },
      );
    }

    // Parse the comma-separated IDs
    const productIds = idsParam
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "Invalid product IDs" },
        { status: 400 },
      );
    }

    // Query for products with the specified IDs, only fetching the id and quantity
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        quantity: true,
        name: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching product stock:", error);
    return NextResponse.json(
      { error: "Failed to fetch product stock" },
      { status: 500 },
    );
  }
}
