import { JOSEError, JWTExpired } from "jose/errors";
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/utils";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;

  try {
    if (!token) {
      throw new Error("No token provided");
    }

    const payload = await verifyJWT(token);
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      payload.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    if (error instanceof JWTExpired) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (error instanceof JOSEError) {
      console.error("JWT verification failed: ", error.code);
    } else {
      console.error("JWT verification failed: ", error);
    }

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
