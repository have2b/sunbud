import { PrismaClient } from "@/generated/prisma";
import { generateJWT } from "@/lib/utils";
import { LoginResponseDto } from "@/types/auth.dto";
import { makeResponse } from "@/utils/make-response";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function POST(request: NextRequest) {
  const { emailOrUsername, password } = await request.json();

  const user = await db.user.findFirst({
    where: {
      OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });

  if (!user) {
    return NextResponse.json(
      makeResponse({
        status: 401,
        data: {},
        message: "Tài khoản không tồn tại",
      }),
      { status: 401 },
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return NextResponse.json(
      makeResponse({ status: 401, data: {}, message: "Mật khẩu không đúng" }),
      { status: 401 },
    );
  }

  const token = await generateJWT({
    userId: user.id.toString(),
    role: user.role,
  });

  const response = NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        ...new LoginResponseDto({
          username: user.username,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          role: user.role,
        }),
        expiresIn: process.env.EXPIRED_TIME,
      },
      message: "Đăng nhập thành công",
    }),
    { status: 200 },
  );

  response.cookies.set("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 3600,
    path: "/",
  });

  return response;
}
