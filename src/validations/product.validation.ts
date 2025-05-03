import * as v from "valibot";

export const insertProductSchema = v.object({
  name: v.pipe(
    v.string("Tên sản phẩm không được để trống"),
    v.minLength(1, "Tên sản phẩm không được để trống"),
    v.maxLength(255, "Tên sản phẩm không được vượt quá 255 ký tự"),
  ),
  description: v.string(),
  price: v.pipe(
    v.number("Giá sản phẩm không được để trống"),
    v.minValue(0, "Giá phải lớn hơn hoặc bằng 0"),
  ),
  quantity: v.pipe(
    v.number("Số lượng không được để trống"),
    v.minValue(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  ),
  imageUrl: v.pipe(
    v.string("Hình ảnh sản phẩm không được để trống"),
    v.minLength(1, "Hình ảnh sản phẩm không được để trống"),
  ),
  categoryId: v.pipe(
    v.number("Danh mục không được để trống"),
    v.finite("Vui lòng chọn danh mục"),
  ),
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
  name: v.pipe(
    v.string(),
    v.minLength(1, "Tên sản phẩm không được để trống"),
    v.maxLength(255, "Tên sản phẩm không được vượt quá 255 ký tự"),
  ),
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
