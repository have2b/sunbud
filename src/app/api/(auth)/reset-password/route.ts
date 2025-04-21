import { db } from "@/db/db";
import { users } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { generateForgotPasswordEmail } from "@/lib/emailTemplates";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Password requirements from constants
const passwordRequirements = [
  (pw: string) => pw.length >= 8,
  (pw: string) => /[^A-Za-z0-9]/.test(pw),
  (pw: string) => /[A-Z]/.test(pw),
  (pw: string) => /[0-9]/.test(pw),
];

function generatePassword(): string {
  const specials = "!@#$%^&*()_+-={}[]:\";'<>?,./";
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  let password = "";
  // Ensure at least one of each required type
  password += specials[Math.floor(Math.random() * specials.length)];
  password += uppers[Math.floor(Math.random() * uppers.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  // Fill the rest
  while (password.length < 8) {
    const all = specials + lowers + uppers + digits;
    password += all[Math.floor(Math.random() * all.length)];
  }
  // Shuffle
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");
  // Check requirements
  if (passwordRequirements.every((fn) => fn(password))) {
    return password;
  }
  // Retry recursively (should succeed quickly)
  return generatePassword();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 },
      );
    }
    // Lookup user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    // Always return the same message for privacy
    const genericResponse = {
      success: true,
      message:
        "Nếu email của bạn được dùng để đăng ký, hệ thống sẽ gửi mật khẩu mới tới email của bạn.",
    };
    if (!user) {
      // Respond as if successful
      return NextResponse.json(genericResponse);
    }
    // Generate new password
    const newPassword = generatePassword();
    const hashed = await bcrypt.hash(newPassword, 10);
    // Update password in DB
    await db
      .update(users)
      .set({ passwordHash: hashed })
      .where(eq(users.id, user.id));
    // Send email
    const { subject, html } = generateForgotPasswordEmail(
      user.firstName,
      user.lastName,
      newPassword,
    );
    await sendEmail(user.email, subject, html);
    return NextResponse.json(genericResponse);
  } catch (err) {
    // Log error but do not leak info
    console.error("Password reset error", err);
    return NextResponse.json({
      success: true,
      message:
        "Nếu email của bạn được dùng để đăng ký, hệ thống sẽ gửi mật khẩu mới tới email của bạn.",
    });
  }
}
