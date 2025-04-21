import { sendEmail } from "@/lib/email";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { to, subject, html } = await request.json();

  if (
    typeof to !== "string" ||
    typeof subject !== "string" ||
    typeof html !== "string"
  ) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message:
          "Missing or invalid fields: to, subject, and html are required.",
      }),
      { status: 400 },
    );
  }

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
