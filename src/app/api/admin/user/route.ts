import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { omit } from "lodash";
import { NextRequest, NextResponse } from "next/server";

const db = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = Number(searchParams.get("id"));

  if (idParam) {
    const user = await db.user.findUnique({
      where: { id: idParam },
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

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: omit(user, ["passwordHash"]),
        message: "Lấy thông tin người dùng thành công",
      }),
      { status: 200 },
    );
  }

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const username = searchParams.get("username");
  const email = searchParams.get("email");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");
  const phone = searchParams.get("phone");

  const where: Prisma.UserWhereInput = {
    role: "USER",
  };

  if (username) where.username = { contains: username, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };
  if (firstName) where.firstName = { contains: firstName, mode: "insensitive" };
  if (lastName) where.lastName = { contains: lastName, mode: "insensitive" };
  if (phone) where.phone = { contains: phone, mode: "insensitive" };

  const [total, usersList] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      orderBy: [{ isVerified: "desc" }, { username: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: usersList.map((u) => omit(u, ["passwordHash", "otp"])),
        total,
      },
      message: "Lấy danh sách người dùng thành công",
    }),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, firstName, lastName, phone, avatarUrl } =
      await request.json();

    if (!username || !email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        makeResponse({
          status: 400,
          data: {},
          message: "Các trường bắt buộc không được để trống",
        }),
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = randomUUID().slice(0, 6);

    const created = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        avatarUrl: avatarUrl || null,
        otp,
        role: "USER",
      },
    });

    return NextResponse.json(
      makeResponse({
        status: 201,
        data: omit(created, ["passwordHash", "otp"]),
        message: "Tạo người dùng thành công",
      }),
      { status: 201 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta?.target?.[0] ?? "";
      const fieldMessageMap: Record<string, string> = {
        username: "Tên người dùng đã tồn tại",
        email: "Email đã tồn tại",
        phone: "Số điện thoại đã tồn tại",
      };
      const message = fieldMessageMap[key] || "Dữ liệu đã được sử dụng";
      return NextResponse.json(
        makeResponse({
          status: 409,
          data: { errors: { [key]: message } },
          message,
        }),
        { status: 409 },
      );
    }
    console.error("POST /api/admin/user error", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lỗi máy chủ. Vui lòng thử lại sau",
      }),
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, email, password, firstName, lastName, phone, avatarUrl } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        makeResponse({ status: 400, data: {}, message: "ID là bắt buộc" }),
        { status: 400 },
      );
    }

    const dataToUpdate: Prisma.UserUpdateInput = {
      email,
      firstName,
      lastName,
      phone,
      avatarUrl: avatarUrl || null,
    };

    if (password) {
      dataToUpdate.passwordHash = await bcrypt.hash(password, 10);
    }

    const updated = await db.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(
      makeResponse({
        status: 200,
        data: omit(updated, ["passwordHash", "otp"]),
        message: "Cập nhật người dùng thành công",
      }),
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta?.target?.[0] ?? "";
      const fieldMessageMap: Record<string, string> = {
        username: "Tên người dùng đã tồn tại",
        email: "Email đã tồn tại",
        phone: "Số điện thoại đã tồn tại",
      };
      const message = fieldMessageMap[key] || "Dữ liệu đã được sử dụng";
      return NextResponse.json(
        makeResponse({
          status: 409,
          data: { errors: { [key]: message } },
          message,
        }),
        { status: 409 },
      );
    }
    console.error("PUT /api/admin/user error", error);
    return NextResponse.json(
      makeResponse({
        status: 500,
        data: {},
        message: "Lỗi máy chủ. Vui lòng thử lại sau",
      }),
      { status: 500 },
    );
  }
}
