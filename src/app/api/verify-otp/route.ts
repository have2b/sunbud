import { db } from "@/db/db";
import { users } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "OTP là bắt buộc" }),
      { status: 400 },
    );
  }

  const user = await db.query.users.findFirst({
    where: eq(users.otp, otp),
  });

  if (!user) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "OTP không hợp lệ" }),
      { status: 400 },
    );
  }

  await db
    .update(users)
    .set({
      isVerified: true,
      otp: "",
    })
    .where(eq(users.otp, otp));

  return NextResponse.json(
    makeResponse({ status: 200, data: {}, message: "Xác nhận OTP thành công" }),
    { status: 200 },
  );
}
