import * as v from "valibot";

export const insertProductSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Tên sản phẩm không được để trống")),
  description: v.string(),
  price: v.pipe(v.number(), v.minValue(0, "Giá phải lớn hơn hoặc bằng 0")),
  quantity: v.pipe(
    v.number(),
    v.minValue(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  ),
  imageUrl: v.optional(v.string()),
  categoryId: v.number(),
  isPublish: v.boolean(),
  imagePublicId: v.pipe(
    v.string(),
    v.minLength(1, "Image public ID is required"),
  ),
  imageWidth: v.pipe(
    v.number(),
    v.minValue(1, "Image width must be at least 1"),
  ),
  imageHeight: v.pipe(
    v.number(),
    v.minValue(1, "Image height must be at least 1"),
  ),
  imageSize: v.pipe(v.number(), v.minValue(1, "Image size must be at least 1")),
});

export type InsertProductSchema = v.InferOutput<typeof insertProductSchema>;

export const updateProductSchema = v.object({
  id: v.number(),
  name: v.pipe(v.string(), v.minLength(1, "Tên sản phẩm không được để trống")),
  description: v.string(),
  price: v.pipe(v.number(), v.minValue(0, "Giá phải lớn hơn hoặc bằng 0")),
  quantity: v.pipe(
    v.number(),
    v.minValue(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  ),
  imageUrl: v.optional(v.string()),
  categoryId: v.number(),
});

export type UpdateProductSchema = v.InferOutput<typeof updateProductSchema>;
