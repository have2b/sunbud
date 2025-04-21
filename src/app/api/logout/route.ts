import { makeResponse } from "@/utils/make-response";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    makeResponse({ status: 200, data: {}, message: "Đăng xuất thành công" }),
    { status: 200 },
  );

  // Clear JWT cookie
  response.cookies.set("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });

  return response;
}
