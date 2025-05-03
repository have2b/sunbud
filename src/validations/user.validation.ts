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
    v.minLength(2, "First name must be at least 2 characters"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(2, "Last name must be at least 2 characters"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  phone: v.pipe(v.string(), v.minLength(10, "Invalid phone number")),
  avatarUrl: v.pipe(v.string(), v.url("Invalid URL")),
});

export type ProfileFormValues = v.InferOutput<typeof profileFormSchema>;

export const profileFormWithPasswordSchema = v.object({
  firstName: v.pipe(
    v.string(),
    v.minLength(2, "First name must be at least 2 characters"),
  ),
  lastName: v.pipe(
    v.string(),
    v.minLength(2, "Last name must be at least 2 characters"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  phone: v.pipe(v.string(), v.minLength(10, "Invalid phone number")),
  avatarUrl: v.pipe(v.string(), v.url("Invalid URL")),
  password: v.optional(v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters"),
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
