import * as v from "valibot";

export const loginSchema = v.object({
  emailOrUsername: v.pipe(
    v.string(),
    v.minLength(3, "Email or username must be at least 3 characters long"),
  ),
  password: v.string(),
});

export type LoginSchema = v.InferOutput<typeof loginSchema>;
