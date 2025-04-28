import { PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "OTP là bắt buộc" }),
      { status: 400 },
    );
  }

  const user = await db.user.findFirst({
    where: { otp },
  });

  if (!user) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "OTP không hợp lệ" }),
      { status: 400 },
    );
  }

  await db.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: "" },
  });

  return NextResponse.json(
    makeResponse({ status: 200, data: {}, message: "Xác nhận OTP thành công" }),
    { status: 200 },
  );
}
