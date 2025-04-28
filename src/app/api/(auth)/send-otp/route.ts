import { PrismaClient } from "@/generated/prisma";
import { sendEmail } from "@/lib/email";
import { generateOtpEmail } from "@/lib/emailTemplates";
import { makeResponse } from "@/utils/make-response";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "Email là bắt buộc" }),
      { status: 400 },
    );
  }

  const user = await db.user.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Người dùng không tồn tại",
      }),
      { status: 404 },
    );
  }

  const otp = randomUUID().slice(0, 6);
  await db.user.update({
    where: { email },
    data: { otp },
  });

  const { subject, html } = generateOtpEmail(
    user.firstName,
    user.lastName,
    otp,
  );
  await sendEmail(email, subject, html);

  const otpExpiry =
    new Date().getTime() + Number(process.env.OTP_EXPIRED_TIME!) * 60000;

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: { otpExpiry },
      message: "Gửi lại OTP thành công",
    }),
    { status: 200 },
  );
}
