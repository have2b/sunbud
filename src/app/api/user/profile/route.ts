import { PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { hash } from "bcryptjs";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies for authentication
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        makeResponse({
          status: 401,
          data: {},
          message: "Lỗi xác thực, vui lòng đăng nhập",
        }),
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = parseInt(payload.userId as string, 10);

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        makeResponse({
          status: 404,
          data: {},
          message: "Lỗi xác thực, người dùng không tồn tại",
        }),
        { status: 404 },
      );
    }

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: user,
        message: "Lấy thông tin người dùng thành công",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/user/profile error", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lỗi khi lấy thông tin người dùng",
      }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get JWT token from cookies for authentication
    const token = request.cookies.get("jwt")?.value;

    if (!token) {
      return NextResponse.json(
        makeResponse({
          status: 401,
          data: {},
          message: "Lỗi xác thực, vui lòng đăng nhập",
        }),
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = parseInt(payload.userId as string, 10);

    const requestData = await request.json();

    const updateData = {
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      email: requestData.email,
      phone: requestData.phone,
      avatarUrl: requestData.avatarUrl || "",
    };

    if (requestData.password) {
      const saltRounds = 10;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).passwordHash = await hash(
        requestData.password,
        saltRounds,
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, otp, ...userWithoutSensitiveData } = updatedUser;

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: userWithoutSensitiveData,
        message: "Cập nhật thông tin người dùng thành công",
      }),
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("PATCH /api/user/profile error", error);

    if (error && error.code === "P2002") {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "Email đã tồn tại trong hệ thống",
        }),
        { status: 400 },
      );
    }

    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lỗi khi cập nhật thông tin người dùng",
      }),
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
