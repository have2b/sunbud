import { Prisma, PrismaClient } from "@/generated/prisma";
import { makeResponse } from "@/utils/make-response";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { generateAccountDeactivationEmail } from "@/lib/emailTemplates";

const db = new PrismaClient();

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

  const user = await db.user.findUnique({
    where: { id },
    include: {
      shippedOrders: {
        where: {
          status: "SHIPPING",
        },
      },
    },
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

  if (user.role === "SHIPPER" && user.shippedOrders.length > 0) {
    return NextResponse.json(
      makeResponse({
        status: 400,
        data: {},
        message:
          "Tài khoản này đang có đơn hàng đang giao. Vui lòng hoàn tất hoặc chuyển giao đơn hàng trước khi thay đổi vai trò",
      }),
      { status: 400 },
    );
  }

  const updateData: Prisma.UserUpdateInput = {
    isVerified: !user.isVerified,
  };

  const updated = await db.user.update({
    data: updateData,
    where: { id },
  });
  if (!updated) {
    return NextResponse.json(
      makeResponse({
        status: 404,
        data: {},
        message: "Người dùng không tồn tại",
      }),
      { status: 404 },
    );
  }

  // Send deactivation email if user is being deactivated (isVerified changed from true to false)
  if (user.isVerified && !updated.isVerified) {
    try {
      const deactivationTime = new Date().toLocaleString("vi-VN");
      const reason = "Tài khoản của bạn đã bị vô hiệu hóa bởi quản trị viên.";
      
      const emailContent = generateAccountDeactivationEmail(
        user.firstName,
        user.lastName,
        user.email,
        deactivationTime,
        reason
      );
      
      await sendEmail(user.email, emailContent.subject, emailContent.html);
    } catch (error) {
      console.error("Failed to send deactivation email:", error);
      // Continue with the response even if email sending fails
    }
  }

  const message = !user.isVerified
    ? "Kích hoạt người dùng thành công"
    : "Vô hiệu hóa người dùng thành công";

  return NextResponse.json(
    makeResponse({
      status: 200,
      data: updated,
      message,
    }),
    { status: 200 },
  );
}
