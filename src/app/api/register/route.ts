import { db } from "@/db/db";
import { users } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, email, firstName, lastName, phone, password } =
    await request.json();

  const isEmailExists = await db.query.users.findFirst({
    where: or(eq(users.email, email)),
  });

  const isUsernameExists = await db.query.users.findFirst({
    where: or(eq(users.username, username)),
  });

  const isPhoneExists = await db.query.users.findFirst({
    where: or(eq(users.phone, phone)),
  });

  if (isEmailExists) {
    return NextResponse.json(
      makeResponse({ status: 409, data: {}, message: "Email has been used" }),
      { status: 409 },
    );
  }

  if (isUsernameExists) {
    return NextResponse.json(
      makeResponse({
        status: 409,
        data: {},
        message: "Username has been used",
      }),
      { status: 409 },
    );
  }

  if (isPhoneExists) {
    return NextResponse.json(
      makeResponse({ status: 409, data: {}, message: "Phone has been used" }),
      { status: 409 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    username,
    email,
    passwordHash: hashedPassword,
    firstName,
    lastName,
    phone: "",
    role: "USER",
  });

  const response = NextResponse.json(
    makeResponse({
      status: 200,
      data: {},
      message: "Register successful",
    }),
    { status: 200 },
  );

  return response;
}
