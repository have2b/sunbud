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
