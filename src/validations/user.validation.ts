import * as v from "valibot";

export const insertUserSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(1, "Tên người dùng không được để trống"),
  ),
  email: v.string(),
  password: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  phone: v.string(),
});

export type InsertUserSchema = v.InferOutput<typeof insertUserSchema>;

export const updateUserSchema = v.object({
  id: v.number(),
  username: v.pipe(
    v.string(),
    v.minLength(1, "Tên người dùng không được để trống"),
  ),
  email: v.string(),
  firstName: v.string(),
  lastName: v.string(),
  phone: v.string(),
});

export type UpdateUserSchema = v.InferOutput<typeof updateUserSchema>;

export const profileFormSchema = v.object({
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
  email: v.pipe(
    v.string(), 
    v.minLength(1, "Email không được để trống"),
    v.email("Địa chỉ email không hợp lệ")
  ),
  phone: v.pipe(
    v.string(), 
    v.minLength(1, "Số điện thoại không được để trống"),
    v.regex(
      /^0[9835]\d{8}$/,
      "Số điện thoại không hợp lệ. Bắt đầu bằng 0, có 10 số và ký tự thứ 2 phải là 9,8,3,5"
    ),
  ),
  avatarUrl: v.pipe(v.string(), v.url("Đường dẫn ảnh đại diện không hợp lệ")),
});

export type ProfileFormValues = v.InferOutput<typeof profileFormSchema>;

export const profileFormWithPasswordSchema = v.object({
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
  email: v.pipe(
    v.string(), 
    v.minLength(1, "Email không được để trống"),
    v.email("Địa chỉ email không hợp lệ")
  ),
  phone: v.pipe(
    v.string(), 
    v.minLength(1, "Số điện thoại không được để trống"),
    v.regex(
      /^0[9835]\d{8}$/,
      "Số điện thoại không hợp lệ. Bắt đầu bằng 0, có 10 số và ký tự thứ 2 phải là 9,8,3,5"
    ),
  ),
  avatarUrl: v.pipe(v.string(), v.url("Đường dẫn ảnh đại diện không hợp lệ")),
  password: v.optional(v.pipe(
    v.string(),
    v.minLength(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    v.regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
    ),
  )),
  confirmPassword: v.optional(v.string()),
});

// Add a custom method to validate password matching
export const validatePasswordMatch = (data: ProfileFormWithPasswordValues): boolean => {
  // Only validate if password is provided
  if (data.password) {
    return data.password === data.confirmPassword;
  }
  return true;
};

export type ProfileFormWithPasswordValues = v.InferOutput<typeof profileFormWithPasswordSchema>;
