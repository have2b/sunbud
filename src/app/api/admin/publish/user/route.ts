import { db } from "@/db/db";
import { users } from "@/db/schema";
import { makeResponse } from "@/utils/make-response";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message: "ID là bắt buộc",
      }),
      { status: 400 },
    );
  }
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
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
  const updated = await db
    .update(users)
    .set({ isVerified: !user.isVerified })
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
      data: updated[0],
      message: !user.isVerified
        ? "Kích hoạt người dùng thành công"
        : "Vô hiệu hóa người dùng thành công",
    }),
    { status: 200 },
  );
}
