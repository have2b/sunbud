import { db } from "@/db/db";
import type { User } from "@/db/schema";
import { users } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { omit } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = Number(searchParams.get("id"));
  if (idParam) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, idParam),
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

  const conditions = [];
  if (username) conditions.push(ilike(users.username, `%${username}%`));
  if (email) conditions.push(ilike(users.email, `%${email}%`));
  if (firstName) conditions.push(ilike(users.firstName, `%${firstName}%`));
  if (lastName) conditions.push(ilike(users.lastName, `%${lastName}%`));
  if (phone) conditions.push(ilike(users.phone, `%${phone}%`));
  conditions.push(eq(users.role, "USER"));

  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(conditions.length ? and(...conditions) : undefined);
  const total = totalResult[0].count;

  const usersList = await db.query.users.findMany({
    where: conditions.length ? and(...conditions) : undefined,
    orderBy: [desc(users.isVerified), asc(users.username)],
    offset: (page - 1) * limit,
    limit,
  });

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {
        data: usersList.map((user) => omit(user, ["passwordHash", "otp"])),
        total,
      },
      message: "Lấy danh sách người dùng thành công",
    }),
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const { username, email, password, firstName, lastName, phone, avatarUrl } =
    await request.json();
  if (!username || !email || !password || !firstName || !lastName || !phone) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message:
          "username, email, password, firstName, lastName, phone là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const otp = randomUUID().slice(0, 6);

  const inserted = await db
    .insert(users)
    .values({
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      phone,
      avatarUrl: avatarUrl || null,
      otp,
      role: "USER",
    })
    .returning();
  const created = inserted[0];

  return NextResponse.json(
    makeResponse({
      status: 201,
      data: omit(created, ["passwordHash", "otp"]),
      message: "Tạo người dùng thành công",
    }),
    { status: 201 },
  );
}

export async function PUT(request: NextRequest) {
  const { id, email, password, firstName, lastName, phone, avatarUrl } =
    await request.json();
  if (!id) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "ID là bắt buộc" }),
      { status: 400 },
    );
  }
  const dataToUpdate: Partial<User> = {
    email,
    firstName,
    lastName,
    phone,
    avatarUrl: avatarUrl || null,
  };
  if (password) dataToUpdate.passwordHash = await bcrypt.hash(password, 10);

  const updated = await db
    .update(users)
    .set(dataToUpdate)
    .where(eq(users.id, id))
    .returning();
  if (updated.length === 0) {
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
      data: omit(updated[0], ["passwordHash", "otp"]),
      message: "Cập nhật người dùng thành công",
    }),
    { status: 200 },
  );
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      makeResponse({ status: 400, data: {}, message: "ID là bắt buộc" }),
      { status: 400 },
    );
  }
  const deleted = await db.delete(users).where(eq(users.id, id)).returning();
  if (deleted.length === 0) {
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
      data: {},
      message: "Xóa người dùng thành công",
    }),
    { status: 200 },
  );
}
