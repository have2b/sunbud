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
  firstName: v.string(),
  lastName: v.string(),
  password: v.string(),
});

export type RegisterSchema = v.InferOutput<typeof registerSchema>;
