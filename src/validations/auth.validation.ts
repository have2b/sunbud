import * as v from "valibot";

export const loginSchema = v.object({
  emailOrUsername: v.pipe(v.string()),
  password: v.string(),
});

export type LoginSchema = v.InferOutput<typeof loginSchema>;

export const registerSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  ),
  email: v.pipe(v.string(), v.email("Địa chỉ email không hợp lệ")),
  phone: v.pipe(
    v.string(),
    v.regex(
      /^0[9835]\d{8}$/,
      "Số điện thoại không hợp lệ. Bắt đầu bằng 0, có 10 số và ký tự thứ 2 phải là 9,8,3,5",
    ),
  ),
  firstName: v.pipe(
    v.string(),
    v.minLength(2, "Họ phải có ít nhất 2 ký tự"),
    v.maxLength(50, "Họ không được vượt quá 50 ký tự"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(2, "Tên phải có ít nhất 2 ký tự"),
    v.maxLength(50, "Tên không được vượt quá 50 ký tự"),
  ),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    v.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
    ),
  ),
});

export type RegisterSchema = v.InferOutput<typeof registerSchema>;

export const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email("Địa chỉ email không hợp lệ")),
});

export type ForgotPasswordSchema = v.InferOutput<typeof forgotPasswordSchema>;
