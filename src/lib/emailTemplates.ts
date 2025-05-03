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
    <p style="font-size: 12px; color: #cccccc; text-align: center;"> 2025 Blossomy. Mọi quyền được bảo lưu.</p>
  </div>
</div>
`;

  const text = `Xin chào ${firstName} ${lastName},

Mã OTP của bạn là: ${otp}
Mã này có hiệu lực trong 1 phút. Vui lòng không chia sẻ mã với bất kỳ ai.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.`;

  return { subject, html, text };
}

export function generateForgotPasswordEmail(
  firstName: string,
  lastName: string,
  newPassword: string,
): { subject: string; html: string; text: string } {
  const subject = "Mật khẩu mới của bạn";
  const html = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #333333;">Xin chào ${firstName} ${lastName},</h2>
    <p style="font-size: 16px; color: #555555;">Bạn (hoặc ai đó) vừa yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="display: inline-block; padding: 15px 30px; background-color: #ffe4e6; color: #000000; font-size: 28px; font-weight: bold; letter-spacing: 2px; border-radius: 8px;">
        ${newPassword}
      </div>
    </div>
    <p style="font-size: 16px; color: #555555;">Hãy đăng nhập bằng mật khẩu mới này và đổi lại mật khẩu ngay sau khi đăng nhập để đảm bảo an toàn cho tài khoản của bạn.</p>
    <p style="font-size: 14px; color: #999999;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.</p>
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />
    <p style="font-size: 12px; color: #cccccc; text-align: center;"> 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
  </div>
</div>
`;
  const text = `Xin chào ${firstName} ${lastName},\n\nMật khẩu mới của bạn là: ${newPassword}\nHãy đăng nhập và đổi lại mật khẩu ngay sau khi đăng nhập. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ.`;
  return { subject, html, text };
}

export function generateAccountDeactivationEmail(
  firstName: string,
  lastName: string,
  accountIdentifier: string,
  deactivationTime: string,
  reason: string,
): { subject: string; html: string; text: string } {
  const subject = "Thông báo vô hiệu hóa tài khoản";

  const html = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 40px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #333333;">Kính gửi ${firstName} ${lastName},</h2>
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Tài khoản <strong>${accountIdentifier}</strong> của bạn trên hệ thống Blossomy đã bị vô hiệu hóa vào lúc 
      <strong>${deactivationTime}</strong> bởi quản lý hệ thống.
    </p>
    
    <div style="background-color: #fff3f5; padding: 20px; border-radius: 8px; margin: 25px 0;">
      <p style="margin: 0; font-size: 16px; color: #555555;">
        <strong>Lý do:</strong><br/>
        ${reason}
      </p>
    </div>

    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Trong thời gian tài khoản bị vô hiệu hóa, bạn sẽ không thể đăng nhập hoặc sử dụng các chức năng của hệ thống.
    </p>

    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px;">
      <p style="font-size: 14px; color: #555555; text-align: center; margin: 0;">
        Nếu cho rằng đây là sự nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ!
      </p>
    </div>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #eeeeee;" />
    <p style="font-size: 12px; color: #cccccc; text-align: center;">© 2025 Blossomy. Mọi quyền được bảo lưu.</p>
  </div>
</div>
`;

  const text = `Kính gửi ${firstName} ${lastName},

Tài khoản ${accountIdentifier} của bạn trên hệ thống Blossomy đã bị vô hiệu hóa vào lúc ${deactivationTime}.

Lý do: ${reason}

Trong thời gian tài khoản bị vô hiệu hóa, bạn sẽ không thể đăng nhập hoặc sử dụng các chức năng của hệ thống.

Nếu cho rằng đây là sự nhầm lẫn, vui lòng liên hệ bộ phận hỗ trợ!

© 2025 Blossomy. Mọi quyền được bảo lưu.`;

  return { subject, html, text };
}
