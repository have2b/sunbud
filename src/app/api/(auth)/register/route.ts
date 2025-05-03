import { PrismaClient } from "@/generated/prisma";
import { sendEmail } from "@/lib/email";
import { generateOtpEmail } from "@/lib/emailTemplates";
import { makeResponse } from "@/utils/make-response";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request: NextRequest) {
  const { username, email, firstName, lastName, phone, password } =
    await request.json();

  const existingUserWithEmail = await db.user.findFirst({
    where: { email },
  });

  const isUsernameExists = await db.user.findFirst({
    where: { username },
  });

  const isPhoneExists = await db.user.findFirst({
    where: { phone },
  });

  if (existingUserWithEmail) {
    // Always return error if email already exists, regardless of verification status
    // This prevents duplicate registrations with the same email
    return NextResponse.json(
      makeResponse({ status: 409, data: {}, message: "Email đã được sử dụng" }),
      { status: 409 },
    );
  }

  if (isUsernameExists) {
    return NextResponse.json(
      makeResponse({
        status: 409,
        data: {},
        message: "Tên đăng nhập đã tồn tại",
      }),
      { status: 409 },
    );
  }

  if (isPhoneExists) {
    return NextResponse.json(
      makeResponse({
        status: 409,
        data: {},
        message: "Số điện thoại đã tồn tại",
      }),
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarUrl = `https://api.dicebear.com/5.x/identicon/svg?seed=${randomUUID()}`;

  const otp = randomUUID().slice(0, 6);

  await db.user.create({
    data: {
      username,
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      phone,
      avatarUrl,
      role: "USER",
      otp,
    },
  });

  const { subject, html } = generateOtpEmail(firstName, lastName, otp);
  await sendEmail(email, subject, html);

  const response = NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        otpExpiry: new Date().getTime() + 60000, // 1 minutes
      },
      message: "Đăng ký thành công",
    }),
    { status: 200 },
  );

  return response;
}
