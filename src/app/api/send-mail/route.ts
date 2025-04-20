import { sendEmail } from "@/lib/email";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();
  await sendEmail(to, subject, html);
  return NextResponse.json(
    makeResponse({
      status: 200,
      data: {},
      message: "Gửi email thành công",
    }),
    { status: 200 },
  );
}
