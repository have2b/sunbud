import * as v from "valibot";

export const insertCategorySchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Tên danh mục không được để trống")),
  description: v.string(),
  isPublish: v.boolean(),
});

export type InsertCategorySchema = v.InferOutput<typeof insertCategorySchema>;

export const updateCategorySchema = v.object({
  id: v.number(),
  name: v.pipe(v.string(), v.minLength(1, "Tên danh mục không được để trống")),
  description: v.string(),
});

export type UpdateCategorySchema = v.InferOutput<typeof updateCategorySchema>;
