import * as v from "valibot";

export const updateOrderSchema = v.object({
  id: v.number(),
  totalAmount: v.pipe(
    v.number(),
    v.minValue(0, "Giá phải lớn hơn hoặc bằng 0"),
  ),
  paymentMethod: v.string(),
  paymentStatus: v.string(),
  deliveryMethod: v.string(),
});

export type UpdateOrderSchema = v.InferOutput<typeof updateOrderSchema>;
