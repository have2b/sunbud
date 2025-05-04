import { JOSEError, JWTExpired } from "jose/errors";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/utils";

type UserRole = "ADMIN" | "SHIPPER" | "USER";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  const pathname = request.nextUrl.pathname;

  // Early return for public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/unauthorized" ||
    pathname.startsWith("/shop") ||
    pathname.startsWith("/cart")
  ) {
    return NextResponse.next();
  }

  try {
    // Check for token existence
    if (!token) {
      throw new Error("No token provided");
    }

    const payload = await verifyJWT(token);
    const userRole = payload.role as UserRole;

    // Role-based access control checks
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/shipper") && userRole !== "SHIPPER") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // For API routes, apply additional role-based protection
    if (pathname.startsWith("/api/admin") && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    if (pathname.startsWith("/api/shipper") && userRole !== "SHIPPER") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 },
      );
    }

    return NextResponse.next();
  } catch (error) {
    // JWT validation errors
    if (error instanceof JWTExpired) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (error instanceof JOSEError) {
      console.error("JWT verification failed: ", error.code);
    } else {
      console.error("JWT verification failed: ", error);
    }

    // Return appropriate responses based on route type
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/account/:path*",
    "/orders/:path*",
    "/checkout/:path*",
    "/admin/:path*",
    "/shipper/:path*",
    "/api/users/:path*",
    "/api/checkout/:path*",
    "/api/admin/:path*",
  ],
};
