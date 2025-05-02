import * as v from "valibot";

export const updateOrderSchema = v.object({
  id: v.number(),
  paymentStatus: v.string(),
  paymentMethod: v.string(),
  shippingStatus: v.string(),
  deliveryMethod: v.string(),
  status: v.string(),
  address: v.string(),
  phone: v.string(),
});

export type UpdateOrderSchema = v.InferOutput<typeof updateOrderSchema>;

export const updateShipperOrderSchema = v.object({
  id: v.number(),
  shippingStatus: v.string(),
});

export type UpdateShipperOrderSchema = v.InferOutput<
  typeof updateShipperOrderSchema
>;
