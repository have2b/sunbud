import * as v from "valibot";

export const loginSchema = v.object({
  emailOrUsername: v.pipe(
    v.string(),
    v.minLength(3, "Email or username must be at least 3 characters long"),
  ),
  password: v.string(),
});

export type LoginSchema = v.InferOutput<typeof loginSchema>;

export const registerSchema = v.object({
  username: v.pipe(
    v.string(),
    v.minLength(3, "Email or username must be at least 3 characters long"),
  ),
  email: v.pipe(v.string(), v.email("Invalid email address")),
  phone: v.pipe(
    v.string(),
    v.regex(
      /^0[9835]\d{10}$/,
      "Invalid phone number. Phone number must start with 0, has 10 numbers and the second number must be one of 9,8,3,5.",
    ),
  ),
  firstName: v.string(),
  lastName: v.string(),
  password: v.string(),
});

export type RegisterSchema = v.InferOutput<typeof registerSchema>;
