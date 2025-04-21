export function generateOtpEmail(
  firstName: string,
  lastName: string,
  otp: string,
): { subject: string; html: string; text: string } {
  const subject = "Xác nhận tài khoản";
  const expiresTime = Number(process.env.OTP_EXPIRED_TIME!);

  const html = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #333333;">Xin chào ${firstName} ${lastName},</h2>
    <p style="font-size: 16px; color: #555555;">Bạn đã yêu cầu mã OTP để xác nhận tài khoản của mình.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; padding: 15px 30px; background-color: #ffe4e6; color: #000000; font-size: 28px; font-weight: bold; letter-spacing: 2px; border-radius: 8px;">
        ${otp}
      </div>
    </div>

    <p style="font-size: 16px; color: #555555;">Mã này có hiệu lực trong vòng <strong>${expiresTime} phút</strong>. Vui lòng <strong>không chia sẻ</strong> mã này với bất kỳ ai.</p>
    <p style="font-size: 14px; color: #999999;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />
    <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
  </div>
</div>
`;

  const text = `Xin chào ${firstName} ${lastName},

Mã OTP của bạn là: ${otp}
Mã này có hiệu lực trong 1 phút. Vui lòng không chia sẻ mã với bất kỳ ai.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.`;

  return { subject, html, text };
}
